import AsyncStorage from '@react-native-async-storage/async-storage';
import { Stack, useRouter, useSegments } from "expo-router";
import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import { BackHandler, Platform } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Colors } from '../constants';

function BackButtonHandler() {
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    if (Platform.OS !== 'android') return;

    const backHandler = BackHandler.addEventListener('hardwareBackPress', async () => {
      const currentPath = segments.join('/');
      
      // Check if we're on an auth screen (login, signup, etc.)
      const isAuthScreen = currentPath.includes('(auth)');
      
      // If on auth screen, prevent back navigation to protected screens
      if (isAuthScreen) {
        // Check if user is authenticated
        try {
          const userData = await AsyncStorage.getItem('userDetail');
          if (!userData) {
            // User is not authenticated, allow app to close or stay on auth screen
            // If at login/signup, allow app to close
            if (currentPath.includes('Login') || currentPath.includes('SignUp') || currentPath.includes('Onboarding')) {
              return false; // Allow app to close
            }
            // Otherwise, prevent back navigation
            return true;
          }
        } catch (error) {
          // If error checking auth, allow app to close for safety
          return false;
        }
      }
      
      // Check if we can navigate back
      if (router.canGoBack()) {
        router.back();
        return true; // Prevent default behavior (app close)
      }
      
      // If we're at a root screen (like Onboarding, Splash, Welcome), allow exit
      const isRootScreen = 
        currentPath === '' || 
        currentPath === 'Onboarding' || 
        currentPath === 'Splash' || 
        currentPath === 'Welcome' ||
        segments.length <= 1;
      
      if (isRootScreen) {
        // At root screens, allow app to close
        return false; // Allow default (app close)
      }
      
      // Check if user is authenticated before allowing navigation to Dashboard
      try {
        const userData = await AsyncStorage.getItem('userDetail');
        if (userData) {
          // User is authenticated, allow navigation to Dashboard
          try {
            router.replace('/(tabs)/Dashboard');
            return true; // Prevent default
          } catch (error) {
            // If navigation fails, allow default
            return false;
          }
        } else {
          // User is not authenticated, navigate to login instead
          try {
            router.replace('/(auth)/Login');
            return true; // Prevent default
          } catch (error) {
            // If navigation fails, allow default
            return false;
          }
        }
      } catch (error) {
        // If error checking auth, navigate to login for safety
        try {
          router.replace('/(auth)/Login');
          return true;
        } catch (navError) {
          return false;
        }
      }
    });

    return () => backHandler.remove();
  }, [router, segments]);

  return null;
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <StatusBar style="light" backgroundColor={Colors.blackColor} />
        <BackButtonHandler />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: Colors.blackColor },
          }}
        />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
