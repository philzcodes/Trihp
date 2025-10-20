// API Constants - Updated for Trihp backend
const devUrl = 'https://trihp-system-backend.onrender.com/api/trihp/v1';

const Constant = {
  baseUrl: devUrl,
  // Auth endpoints
  register: 'auth',
  login: 'auth/login',
  logout: 'auth/logout',
  verifyEmail: 'auth/verify-email',
  forgotPassword: 'auth/forgot-password',
  resetPassword: 'auth/reset-password',
  
  // User endpoints
  getProfile: 'user/profile',
  updateProfile: 'user/update-profile',
  
  // Ride endpoints
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
