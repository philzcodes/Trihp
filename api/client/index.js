import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

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
      console.error('API responded with an error:', error.response.data);
      
      // Handle token expiration
      if (error.response.status === 401) {
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

export default api;
