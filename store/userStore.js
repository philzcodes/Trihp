import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';

const useUserStore = create((set, get) => ({
  // State
  userData: null,
  token: null,
  refreshToken: null,
  loading: false,
  error: null,
  isAuthenticated: false,

  // Actions
  setUserData: (userData) => {
    set({ 
      userData: userData.user,
      token: userData.token,
      refreshToken: userData.refreshToken,
      isAuthenticated: true 
    });
  },

  fetchUser: async () => {
    set({ loading: true, error: null });
    
    try {
      // Get user data from AsyncStorage
      const storedData = await AsyncStorage.getItem('userDetail');
      if (storedData) {
        const userData = JSON.parse(storedData);
        set({ 
          userData: userData.user,
          token: userData.token,
          refreshToken: userData.refreshToken,
          isAuthenticated: true,
          loading: false 
        });
        return userData;
      } else {
        set({ 
          userData: null,
          token: null,
          refreshToken: null,
          isAuthenticated: false,
          loading: false 
        });
        return null;
      }
    } catch (error) {
      set({ 
        error: error.message, 
        loading: false 
      });
      throw error;
    }
  },

  updateWalletAmount: (amount) => {
    set((state) => ({
      userData: {
        ...state.userData,
        walletBalance: amount
      }
    }));
  },

  logout: async () => {
    try {
      await AsyncStorage.removeItem('userDetail');
      set({ 
        userData: null,
        token: null,
        refreshToken: null,
        isAuthenticated: false,
        error: null 
      });
    } catch (error) {
      console.error('Error during logout:', error);
    }
  },

  // Computed values
  getWalletAmount: () => get().userData?.walletBalance || 0,
  getUserName: () => {
    const user = get().userData;
    if (!user) return '';
    return `${user.firstName} ${user.lastName}`.trim();
  },
  getUserEmail: () => get().userData?.email || '',
  getUserPhone: () => get().userData?.phoneNumber || '',
}));

export default useUserStore;
