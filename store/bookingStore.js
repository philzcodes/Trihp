import { create } from 'zustand';
import rideRequestAPI from '../api/rideRequestAPI';

const useBookingStore = create((set, get) => ({
  // State
  currentRide: null,
  driverInfo: null,
  rideStatus: 'PENDING', // Updated to match backend enum
  pickupTime: 0,
  durationMinutes: 0,
  dropOffTime: '',
  driverCoordinates: null,
  rideStartStatus: false,
  loading: false,
  error: null,
  rideRequestId: null,

  // Actions
  setCurrentRide: (ride) => {
    set({ currentRide: ride });
  },

  setDriverInfo: (driver) => {
    set({ driverInfo: driver });
  },

  setRideStatus: (status) => {
    set({ rideStatus: status });
  },

  setPickupTime: (time) => {
    set({ pickupTime: time });
  },

  setDurationMinutes: (minutes) => {
    set({ durationMinutes: minutes });
  },

  setDropOffTime: (time) => {
    set({ dropOffTime: time });
  },

  setDriverCoordinates: (coordinates) => {
    set({ driverCoordinates: coordinates });
  },

  setRideStartStatus: (status) => {
    set({ rideStartStatus: status });
  },

  setLoading: (loading) => {
    set({ loading });
  },

  setError: (error) => {
    set({ error });
  },

  setRideRequestId: (id) => {
    set({ rideRequestId: id });
  },

  // API Actions
  createRideRequest: async (rideData) => {
    set({ loading: true, error: null });
    try {
      const response = await rideRequestAPI.createRideRequest(rideData);
      set({ 
        currentRide: response,
        rideRequestId: response.id,
        loading: false 
      });
      return response;
    } catch (error) {
      set({ error: error.message || 'Failed to create ride request', loading: false });
      throw error;
    }
  },

  updateRideStatus: async (status, additionalData = {}) => {
    const { rideRequestId } = get();
    if (!rideRequestId) {
      throw new Error('No active ride request');
    }

    set({ loading: true, error: null });
    try {
      const response = await rideRequestAPI.updateRideStatus(rideRequestId, {
        status,
        ...additionalData
      });
      set({ 
        currentRide: response,
        rideStatus: status,
        loading: false 
      });
      return response;
    } catch (error) {
      set({ error: error.message || 'Failed to update ride status', loading: false });
      throw error;
    }
  },

  cancelRide: async (cancellationReason) => {
    const { rideRequestId } = get();
    if (!rideRequestId) {
      throw new Error('No active ride request');
    }

    set({ loading: true, error: null });
    try {
      const response = await rideRequestAPI.cancelRide(rideRequestId, {
        cancellationReason
      });
      set({ 
        currentRide: response,
        rideStatus: 'CANCELLED',
        loading: false 
      });
      return response;
    } catch (error) {
      set({ error: error.message || 'Failed to cancel ride', loading: false });
      throw error;
    }
  },

  getActiveRide: async (riderId) => {
    set({ loading: true, error: null });
    try {
      const response = await rideRequestAPI.getActiveRideByRider(riderId);
      if (response) {
        set({ 
          currentRide: response,
          rideRequestId: response.id,
          rideStatus: response.status,
          driverInfo: response.driverId ? {
            id: response.driverId,
            name: response.driverName,
            phone: response.driverPhone,
            vehicleNumber: response.driverVehicleNumber
          } : null,
          loading: false 
        });
      } else {
        set({ loading: false });
      }
      return response;
    } catch (error) {
      set({ error: error.message || 'Failed to get active ride', loading: false });
      throw error;
    }
  },

  // Computed values
  getRideId: () => get().rideRequestId || get().currentRide?.id,
  
  getPickupCoordinates: () => {
    const ride = get().currentRide;
    if (!ride) return null;
    return {
      latitude: parseFloat(ride.pickupLatitude || ride.pickup_latitude),
      longitude: parseFloat(ride.pickupLongitude || ride.pickup_longitude),
    };
  },

  getDropOffCoordinates: () => {
    const ride = get().currentRide;
    if (!ride) return null;
    return {
      latitude: parseFloat(ride.dropOffLatitude || ride.drop_latitude),
      longitude: parseFloat(ride.dropOffLongitude || ride.drop_longitude),
    };
  },

  // Reset function
  resetBookingState: () => {
    set({
      currentRide: null,
      driverInfo: null,
      rideStatus: 'PENDING',
      pickupTime: 0,
      durationMinutes: 0,
      dropOffTime: '',
      driverCoordinates: null,
      rideStartStatus: false,
      loading: false,
      error: null,
      rideRequestId: null,
    });
  },
}));

export default useBookingStore;
