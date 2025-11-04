import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { userAPI } from '../api/services';
import { Colors, Fonts } from '../constants';

const DashboardHeader = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  
  // User state
  const [user, setUser] = useState({
    firstName: 'User',
    lastName: '',
    profileImageUri: null,
  });
  const [isLoading, setIsLoading] = useState(true);

  // Fetch user profile
  const fetchUserProfile = async () => {
    try {
      setIsLoading(true);
      const response = await userAPI.getProfile();
      
      if (response && response.data) {
        setUser({
          firstName: response.data.firstName || 'User',
          lastName: response.data.lastName || '',
          profileImageUri: response.data.profileImageUri || null,
        });
      }
    } catch (error) {
      console.warn('Error fetching user profile for header:', error);
      // Keep default values on error
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  return (
    <View style={{ marginTop: insets.top || 20 }}>
      <View style={[styles.container, { paddingBottom: 15 }]}>
        <View style={styles.container}>
          <Pressable onPress={() => router.push('/(tabs)/Profile')}>
            {user?.profileImageUri ? (
              <View style={styles.image}>
                <Image
                  source={{ uri: user?.profileImageUri }}
                  resizeMode="cover"
                  style={styles.image}
                />
              </View>
            ) : (
              <View style={styles.placeholder}>
                <Text style={styles.placeholderText}>
                  {user?.firstName?.charAt(0).toUpperCase() || 'U'}
                </Text>
              </View>
            )}
          </Pressable>
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color={Colors.yellow} />
            </View>
          ) : (
            <Text style={styles.title}>
              Hello, {user?.firstName} {user?.lastName}
            </Text>
          )}
        </View>
        
      </View>
    </View>
  );
};

export default DashboardHeader;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 60,
  },
  image: {
    height: 45,
    width: 45,
    borderRadius: 100,
    borderWidth: 2,
    borderColor: '#fff',
  },
  placeholder: {
    height: 45,
    width: 45,
    borderRadius: 100,
    borderWidth: 2,
    borderColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.blackColor,
  },
  placeholderText: {
    ...Fonts.Regular,
    fontSize: 20,
    color: Colors.yellow,
    fontWeight: 'bold',
  },
  title: {
    ...Fonts.Regular,
    fontSize: 16,
    marginLeft: 15,
    color: Colors.whiteColor,
  },
  loadingContainer: {
    marginLeft: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
