import { create } from 'zustand';

const useUserStore = create((set, get) => ({
  // State
  userData: {
    data: {
      wallet_amount: 0,
    }
  },
  loading: false,
  error: null,

  // Actions
  fetchUser: async () => {
    set({ loading: true, error: null });
    
    try {
      // Simulate API call - replace with actual API logic
      const response = {
        data: {
          data: {
            wallet_amount: Math.floor(Math.random() * 1000) + 100 // Random wallet amount for demo
          }
        }
      };
      
      set({ 
        userData: response.data, 
        loading: false 
      });
      
      return response.data;
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
        data: {
          ...state.userData.data,
          wallet_amount: amount
        }
      }
    }));
  },

  // Computed values
  getWalletAmount: () => get().userData?.data?.wallet_amount || 0,
}));

export default useUserStore;
