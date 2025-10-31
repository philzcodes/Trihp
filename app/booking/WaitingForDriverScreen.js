import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import BottomSheet from '@gorhom/bottom-sheet';
import { useLocalSearchParams, useRouter } from 'expo-router';
import LottieView from 'lottie-react-native';
import { useEffect, useMemo, useRef, useState } from 'react';
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
import rideRequestAPI from '../../api/rideRequestAPI';
import { MapComponent } from '../../components';
import { Colors, Fonts } from '../../constants';
import { showError, showWarning } from '../../helper/Toaster';
import { useRideWebSocket } from '../../services/websocketService';

const WaitingForDriverScreen = () => {
  const params = useLocalSearchParams();
  
  // Parse the data parameter if it's a JSON string
  let data = null;
  try {
    if (params?.data) {
      if (typeof params.data === 'string') {
        data = JSON.parse(params.data);
      } else {
        data = params.data;
      }
    }
  } catch (error) {
    console.error('Error parsing data parameter:', error);
    data = null;
  }

  console.log('WaitingForDriverScreen - Received data:', data);

  const mapRef = useRef(null);
  const { height } = useWindowDimensions();
  const router = useRouter();
  const bottomSheetModalRef = useRef(null);
  const insets = useSafeAreaInsets();

  // Timer state for optional auto-navigation (derived from ETA or fallback)
  const [timeRemaining, setTimeRemaining] = useState(null);
  const timerIntervalRef = useRef(null);
  const [currentRide, setCurrentRide] = useState(null);
  const [driverInfoState, setDriverInfoState] = useState(null);
  const [rideInfoState, setRideInfoState] = useState(null);
  const [eta, setEta] = useState(null);

  const snapPoints = useMemo(() => ['50%', '70%'], []);
  const [bottomSheetHeight, setBottomSheetHeight] = useState(0);

  const mapHeight = height - bottomSheetHeight;

  const handleBottomSheetChange = (index) => {
    const snapPointValue = parseFloat(snapPoints[index]);
    setBottomSheetHeight(height * (snapPointValue / 100));
  };

  console.log('WaitingForDriverScreen - Screen height:', height);

  // Initialize local state from incoming params (or null); WebSocket will keep these up-to-date
  const initialDriver = data?.driver || null;
  const initialRide = data?.ride || data?.data || data || null;
  
  // Get ride ID for WebSocket subscription
  const rideId = initialRide?.id || initialRide?.rideId || data?.id || data?.ride?.id || data?.rideId || null;
  
  // Initialize state from params
  useEffect(() => {
    if (driverInfoState === null && initialDriver) {
      setDriverInfoState(initialDriver);
    }
    if (rideInfoState === null && initialRide) {
      setRideInfoState(initialRide);
    }
  }, []);

  // Use WebSocket hook for real-time updates
  const { 
    rideData, 
    driverData, 
    status, 
    eta: wsEta, 
    error: wsError, 
    isConnected 
  } = useRideWebSocket(rideId, {
    onStatusChange: (newStatus) => {
      // Handle status changes and navigate accordingly
      if (newStatus === 'DRIVER_ARRIVED') {
        router.push({ 
          pathname: '/booking/DriverArrivedScreen', 
          params: { 
            data: JSON.stringify({ 
              driver: rideInfoState || rideData, 
              ride: rideInfoState || rideData 
            }) 
          } 
        });
      } else if (newStatus === 'CANCELLED') {
        router.push({ 
          pathname: '/booking/RideCancelScreen', 
          params: { 
            rideId: rideId, 
            reason: 'Ride cancelled' 
          } 
        });
      } else if (newStatus === 'TRIP_STARTED') {
        router.push({ 
          pathname: '/booking/TripInProgressScreen', 
          params: { 
            data: JSON.stringify({ 
              driver: rideInfoState || rideData, 
              ride: rideInfoState || rideData 
            }) 
          } 
        });
      }
    },
    onMessage: (data) => {
      // Log WebSocket messages for debugging
      if (__DEV__) {
        console.log('WebSocket message received:', data);
      }
    },
  });

  // Update state when WebSocket data arrives
  useEffect(() => {
    if (rideData) {
      setCurrentRide(rideData);
      setRideInfoState(rideData);
      
      // Update driver info if available
      if (rideData.driverId) {
        setDriverInfoState({
          id: rideData.driverId,
          name: rideData.driverName,
          phone: rideData.driverPhone,
          vehicleNumber: rideData.driverVehicleNumber,
          latitude: rideData.pickupLatitude,
          longitude: rideData.pickupLongitude,
          profile_image: rideData.driverProfileImage || null,
        });
      }
    }
  }, [rideData]);

  // Update driver info when driver data arrives
  useEffect(() => {
    if (driverData) {
      setDriverInfoState(prev => ({
        ...prev,
        ...driverData,
      }));
    }
  }, [driverData]);

  // Update ETA when ETA update arrives
  useEffect(() => {
    if (wsEta !== null && wsEta !== undefined) {
      setEta(wsEta);
    }
  }, [wsEta]);

  // Handle WebSocket errors - fallback to API call if WebSocket fails
  useEffect(() => {
    if (wsError && !isConnected && rideId) {
      console.warn('WebSocket connection failed, falling back to initial API fetch');
      // Fetch initial ride data once if WebSocket fails
      (async () => {
        try {
          const r = await rideRequestAPI.getRideRequest(rideId);
          if (r) {
            setCurrentRide(r);
            setRideInfoState(r);
            setDriverInfoState({
              id: r.driverId,
              name: r.driverName,
              phone: r.driverPhone,
              vehicleNumber: r.driverVehicleNumber,
              latitude: r.pickupLatitude,
              longitude: r.pickupLongitude,
              profile_image: r.driverProfileImage || null,
            });
            if (r.estimatedArrival) setEta(r.estimatedArrival);
          }
        } catch (err) {
          console.error('Failed to fetch ride data:', err);
        }
      })();
    }
  }, [wsError, isConnected, rideId]);
  
  const pickupCoordinates = {
    latitude: parseFloat(rideInfoState?.pickup_latitude || rideInfoState?.pickupLatitude) || 4.8666,
    longitude: parseFloat(rideInfoState?.pickup_longitude || rideInfoState?.pickupLongitude) || 6.9745,
  };

  const dropOffCoordinates = {
    latitude: parseFloat(rideInfoState?.drop_latitude || rideInfoState?.dropOffLatitude) || 4.8670,
    longitude: parseFloat(rideInfoState?.drop_longitude || rideInfoState?.dropOffLongitude) || 6.9750,
  };

  // Driver is now at pickup location
  const driverCoordinates = {
    latitude: pickupCoordinates.latitude,
    longitude: pickupCoordinates.longitude,
  };

  // Calculate map region to show route to destination
  const calculateRegion = () => {
    const maxLat = Math.max(pickupCoordinates.latitude, dropOffCoordinates.latitude);
    const minLat = Math.min(pickupCoordinates.latitude, dropOffCoordinates.latitude);
    const minLon = Math.min(pickupCoordinates.longitude, dropOffCoordinates.longitude);
    const maxLon = Math.max(pickupCoordinates.longitude, dropOffCoordinates.longitude);
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

  // Fetch initial ride data if WebSocket is not connected and we have a rideId
  useEffect(() => {
    if (!isConnected && rideId && !rideInfoState) {
      // Fetch initial data once
      (async () => {
        try {
          const r = await rideRequestAPI.getRideRequest(rideId);
          if (r) {
            setCurrentRide(r);
            setRideInfoState(r);
            setDriverInfoState({
              id: r.driverId,
              name: r.driverName,
              phone: r.driverPhone,
              vehicleNumber: r.driverVehicleNumber,
              latitude: r.pickupLatitude,
              longitude: r.pickupLongitude,
              profile_image: r.driverProfileImage || null,
            });
            if (r.estimatedArrival) setEta(r.estimatedArrival);
          }
        } catch (err) {
          console.error('Failed to fetch initial ride data:', err);
        }
      })();
    }
  }, [isConnected, rideId, rideInfoState]);

  const handleMessageDriver = () => {
    showWarning('Message functionality coming soon');
  };

  const handleCallDriver = async () => {
    try {
      const phoneNumber = (driverInfoState?.phone_number || driverInfoState?.phone || driverInfoState?.driverPhone || '+1234567890');
      const url = `tel:${phoneNumber}`;
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        showWarning('Phone call not supported on this device');
      }
    } catch (err) {
      if (__DEV__) console.log('handleCallDriver error', err);
      showError('Unable to make a call');
    }
  };

  // Calculate drop off time
  const getDropOffTime = () => {
    const now = new Date();
    // Add estimated time (e.g., 15 minutes)
    const estimatedMinutes = 15;
    now.setMinutes(now.getMinutes() + estimatedMinutes);
    const hours = now.getHours();
    const minutes = now.getMinutes();
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  };

  // Safety check for data - provide fallback values if missing
  if (!driverInfoState) setDriverInfoState({
    first_name: 'Micheal Edem',
    name: 'Micheal Edem',
    phone_number: '+1234567890',
    profile_image: null,
    latitude: 4.8666,
    longitude: 6.9745,
  });

  if (!rideInfoState) setRideInfoState({
    pickup_latitude: 4.8666,
    pickup_longitude: 6.9745,
    drop_latitude: 4.8670,
    drop_longitude: 6.9750,
    amount: '25',
    distance: '5.2 km',
    payment_type: 'Cash',
  });

  const driverName = driverInfoState?.first_name || driverInfoState?.name || 'Micheal Edem';

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
            ...dropOffCoordinates,
            customMarker: (
              <Image 
                source={require('../../assets/images/pin.png')} 
                style={styles.destinationMarker} 
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
        originCoordinates={pickupCoordinates}
        destinationCoordinates={dropOffCoordinates}
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
          {/* Header Section */}
          <View style={styles.headerSection}>
            <Text style={styles.headerTitle}>
              Waiting for "{driverName}"{'\n'}to start the trip
            </Text>
          </View>

          {/* Loading Spinner */}
          <View style={styles.spinnerContainer}>
            <LottieView 
              source={require('../../assets/svgIcons/spinner.json')} 
              autoPlay 
              loop 
              style={styles.spinner} 
            />
          </View>

          {/* Divider */}
          <View style={styles.divider} />

          {/* Driver Info Section */}
          <View style={styles.driverInfoSection}>
            <View style={styles.driverDetails}>
              <Text style={styles.driverName}>
                {driverName}
              </Text>
              <Text style={styles.driverStatus}>Arrived</Text>
              <View style={styles.ratingContainer}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <Ionicons 
                    key={star}
                    name="star" 
                    size={18} 
                    color="#FFD700" 
                  />
                ))}
              </View>
              <Text style={styles.vehicleInfo}>
                Brand Of Car - MM1428
              </Text>
              <Text style={styles.dropOffTime}>
                Drop off by {getDropOffTime()}
              </Text>
            </View>
            
            <View style={styles.driverImageContainer}>
              <Image
                source={
                  driverInfoState?.profile_image 
                    ? { uri: driverInfoState.profile_image }
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

          {/* Action Buttons */}
          <View style={styles.actionButtonsSection}>
            <Pressable 
              style={styles.callButton}
              onPress={handleCallDriver}
            >
              <Ionicons 
                name="call" 
                size={24} 
                color="#FF3B30" 
              />
            </Pressable>

            <Pressable 
              style={styles.messageButton}
              onPress={handleMessageDriver}
            >
              <MaterialCommunityIcons 
                name="message-processing" 
                size={24} 
                color="#4CD964" 
              />
            </Pressable>
          </View>
        </View>
      </BottomSheet>
    </View>
  );
};

export default WaitingForDriverScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  map: {
    width: '100%',
  },
  destinationMarker: {
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
    paddingTop: 10,
    paddingBottom: 15,
    paddingHorizontal: 20,
  },
  headerTitle: {
    ...Fonts.Regular,
    fontSize: 22,
    fontWeight: '500',
    textAlign: 'center',
    color: Colors.whiteColor,
    lineHeight: 30,
  },

  // Spinner Section
  spinnerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 25,
  },
  spinner: {
    width: 80,
    height: 80,
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
    paddingHorizontal: 20,
    marginBottom: 25,
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
  driverStatus: {
    ...Fonts.Regular,
    fontSize: 15,
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    gap: 4,
    marginBottom: 10,
  },
  vehicleInfo: {
    ...Fonts.Regular,
    fontSize: 15,
    color: Colors.whiteColor,
    marginBottom: 6,
  },
  dropOffTime: {
    ...Fonts.Regular,
    fontSize: 15,
    color: Colors.whiteColor,
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

  // Action Buttons Section
  actionButtonsSection: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 15,
    justifyContent: 'center',
  },
  callButton: {
    width: 120,
    height: 55,
    backgroundColor: Colors.whiteColor,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  messageButton: {
    width: 120,
    height: 55,
    backgroundColor: Colors.whiteColor,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
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