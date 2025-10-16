import { create } from 'zustand';

const useBookingStore = create((set, get) => ({
  // State
  currentRide: null,
  driverInfo: null,
  rideStatus: 'pending', // pending, accepted, started, completed, cancelled
  pickupTime: 0,
  durationMinutes: 0,
  dropOffTime: '',
  driverCoordinates: null,
  rideStartStatus: false,
  loading: false,
  error: null,

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

  // Computed values
  getRideId: () => get().currentRide?.id || get().currentRide?.data?.id,
  
  getPickupCoordinates: () => {
    const ride = get().currentRide;
    if (!ride) return null;
    return {
      latitude: parseFloat(ride.pickup_latitude || ride.data?.pickup_latitude),
      longitude: parseFloat(ride.pickup_longitude || ride.data?.pickup_longitude),
    };
  },

  getDropOffCoordinates: () => {
    const ride = get().currentRide;
    if (!ride) return null;
    return {
      latitude: parseFloat(ride.drop_latitude || ride.data?.drop_latitude),
      longitude: parseFloat(ride.drop_longitude || ride.data?.drop_longitude),
    };
  },

  // Reset function
  resetBookingState: () => {
    set({
      currentRide: null,
      driverInfo: null,
      rideStatus: 'pending',
      pickupTime: 0,
      durationMinutes: 0,
      dropOffTime: '',
      driverCoordinates: null,
      rideStartStatus: false,
      loading: false,
      error: null,
    });
  },
}));

export default useBookingStore;
