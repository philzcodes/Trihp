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
import { Colors, Fonts } from '../../constants';
import { showWarning } from '../../helper/Toaster';

const TripInProgressScreen = () => {
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

  console.log('TripInProgressScreen - Received data:', data);

  const mapRef = useRef(null);
  const { height } = useWindowDimensions();
  const router = useRouter();
  const bottomSheetModalRef = useRef(null);
  const insets = useSafeAreaInsets();

  // Timer for trip completion (e.g., 60 seconds)
  const [timeRemaining, setTimeRemaining] = useState(60);
  const timerIntervalRef = useRef(null);

  const snapPoints = useMemo(() => ['40%', '60%'], []);
  const [bottomSheetHeight, setBottomSheetHeight] = useState(0);

  const mapHeight = height - bottomSheetHeight;

  const handleBottomSheetChange = (index) => {
    const snapPointValue = parseFloat(snapPoints[index]);
    setBottomSheetHeight(height * (snapPointValue / 100));
  };

  // Extract driver and ride information
  const driverInfo = data?.driver || {};
  const rideInfo = data?.ride || data?.data || {};
  
  const pickupCoordinates = {
    latitude: parseFloat(rideInfo.pickup_latitude) || 4.8666,
    longitude: parseFloat(rideInfo.pickup_longitude) || 6.9745,
  };

  const dropOffCoordinates = {
    latitude: parseFloat(rideInfo.drop_latitude) || 4.8670,
    longitude: parseFloat(rideInfo.drop_longitude) || 6.9750,
  };

  // Driver is now moving towards destination (simulate position between pickup and dropoff)
  const [driverCoordinates, setDriverCoordinates] = useState({
    latitude: pickupCoordinates.latitude + (dropOffCoordinates.latitude - pickupCoordinates.latitude) * 0.3,
    longitude: pickupCoordinates.longitude + (dropOffCoordinates.longitude - pickupCoordinates.longitude) * 0.3,
  });

  // Calculate map region to show route to destination
  const calculateRegion = () => {
    const maxLat = Math.max(driverCoordinates.latitude, dropOffCoordinates.latitude);
    const minLat = Math.min(driverCoordinates.latitude, dropOffCoordinates.latitude);
    const minLon = Math.min(driverCoordinates.longitude, dropOffCoordinates.longitude);
    const maxLon = Math.max(driverCoordinates.longitude, dropOffCoordinates.longitude);
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

  // Timer effect - simulates trip progress and completion
  useEffect(() => {
    let progress = 0.3; // Start at 30% of the journey

    timerIntervalRef.current = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timerIntervalRef.current);
          // Navigate to trip completed screen
          router.push({
            pathname: '/booking/TripCompletedScreen',
            params: { data: JSON.stringify(data) }
          });
          return 0;
        }
        return prev - 1;
      });

      // Update driver position gradually towards destination
      progress += 0.01;
      if (progress <= 0.95) {
        setDriverCoordinates({
          latitude: pickupCoordinates.latitude + 
            (dropOffCoordinates.latitude - pickupCoordinates.latitude) * progress,
          longitude: pickupCoordinates.longitude + 
            (dropOffCoordinates.longitude - pickupCoordinates.longitude) * progress,
        });
      }
    }, 1000);

    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, [router, data, pickupCoordinates, dropOffCoordinates]);

  const handleMessageDriver = () => {
    showWarning('Message functionality coming soon');
  };

  const handleCallDriver = () => {
    const phoneNumber = driverInfo?.phone_number || driverInfo?.phone || '+1234567890';
    Linking.openURL(`tel:${phoneNumber}`);
  };

  const handleSupport = () => {
    showWarning('Support functionality coming soon');
  };

  const handleChangeDestination = () => {
    router.push('/booking/SearchScreen');
  };

  // Calculate drop off time
  const getDropOffTime = () => {
    const now = new Date();
    const estimatedMinutes = Math.ceil(timeRemaining / 60);
    now.setMinutes(now.getMinutes() + estimatedMinutes);
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const ampm = hours >= 12 ? 'pm' : 'am';
    const displayHours = hours % 12 || 12;
    return `${displayHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} ${ampm}`;
  };

  // Safety check for data
  if (!data) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingTitle}>Loading...</Text>
          <Text style={styles.loadingMessage}>
            Please wait while we prepare trip details.
          </Text>
        </View>
      </View>
    );
  }

  const driverName = driverInfo?.first_name || driverInfo?.name || 'Driver Name';

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
        originCoordinates={driverCoordinates}
        destinationCoordinates={dropOffCoordinates}
        directionsStrokeWidth={4}
        directionsStrokeColor="#000000"
      />

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
            <Text style={styles.headerTitle}>Driving to Your Destination</Text>
          </View>

          {/* Divider */}
          <View style={styles.divider} />

          {/* Driver Info Section */}
          <View style={styles.driverInfoSection}>
            <View style={styles.driverDetails}>
              <Text style={styles.driverName}>{driverName}</Text>
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

          {/* Divider */}
          <View style={styles.divider} />

          {/* Action Buttons Row */}
          <View style={styles.actionButtonsRow}>
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

            <Pressable 
              style={styles.supportButton}
              onPress={handleSupport}
            >
              <Ionicons 
                name="information-circle" 
                size={20} 
                color="rgba(255, 255, 255, 0.7)" 
                style={{ marginRight: 8 }}
              />
              <Text style={styles.supportButtonText}>Support</Text>
              <Ionicons 
                name="chevron-forward" 
                size={20} 
                color="rgba(255, 255, 255, 0.7)" 
                style={{ marginLeft: 4 }}
              />
            </Pressable>
          </View>

          {/* Drop Off Time */}
          <View style={styles.dropOffTimeSection}>
            <Text style={styles.dropOffTimeText}>
              Drop off by {getDropOffTime()}
            </Text>
          </View>

          {/* Drop Off Location */}
          <View style={styles.dropOffLocationSection}>
            <View style={styles.locationRow}>
              <Ionicons 
                name="location-sharp" 
                size={24} 
                color="#4CD964" 
              />
              <Text style={styles.locationText}>Drop off location</Text>
            </View>
            <Pressable onPress={handleChangeDestination}>
              <Text style={styles.changeText}>Change</Text>
            </Pressable>
          </View>
        </View>
      </BottomSheet>
    </View>
  );
};

export default TripInProgressScreen;

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
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 20,
  },
  headerTitle: {
    ...Fonts.Regular,
    fontSize: 24,
    fontWeight: '600',
    textAlign: 'center',
    color: Colors.whiteColor,
  },

  // Divider
  divider: {
    width: '100%',
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },

  // Driver Info Section
  driverInfoSection: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  driverDetails: {
    flex: 1,
  },
  driverName: {
    ...Fonts.Regular,
    fontSize: 20,
    fontWeight: '600',
    color: Colors.whiteColor,
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
  },
  driverImageContainer: {
    position: 'relative',
    width: 100,
    height: 80,
  },
  driverImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 2,
    borderColor: Colors.whiteColor,
  },
  vehicleImage: {
    position: 'absolute',
    bottom: -5,
    right: -5,
    width: 60,
    height: 40,
  },

  // Action Buttons Row
  actionButtonsRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 20,
    gap: 10,
    alignItems: 'center',
  },
  callButton: {
    width: 70,
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
    width: 70,
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
  supportButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(139, 69, 69, 0.8)',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
  },
  supportButtonText: {
    ...Fonts.Regular,
    fontSize: 16,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.9)',
  },

  // Drop Off Time Section
  dropOffTimeSection: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    alignItems: 'center',
  },
  dropOffTimeText: {
    ...Fonts.Regular,
    fontSize: 18,
    fontWeight: '500',
    color: Colors.whiteColor,
  },

  // Drop Off Location Section
  dropOffLocationSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  locationText: {
    ...Fonts.Regular,
    fontSize: 16,
    color: Colors.whiteColor,
  },
  changeText: {
    ...Fonts.Regular,
    fontSize: 16,
    fontWeight: '500',
    color: '#FFD700',
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