import api from './client';
import Constant from './constants';

// Ride Request API Service
export const rideRequestAPI = {
  // Create a new ride request
  createRideRequest: async (rideData) => {
    try {
      console.log('Creating ride request:', rideData);
      console.log('rideRequestAPI: api object available:', !!api);
      console.log('rideRequestAPI: api.post method available:', !!api?.post);
      console.log('rideRequestAPI: Constant.createRideRequest:', Constant.createRideRequest);
      
      if (!api || !api.post) {
        throw new Error('API client is not properly initialized');
      }
      
      const response = await api.post(Constant.createRideRequest, rideData);
      return response.data;
    } catch (error) {
      console.error('Create ride request API error:', error);
      throw error.response?.data || error.message;
    }
  },

  // Get ride request by ID
  getRideRequest: async (rideId) => {
    try {
      const response = await api.get(`${Constant.getRideRequest}/${rideId}`);
      return response.data;
    } catch (error) {
      console.error('Get ride request API error:', error);
      throw error.response?.data || error.message;
    }
  },

  // Get all ride requests for a rider
  getRideByRider: async (riderId) => {
    try {
      const response = await api.get(`${Constant.getRideByRider}/${riderId}`);
      return response.data;
    } catch (error) {
      console.error('Get ride by rider API error:', error);
      throw error.response?.data || error.message;
    }
  },

  // Get all ride requests for a driver
  getRideByDriver: async (driverId) => {
    try {
      const response = await api.get(`${Constant.getRideByDriver}/${driverId}`);
      return response.data;
    } catch (error) {
      console.error('Get ride by driver API error:', error);
      throw error.response?.data || error.message;
    }
  },

  // Get ride requests by status
  getRideByStatus: async (status) => {
    try {
      const response = await api.get(`${Constant.getRideByStatus}/${status}`);
      return response.data;
    } catch (error) {
      console.error('Get ride by status API error:', error);
      throw error.response?.data || error.message;
    }
  },

  // Get active ride for a rider
  getActiveRideByRider: async (riderId) => {
    try {
      const response = await api.get(`${Constant.getActiveRideByRider}/${riderId}`);
      return response.data;
    } catch (error) {
      console.error('Get active ride by rider API error:', error);
      throw error.response?.data || error.message;
    }
  },

  // Get active ride for a driver
  getActiveRideByDriver: async (driverId) => {
    try {
      const response = await api.get(`${Constant.getActiveRideByDriver}/${driverId}`);
      return response.data;
    } catch (error) {
      console.error('Get active ride by driver API error:', error);
      throw error.response?.data || error.message;
    }
  },

  // Update ride request
  updateRideRequest: async (rideId, updateData) => {
    try {
      const response = await api.patch(`${Constant.updateRideRequest}/${rideId}`, updateData);
      return response.data;
    } catch (error) {
      console.error('Update ride request API error:', error);
      throw error.response?.data || error.message;
    }
  },

  // Update ride status
  updateRideStatus: async (rideId, statusData) => {
    try {
      const response = await api.patch(`${Constant.updateRideStatus}/${rideId}/status`, statusData);
      return response.data;
    } catch (error) {
      console.error('Update ride status API error:', error);
      throw error.response?.data || error.message;
    }
  },

  // Cancel ride
  cancelRide: async (rideId, cancellationData) => {
    try {
      const response = await api.patch(`${Constant.cancelRide}/${rideId}/cancel`, cancellationData);
      return response.data;
    } catch (error) {
      console.error('Cancel ride API error:', error);
      throw error.response?.data || error.message;
    }
  },

  // Delete ride request
  deleteRideRequest: async (rideId) => {
    try {
      const response = await api.delete(`${Constant.deleteRideRequest}/${rideId}`);
      return response.data;
    } catch (error) {
      console.error('Delete ride request API error:', error);
      throw error.response?.data || error.message;
    }
  },

  // Pricing endpoints
  calculatePrice: async (pricingData) => {
    try {
      console.log('Calculating price via rideRequestAPI:', pricingData);
      const response = await api.post(Constant.calculatePrice, pricingData);
      return response.data;
    } catch (error) {
      console.error('Calculate price API error:', error);
      throw error.response?.data || error.message;
    }
  },

  getAvailableServices: async (regionId = null) => {
    try {
      const url = regionId 
        ? `${Constant.getAvailableServices}?regionId=${regionId}`
        : Constant.getAvailableServices;
      
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      console.error('Get available services API error:', error);
      throw error.response?.data || error.message;
    }
  },

  getAvailableRegions: async () => {
    try {
      const response = await api.get(Constant.getAvailableRegions);
      return response.data;
    } catch (error) {
      console.error('Get available regions API error:', error);
      throw error.response?.data || error.message;
    }
  },
};

export default rideRequestAPI;
