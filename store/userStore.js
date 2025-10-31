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
        
        // Validate that we have essential user data
        if (userData && (userData.user || userData.token)) {
          set({ 
            userData: userData.user || userData,
            token: userData.token || userData.accessToken,
            refreshToken: userData.refreshToken,
            isAuthenticated: true,
            loading: false 
          });
          return userData;
        } else {
          // Invalid data structure, clear it
          await AsyncStorage.removeItem('userDetail');
          set({ 
            userData: null,
            token: null,
            refreshToken: null,
            isAuthenticated: false,
            loading: false 
          });
          return null;
        }
      } else {
        // No user data found - this is normal if user hasn't logged in
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
      console.error('Error fetching user from storage:', error);
      // Clear potentially corrupted data
      try {
        await AsyncStorage.removeItem('userDetail');
      } catch (clearError) {
        console.error('Error clearing corrupted user data:', clearError);
      }
      set({ 
        userData: null,
        token: null,
        refreshToken: null,
        isAuthenticated: false,
        error: error.message, 
        loading: false 
      });
      return null;
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
