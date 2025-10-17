import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import LottieView from 'lottie-react-native';
import React, { useEffect, useRef, useState } from 'react';
import {
  Image,
  Linking,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MapComponent } from '../../components';
import { Colors, Fonts } from '../../constants';
import { showWarning } from '../../helper/Toaster';

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
  const insets = useSafeAreaInsets();

  // Timer state for auto-navigation (e.g., 30 seconds before starting trip)
  const [timeRemaining, setTimeRemaining] = useState(30);
  const timerIntervalRef = useRef(null);

  // Panel expandable state
  const [isPanelExpanded, setIsPanelExpanded] = useState(false);

  console.log('WaitingForDriverScreen - Screen height:', height);

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

  // Timer effect - counts down and navigates to trip started screen
  useEffect(() => {
    timerIntervalRef.current = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timerIntervalRef.current);
          // Navigate to trip started/in progress screen
          router.push('/booking/TripInProgressScreen', { data: data });
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
  }, [router, data]);

  const handleMessageDriver = () => {
    showWarning('Message functionality coming soon');
  };

  const handleCallDriver = () => {
    const phoneNumber = driverInfo?.phone_number || driverInfo?.phone || '+1234567890';
    Linking.openURL(`tel:${phoneNumber}`);
  };

  const togglePanelExpansion = () => {
    setIsPanelExpanded(!isPanelExpanded);
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

  const driverName = driverInfo?.first_name || driverInfo?.name || 'Micheal Edem';

  return (
    <View style={styles.container}>
      {/* Map Component */}
      <MapComponent
        ref={mapRef}
        style={styles.map}
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

      {/* Driver Info Panel */}
      <View style={[styles.driverPanel, { height: isPanelExpanded ? '80%' : '60%' }]}>
        {/* Panel Header with Expand/Collapse Button */}
        <Pressable style={styles.panelHeader} onPress={togglePanelExpansion}>
          <View style={styles.panelHandle} />
        </Pressable>

        <ScrollView 
          style={styles.driverPanelContent}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
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
        </ScrollView>
      </View>
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
    flex: 1,
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

  // Driver Panel Styles
  driverPanel: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#000000',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingBottom: Platform.OS === 'ios' ? 20 : 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  panelHeader: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  panelHandle: {
    width: 50,
    height: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    borderRadius: 3,
    alignSelf: 'center',
  },
  driverPanelContent: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },

  // Header Section
  headerSection: {
    paddingTop: 10,
    paddingBottom: 15,
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