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

    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      // Check if we can navigate back
      if (router.canGoBack()) {
        router.back();
        return true; // Prevent default behavior (app close)
      }
      
      // If we're at a root screen (like Onboarding, Splash, Welcome), allow exit
      // Otherwise, try to navigate to Dashboard as a safe fallback
      const currentPath = segments.join('/');
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
      
      // Not at root but can't go back - try navigating to Dashboard
      try {
        router.replace('/(tabs)/Dashboard');
        return true; // Prevent default
      } catch (error) {
        // If navigation fails, allow default
        return false;
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
