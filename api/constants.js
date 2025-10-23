// API Constants - Updated for Trihp backend
// Production endpoint (commented out)
// const prodUrl = 'https://trihp-system-backend.onrender.com/api/trihp/v1';

// Development endpoint
const devUrl = 'http://192.168.100.243:3000/api/trihp/v1';

const Constant = {
  baseUrl: devUrl,
  // Auth endpoints
  register: 'auth',
  login: 'auth/login',
  logout: 'auth/logout',
  verifyEmail: 'auth/verify-email',
  forgotPassword: 'auth/password/forgot',
  resetPassword: 'auth/password/reset',
  changePassword: 'auth/password/change',
  
  // User endpoints
  getProfile: 'users/profile',
  updateProfile: 'users/profile',
  
  // Rider endpoints (using available user endpoints for now)
  getRiderProfile: 'users/profile',
  updateRiderProfile: 'users/profile',
  addHomeAddress: 'riders/home-address', // Will need backend implementation
  addWorkAddress: 'riders/work-address', // Will need backend implementation
  getRiderWallet: 'riders/wallet', // Will need backend implementation
  addToWallet: 'riders/wallet/add', // Will need backend implementation
  deductFromWallet: 'riders/wallet/deduct', // Will need backend implementation
  
  // Ride Request endpoints
  createRideRequest: 'ride-request',
  getRideRequest: 'ride-request',
  updateRideRequest: 'ride-request',
  deleteRideRequest: 'ride-request',
  getRideByRider: 'ride-request/rider',
  getRideByDriver: 'ride-request/driver',
  getRideByStatus: 'ride-request/status',
  getActiveRideByRider: 'ride-request/rider/active',
  getActiveRideByDriver: 'ride-request/driver/active',
  updateRideStatus: 'ride-request',
  cancelRide: 'ride-request',
  
  // Ride endpoints (legacy - keeping for compatibility)
  createRide: 'ride/create',
  getRide: 'ride/get',
  getAllRide: 'ride/all',
  rideHistory: 'ride/history',
  driverDetail: 'ride/driver-detail',
  
  // Payment endpoints
  payment: 'payment',
  addCard: 'payment/add-card',
  fetchCardInfo: 'payment/card-info',
  addMobileMoney: 'payment/add-mobile-money',
  trihpWallet: 'payment/trihp-wallet',
  
  // Vehicle endpoints
  vehicle: 'vehicle',
  
  // Validation regex
  numberValidationRegx: /^\d+$/,
  passwordValidation: /^(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,16}$/,
  emailValidationRegx:
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
};

export default Constant;
