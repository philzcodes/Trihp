import axios from 'axios';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { getCurrentToken } from '../../api/client';
import rideRequestAPI from '../../api/rideRequestAPI';
import { MapComponent } from '../../components';
import TriphButton from '../../components/TriphButton';
import { haversineDistance } from '../../helper/distancesCalculate';
import Loader from '../../helper/Loader';
import { getRecentLocations, saveRideLocation } from '../../helper/locationHistory';
import { useAuthCheck } from '../../hooks';
import useBookingStore from '../../store/bookingStore';
import useUserStore from '../../store/userStore';
import { GOOGLE_MAPS_APIKEY } from '../../utils/Api';

const SearchScreen = ({ route }) => {
  const [stops, setStops] = useState([]);
  const [rides, setRides] = useState([]);
  const mapViewRef = useRef();
  const router = useRouter();
  const [originLocation, setOriginLocation] = useState('');
  const [originShowList, setOriginShowList] = useState(false);
  const [originPrediction, setOriginPredictions] = useState([]);
  const [originCoordinates, setOriginCoordinates] = useState();
  const [destinationLocation, setDestinationLocation] = useState('');
  const [dropShowList, setDropShowList] = useState(false);
  const [dropPrediction, setDropPredictions] = useState([]);
  const [destinationCoordinates, setDestinationCoordinates] = useState();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true); // Loading state for map and location
  const [focusedInput, setFocusedInput] = useState(null);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [isReturningFromRide, setIsReturningFromRide] = useState(false);
  const [isCreatingRide, setIsCreatingRide] = useState(false);

  // Zustand stores
  const { createRideRequest, setCurrentRide } = useBookingStore();
  const { userData, getUserName, getUserPhone, fetchUser } = useUserStore();
  
  // Auth check hook (doesn't auto-redirect, allows conditional rendering)
  const { isAuthenticated: userIsAuthenticated, redirectToLogin } = useAuthCheck();

  const [recentLocations, setRecentLocations] = useState([]);

  useEffect(() => {
    getLocation();
    fetchUser(); // Fetch user data from AsyncStorage
    loadRecentLocations(); // Load recent locations from history
    
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardVisible(true);
    });
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardVisible(false);
    });

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  // Load recent locations from history
  const loadRecentLocations = async () => {
    try {
      const locations = await getRecentLocations(2);
      setRecentLocations(locations);
    } catch (error) {
      console.error('Error loading recent locations:', error);
      setRecentLocations([]);
    }
  };

  // Removed auto-navigation - now using Continue button for user control

  // Get selected vehicle type from route params (set when coming from Services page)
  const selectedVehicleType = route?.params?.selectedVehicleType || null;

  useEffect(() => {
    if (route?.params?.stops && Array.isArray(route.params.stops)) {
      setStops(route.params.stops);
    }
    if (route?.params?.rides) {
      setRides(route.params.rides);
    }
  }, [route?.params?.stops]);

  const getLocation = async () => {
    try {
      setInitialLoading(true);
      let { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        console.warn('Permission to access location was denied');
        setOriginLocation("Location permission denied");
        setInitialLoading(false); // Stop loading even on error
        return;
      }

      let location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
        timeout: 10000,
        maximumAge: 60000
      });

      const coordinates = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.006996872576237934,
        longitudeDelta: 0.004216404151804909,
      };

      setOriginCoordinates(coordinates);

      try {
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Reverse geocoding timeout')), 5000)
        );
        
        const geocodePromise = Location.reverseGeocodeAsync(coordinates);
        const address = await Promise.race([geocodePromise, timeoutPromise]);
        
        if (address && address.length > 0) {
          const formattedAddress = [
            address[0].name,
            address[0].street,
            address[0].city,
            address[0].region,
            address[0].country
          ].filter(Boolean).join(', ');
          setOriginLocation(formattedAddress);
        } else {
          setOriginLocation("Current Location");
        }
      } catch (geocodeError) {
        console.warn('Reverse geocoding failed:', geocodeError);
        setOriginLocation("Current Location");
      }
      
      // Location and coordinates are ready, wait a bit for map to render
      // Use a slightly longer delay to ensure map component is fully loaded
      setTimeout(() => {
        setInitialLoading(false);
      }, 800); // Delay to ensure map is rendered and interactive
    } catch (error) {
      console.warn('Location error:', error);
      setOriginLocation("Location unavailable");
      setInitialLoading(false); // Stop loading on error
    }
  };

  const handleOriginSearch = async (text) => {
    if (!text) {
      setOriginPredictions([]);
      setOriginShowList(false);
      return;
    }
    
    try {
      const apiUrl = `https://maps.googleapis.com/maps/api/place/autocomplete/json?key=${GOOGLE_MAPS_APIKEY}&input=${text}`;
      const result = await axios.get(apiUrl);
      
      if (result.data?.predictions) {
        setOriginPredictions(result.data.predictions);
        setOriginShowList(true);
      } else {
        setOriginPredictions([]);
        setOriginShowList(false);
      }
    } catch (e) {
      console.error('Search error:', e);
      setOriginPredictions([]);
      setOriginShowList(false);
    }
  };

  const handleDestinationSearch = async (text) => {
    if (!text) {
      setDropPredictions([]);
      setDropShowList(false);
      return;
    }
    
    try {
      const apiUrl = `https://maps.googleapis.com/maps/api/place/autocomplete/json?key=${GOOGLE_MAPS_APIKEY}&input=${text}`;
      const result = await axios.get(apiUrl);
      
      if (result.data?.predictions) {
        setDropPredictions(result.data.predictions);
        setDropShowList(true);
      } else {
        setDropPredictions([]);
        setDropShowList(false);
      }
    } catch (e) {
      console.error('Search error:', e);
      setDropPredictions([]);
      setDropShowList(false);
    }
  };

  const checkLocation = async (address, isOrigin = true) => {
    try {
      if (address) {
        const response = await axios.get(
          `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${GOOGLE_MAPS_APIKEY}`
        );
        
        if (response.data.results && response.data.results.length > 0) {
          const coordinates = response.data.results[0].geometry.location;
          const newCoordinates = {
            latitude: coordinates.lat,
            longitude: coordinates.lng,
            latitudeDelta: 0.006996872576237934,
            longitudeDelta: 0.004216404151804909,
          };

          if (isOrigin) {
            setOriginCoordinates(newCoordinates);
          } else {
            setDestinationCoordinates(newCoordinates);
          }
        }
      }
    } catch (error) {
      console.error('Error in checkLocation:', error);
    }
  };

  const handleRegionChange = async (region) => {
    if (!originShowList && !dropShowList) {
      setOriginCoordinates(region);

      try {
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Reverse geocoding timeout')), 5000)
        );
        
        const geocodePromise = Location.reverseGeocodeAsync(region);
        const address = await Promise.race([geocodePromise, timeoutPromise]);
        
        if (address && address.length > 0) {
          const formattedAddress = [
            address[0].name,
            address[0].street,
            address[0].city,
            address[0].region,
            address[0].country
          ].filter(Boolean).join(', ');
          setOriginLocation(formattedAddress || 'Unknown Address');
        }
      } catch (error) {
        console.warn('Error fetching address for origin:', error.message);
        // Don't update the location if geocoding fails - keep current location text
      }
    }
  };

  const handleRecentLocationPress = (item) => {
    // Set the recent location as destination (where to field)
    setDestinationLocation(item.address || item.name);
    checkLocation(item.address || item.name, false);
    
    // Keep current location as origin if available, otherwise use item coordinates for origin too
    if (item.latitude && item.longitude) {
      const coords = {
        latitude: item.latitude,
        longitude: item.longitude,
        latitudeDelta: 0.006996872576237934,
        longitudeDelta: 0.004216404151804909,
      };
      setDestinationCoordinates(coords);
    }
  };

  const handleCreateRideRequest = async () => {
    // Prevent multiple simultaneous calls
    if (isCreatingRide || loading) {
      console.log('Ride creation already in progress');
      return;
    }

    // Validate inputs
    if (!originLocation || !destinationLocation) {
      Alert.alert('Missing Information', 'Please select both pickup and destination locations');
      return;
    }

    if (!originCoordinates || !destinationCoordinates) {
      Alert.alert('Location Error', 'Please wait for location coordinates to be loaded');
      return;
    }

    // Check authentication
    if (!userIsAuthenticated) {
      redirectToLogin('Please log in to create a ride request');
      return;
    }

    // Get current token
    const currentToken = await getCurrentToken();
    if (!currentToken) {
      redirectToLogin('Please log in again to create a ride request');
      return;
    }

    setIsCreatingRide(true);

    try {
      setLoading(true);

      // Calculate distance and estimated duration
      const distance = haversineDistance(
        { latitude: originCoordinates.latitude, longitude: originCoordinates.longitude },
        { latitude: destinationCoordinates.latitude, longitude: destinationCoordinates.longitude }
      );

      console.log('Distance calculation:', {
        origin: { lat: originCoordinates.latitude, lng: originCoordinates.longitude },
        destination: { lat: destinationCoordinates.latitude, lng: destinationCoordinates.longitude },
        calculatedDistance: distance,
        distanceInKM: distance,
      });

      // Validate distance calculation
      if (isNaN(distance) || distance <= 0) {
        console.error('Invalid distance calculation:', distance);
        Alert.alert('Error', 'Unable to calculate distance. Please try selecting different locations.');
        setLoading(false);
        return;
      }

      // Mock pricing calculation (you can replace this with actual pricing logic)
      const baseFare = 50; // Base fare
      const perKMCharge = 25; // Per kilometer charge
      const perMinuteCharge = 2; // Per minute charge
      const estimatedDuration = Math.max(5, distance * 2); // Rough estimate: 2 minutes per km
      const totalFare = baseFare + (distance * perKMCharge) + (estimatedDuration * perMinuteCharge);

      console.log('Pricing calculation:', {
        baseFare,
        perKMCharge,
        perMinuteCharge,
        distance,
        estimatedDuration,
        distanceCharge: distance * perKMCharge,
        timeCharge: estimatedDuration * perMinuteCharge,
        totalFare,
      });

      // Get current user data (might have been updated)
      const currentUserData = useUserStore.getState().userData || userData;
      if (!currentUserData || !currentUserData.id) {
        redirectToLogin('Please log in to create a ride request');
        return;
      }

      // Create ride request data
      const rideRequestData = {
        riderId: currentUserData.id,
        riderName: getUserName(),
        riderPhone: getUserPhone(),
        pickupLatitude: originCoordinates.latitude,
        pickupLongitude: originCoordinates.longitude,
        pickupAddress: originLocation,
        dropOffLatitude: destinationCoordinates.latitude,
        dropOffLongitude: destinationCoordinates.longitude,
        dropOffAddress: destinationLocation,
        vehicleType: selectedVehicleType || 'CAR', // Use selected vehicle type from Services page, or default to CAR
        estimatedDistance: distance,
        estimatedDuration: estimatedDuration,
        baseFare: baseFare,
        perKMCharge: perKMCharge,
        perMinuteCharge: perMinuteCharge,
        totalFare: Math.round(totalFare),
        specialInstructions: '',
        isScheduled: false,
      };

      // Create the ride request directly using the API
      
      if (!rideRequestAPI || !rideRequestAPI.createRideRequest) {
        throw new Error('Ride request API is not available');
      }
      
      const response = await rideRequestAPI.createRideRequest(rideRequestData);
      
      console.log('Ride request created successfully:', response);

      // Extract response data - handle both response.data and direct response
      const rideData = response?.data?.data || response?.data || response;
      
      // Extract ride ID - handle various response structures
      const rideId = rideData?.id || rideData?.data?.id || response?.id || response?.data?.id;
      
      if (!rideId) {
        console.error('Ride creation failed - no ride ID in response:', response);
        throw new Error('Ride request creation failed - no response ID received');
      }

      // Create a proper ride object for the store
      const rideObject = {
        id: rideId,
        ...rideData,
        pickupAddress: rideData?.pickupAddress || originLocation,
        dropOffAddress: rideData?.dropOffAddress || destinationLocation,
        estimatedDistance: rideData?.estimatedDistance || distance,
        estimatedDuration: rideData?.estimatedDuration || estimatedDuration,
        totalFare: rideData?.totalFare || Math.round(totalFare),
        vehicleType: rideData?.vehicleType || selectedVehicleType || 'CAR',
      };

      // Set the current ride in the store BEFORE navigation
      console.log('Setting current ride in store:', rideObject);
      setCurrentRide(rideObject);

      // Save destination location to history
      if (rideData?.dropOffAddress || destinationLocation) {
        await saveRideLocation({
          id: rideId,
          dropOffAddress: rideData?.dropOffAddress || destinationLocation,
          dropOffLatitude: rideData?.dropOffLatitude || destinationCoordinates.latitude,
          dropOffLongitude: rideData?.dropOffLongitude || destinationCoordinates.longitude,
        });
        // Refresh recent locations
        loadRecentLocations();
      }

      console.log('Navigating to RideSelection with params:', {
        rideId: rideId,
        pickupAddress: originLocation,
        destinationAddress: destinationLocation,
        estimatedDistance: distance.toString(),
        estimatedDuration: estimatedDuration.toString(),
        totalFare: Math.round(totalFare).toString(),
      });

      // Navigate to RideSelection with ride data
      router.push({
        pathname: '/booking/RideSelection',
        params: {
          rideId: rideId,
          pickupAddress: originLocation,
          destinationAddress: destinationLocation,
          estimatedDistance: distance.toString(),
          estimatedDuration: estimatedDuration.toString(),
          totalFare: Math.round(totalFare).toString(),
          selectedVehicleType: selectedVehicleType || rideData?.vehicleType || 'CAR', // Pass selected vehicle type from Services page
        }
      });

    } catch (error) {
      console.error('Error creating ride request:', error);
      
      // Reset the creating ride state
      setIsCreatingRide(false);
      
      // Check if it's an authentication error
      if (error?.statusCode === 401 || error?.message?.includes('Unauthorized') || error?.message?.includes('Invalid or Expired Token')) {
        Alert.alert(
          'Authentication Required', 
          'Your session has expired. Please log in again to create a ride request.',
          [
            { text: 'OK', onPress: () => {
              // Navigate to login screen or clear user data
              console.log('User needs to re-authenticate');
            }}
          ]
        );
      } else if (error?.message?.includes('Ride request API is not available')) {
        Alert.alert(
          'Service Error', 
          'The ride request service is temporarily unavailable. Please try again later.',
          [{ text: 'OK' }]
        );
      } else if (error?.message?.includes('no response ID received')) {
        Alert.alert(
          'Request Failed', 
          'Failed to create ride request. Please check your connection and try again.',
          [{ text: 'OK' }]
        );
      } else {
        Alert.alert(
          'Error', 
          'Failed to create ride request. Please try again.',
          [{ text: 'OK' }]
        );
      }
    } finally {
      setLoading(false);
      setIsCreatingRide(false);
    }
  };

  const showRecentLocations = !originShowList && !dropShowList && !keyboardVisible;
  const canCreateRide = originLocation && destinationLocation && originCoordinates && destinationCoordinates;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        <StatusBar barStyle="light-content" backgroundColor="#000000" />
        <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <Icon name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerText}>Plan Your Ride</Text>
          <View style={styles.placeholderButton} />
        </View>

        {/* Initial Loading Overlay */}
        {initialLoading && (
          <View style={styles.initialLoadingContainer}>
            <ActivityIndicator size="large" color="#FFD700" />
            <Text style={styles.loadingText}>Getting your location...</Text>
            <Text style={styles.loadingSubText}>Preparing map</Text>
          </View>
        )}

        {/* Content Container */}
        {!initialLoading && (
        <View style={styles.contentContainer}>
          {/* Input Section */}
          <View style={styles.inputSection}>
            {/* Origin Input */}
            <View style={styles.inputWrapper}>
                <TextInput
                  value={originLocation}
                  placeholder="Current Location"
                  onChangeText={(text) => {
                    setOriginLocation(text);
                    handleOriginSearch(text);
                }}
                onFocus={() => {
                    setFocusedInput('origin');
                  setOriginShowList(true);
                }}
                onBlur={() => {
                  setTimeout(() => {
                    if (originPrediction.length === 0) {
                      setOriginShowList(false);
                    }
                  }, 200);
                }}
                selectionColor="#FFFFFF"
                placeholderTextColor="#6B6B6B"
                style={styles.textInput}
              />
              </View>

            {/* Destination Input */}
            <View style={styles.inputWrapper}>
                <TextInput
                  value={destinationLocation}
                  placeholder="Where to?"
                  onChangeText={(text) => {
                    setDestinationLocation(text);
                    handleDestinationSearch(text);
                  }}
                  onFocus={() => {
                  setFocusedInput('destination');
                    setDropShowList(true);
                  }}
                  onBlur={() => {
                  setTimeout(() => {
                    if (dropPrediction.length === 0) {
                      setDropShowList(false);
                    }
                  }, 200);
                  }}
                selectionColor="#FFFFFF"
                placeholderTextColor="#6B6B6B"
                  style={styles.textInput}
                />
          </View>

          {/* Predictions Lists */}
          {focusedInput === 'origin' && originPrediction.length > 0 && originShowList && (
              <View style={styles.predictionsContainer}>
              <FlatList
                data={originPrediction}
                keyboardShouldPersistTaps="always"
                  keyExtractor={(item, index) => item?.place_id || index.toString()}
                renderItem={({ item }) => (
                  <Pressable
                    style={styles.predictionItem}
                    onPress={() => {
                        setOriginLocation(item?.structured_formatting?.main_text || item?.description);
                      setOriginShowList(false);
                      checkLocation(item?.description, true);
                        Keyboard.dismiss();
                    }}
                  >
                      <View style={styles.predictionIconContainer}>
                        <Icon name="location-sharp" size={18} color="#FFFFFF" />
                      </View>
                    <View style={styles.predictionTextContainer}>
                        <Text style={styles.predictionMainText}>
                          {item?.structured_formatting?.main_text || 'No address found'}
                        </Text>
                      {item?.structured_formatting?.secondary_text && (
                        <Text style={styles.predictionSecondaryText} numberOfLines={1}>
                          {item?.structured_formatting?.secondary_text}
                        </Text>
                      )}
                    </View>
                  </Pressable>
                )}
              />
            </View>
          )}

          {focusedInput === 'destination' && dropPrediction.length > 0 && dropShowList && (
              <View style={styles.predictionsContainer}>
              <FlatList
                data={dropPrediction}
                keyboardShouldPersistTaps="always"
                  keyExtractor={(item, index) => item?.place_id || index.toString()}
                renderItem={({ item }) => (
                  <Pressable
                    style={styles.predictionItem}
                    onPress={() => {
                        setDestinationLocation(item?.structured_formatting?.main_text || item?.description);
                      setDropShowList(false);
                      checkLocation(item?.description, false);
                        Keyboard.dismiss();
                    }}
                  >
                      <View style={styles.predictionIconContainer}>
                        <Icon name="location-sharp" size={18} color="#FFFFFF" />
                      </View>
                    <View style={styles.predictionTextContainer}>
                        <Text style={styles.predictionMainText}>
                          {item?.structured_formatting?.main_text || 'No address found'}
                        </Text>
                      {item?.structured_formatting?.secondary_text && (
                        <Text style={styles.predictionSecondaryText} numberOfLines={1}>
                          {item?.structured_formatting?.secondary_text}
                        </Text>
                      )}
                    </View>
                  </Pressable>
                )}
              />
            </View>
          )}

          {/* Recent Locations */}
          {showRecentLocations && recentLocations.length > 0 && (
            <View style={styles.recentLocationsContainer}>
                {recentLocations.map((item, index) => (
                  <View key={item.id || index}>
                    <TouchableOpacity 
                      style={styles.recentLocationItem} 
                      onPress={() => handleRecentLocationPress(item)}
                      activeOpacity={0.7}
                    >
                  <View style={styles.clockIconContainer}>
                        <MaterialCommunityIcons name="clock-outline" size={22} color="#FFFFFF" />
                  </View>
                      <View style={styles.locationDetailsContainer}>
                        <Text style={styles.locationName}>{item.name || item.address?.split(',')[0] || 'Location'}</Text>
                        <Text style={styles.locationAddress} numberOfLines={1}>
                          {item.address || item.name}
                        </Text>
                  </View>
                </TouchableOpacity>
                    {index < recentLocations.length - 1 && <View style={styles.divider} />}
                  </View>
              ))}
            </View>
          )}
        </View>

          {/* Map Section */}
        {originCoordinates && (
            <View style={styles.mapSection}>
              <View style={styles.mapContainer}>
            <MapComponent
              ref={mapViewRef}
              style={styles.map}
              region={originCoordinates}
              showsUserLocation={true}
              followsUserLocation={true}
              showsMyLocationButton={false}
              zoomControlEnabled={true}
              onRegionChangeComplete={handleRegionChange}
              onMapReady={() => {
                // Map component is ready - hide loading
                if (initialLoading) {
                  setTimeout(() => {
                    setInitialLoading(false);
                  }, 300);
                }
              }}
            />
                {/* Center Pin */}
                <View style={styles.centerPinContainer}>
                  <View style={styles.pinCircle} />
                  <View style={styles.pinStick} />
                </View>
            </View>
          </View>
        )}
        </View>
        )}

        {/* Continue Button - Fixed at bottom */}
        {!initialLoading && (
          <View style={styles.continueButtonContainer}>
            <TriphButton
              text={isCreatingRide ? 'Creating Ride...' : 'Continue'}
              onPress={handleCreateRideRequest}
              disabled={!canCreateRide || isCreatingRide || loading}
              loading={isCreatingRide || loading}
              bgColor={{
                backgroundColor: canCreateRide && !isCreatingRide && !loading 
                  ? '#FFD700' 
                  : 'rgba(255, 215, 0, 0.5)'
              }}
              textColor={canCreateRide && !isCreatingRide && !loading ? '#000000' : '#666666'}
            />
          </View>
        )}

        <Loader modalVisible={loading} setModalVisible={setLoading} />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#000000',
  },
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 10 : 10,
    paddingBottom: 16,
    backgroundColor: '#000000',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  headerText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
    letterSpacing: 0.2,
  },
  placeholderButton: {
    width: 40,
  },
  contentContainer: {
    flex: 1,
    paddingBottom: Platform.OS === 'ios' ? 100 : 90, // Add padding for Continue button
  },
  inputSection: {
    paddingHorizontal: 16,
    paddingTop: 8,
    zIndex: 10,
  },
  inputWrapper: {
    backgroundColor: '#2C2C2E',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginBottom: 12,
  },
  textInput: {
    fontSize: 17,
    color: '#FFFFFF',
    fontWeight: '400',
    padding: 0,
    margin: 0,
  },
  predictionsContainer: {
    backgroundColor: '#1C1C1E',
    borderRadius: 12,
    marginTop: 8,
    maxHeight: 250,
    overflow: 'hidden',
  },
  predictionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: '#2C2C2E',
  },
  predictionIconContainer: {
    marginRight: 12,
  },
  predictionTextContainer: {
    flex: 1,
  },
  predictionMainText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  predictionSecondaryText: {
    fontSize: 14,
    fontWeight: '400',
    color: '#8E8E93',
  },
  recentLocationsContainer: {
    marginTop: 24,
  },
  recentLocationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
  },
  clockIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#2C2C2E',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  locationDetailsContainer: {
    flex: 1,
  },
  locationName: {
    fontSize: 17,
    fontWeight: '500',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  locationAddress: {
    fontSize: 15,
    fontWeight: '400',
    color: '#8E8E93',
  },
  divider: {
    height: 0.5,
    backgroundColor: '#2C2C2E',
    marginLeft: 62,
  },
  mapSection: {
    flex: 1,
    marginTop: 16,
  },
  mapContainer: {
    flex: 1,
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  centerPinContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -12 }, { translateY: -36 }],
    alignItems: 'center',
  },
  pinCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FF3B30',
    borderWidth: 3,
    borderColor: '#FFFFFF',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  pinStick: {
    width: 2,
    height: 12,
    backgroundColor: '#FF3B30',
    marginTop: -1,
  },
  initialLoadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000000',
    paddingHorizontal: 20,
  },
  loadingText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginTop: 20,
    textAlign: 'center',
  },
  loadingSubText: {
    fontSize: 14,
    fontWeight: '400',
    color: '#8E8E93',
    marginTop: 8,
    textAlign: 'center',
  },
  continueButtonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingVertical: 16,
    paddingBottom: Platform.OS === 'ios' ? 34 : 16,
    backgroundColor: '#000000',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 10,
  },
});

export default SearchScreen;
