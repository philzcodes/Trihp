import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import BottomSheet from '@gorhom/bottom-sheet';
import { useLocalSearchParams, useRouter } from 'expo-router';
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
import { MapComponent } from '../../components';
import TriphButton from '../../components/TriphButton';
import { Colors, Fonts } from '../../constants';
import { showError, showSucess, showWarning } from '../../helper/Toaster';
import useBookingStore from '../../store/bookingStore';

const DriverArrivedScreen = () => {
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

  console.log('DriverArrivedScreen - Received data:', data);

  const mapRef = useRef(null);
  const { height } = useWindowDimensions();
  const router = useRouter();
  const bottomSheetModalRef = useRef(null);
  const insets = useSafeAreaInsets();

  const snapPoints = useMemo(() => ['55%', '75%'], []);
  const [bottomSheetHeight, setBottomSheetHeight] = useState(0);

  const mapHeight = height - bottomSheetHeight;

  const handleBottomSheetChange = (index) => {
    const snapPointValue = parseFloat(snapPoints[index]);
    setBottomSheetHeight(height * (snapPointValue / 100));
  };

  // Extract driver and ride information
  const driverInfo = data?.driver || {};
  const rideInfo = data?.ride || data?.data || {};
  const verifyRide = useBookingStore(state => state.verifyRide);
  const setRideRequestId = useBookingStore(state => state.setRideRequestId);
  const setCurrentRide = useBookingStore(state => state.setCurrentRide);
  
  const rideId = rideInfo?.id;
  
  // Set ride ID in store when screen loads to ensure verifyRide works
  useEffect(() => {
    if (rideId) {
      setRideRequestId(rideId);
      setCurrentRide(rideInfo);
    }
  }, [rideId, rideInfo, setRideRequestId, setCurrentRide]);
  
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

  const handleMessageDriver = () => {
    showWarning('Message functionality coming soon');
  };

  const handleCallDriver = () => {
    const phoneNumber = driverInfo?.phone_number || driverInfo?.phone || '+1234567890';
    Linking.openURL(`tel:${phoneNumber}`);
  };

  const handleVerifyRide = () => {
    (async () => {
      try {
        // Pass rideId to verifyRide in case store doesn't have it
        await verifyRide(null, rideId);
        showSucess('Ride verified! Starting your trip...');
        // Navigate to trip in progress screen
        setTimeout(() => {
          router.push('/booking/TripInProgressScreen', { data: JSON.stringify(data) });
        }, 1500);
      } catch (err) {
        console.error('DriverArrivedScreen: verifyRide failed', err);
        showError(err?.message || 'Failed to verify ride');
      }
    })();
  };

  const handleCancel = () => {
    router.push('/booking/RideCancelScreen', { 
      data: rideInfo,
      rideId: rideInfo?.id 
    });
  };

  // Calculate drop off time
  const getDropOffTime = () => {
    const now = new Date();
    const estimatedMinutes = 15;
    now.setMinutes(now.getMinutes() + estimatedMinutes);
    const hours = now.getHours();
    const minutes = now.getMinutes();
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  };

  // Safety check for data
  if (!data) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingTitle}>Loading...</Text>
          <Text style={styles.loadingMessage}>
            Please wait while we prepare driver details.
          </Text>
        </View>
      </View>
    );
  }

  const driverName = driverInfo?.name || driverInfo?.first_name || 'Driver Name';

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
        onPress={() => router.back()}
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
          {/* Cancel Button */}
          <View style={styles.cancelButtonContainer}>
            <Pressable style={styles.cancelButton} onPress={handleCancel}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </Pressable>
          </View>

          {/* Header Section */}
          <View style={styles.headerSection}>
            <Text style={styles.headerTitle}>Your driver has arrived</Text>
            <Text style={styles.headerSubtitle}>
              Verify Your Driver's Identity and Vehicle Description
            </Text>
          </View>

          {/* Divider */}
          <View style={styles.divider} />

          {/* Driver Info Section */}
          <View style={styles.driverInfoSection}>
            <View style={styles.driverDetails}>
              <Text style={styles.driverName}>{driverName}</Text>
              <Text style={styles.driverStatus}>Arrived</Text>
              <View style={styles.ratingContainer}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <Ionicons 
                    key={star}
                    name="star" 
                    size={20} 
                    color="#FFD700" 
                  />
                ))}
              </View>
              <Text style={styles.vehicleInfo}>Brand Of Car - MM1428</Text>
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

          {/* Verify Button */}
          <View style={styles.verifyButtonContainer}>
            <TriphButton
              text="I Have verified My Ride"
              onPress={handleVerifyRide}
              extraStyle={styles.verifyButton}
              extraTextStyle={styles.verifyButtonText}
              bgColor={{ backgroundColor: '#FFD700' }}
            />
          </View>
        </View>
      </BottomSheet>
    </View>
  );
};

export default DriverArrivedScreen;

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

  // Cancel Button (Top Left)
  cancelButtonContainer: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 15,
    alignItems: 'flex-start',
  },
  cancelButton: {
    backgroundColor: Colors.whiteColor,
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 25,
  },
  cancelButtonText: {
    ...Fonts.Regular,
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
  },

  // Header Section
  headerSection: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  headerTitle: {
    ...Fonts.Regular,
    fontSize: 24,
    fontWeight: '600',
    textAlign: 'center',
    color: Colors.whiteColor,
    marginBottom: 8,
  },
  headerSubtitle: {
    ...Fonts.Regular,
    fontSize: 14,
    textAlign: 'center',
    color: 'rgba(255, 255, 255, 0.7)',
    lineHeight: 20,
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
    marginBottom: 20,
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
    marginBottom: 12,
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
    marginBottom: 25,
  },
  callButton: {
    width: 100,
    height: 50,
    backgroundColor: Colors.whiteColor,
    borderRadius: 25,
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
    width: 100,
    height: 50,
    backgroundColor: Colors.whiteColor,
    borderRadius: 25,
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

  // Verify Button
  verifyButtonContainer: {
    paddingHorizontal: 20,
  },
  verifyButton: {
    backgroundColor: '#FFD700',
    borderRadius: 30,
    paddingVertical: 16,
  },
  verifyButtonText: {
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