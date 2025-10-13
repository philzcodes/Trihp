import { useRouter } from 'expo-router';
import React from 'react';
import {
  Image,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Colors, Fonts } from '../constants';

const DashboardHeader = () => {
  const router = useRouter();
  
  // Mock user data - replace with actual user data from your state management
  const user = {
    first_name: 'John',
    user_name: 'john_doe',
    image: null,
  };

  return (
    <View style={{ marginTop: Platform.OS === 'ios' ? 0 : 20 }}>
      <View style={[styles.container, { paddingBottom: 15 }]}>
        <View style={styles.container}>
          <Pressable onPress={() => router.push('/profile')}>
            {user?.image ? (
              <View style={styles.image}>
                <Image
                  source={{ uri: user?.image }}
                  resizeMode="cover"
                  style={styles.image}
                />
              </View>
            ) : (
              <View style={styles.placeholder}>
                <Text style={styles.placeholderText}>
                  {user?.first_name?.charAt(0).toUpperCase() || 'U'}
                </Text>
              </View>
            )}
          </Pressable>
          <Text style={styles.title}>Hello, {user?.first_name}</Text>
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
});
