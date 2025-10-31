import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { useRouter } from 'expo-router';
import useUserStore from '../store/userStore';
import { isAuthenticated as checkIsAuthenticated } from '../api/client';

/**
 * Simple hook to check authentication status without redirecting
 * Useful for conditional rendering or actions that require auth
 * 
 * @returns {Object} - { isAuthenticated, userData, isLoading, checkAuth }
 */
export const useAuthCheck = () => {
  const router = useRouter();
  const { userData, fetchUser, isAuthenticated, loading } = useUserStore();
  const [authStatus, setAuthStatus] = useState({
    isAuthenticated: false,
    checked: false,
  });

  const checkAuth = async () => {
    try {
      await fetchUser();
      await new Promise(resolve => setTimeout(resolve, 100));

      const currentUserData = useUserStore.getState().userData;
      const currentIsAuthenticated = useUserStore.getState().isAuthenticated;
      const hasToken = await checkIsAuthenticated();

      const userIsAuthenticated = 
        currentIsAuthenticated && 
        currentUserData && 
        currentUserData.id && 
        hasToken;

      setAuthStatus({
        isAuthenticated: userIsAuthenticated,
        checked: true,
      });

      return userIsAuthenticated;
    } catch (error) {
      console.error('Error checking authentication:', error);
      setAuthStatus({
        isAuthenticated: false,
        checked: true,
      });
      return false;
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const redirectToLogin = (message = 'Please log in to continue') => {
    Alert.alert(
      'Authentication Required',
      message,
      [
        {
          text: 'Login',
          onPress: () => {
            router.replace('/(auth)/Login');
          },
        },
      ],
      { cancelable: false }
    );
  };

  return {
    isAuthenticated: authStatus.isAuthenticated || (isAuthenticated && !!userData && !!userData.id),
    userData,
    isLoading: loading || !authStatus.checked,
    checkAuth,
    redirectToLogin,
  };
};

export default useAuthCheck;

