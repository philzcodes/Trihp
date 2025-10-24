import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import BottomSheet from '@gorhom/bottom-sheet';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Image,
  Linking,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MapComponent } from '../../components';
import TriphButton from '../../components/TriphButton';
import { Colors, Fonts } from '../../constants';
import { showWarning } from '../../helper/Toaster';

const DriverFoundScreen = () => {
  const params = useLocalSearchParams();
  
  // Debug logging for params
  console.log('DriverFoundScreen - Raw params:', params);
  console.log('DriverFoundScreen - Params keys:', Object.keys(params || {}));
  
  // Parse the data parameter if it's a JSON string
  let data = null;
  try {
    if (params?.data) {
      console.log('DriverFoundScreen - Raw data param:', params.data);
      console.log('DriverFoundScreen - Data param type:', typeof params.data);
      
      if (typeof params.data === 'string') {
        data = JSON.parse(params.data);
        console.log('DriverFoundScreen - Parsed data from string:', data);
      } else {
        data = params.data;
        console.log('DriverFoundScreen - Using data as object:', data);
      }
    } else {
      console.log('DriverFoundScreen - No data param found, creating dummy data');
      // Create dummy data if no data is provided
      data = {
        driver: {
          first_name: 'John',
          name: 'John Doe',
          phone_number: '+1234567890',
          latitude: '4.8646',
          longitude: '6.9725',
          profile_image: null
        },
        ride: {
          id: 'ride_123',
          pickup_latitude: '4.8666',
          pickup_longitude: '6.9745',
          drop_latitude: '4.8670',
          drop_longitude: '6.9750',
          amount: '25',
          payment_type: 'cash'
        }
      };
    }
  } catch (error) {
    console.error('Error parsing data parameter:', error);
    console.log('DriverFoundScreen - Creating fallback dummy data due to parse error');
    // Create fallback dummy data
    data = {
      driver: {
        first_name: 'John',
        name: 'John Doe',
        phone_number: '+1234567890',
        latitude: '4.8646',
        longitude: '6.9725',
        profile_image: null
      },
      ride: {
        id: 'ride_123',
        pickup_latitude: '4.8666',
        pickup_longitude: '6.9745',
        drop_latitude: '4.8670',
        drop_longitude: '6.9750',
        amount: '25',
        payment_type: 'cash'
      }
    };
  }
  
  console.log('DriverFoundScreen - Final data:', data);

  const mapRef = useRef(null);
  const { height } = useWindowDimensions();
  const router = useRouter();
  const bottomSheetModalRef = useRef(null);
  const insets = useSafeAreaInsets();

  // Timer state - starts at 2 minutes (120 seconds)
  const [timeRemaining, setTimeRemaining] = useState(10);
  const timerIntervalRef = useRef(null);

  const snapPoints = useMemo(() => ['60%', '80%'], []);
  const [bottomSheetHeight, setBottomSheetHeight] = useState(0);

  const mapHeight = height - bottomSheetHeight;

  const handleBottomSheetChange = (index) => {
    const snapPointValue = parseFloat(snapPoints[index]);
    setBottomSheetHeight(height * (snapPointValue / 100));
  };

  console.log('DriverFoundScreen - Screen height:', height);

  // Extract driver and ride information
  const driverInfo = data?.driver || {};
  const rideInfo = data?.ride || data?.data || {};
  
  console.log('DriverFoundScreen - Driver info:', driverInfo);
  console.log('DriverFoundScreen - Driver name field:', driverInfo?.name);
  console.log('DriverFoundScreen - Driver first_name field:', driverInfo?.first_name);
  console.log('DriverFoundScreen - Ride info:', rideInfo);
  
  const pickupCoordinates = {
    latitude: parseFloat(rideInfo.pickup_latitude) || 4.8666,
    longitude: parseFloat(rideInfo.pickup_longitude) || 6.9745,
  };

  const dropOffCoordinates = {
    latitude: parseFloat(rideInfo.drop_latitude) || 4.8670,
    longitude: parseFloat(rideInfo.drop_longitude) || 6.9750,
  };

  const driverCoordinates = {
    latitude: parseFloat(driverInfo.latitude) || pickupCoordinates.latitude - 0.002,
    longitude: parseFloat(driverInfo.longitude) || pickupCoordinates.longitude - 0.002,
  };
  
  console.log('DriverFoundScreen - Pickup coordinates:', pickupCoordinates);
  console.log('DriverFoundScreen - Drop off coordinates:', dropOffCoordinates);
  console.log('DriverFoundScreen - Driver coordinates:', driverCoordinates);

  // Calculate map region to show both driver and pickup location
  const calculateRegion = () => {
    const maxLat = Math.max(driverCoordinates.latitude, pickupCoordinates.latitude);
    const minLat = Math.min(driverCoordinates.latitude, pickupCoordinates.latitude);
    const minLon = Math.min(driverCoordinates.longitude, pickupCoordinates.longitude);
    const maxLon = Math.max(driverCoordinates.longitude, pickupCoordinates.longitude);
    const midLat = (minLat + maxLat) / 2;
    const midLon = (minLon + maxLon) / 2;
    const deltaLat = (maxLat - minLat) * 1.5;
    const deltaLon = (maxLon - minLon) * 1.5;

    return {
      latitude: midLat,
      longitude: midLon,
      latitudeDelta: Math.max(deltaLat, 0.01),
      longitudeDelta: Math.max(deltaLon, 0.01),
    };
    };

  // Timer effect - counts down and navigates when reaching 0
  useEffect(() => {
    console.log('Starting timer with 120 seconds');
    timerIntervalRef.current = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          console.log('Timer reached 1, stopping timer');
          clearInterval(timerIntervalRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, []);

  // Separate effect to handle navigation when timer reaches 0
  useEffect(() => {
    if (timeRemaining === 0) {
      console.log('Timer reached 0, navigating to WaitingForDriverScreen');
      console.log('DriverFoundScreen - Data being passed:', data);
      // Use setTimeout to ensure navigation happens after render
      setTimeout(() => {
        router.push({
          pathname: '/booking/DriverArrivedScreen',
          params: {
            data: JSON.stringify(data)
          }
        });
      }, 0);
    }
  }, [timeRemaining, router, data]);

  // Format time remaining as MM:SS or just minutes
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return mins > 0 ? `${mins.toString().padStart(2, '0')}` : '00';
  };

  const handleMessageDriver = () => {
    showWarning('Message functionality coming soon');
  };

  const handleCallDriver = () => {
    const phoneNumber = driverInfo?.phone_number || driverInfo?.phone || '+1234567890';
    Linking.openURL(`tel:${phoneNumber}`);
  };

  const handleCancelTrip = () => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
    }
    router.push('/booking/RideCancelScreen', { 
      data: rideInfo,
      rideId: rideInfo?.id 
    });
  };

  const togglePanelExpansion = () => {
    setIsPanelExpanded(!isPanelExpanded);
  };

  // Data is now always available (either real or dummy)
  console.log('DriverFoundScreen - Rendering main screen with data:', !!data);

  return (
    <View style={styles.container}>
      {/* Map Component */}
      <MapComponent
        ref={mapRef}
        style={[styles.map, { height: mapHeight }]}
        initialRegion={calculateRegion()}
        showsUserLocation={false}
        showsMyLocationButton={false}
        markers={[
          {
          ...pickupCoordinates,
          customMarker: (
              <Image 
                source={require('../../assets/images/pin.png')} 
                style={styles.pickupMarker} 
                resizeMode="contain" 
              />
            )
          }
        ]}
        driverMarkers={[
          {
            ...driverCoordinates,
          customMarker: (
              <Image 
                source={require('../../assets/images/car.png')} 
                style={styles.driverMarker} 
                resizeMode="contain" 
              />
            )
          }
        ]}
        showDirections={true}
        originCoordinates={driverCoordinates}
        destinationCoordinates={pickupCoordinates}
        directionsStrokeWidth={4}
        directionsStrokeColor="#000000"
      />

      {/* Back Button */}
      <Pressable 
        style={[styles.backButton, { top: Platform.OS === 'ios' ? 60 : 20 }]} 
        onPress={() => {
          if (timerIntervalRef.current) {
            clearInterval(timerIntervalRef.current);
          }
          router.back();
        }}
      >
        <View style={styles.backButtonCircle}>
          <Ionicons name="arrow-back" size={24} color={Colors.whiteColor} />
        </View>
      </Pressable>

      {/* Bottom Sheet */}
      <BottomSheet
        ref={bottomSheetModalRef}
        index={0}
        snapPoints={snapPoints}
        enablePanDownToClose={false}
        handleIndicatorStyle={styles.bottomSheetIndicator}
        backgroundStyle={styles.bottomSheetBackground}
        enableOverDrag={false}
        bottomInset={insets.bottom}
        onChange={handleBottomSheetChange}
        enableDynamicSizing={false}
        animateOnMount={true}
      >
        <View style={styles.bottomSheetContent}>
          
          {/* Header with Timer */}
          <View style={styles.headerSection}>
            <Text style={styles.headerTitle}>Meet driver at the pickup location</Text>
            <View style={styles.timerCircle}>
              <Text style={styles.timerNumber}>{formatTime(timeRemaining)}</Text>
              <Text style={styles.timerLabel}>Min</Text>
            </View>
          </View>

          {/* Trip Details Section */}
          <View style={styles.tripDetailsSection}>
            {/* Pickup Location */}
            <View style={styles.locationRow}>
              <View style={styles.locationIconContainer}>
                <View style={styles.pickupDot} />
                <View style={styles.dashedLine} />
              </View>
              <View style={styles.locationTextContainer}>
                <Text style={styles.locationLabel}>Pickup Location</Text>
              </View>
              <Text style={styles.priceText}>${rideInfo?.amount || '25'}</Text>
            </View>

            {/* Drop off Location */}
            <View style={styles.locationRow}>
              <View style={styles.locationIconContainer}>
                <Ionicons 
                  name="location-sharp" 
                  size={20} 
                  color="#4CD964" 
                />
              </View>
              <View style={styles.locationTextContainer}>
                <Text style={styles.locationLabel}>Drop off location</Text>
              </View>
              <View style={styles.paymentBadge}>
                <Image 
                  source={require('../../assets/images/paymentMode/cash.png')} 
                  style={styles.paymentIcon} 
                  resizeMode="contain" 
                />
                <Text style={styles.paymentText}>Cash</Text>
              </View>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtonsSection}>
            <Pressable 
              style={styles.messageButton}
              onPress={handleMessageDriver}
            >
              <MaterialCommunityIcons 
                name="message-processing" 
                size={20} 
                color="#4CD964" 
              />
              <Text style={styles.messageButtonText}>Message Driver</Text>
            </Pressable>

              <Pressable
              style={styles.callButton}
              onPress={handleCallDriver}
            >
              <Ionicons 
                name="call" 
                size={20} 
                color="#FF3B30" 
              />
              <Text style={styles.callButtonText}>Call Driver</Text>
              </Pressable>
            </View>

          {/* Divider */}
          <View style={styles.divider} />

          {/* Driver Info Section */}
          <View style={styles.driverInfoSection}>
            <View style={styles.driverDetails}>
              <Text style={styles.driverName}>
                {driverInfo?.name || driverInfo?.first_name || 'Driver Name'}
              </Text>
              <Text style={styles.driverArrival}>
                Arriving in {formatTime(timeRemaining)} mins
              </Text>
              <View style={styles.ratingContainer}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <Ionicons 
                    key={star}
                    name="star" 
                    size={16} 
                    color="#FFD700" 
                  />
                ))}
              </View>
              <Text style={styles.vehicleDescription}>
                Vehicle description (Brand, color, Reg. NO.)
              </Text>
            </View>
            <View style={styles.driverImageContainer}>
              <Image
                source={
                  driverInfo?.profile_image 
                    ? { uri: driverInfo.profile_image }
                    : require('../../assets/images/user.jpg')
                }
                style={styles.driverImage}
                resizeMode="cover"
              />
              <Image
                source={require('../../assets/images/car.png')}
                style={styles.vehicleImage}
                resizeMode="contain"
              />
            </View>
          </View>

          {/* Cancel Trip Button */}
          <View style={styles.cancelButtonContainer}>
            <TriphButton
              text="Cancel Trip"
              onPress={handleCancelTrip}
              extraStyle={styles.cancelButton}
              extraTextStyle={styles.cancelButtonText}
              bgColor={{ backgroundColor: '#FFD700' }}
            />
          </View>
        </View>
      </BottomSheet>
    </View>
  );
};

export default DriverFoundScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  map: {
    width: '100%',
  },
  pickupMarker: {
    width: 40,
    height: 40,
  },
  driverMarker: {
    width: 50,
    height: 50,
  },

  // Back Button Styles
  backButton: {
    position: 'absolute',
    left: 20,
    zIndex: 10,
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
  bottomSheetIndicator: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    width: 40,
    height: 4,
  },
  bottomSheetBackground: {
    backgroundColor: '#000000',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  bottomSheetContent: {
    flex: 1,
    paddingBottom: Platform.OS === 'ios' ? 20 : 10,
  },

  // Header Section
  headerSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 10,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerTitle: {
    ...Fonts.Regular,
    fontSize: 18,
    fontWeight: '500',
    color: Colors.whiteColor,
    flex: 1,
  },
  timerCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 2,
    borderColor: Colors.whiteColor,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },
  timerNumber: {
    ...Fonts.Regular,
    fontSize: 24,
    fontWeight: '700',
    color: Colors.whiteColor,
  },
  timerLabel: {
    ...Fonts.Regular,
    fontSize: 12,
    color: Colors.whiteColor,
    marginTop: 2,
  },

  // Trip Details Section
  tripDetailsSection: {
    paddingBottom: 15,
    paddingHorizontal: 20,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  locationIconContainer: {
    width: 30,
    alignItems: 'center',
  },
  pickupDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#FF3B30',
    borderWidth: 2,
    borderColor: Colors.whiteColor,
  },
  dashedLine: {
    width: 2,
    height: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    marginTop: 4,
  },
  locationTextContainer: {
    flex: 1,
    marginLeft: 10,
  },
  locationLabel: {
    ...Fonts.Regular,
    fontSize: 15,
    color: Colors.whiteColor,
  },
  priceText: {
    ...Fonts.Regular,
    fontSize: 24,
    fontWeight: '700',
    color: Colors.whiteColor,
  },
  paymentBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    gap: 6,
  },
  paymentIcon: {
    width: 20,
    height: 20,
  },
  paymentText: {
    ...Fonts.Regular,
    fontSize: 14,
    color: Colors.whiteColor,
  },

  // Action Buttons Section
  actionButtonsSection: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  messageButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.whiteColor,
    paddingVertical: 14,
    borderRadius: 25,
    gap: 8,
  },
  messageButtonText: {
    ...Fonts.Regular,
    fontSize: 15,
    fontWeight: '500',
    color: '#000000',
  },
  callButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.whiteColor,
    paddingVertical: 14,
    borderRadius: 25,
    gap: 8,
  },
  callButtonText: {
    ...Fonts.Regular,
    fontSize: 15,
    fontWeight: '500',
    color: '#000000',
  },

  // Divider
  divider: {
    width: '100%',
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginBottom: 20,
  },

  // Driver Info Section
  driverInfoSection: {
    flexDirection: 'row',
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  driverDetails: {
    flex: 1,
  },
  driverName: {
    ...Fonts.Regular,
    fontSize: 20,
    fontWeight: '600',
    color: Colors.whiteColor,
    marginBottom: 4,
  },
  driverArrival: {
    ...Fonts.Regular,
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    gap: 4,
    marginBottom: 8,
  },
  vehicleDescription: {
    ...Fonts.Regular,
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  driverImageContainer: {
    position: 'relative',
    width: 100,
    height: 100,
  },
  driverImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: Colors.whiteColor,
  },
  vehicleImage: {
    position: 'absolute',
    bottom: -10,
    right: -10,
    width: 60,
    height: 40,
  },

  // Cancel Button
  cancelButtonContainer: {
    marginTop: 10,
    paddingHorizontal: 20,
  },
  cancelButton: {
    backgroundColor: '#FFD700',
    borderRadius: 30,
    paddingVertical: 16,
  },
  cancelButtonText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '600',
  },

  // Loading State
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingTitle: {
    fontSize: 18,
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 10,
    fontWeight: '600',
  },
  loadingMessage: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
    textAlign: 'center',
  },
});


