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
  const pollingIntervalRef = useRef(null);
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

  // Initialize local state from incoming params (or null); we'll poll to keep these up-to-date
  const initialDriver = data?.driver || null;
  const initialRide = data?.ride || data?.data || data || null;
  if (driverInfoState === null) setDriverInfoState(initialDriver || {});
  if (rideInfoState === null) setRideInfoState(initialRide || {});
  
  const pickupCoordinates = {
    latitude: parseFloat(rideInfo.pickup_latitude) || 4.8666,
    longitude: parseFloat(rideInfo.pickup_longitude) || 6.9745,
  };

  const dropOffCoordinates = {
    latitude: parseFloat(rideInfo.drop_latitude) || 4.8670,
    longitude: parseFloat(rideInfo.drop_longitude) || 6.9750,
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

  // Polling effect - fetch ride updates (ETA, driver location, status)
  useEffect(() => {
    const rideId = rideInfoState?.id || rideInfoState?.rideId || rideInfoState?.id || data?.id || data?.ride?.id || data?.rideId;

    const stopPolling = () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
        pollingIntervalRef.current = null;
      }
    };

    const startPolling = () => {
      // initial fetch
      (async () => {
        try {
          if (!rideId) return;
          const r = await rideRequestAPI.getRideRequest(rideId);
          if (r) {
            setCurrentRide(r);
            setDriverInfoState({
              id: r.driverId,
              name: r.driverName,
              phone: r.driverPhone,
              vehicleNumber: r.driverVehicleNumber,
              latitude: r.pickupLatitude,
              longitude: r.pickupLongitude,
              profile_image: r.driverProfileImage || null,
            });
            setRideInfoState(r);
            if (r.estimatedArrival) setEta(r.estimatedArrival);

            // react to status changes
            if (r.status === 'DRIVER_ARRIVED' || r.status === 'DRIVER_ARRIVED') {
              stopPolling();
              router.push({ pathname: '/booking/DriverArrivedScreen', params: { data: JSON.stringify({ driver: r, ride: r }) } });
              return;
            }

            if (r.status === 'CANCELLED') {
              stopPolling();
              router.push({ pathname: '/booking/RideCancelScreen', params: { rideId: rideId, reason: 'Ride cancelled' } });
              return;
            }

            if (r.status === 'TRIP_STARTED') {
              stopPolling();
              router.push({ pathname: '/booking/TripInProgressScreen', params: { data: JSON.stringify({ driver: r, ride: r }) } });
              return;
            }
          }
        } catch (err) {
          if (__DEV__) console.log('WaitingForDriverScreen: initial poll error', err);
        }
      })();

      // periodic poll
      pollingIntervalRef.current = setInterval(async () => {
        try {
          if (!rideId) return;
          const r = await rideRequestAPI.getRideRequest(rideId);
          if (r) {
            setCurrentRide(r);
            setDriverInfoState({
              id: r.driverId,
              name: r.driverName,
              phone: r.driverPhone,
              vehicleNumber: r.driverVehicleNumber,
              latitude: r.pickupLatitude,
              longitude: r.pickupLongitude,
              profile_image: r.driverProfileImage || null,
            });
            setRideInfoState(r);
            if (r.estimatedArrival) setEta(r.estimatedArrival);

            // status-driven navigation
            if (r.status === 'DRIVER_ARRIVED') {
              stopPolling();
              router.push({ pathname: '/booking/DriverArrivedScreen', params: { data: JSON.stringify({ driver: r, ride: r }) } });
            } else if (r.status === 'CANCELLED') {
              stopPolling();
              router.push({ pathname: '/booking/RideCancelScreen', params: { rideId: rideId, reason: 'Ride cancelled' } });
            } else if (r.status === 'TRIP_STARTED') {
              stopPolling();
              router.push({ pathname: '/booking/TripInProgressScreen', params: { data: JSON.stringify({ driver: r, ride: r }) } });
            }
          }
        } catch (err) {
          if (__DEV__) console.log('WaitingForDriverScreen: poll error', err);
        }
      }, 5000);
    };

    startPolling();

    return () => {
      stopPolling();
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, [data, router, rideInfoState]);

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