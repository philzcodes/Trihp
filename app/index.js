import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { Colors } from '../constants';

const Index = () => {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        // Check if user data exists in AsyncStorage
        const userData = await AsyncStorage.getItem('userDetail');
        
        if (userData) {
          // User is logged in, redirect to dashboard
          router.replace('/Dashboard');
        } else {
          // User is not logged in, redirect to splash screen
          router.replace('/Splash');
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
        // On error, redirect to splash screen
        router.replace('/Splash');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthentication();
  }, [router]);

  // Show loading screen while checking authentication
  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={Colors.yellow} />
      </View>
    );
  }

  // This component doesn't render anything as it only handles routing
  return null;
};

export default Index;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.blackColor,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
