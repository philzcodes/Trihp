// paymentManager.js
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
// import querystring from 'querystring';
import Constant from './Constant';
import { showWarning } from './Toaster';

class PaymentManager {
  constructor(stripe) {
    this.stripe = stripe;
  }

  async getPaymentToken() {
    const user = await AsyncStorage.getItem('userDetail');
    return JSON.parse(user)?.token;
  }

  async initializePaymentSheet(amount) {
    try {
      const params = await this.fetchPaymentSheetParams(amount);
      if (!params) return { error: 'Could not fetch payment params' };

      const { error } = await this.stripe.initPaymentSheet({
        merchantDisplayName: 'Trihp Inc.',
        customerId: params.stripe_customer_id,
        customerEphemeralKeySecret: params.ephemeralKey,
        paymentIntentClientSecret: params.paymentIntent,
        allowsDelayedPaymentMethods: true,
        defaultBillingDetails: {
          name: 'Jenny Rosen',
        },
      });

      return { error, paymentIntent: params.paymentIntent };
    } catch (error) {
      console.error('Payment sheet initialization error:', error);
      return { error };
    }
  }

  async fetchPaymentSheetParams(amount) {
    const token = await this.getPaymentToken();
    const param = {
      amount: amount.toFixed(0),
      currency: 'USD',
    };

    try {
      const response = await axios.post(`${Constant.baseUrl}payment`, querystring.stringify(param), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Accept: '*/*',
          Authorization: `Bearer ${token}`,
        },
      });

      if (response?.status === 200) {
        const { ephemeralKey, paymentIntent, stripe_customer_id } = response?.data;
        return {
          paymentIntent,
          ephemeralKey,
          stripe_customer_id,
        };
      }
      return null;
    } catch (error) {
      console.error('Error fetching payment sheet params:', error?.response?.data);
      throw error;
    }
  }

  async processCardPayment(amount) {
    try {
      const { error, paymentIntent } = await this.initializePaymentSheet(amount);
      if (error) {
        showWarning('Error initializing payment');
        return { success: false, paymentIntent: null };
      }

      const presentResult = await this.stripe.presentPaymentSheet();
      if (presentResult.error) {
        showWarning('Payment failed');
        return { success: false, paymentIntent: null };
      }

      showSucess('Payment done successfully');
      return { success: true, paymentIntent };
    } catch (error) {
      console.error('Payment processing error:', error);
      showWarning('Payment processing failed');
      return { success: false, paymentIntent: null };
    }
  }

  async createRideRequest(rideDetails, paymentIntent = null) {
    try {
      const token = await this.getPaymentToken();
      const response = await axios.post(
        `${Constant.baseUrl}${Constant.createRide}`,
        {
          ...rideDetails,
          transaction_id: paymentIntent,
          payment_type: paymentIntent ? 'card' : rideDetails.paymentMethod,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response?.data?.status === 200) {
        return {
          success: true,
          data: { ...rideDetails, id: response?.data?.some?.id },
        };
      }
      return { success: false, error: response?.data };
    } catch (error) {
      console.error('Error creating ride:', error?.response?.data);
      throw error;
    }
  }
}

export default PaymentManager;
