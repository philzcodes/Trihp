import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../constants';

const Services = () => {
  const router = useRouter();

  const rideTypes = [
    {
      id: '1',
      icon: require('../../assets/images/services/motorcycle.png'),
      value: 'Trihp Motorcycle',
    },
    {
      id: '2',
      icon: require('../../assets/images/services/keke.png'),
      value: 'trihp Keke',
    },
    {
      id: '3',
      icon: require('../../assets/images/services/car-lite.png'),
      value: 'Trihp Lite (no/ac)',
    },
    {
      id: '4',
      icon: require('../../assets/images/services/car-smooth.png'),
      value: 'Trihp Smooth',
    },
    {
      id: '5',
      icon: require('../../assets/images/services/suv.png'),
      value: 'Trihp SUV',
    },
    {
      id: '6',
      icon: require('../../assets/images/services/car-luxe.png'),
      value: 'Trihp Luxe',
    },
  ];

  const handleSelectedRideType = async (rideType) => {
    if (rideType) {
      try {
        await AsyncStorage.setItem('selectedRideType', JSON.stringify(rideType));
        router.push('/search-ride');
      } catch (error) {
        console.error('Error saving ride type:', error);
      }
    }
  };

  const handleBackPress = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.blackColor} />
      
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={handleBackPress} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={Colors.whiteColor} />
        </Pressable>
        <Text style={styles.headerTitle}>Services</Text>
      </View>
      
      <ScrollView 
        contentContainerStyle={styles.scrollContent} 
        showsVerticalScrollIndicator={false}
      >
        {/* Banner Text */}
        <Text style={styles.bannerText}>Ride Beyond Limits</Text>
        
        {/* Banner Image */}
        <View style={styles.bannerContainer}>
          <Image 
            source={require('../../assets/images/service-banner.png')} 
            resizeMode="cover" 
            style={styles.bannerImage} 
          />
        </View>
        
        {/* Rides Section Divider */}
        <View style={styles.sectionDivider}>
          <View style={styles.dividerLine} />
          <Text style={styles.sectionTitle}>Rides</Text>
          <View style={styles.dividerLine} />
        </View>
        
        {/* Ride Types List */}
        <View style={styles.rideTypesContainer}>
          {rideTypes.map((item) => (
            <Pressable
              key={item.id}
              style={({ pressed }) => [
                styles.rideTypeCard,
                pressed && styles.rideTypeCardPressed
              ]}
              onPress={() => handleSelectedRideType(item)}
              android_ripple={{ color: '#2a2a2a' }}
            >
              <View style={styles.rideTypeIconContainer}>
                <Image 
                  source={item.icon} 
                  resizeMode="contain" 
                  style={styles.rideTypeIcon} 
                />
              </View>
              <Text style={styles.rideTypeText}>{item.value}</Text>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Services;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.blackColor,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1a1a1a',
  },
  backButton: {
    marginRight: 16,
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.whiteColor,
    letterSpacing: 0.5,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  bannerText: {
    fontSize: 16,
    color: Colors.whiteColor,
    marginTop: 24,
    marginBottom: 16,
    fontWeight: '400',
  },
  bannerContainer: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 24,
  },
  bannerImage: {
    width: '100%',
    height: '100%',
  },
  sectionDivider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#333',
  },
  sectionTitle: {
    color: Colors.whiteColor,
    fontSize: 16,
    fontWeight: '500',
    paddingHorizontal: 16,
    letterSpacing: 0.5,
  },
  rideTypesContainer: {
    gap: 16,
  },
  rideTypeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0a0a0a',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#2a2a2a',
    padding: 16,
    minHeight: 80,
  },
  rideTypeCardPressed: {
    backgroundColor: '#1a1a1a',
    borderColor: '#3a3a3a',
  },
  rideTypeIconContainer: {
    width: 80,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  rideTypeIcon: {
    width: '100%',
    height: '100%',
  },
  rideTypeText: {
    flex: 1,
    color: Colors.whiteColor,
    fontSize: 16,
    fontWeight: '500',
    letterSpacing: 0.3,
  },
});