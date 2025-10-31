import { useEffect, useRef } from 'react';
import { Alert } from 'react-native';
import { useRouter } from 'expo-router';
import useUserStore from '../store/userStore';
import { isAuthenticated as checkIsAuthenticated } from '../api/client';

/**
 * Custom hook to require authentication for a screen
 * Automatically redirects to login if user is not authenticated
 * 
 * @param {Object} options - Configuration options
 * @param {boolean} options.redirect - Whether to redirect immediately (default: true)
 * @param {boolean} options.showAlert - Whether to show alert before redirect (default: true)
 * @param {string} options.alertTitle - Custom alert title
 * @param {string} options.alertMessage - Custom alert message
 * @param {string} options.redirectPath - Custom redirect path (default: '/(auth)/Login')
 * @param {boolean} options.enabled - Whether the auth check is enabled (default: true)
 * 
 * @returns {Object} - { isAuthenticated, userData, isLoading }
 */
export const useRequireAuth = (options = {}) => {
  const router = useRouter();
  const {
    redirect = true,
    showAlert = true,
    alertTitle = 'Authentication Required',
    alertMessage = 'Please log in to continue',
    redirectPath = '/(auth)/Login',
    enabled = true,
  } = options;

  const { userData, fetchUser, isAuthenticated, loading } = useUserStore();
  const hasCheckedRef = useRef(false);
  const redirectingRef = useRef(false);

  useEffect(() => {
    const checkAuth = async () => {
      // Skip if already checked or disabled
      if (hasCheckedRef.current || !enabled || redirectingRef.current) {
        return;
      }

      try {
        // First, try to fetch user from storage
        await fetchUser();
        
        // Small delay to ensure state is updated
        await new Promise(resolve => setTimeout(resolve, 100));

        // Get current state
        const currentUserData = useUserStore.getState().userData;
        const currentIsAuthenticated = useUserStore.getState().isAuthenticated;

        // Also check AsyncStorage directly for token
        const hasToken = await checkIsAuthenticated();

        // Check if user is authenticated
        const userIsAuthenticated = 
          currentIsAuthenticated && 
          currentUserData && 
          currentUserData.id && 
          hasToken;

        if (!userIsAuthenticated) {
          hasCheckedRef.current = true;
          
          if (redirect) {
            redirectingRef.current = true;
            
            if (showAlert) {
              Alert.alert(
                alertTitle,
                alertMessage,
                [
                  {
                    text: 'Login',
                    onPress: () => {
                      router.replace(redirectPath);
                    },
                  },
                ],
                { 
                  cancelable: false,
                  onDismiss: () => {
                    // Redirect even if alert is dismissed
                    router.replace(redirectPath);
                  }
                }
              );
            } else {
              // Redirect without showing alert
              router.replace(redirectPath);
            }
          }
        } else {
          hasCheckedRef.current = true;
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
        
        if (redirect) {
          redirectingRef.current = true;
          
          if (showAlert) {
            Alert.alert(
              'Session Expired',
              'Your session has expired. Please log in again.',
              [
                {
                  text: 'Login',
                  onPress: () => {
                    router.replace(redirectPath);
                  },
                },
              ],
              { 
                cancelable: false,
                onDismiss: () => {
                  router.replace(redirectPath);
                }
              }
            );
          } else {
            router.replace(redirectPath);
          }
        }
      }
    };

    checkAuth();
  }, [enabled, redirect, showAlert, alertTitle, alertMessage, redirectPath, router, fetchUser]);

  // Reset ref when enabled changes to allow re-checking
  useEffect(() => {
    if (enabled) {
      hasCheckedRef.current = false;
      redirectingRef.current = false;
    }
  }, [enabled]);

  return {
    isAuthenticated: isAuthenticated && !!userData && !!userData.id,
    userData,
    isLoading: loading,
  };
};

export default useRequireAuth;

