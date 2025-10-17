import { Ionicons } from '@expo/vector-icons';
import BottomSheet from '@gorhom/bottom-sheet';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useMemo, useRef, useState } from 'react';
import {
  Image,
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
import { showSucess } from '../../helper/Toaster';

const TripCompletedScreen = () => {
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

  console.log('TripCompletedScreen - Received data:', data);

  const mapRef = useRef(null);
  const { height } = useWindowDimensions();
  const router = useRouter();
  const bottomSheetModalRef = useRef(null);
  const insets = useSafeAreaInsets();

  const [rating, setRating] = useState(0);
  const [hoveredStar, setHoveredStar] = useState(0);

  const snapPoints = useMemo(() => ['35%', '50%'], []);
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

  // Driver is now at destination
  const driverCoordinates = {
    latitude: dropOffCoordinates.latitude,
    longitude: dropOffCoordinates.longitude,
  };

  // Calculate map region to show completed route
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

  const handleRating = (star) => {
    setRating(star);
  };

  const handleSubmitRating = () => {
    if (rating === 0) {
      // If no rating, just go back to dashboard
      router.push('/(tabs)/Dashboard');
      return;
    }

    // Submit rating (in a real app, this would be an API call)
    console.log('Submitting rating:', rating);
    showSucess(`Thank you for rating ${rating} stars!`);
    
    // Navigate to dashboard after rating
    setTimeout(() => {
      router.push('/(tabs)/Dashboard');
    }, 1500);
  };

  // Safety check for data
  if (!data) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingTitle}>Loading...</Text>
          <Text style={styles.loadingMessage}>
            Please wait while we prepare trip summary.
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
            ...pickupCoordinates,
            customMarker: (
              <Image 
                source={require('../../assets/images/originLocation.png')} 
                style={styles.pickupMarker} 
                resizeMode="contain" 
              />
            )
          },
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
        directionsStrokeWidth={3}
        directionsStrokeColor="#CCCCCC"
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
            <Text style={styles.headerTitle}>Destination Reached</Text>
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

          {/* Rate Your Ride Section */}
          <View style={styles.ratingSection}>
            <Text style={styles.ratingTitle}>Rate your ride</Text>
            <View style={styles.starsContainer}>
              {[1, 2, 3, 4, 5].map((star) => (
                <Pressable
                  key={star}
                  onPress={() => handleRating(star)}
                  onPressIn={() => setHoveredStar(star)}
                  onPressOut={() => setHoveredStar(0)}
                  style={styles.starButton}
                >
                  <Ionicons 
                    name={
                      star <= (hoveredStar || rating) 
                        ? "star" 
                        : "star-outline"
                    }
                    size={40} 
                    color={
                      star <= (hoveredStar || rating) 
                        ? "#FFD700" 
                        : "rgba(255, 255, 255, 0.3)"
                    }
                  />
                </Pressable>
              ))}
            </View>
          </View>

          {/* Submit Button */}
          <View style={styles.buttonContainer}>
            <TriphButton
              text={rating > 0 ? "Submit Rating" : "Skip"}
              onPress={handleSubmitRating}
              extraStyle={styles.submitButton}
              extraTextStyle={styles.submitButtonText}
              bgColor={{ backgroundColor: rating > 0 ? '#FFD700' : 'rgba(255, 255, 255, 0.2)' }}
            />
          </View>
        </View>
      </BottomSheet>
    </View>
  );
};

export default TripCompletedScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  map: {
    width: '100%',
  },
  pickupMarker: {
    width: 30,
    height: 40,
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

  // Rating Section
  ratingSection: {
    paddingHorizontal: 20,
    paddingVertical: 25,
    alignItems: 'center',
  },
  ratingTitle: {
    ...Fonts.Regular,
    fontSize: 18,
    fontWeight: '500',
    color: Colors.whiteColor,
    marginBottom: 20,
  },
  starsContainer: {
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'center',
  },
  starButton: {
    padding: 5,
  },

  // Button Container
  buttonContainer: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  submitButton: {
    borderRadius: 30,
    paddingVertical: 16,
  },
  submitButtonText: {
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