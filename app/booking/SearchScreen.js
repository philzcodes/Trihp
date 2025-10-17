import axios from 'axios';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
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
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { MapComponent } from '../../components';
import { haversineDistance } from '../../helper/distancesCalculate';
import Loader from '../../helper/Loader';
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
  const [focusedInput, setFocusedInput] = useState(null);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [isReturningFromRide, setIsReturningFromRide] = useState(false);

  // Mock recent locations - matching the image
  const recentLocations = [
    {
      id: '1',
      name: 'Main Peninsular Rd',
      address: 'Hamilton Freetown, Sierra Leone.',
    },
    {
      id: '2',
      name: 'Main Peninsular Rd',
      address: 'Hamilton Freetown, Sierra Leone.',
    },
  ];

  useEffect(() => {
    getLocation();
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

  useEffect(() => {
    if (originCoordinates && destinationCoordinates && originLocation && destinationLocation && !isReturningFromRide) {
      if (originCoordinates.latitude && originCoordinates.longitude && 
          destinationCoordinates.latitude && destinationCoordinates.longitude) {
        const distance = haversineDistance(originCoordinates, destinationCoordinates);
        const details = {
          originLocation,
          destinationLocation,
          originCoordinates,
          destinationCoordinates,
          distance,
          stops,
        };

        const timer = setTimeout(() => {
          console.log('SearchScreen: Navigating to RideSelection with details:', details);
          router.push({
            pathname: '/booking/RideSelection',
            params: {
              ...details,
              originCoordinates: JSON.stringify(details.originCoordinates),
              destinationCoordinates: JSON.stringify(details.destinationCoordinates),
              distance: details.distance.toString(),
              stops: JSON.stringify(details.stops)
            }
          });
        }, 100);
        return () => clearTimeout(timer);
      } else {
        console.warn('Invalid coordinates structure:', { originCoordinates, destinationCoordinates });
      }
    }

    if (isReturningFromRide) {
      setIsReturningFromRide(false);
    }
  }, [originCoordinates, destinationCoordinates, originLocation, destinationLocation, isReturningFromRide]);

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
      let { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        console.warn('Permission to access location was denied');
        setOriginLocation("Location permission denied");
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
    } catch (error) {
      console.warn('Location error:', error);
      setOriginLocation("Location unavailable");
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
    setOriginLocation(item.name);
    setDestinationLocation(item.address);
    checkLocation(item.name, true);
    checkLocation(item.address, false);
  };

  const showRecentLocations = !originShowList && !dropShowList && !keyboardVisible;

  return (
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

        {/* Content Container */}
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
            {showRecentLocations && (
              <View style={styles.recentLocationsContainer}>
                {recentLocations.map((item, index) => (
                  <View key={item.id}>
                    <TouchableOpacity 
                      style={styles.recentLocationItem} 
                      onPress={() => handleRecentLocationPress(item)}
                      activeOpacity={0.7}
                    >
                      <View style={styles.clockIconContainer}>
                        <MaterialCommunityIcons name="clock-outline" size={22} color="#FFFFFF" />
                      </View>
                      <View style={styles.locationDetailsContainer}>
                        <Text style={styles.locationName}>{item.name}</Text>
                        <Text style={styles.locationAddress} numberOfLines={1}>
                          {item.address}
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

        <Loader modalVisible={loading} setModalVisible={setLoading} />
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 60 : 20,
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
});

export default SearchScreen;