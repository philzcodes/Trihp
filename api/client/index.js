import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

// Request queue and throttling
class RequestQueue {
  constructor() {
    this.queue = [];
    this.processing = false;
    this.maxConcurrent = 3; // Maximum concurrent requests
    this.activeRequests = 0;
    this.requestDelay = 200; // Delay between requests in ms
  }

  async addRequest(requestFn) {
    return new Promise((resolve, reject) => {
      this.queue.push({
        requestFn,
        resolve,
        reject,
        timestamp: Date.now(),
      });
      this.processQueue();
    });
  }

  async processQueue() {
    if (this.processing || this.queue.length === 0) return;
    
    this.processing = true;
    
    while (this.queue.length > 0 && this.activeRequests < this.maxConcurrent) {
      const { requestFn, resolve, reject } = this.queue.shift();
      this.activeRequests++;
      
      try {
        // Add delay between requests
        if (this.activeRequests > 1) {
          await new Promise(resolve => setTimeout(resolve, this.requestDelay));
        }
        
        const result = await requestFn();
        resolve(result);
      } catch (error) {
        reject(error);
      } finally {
        this.activeRequests--;
      }
    }
    
    this.processing = false;
    
    // Continue processing if there are more requests
    if (this.queue.length > 0) {
      setTimeout(() => this.processQueue(), 100);
    }
  }

  clear() {
    this.queue = [];
    this.activeRequests = 0;
    this.processing = false;
  }
}

const requestQueue = new RequestQueue();

// API Configuration
const API_CONFIG = {
  // Production endpoint (commented out)
  // baseUrl: 'https://trihp-system-backend.onrender.com/api/trihp/v1',
  
  // Development endpoint
  baseUrl: 'http://192.168.100.243:3000/api/trihp/v1',
  timeout: 10000,
};

const api = axios.create({
  baseURL: API_CONFIG.baseUrl,
  timeout: API_CONFIG.timeout,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Wrapper function to use request queue
const queuedRequest = async (config) => {
  return requestQueue.addRequest(async () => {
    return await api(config);
  });
};

// Override the default axios methods to use queued requests
const originalGet = api.get;
const originalPost = api.post;
const originalPut = api.put;
const originalPatch = api.patch;
const originalDelete = api.delete;

api.get = (url, config = {}) => {
  return queuedRequest({ ...config, method: 'get', url });
};

api.post = (url, data, config = {}) => {
  return queuedRequest({ ...config, method: 'post', url, data });
};

api.put = (url, data, config = {}) => {
  return queuedRequest({ ...config, method: 'put', url, data });
};

api.patch = (url, data, config = {}) => {
  return queuedRequest({ ...config, method: 'patch', url, data });
};

api.delete = (url, config = {}) => {
  return queuedRequest({ ...config, method: 'delete', url });
};

// Request interceptor: attach token for all requests except auth endpoints
api.interceptors.request.use(
  async (config) => {
    // Skip token attachment for auth endpoints
    const authEndpoints = ['/auth', '/auth/login', '/auth/register', '/auth/verify-email', '/auth/password/forgot', '/auth/password/reset'];
    const isAuthEndpoint = authEndpoints.some(endpoint => config.url?.includes(endpoint));
    
    if (!isAuthEndpoint) {
      try {
        const userData = await AsyncStorage.getItem('userDetail');
        if (userData) {
          const parsedData = JSON.parse(userData);
          const token = parsedData.token || parsedData.accessToken;
          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
            console.log('Token attached to request:', config.url);
          } else {
            console.log('No token found in user data');
          }
        } else {
          console.log('No user data found in AsyncStorage');
        }
      } catch (error) {
        console.error('Error retrieving token:', error);
      }
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Response interceptor for global error handling
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response) {
      const errorData = error.response.data;
      const status = error.response.status;
      
      console.error('API responded with an error:', errorData);
      
      // Handle rate limiting specifically
      if (status === 429 || (errorData && errorData.message && errorData.message.includes('Too many requests'))) {
        console.warn('Rate limit exceeded, implementing backoff strategy');
        
        // Clear the request queue to prevent more requests
        requestQueue.clear();
        
        // Add exponential backoff delay
        const backoffDelay = Math.min(5000, 1000 * Math.pow(2, requestQueue.activeRequests));
        console.log(`Rate limited, waiting ${backoffDelay}ms before retrying`);
        
        await new Promise(resolve => setTimeout(resolve, backoffDelay));
        
        // Return a more user-friendly error
        const rateLimitError = new Error('Service is busy. Please try again in a moment.');
        rateLimitError.isRateLimit = true;
        return Promise.reject(rateLimitError);
      }
      
      // Handle token expiration
      if (status === 401) {
        console.log('Token expired or invalid, clearing user data');
        try {
          await AsyncStorage.removeItem('userDetail');
          // You could also dispatch a logout action here if using Redux/Zustand
        } catch (storageError) {
          console.error('Error clearing user data:', storageError);
        }
      }
    } else if (error.request) {
      console.error('No response received:', error.request);
    } else {
      console.error('Error setting up request:', error.message);
    }
    return Promise.reject(error);
  },
);

// Helper function to check if user is authenticated
export const isAuthenticated = async () => {
  try {
    const userData = await AsyncStorage.getItem('userDetail');
    if (userData) {
      const parsedData = JSON.parse(userData);
      const token = parsedData.token || parsedData.accessToken;
      return !!token;
    }
    return false;
  } catch (error) {
    console.error('Error checking authentication:', error);
    return false;
  }
};

// Helper function to get current token
export const getCurrentToken = async () => {
  try {
    const userData = await AsyncStorage.getItem('userDetail');
    if (userData) {
      const parsedData = JSON.parse(userData);
      return parsedData.token || parsedData.accessToken;
    }
    return null;
  } catch (error) {
    console.error('Error getting token:', error);
    return null;
  }
};

// Request queue management functions
export const clearRequestQueue = () => {
  requestQueue.clear();
  console.log('Request queue cleared');
};

export const getQueueStats = () => {
  return {
    queueLength: requestQueue.queue.length,
    activeRequests: requestQueue.activeRequests,
    processing: requestQueue.processing,
  };
};

export const setMaxConcurrentRequests = (max) => {
  requestQueue.maxConcurrent = max;
  console.log(`Max concurrent requests set to ${max}`);
};

export const setRequestDelay = (delay) => {
  requestQueue.requestDelay = delay;
  console.log(`Request delay set to ${delay}ms`);
};

export default api;
