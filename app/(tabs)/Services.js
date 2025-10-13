import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React from 'react';
import {
  Image,
  ImageBackground,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Fonts } from '../../constants';

const Services = () => {
  const router = useRouter();

  const rideTypes = [
    {
      id: '1',
      icon: require('../../assets/images/car.png'),
      value: 'Motorcycle',
    },
    {
      id: '2',
      icon: require('../../assets/images/auto.png'),
      value: 'Keke',
    },
    {
      id: '3',
      icon: require('../../assets/images/bike.png'),
      value: 'Lite(no/ac)',
    },
    {
      id: '4',
      icon: require('../../assets/images/bike.png'),
      value: 'Smooth',
    },
    {
      id: '5',
      icon: require('../../assets/images/auto.png'),
      value: 'SUV',
    },
    {
      id: '6',
      icon: require('../../assets/images/car.png'),
      value: 'Luxe',
    },
  ];

  const payments = [
    { 
      id: 1, 
      icon: require('../../assets/images/wallet.png'), 
      value: 'Trihp Wallet' 
    }
  ];

  const handleSelectedRideType = async (rideType) => {
    if (rideType) {
      try {
        await AsyncStorage.setItem('selectedRideType', JSON.stringify(rideType));
        router.push('/search-ride', { selectedRide: rideType });
      } catch (error) {
        console.error('Error saving ride type:', error);
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Services</Text>
      </View>
      
      <ScrollView 
        contentContainerStyle={styles.scrollContent} 
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.bannerText}>
          Ride beyond limits
        </Text>
        
        <Image 
          source={require('../../assets/images/service-banner.png')} 
          resizeMode="contain" 
          style={styles.bannerImage} 
        />
        
        {/* Rides Section */}
        <View style={styles.sectionDivider}>
          <View style={styles.dividerLine} />
          <Text style={styles.sectionTitle}>Rides</Text>
          <View style={styles.dividerLine} />
        </View>
        
        <View style={styles.rideTypesContainer}>
          {rideTypes.map((item) => (
            <Pressable
              key={item.id}
              style={styles.rideTypeItem}
              onPress={() => handleSelectedRideType(item.id)}
            >
              <Text style={styles.rideTypeText}>{item.value}</Text>
              <ImageBackground 
                source={require('../../assets/images/service_bg.png')} 
                style={styles.rideTypeBackground}
              >
                <Image 
                  source={item.icon} 
                  resizeMode="contain" 
                  style={styles.rideTypeIcon} 
                />
              </ImageBackground>
            </Pressable>
          ))}
        </View>
        
        {/* Payments Section */}
        <View style={styles.sectionDivider}>
          <View style={styles.dividerLine} />
          <Text style={styles.sectionTitle}>Payments</Text>
          <View style={styles.dividerLine} />
        </View>
        
        <View style={styles.paymentsContainer}>
          {payments.map((item) => (
            <Pressable
              key={item.id}
              style={styles.paymentItem}
              onPress={() => router.push('/(tabs)/Payment')}
            >
              <Text style={styles.paymentText}>{item.value}</Text>
              <ImageBackground 
                source={require('../../assets/images/service_bg.png')} 
                style={styles.paymentBackground}
              >
                <Image 
                  source={item.icon} 
                  resizeMode="contain" 
                  style={styles.paymentIcon} 
                />
              </ImageBackground>
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
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.whiteColor,
  },
  headerTitle: {
    ...Fonts.Regular,
    fontSize: 24,
    color: Colors.whiteColor,
    fontWeight: 'bold',
  },
  scrollContent: {
    paddingBottom: 20,
    marginHorizontal: 10,
  },
  bannerText: {
    ...Fonts.Regular,
    color: Colors.whiteColor,
    fontSize: 14,
    marginTop: 20,
    marginBottom: 10,
  },
  bannerImage: {
    width: '100%',
    marginBottom: 15,
  },
  sectionDivider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 15,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#8F8F8F',
  },
  sectionTitle: {
    color: Colors.whiteColor,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginHorizontal: 10,
  },
  rideTypesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
    justifyContent: 'space-between',
  },
  rideTypeItem: {
    width: '29%',
    alignItems: 'center',
    marginBottom: 30,
    marginHorizontal: 7,
  },
  rideTypeText: {
    color: Colors.whiteColor,
    textAlign: 'center',
    ...Fonts.Regular,
    fontSize: 12,
    paddingBottom: 10,
  },
  rideTypeBackground: {
    justifyContent: 'center',
    height: 65,
    alignItems: 'center',
  },
  rideTypeIcon: {
    height: 60,
    width: 60,
  },
  paymentsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  paymentItem: {
    width: '29%',
    alignItems: 'center',
    marginBottom: 30,
    marginHorizontal: 7,
  },
  paymentText: {
    color: Colors.whiteColor,
    textAlign: 'center',
    ...Fonts.Regular,
    fontSize: 12,
    paddingBottom: 10,
  },
  paymentBackground: {
    justifyContent: 'center',
    height: 65,
    alignItems: 'center',
  },
  paymentIcon: {
    height: 50,
    width: 60,
  },
});
