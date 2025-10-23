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

// Request interceptor: attach token only if the endpoint requires it
api.interceptors.request.use(
  async (config) => {
    if (config.requiresAuth) {
      try {
        const userData = await AsyncStorage.getItem('userDetail');
        if (userData) {
          const token = JSON.parse(userData).token;
          config.headers.Authorization = `Bearer ${token}`;
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
  (error) => {
    if (error.response) {
      console.error('API responded with an error:', error.response.data);
    } else if (error.request) {
      console.error('No response received:', error.request);
    } else {
      console.error('Error setting up request:', error.message);
    }
    return Promise.reject(error);
  },
);

export default api;
