// API constants
export const baseUrl = 'https://api.trihp.com/'; // Replace with actual API URL

// Vehicle types
export const vehicleTypes = [
  { id: 1, name: 'Economy', price: 5.0, capacity: 4, estimatedTime: '5-10 min' },
  { id: 2, name: 'Comfort', price: 7.5, capacity: 4, estimatedTime: '5-10 min' },
  { id: 3, name: 'Premium', price: 10.0, capacity: 4, estimatedTime: '5-10 min' },
];

// Ride statuses
export const rideStatus = {
  PENDING: 'pending',
  ACCEPTED: 'accepted',
  STARTED: 'started',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
};

// Payment methods
export const paymentMethods = {
  CASH: 'cash',
  CARD: 'card',
  WALLET: 'wallet',
};

// Ride types
export const rideTypes = {
  IMMEDIATE: 'immediate',
  SCHEDULED: 'scheduled',
};

// API endpoints
export const endpoints = {
  CREATE_RIDE: '/rides',
  GET_NEARBY_DRIVERS: '/drivers/nearby',
  CANCEL_RIDE: '/rides/cancel',
  GET_RIDE_STATUS: '/rides/status',
  UPDATE_RIDE: '/rides/update',
};

export default {
  baseUrl,
  vehicleTypes,
  rideStatus,
  paymentMethods,
  rideTypes,
  endpoints,
};
