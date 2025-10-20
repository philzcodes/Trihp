import api from './client';
import Constant from './constants';

// Authentication API Services
export const authAPI = {
  // Register a new user
  register: async (userData) => {
    try {
      const response = await api.post(Constant.register, userData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Login user
  login: async (credentials) => {
    try {
      // Convert object to URL-encoded string for form-encoded requests
      const formData = new URLSearchParams();
      formData.append('emailOrPhone', credentials.emailOrPhone);
      formData.append('password', credentials.password);
      formData.append('userType', credentials.userType);

      console.log('Login form data:', formData.toString());
      console.log('Login URL:', `${Constant.baseUrl}/${Constant.login}`);

      const response = await api.post(Constant.login, formData.toString(), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Login API error:', error);
      throw error.response?.data || error.message;
    }
  },

  // Logout user
  logout: async () => {
    try {
      const response = await api.post(Constant.logout);
      return response.data;
    } catch (error) {
      console.error('Logout API error:', error);
      throw error.response?.data || error.message;
    }
  },
  verifyEmail: async (emailData) => {
    try {
      // Convert object to URL-encoded string for form-encoded requests
      const formData = new URLSearchParams();
      formData.append('email', emailData.email);
      formData.append('otp', emailData.otp);
      formData.append('userType', emailData.userType);

      const response = await api.post(Constant.verifyEmail, formData.toString(), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Forgot password
  forgotPassword: async (emailData) => {
    try {
      // Convert object to URL-encoded string for form-encoded requests
      const formData = new URLSearchParams();
      formData.append('email', emailData.email);
      formData.append('userType', emailData.userType);

      const response = await api.post(Constant.forgotPassword, formData.toString(), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Forgot password API error:', error);
      throw error.response?.data || error.message;
    }
  },

  // Reset password
  resetPassword: async (resetData) => {
    try {
      // Convert object to URL-encoded string for form-encoded requests
      const formData = new URLSearchParams();
      formData.append('otp', resetData.otp);
      formData.append('newPassword', resetData.newPassword);

      const response = await api.post(Constant.resetPassword, formData.toString(), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Reset password API error:', error);
      throw error.response?.data || error.message;
    }
  },
};

// User API Services
export const userAPI = {
  // Get user profile
  getProfile: async () => {
    try {
      const response = await api.get(Constant.getProfile, {
        requiresAuth: true,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Update user profile
  updateProfile: async (profileData) => {
    try {
      const response = await api.put(Constant.updateProfile, profileData, {
        requiresAuth: true,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

// Ride API Services
export const rideAPI = {
  // Create a new ride
  createRide: async (rideData) => {
    try {
      const response = await api.post(Constant.createRide, rideData, {
        requiresAuth: true,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get ride details
  getRide: async (rideId) => {
    try {
      const response = await api.get(`${Constant.getRide}/${rideId}`, {
        requiresAuth: true,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get all rides
  getAllRides: async () => {
    try {
      const response = await api.get(Constant.getAllRide, {
        requiresAuth: true,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get ride history
  getRideHistory: async () => {
    try {
      const response = await api.get(Constant.rideHistory, {
        requiresAuth: true,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get driver details
  getDriverDetail: async (rideId) => {
    try {
      const response = await api.post(Constant.driverDetail, { id: rideId }, {
        requiresAuth: true,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

// Payment API Services
export const paymentAPI = {
  // Add payment card
  addCard: async (cardData) => {
    try {
      const response = await api.post(Constant.addCard, cardData, {
        requiresAuth: true,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Fetch card information
  fetchCardInfo: async () => {
    try {
      const response = await api.get(Constant.fetchCardInfo, {
        requiresAuth: true,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Add mobile money
  addMobileMoney: async (mobileMoneyData) => {
    try {
      const response = await api.post(Constant.addMobileMoney, mobileMoneyData, {
        requiresAuth: true,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Trihp wallet operations
  trihpWallet: async (walletData) => {
    try {
      const response = await api.post(Constant.trihpWallet, walletData, {
        requiresAuth: true,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

export default {
  authAPI,
  userAPI,
  rideAPI,
  paymentAPI,
};
