// API Constants - Same as old app
const devUrl = 'http://192.168.118.131:6000/auth/user/';

const Constant = {
  baseUrl: devUrl,
  ride: `ride`,
  login: `login`,
  logout: `logout`,
  payment: `payment`,
  vehicle: `vehicle`,
  addCard: `add-card`,
  getRide: `get-Ride`,
  register: `register`,
  numberValidationRegx: /^\d+$/,
  verifiedEmail: `verify-email`,
  verifyPhone: `verified_phone`,
  otpEmail: `otp-email`,
  verifyOtp: `verify-otp`,
  resendOtp: `resend-otp`,
  existEmail: `exist-email`,
  forgetPassword: `changePassword`,
  resetPassword: `update-password`,
  getProfile: `get-profile`,
  getAllRide: `getall-ride`,
  createRide: `create-ride`,
  trihpWallet: `trihpWallet`,
  rideHistory: `ride-history`,
  verifiedOtp: `verified-otp`,
  driverDetail: `driver-detail`,
  updateProfile: `update-profile`,
  completProfile: `create-profile`,
  fetchCardInfo: `fetch-card-info`,
  getRideDetails: `get-rideDetails`,
  addMobileMoney: `add-mobile-money`,
  passwordValidation: /^(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,16}$/,
  emailValidationRegx:
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
};

export default Constant;
