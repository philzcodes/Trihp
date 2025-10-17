import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useRef, useState } from 'react';
import {
  Image,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions
} from 'react-native';
import { MapComponent } from '../../components';
import TriphButton from '../../components/TriphButton';
import { Colors, Fonts } from '../../constants';
import Loader from '../../helper/Loader';
import { showWarning } from '../../helper/Toaster';

const PickupConfirm = () => {
  const data = useLocalSearchParams();
  const mapRef = useRef(null);
  const { height } = useWindowDimensions();
  const mapHeight = height * 0.85;
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  // Debug logging
  console.log('PickupConfirm - Received data:', data);
  console.log('PickupConfirm - Origin coordinates:', data?.originCoordinates);
  console.log('PickupConfirm - Destination coordinates:', data?.destinationCoordinates);
  console.log('PickupConfirm - Amount:', data?.amount, 'Type:', typeof data?.amount);
  console.log('PickupConfirm - Payment method:', data?.paymentMethod);
  console.log('PickupConfirm - Vehicle category:', data?.vehicle_category_id);
  console.log('PickupConfirm - Parsed origin coordinates:', parsedOriginCoordinates);
  console.log('PickupConfirm - Parsed destination coordinates:', parsedDestinationCoordinates);
  
  // Parse coordinates safely
  const parseCoordinates = (coordParam) => {
    if (!coordParam) return null;
    try {
      if (typeof coordParam === 'string') {
        return JSON.parse(coordParam);
      }
      return coordParam;
    } catch (error) {
      console.error('Error parsing coordinates:', error);
      return null;
    }
  };

  const parsedOriginCoordinates = parseCoordinates(data?.originCoordinates);
  const parsedDestinationCoordinates = parseCoordinates(data?.destinationCoordinates);

  const [originCoordinates, setOriginCoordinates] = useState({
    latitude: parsedOriginCoordinates?.latitude || 4.8666,
    longitude: parsedOriginCoordinates?.longitude || 6.9745,
  });

  const [pickupLocation, setPickupLocation] = useState(
    data?.originLocation || 'Main Peninsular Rd'
  );

  const region = {
    latitude: originCoordinates?.latitude || 4.8666,
    longitude: originCoordinates?.longitude || 6.9745,
    latitudeDelta: 0.0037653946957192375,
    longitudeDelta: 0.001982487738132477,
  };

  console.log('PickupConfirm - Region object:', region);
  console.log('PickupConfirm - Origin coordinates state:', originCoordinates);

  const getAddressDestination = async (lat, long) => {
    try {
      let address = await Location.reverseGeocodeAsync({ 
        latitude: lat, 
        longitude: long 
      });
      if (address.length > 0) {
        const formattedAddress = [
          address[0].name,
          address[0].street,
          address[0].city,
          address[0].region,
          address[0].country
        ].filter(Boolean).join(', ');
        setPickupLocation(formattedAddress);
      }
    } catch (error) {
      console.error('Error fetching address:', error);
    }
  };

  const creatRide = async () => {
    try {
      setLoading(true);
      
      console.log('Creating ride with data:', {
        originCoordinates,
        parsedDestinationCoordinates,
        pickupLocation,
        data
      });
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Safe amount parsing
      let amount = '1000'; // Default fallback
      if (data?.amount) {
        try {
          const parsedAmount = parseFloat(data.amount);
          if (!isNaN(parsedAmount)) {
            amount = parsedAmount.toFixed(0);
          }
        } catch (error) {
          console.warn('Error parsing amount:', error);
        }
      }
      
      // Dummy ride creation - no real API call
      const details = {
        pickup_latitude: originCoordinates?.latitude || 4.8666,
        pickup_longitude: originCoordinates?.longitude || 6.9745,
        drop_latitude: parsedDestinationCoordinates?.latitude || 4.8666,
        drop_longitude: parsedDestinationCoordinates?.longitude || 6.9745,
        pickup_location_name: pickupLocation || 'Unknown Location',
        drop_location_name: data?.destinationLocation || 'Unknown Destination',
        pay_for: data?.paymentMethod || 'cash',
        amount: amount,
        distance: data?.distance || '5.2',
        ride_category: data?.vehicle_category_id || '1',
        transaction_id: 'dummy_transaction_' + Date.now(),
        payment_type: data?.paymentMethod || 'cash',
      };
      
      // Simulate successful response
      console.log('Dummy ride created successfully:', details);
      
        const datas = {
          ...details,
        id: 'dummy_ride_' + Date.now(),
        status: 'confirmed',
        driver_id: 'dummy_driver_123',
        estimated_arrival: '5-10 minutes',
        };
      
      // Navigate to next screen with dummy data
      console.log('Navigating to FetchingRide with data:', datas);
      router.push({
        pathname: '/booking/FetchingRide',
        params: { info: JSON.stringify(datas) }
      });
      
    } catch (error) {
      console.error('Error in dummy ride creation:', error);
      showWarning('Failed to create ride');
    } finally {
      setLoading(false);
    }
  };

  try {
  return (
    <View style={styles.container}>
        {/* Map Component */}
      <MapComponent
        ref={mapRef}
        style={{ height: mapHeight, width: '100%' }}
          region={region}
        onRegionChangeComplete={(newRegion) => {
            try {
              console.log('Region changed:', newRegion);
          setOriginCoordinates({
            latitude: newRegion?.latitude,
            longitude: newRegion?.longitude,
          });
          getAddressDestination(newRegion?.latitude, newRegion?.longitude);
            } catch (error) {
              console.error('Error handling region change:', error);
            }
          }}
          onMapReady={() => {
            console.log('PickupConfirm map ready');
          }}
        />

      {/* Center Pin Marker */}
      <View style={styles.centerMarkerContainer}>
        <View style={styles.pickupLabel}>
          <Text style={styles.pickupLabelText}>Pickup here</Text>
        </View>
        <Image 
          source={require('../../assets/images/pin.png')} 
          style={styles.pinImage} 
          resizeMode="contain" 
        />
      </View>

      {/* Back Button */}
      <Pressable 
        style={[styles.backButton, { top: Platform.OS === 'ios' ? 60 : 20 }]} 
        onPress={() => router.back()}
      >
        <View style={styles.backButtonCircle}>
          <Ionicons name="arrow-back" size={24} color={Colors.whiteColor} />
        </View>
      </Pressable>

      {/* Bottom Sheet */}
      <View style={styles.bottomSheet}>
        {/* Header */}
        <Text style={styles.headerText}>
          Confirm Your Pickup Location
        </Text>
        
        {/* Divider */}
        <View style={styles.divider} />
        
        {/* Content */}
        <View style={styles.contentContainer}>
          {/* Pickup Location Display */}
          <View style={styles.locationContainer}>
            <View style={styles.locationRow}>
              <Ionicons 
                name="location-sharp" 
                size={24} 
                color={Colors.whiteColor} 
              />
              <Text style={styles.locationText}>{pickupLocation}</Text>
            </View>
          </View>

          {/* Change Destination Button */}
            <Pressable
            style={styles.changeButton}
              onPress={() => router.push('/booking/SearchScreen')}
            >
            <Text style={styles.changeButtonText}>Change destination</Text>
            </Pressable>

          {/* Confirm Pickup Button */}
          <TriphButton
            text="Confirm Pickup"
            onPress={() => {
              creatRide();
            }}
            extraStyle={styles.confirmButton}
            extraTextStyle={styles.confirmButtonText}
          />
        </View>
      </View>

      {/* Loader */}
      <Loader modalVisible={loading} setModalVisible={setLoading} />
    </View>
  );
  } catch (error) {
    console.error('PickupConfirm: Error rendering component:', error);
    // Return fallback view if component fails to render
    return (
      <View style={styles.container}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
          <Text style={{ fontSize: 18, color: '#FFFFFF', textAlign: 'center', marginBottom: 10 }}>
            Map Error
          </Text>
          <Text style={{ fontSize: 14, color: '#8E8E93', textAlign: 'center', marginBottom: 20 }}>
            Unable to load map. Please try again.
          </Text>
          <Pressable
            style={{ backgroundColor: '#FFD700', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 20 }}
            onPress={() => router.back()}
          >
            <Text style={{ color: '#000000', fontWeight: '600' }}>Go Back</Text>
          </Pressable>
        </View>
      </View>
    );
  }
};

export default PickupConfirm;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.whiteColor,
  },
  
  // Center Marker Styles
  centerMarkerContainer: {
    position: 'absolute',
    top: '42%',
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pickupLabel: {
    backgroundColor: '#000000',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 8,
  },
  pickupLabelText: {
    color: Colors.whiteColor,
    fontSize: 14,
    fontWeight: '500',
    ...Fonts.Regular,
  },
  pinImage: {
    height: 50,
    width: 50,
  },

  // Back Button Styles
  backButton: {
    position: 'absolute',
    left: 20,
  },
  backButtonCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },

  // Bottom Sheet Styles
  bottomSheet: {
    position: 'absolute',
    width: '100%',
    bottom: 0,
    backgroundColor: '#000000',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
  },
  headerText: {
    ...Fonts.Regular,
    fontSize: 18,
    fontWeight: '500',
    textAlign: 'center',
    color: Colors.whiteColor,
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  divider: {
    width: '100%',
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  
  // Location Display Styles
  locationContainer: {
    paddingVertical: 15,
    paddingHorizontal: 10,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  locationText: {
    ...Fonts.Regular,
    fontSize: 16,
    color: Colors.whiteColor,
    flex: 1,
  },

  // Change Button Styles
  changeButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    marginTop: 5,
  },
  changeButtonText: {
    ...Fonts.Regular,
    fontSize: 15,
    color: 'rgba(255, 255, 255, 0.7)',
    fontWeight: '400',
  },

  // Confirm Button Styles
  confirmButton: {
    marginTop: 20,
    marginBottom: 10,
    backgroundColor: '#FFD700',
    borderRadius: 30,
    paddingVertical: 16,
  },
  confirmButtonText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '600',
    ...Fonts.Regular,
  },
});