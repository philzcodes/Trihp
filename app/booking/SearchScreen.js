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
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import MapView, { PROVIDER_DEFAULT, PROVIDER_GOOGLE } from 'react-native-maps';
import Icon3 from 'react-native-vector-icons/Entypo';
import Icon2 from 'react-native-vector-icons/Ionicons';
import Icon4 from 'react-native-vector-icons/MaterialCommunityIcons';
import Pin from '../../assets/images/Pin';
import Back from '../../assets/svgIcons/Back';
import { Colors, Fonts } from '../../constants';
import { haversineDistance } from '../../helper/distancesCalculate';
import Loader from '../../helper/Loader';
import { GOOGLE_MAPS_APIKEY } from '../../utils/Api';
import customMapStyle from '../../utils/Map.json';

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
  const [focusedInput, setFocusedInput] = useState('origin');
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [isReturningFromRide, setIsReturningFromRide] = useState(false);

  // Mock recent locations
  const recentLocations = [
    {
      id: '1',
      pickup_location_name: 'Times Square, NYC',
      drop_location_name: 'Los Angeles, CA',
    },
    {
      id: '2',
      pickup_location_name: 'Times Square, NYC',
      drop_location_name: 'Los Angeles, CA',
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
        router.push('/booking/RideSelection', { info: details });
      }, 100);
      return () => clearTimeout(timer);
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
        accuracy: Location.Accuracy.High
      });

      const coordinates = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.006996872576237934,
        longitudeDelta: 0.004216404151804909,
      };

      setOriginCoordinates(coordinates);

      // Reverse geocoding with Expo
      let address = await Location.reverseGeocodeAsync(coordinates);
      if (address.length > 0) {
        const formattedAddress = [
          address[0].name,
          address[0].street,
          address[0].city,
          address[0].region,
          address[0].country
        ].filter(Boolean).join(', ');
        setOriginLocation(formattedAddress);
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
        // Forward geocoding using Google API
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
        // Reverse geocoding with Expo
        let address = await Location.reverseGeocodeAsync(region);
        if (address.length > 0) {
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
        console.error('Error fetching address for origin:', error);
      }
    }
  };

  const handleRecentLocationPress = (item) => {
    checkLocation(item.pickup_location_name + ', ' + item.drop_location_name, false);
    setDestinationLocation(item.drop_location_name);
  };

  const showRecentLocations = !originShowList && !dropShowList && !keyboardVisible;

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Back />
          </TouchableOpacity>
          <Text style={styles.headerText}>Plan Your Ride</Text>
          <View style={styles.placeholderButton} />
        </View>

        {/* Top Section */}
        <View style={[styles.inputContainerWrapper, {
          flex: originLocation || destinationLocation ? 2 : 1,
        }]}>
          {/* Input Fields */}
          <View style={styles.inputsWrapper}>
            <View style={styles.inputsContainer}>
              <View style={styles.inputField}>
                <TextInput
                  value={originLocation}
                  placeholder="Current Location"
                  onChangeText={(text) => {
                    setOriginLocation(text);
                    handleOriginSearch(text);
                    setFocusedInput('origin');
                  }}
                  onFocus={() => setFocusedInput('origin')}
                  selectionColor="#fff"
                  cursorColor="#fff"
                  placeholderTextColor="#848484"
                  style={[styles.textInput, { textAlign: 'left' }]}
                />
                {originLocation.length > 0 && (
                  <TouchableOpacity
                    onPress={() => {
                      setOriginLocation('');
                      setOriginShowList(false);
                    }}
                  >
                    <Icon3 name="circle-with-cross" size={20} color="#848484" />
                  </TouchableOpacity>
                )}
              </View>

              <View style={styles.inputField}>
                <TextInput
                  value={destinationLocation}
                  placeholder="Where to?"
                  onChangeText={(text) => {
                    setDestinationLocation(text);
                    handleDestinationSearch(text);
                    setFocusedInput('destination');
                  }}
                  onFocus={() => {
                    setDropShowList(true);
                  }}
                  onBlur={() => {
                    if (dropPrediction.length === 0) {
                      setDropShowList(false);
                    }
                  }}
                  selectionColor="#fff"
                  cursorColor="#fff"
                  placeholderTextColor="#848484"
                  style={styles.textInput}
                />
                {destinationLocation.length > 0 && (
                  <TouchableOpacity
                    onPress={() => {
                      setDestinationLocation('');
                      setDropShowList(false);
                    }}
                  >
                    <Icon3 name="circle-with-cross" size={20} color="#848484" />
                  </TouchableOpacity>
                )}
              </View>
            </View>

            <TouchableOpacity
              style={styles.addButton}
              onPress={() =>
                router.push('/booking/AddStops', {
                  originCoordinates,
                  destinationLocation,
                  originLocation,
                  existingStops: stops,
                  key: Date.now(),
                })
              }
            >
              <Icon2 name="add" size={22} color="#fff" />
            </TouchableOpacity>
          </View>

          {/* Predictions Lists */}
          {focusedInput === 'origin' && originPrediction.length > 0 && originShowList && (
            <View style={styles.listContainer}>
              <FlatList
                data={originPrediction}
                keyboardShouldPersistTaps="always"
                keyExtractor={(item, index) => item?.id || index.toString()}
                renderItem={({ item }) => (
                  <Pressable
                    style={styles.predictionItem}
                    onPress={() => {
                      setOriginLocation(item?.structured_formatting?.main_text);
                      setOriginShowList(false);
                      checkLocation(item?.description, true);
                    }}
                  >
                    <Icon2 name="location" size={18} color="#fff" />
                    <View style={styles.predictionTextContainer}>
                      <Text style={styles.predictionMainText}>{item?.structured_formatting?.main_text || 'No address found'}</Text>
                      {item?.structured_formatting?.secondary_text && (
                        <Text style={styles.predictionSecondaryText} numberOfLines={1}>
                          {item?.structured_formatting?.secondary_text}
                        </Text>
                      )}
                    </View>
                  </Pressable>
                )}
                style={styles.predictionList}
              />
            </View>
          )}

          {focusedInput === 'destination' && dropPrediction.length > 0 && dropShowList && (
            <View style={styles.listContainer}>
              <FlatList
                data={dropPrediction}
                keyExtractor={(item, index) => item?.id || index.toString()}
                keyboardShouldPersistTaps="always"
                renderItem={({ item }) => (
                  <Pressable
                    style={styles.predictionItem}
                    onPress={() => {
                      setDestinationLocation(item?.structured_formatting?.main_text);
                      setDropShowList(false);
                      checkLocation(item?.description, false);
                    }}
                  >
                    <Icon2 name="location" size={18} color="#fff" />
                    <View style={styles.predictionTextContainer}>
                      <Text style={styles.predictionMainText}>{item?.structured_formatting?.main_text || 'No address found'}</Text>
                      {item?.structured_formatting?.secondary_text && (
                        <Text style={styles.predictionSecondaryText} numberOfLines={1}>
                          {item?.structured_formatting?.secondary_text}
                        </Text>
                      )}
                    </View>
                  </Pressable>
                )}
                style={styles.predictionList}
              />
            </View>
          )}

          {/* Recent Locations */}
          {showRecentLocations && (
            <View style={styles.recentLocationsContainer}>
              {recentLocations.map((item) => (
                <TouchableOpacity key={item.id} style={styles.recentLocationItem} onPress={() => handleRecentLocationPress(item)}>
                  <View style={styles.clockIconContainer}>
                    <Icon4 name="clock-outline" size={20} color="#fff" />
                  </View>
                  <View style={styles.locationTextContainer}>
                    <Text style={styles.locationText}>{item.pickup_location_name}</Text>
                    <Text style={styles.subLocationText}>{item.drop_location_name}</Text>
                  </View>
                </TouchableOpacity>
              ))}
              <View style={styles.separator} />
            </View>
          )}
        </View>

        {/* Map View */}
        {originCoordinates && (
          <View style={[styles.mapContainer, { flex: originLocation || destinationLocation ? 2 : 1 }]}>
            <MapView
              ref={mapViewRef}
              customMapStyle={customMapStyle}
              mapType="standard"
              showsUserLocation={true}
              region={originCoordinates}
              followsUserLocation={true}
              showsMyLocationButton={false}
              zoomControlEnabled
              provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : PROVIDER_DEFAULT}
              style={styles.map}
              onRegionChangeComplete={handleRegionChange}
            />

            <View style={styles.pinContainer}>
              <Pin />
            </View>
          </View>
        )}

        <Loader modalVisible={loading} setModalVisible={setLoading} />
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.blackColor,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
  },
  backButton: {
    padding: 5,
  },
  headerText: {
    ...Fonts.Regular,
    fontSize: 18,
    color: Colors.whiteColor,
  },
  placeholderButton: {
    width: 30,
  },
  inputContainerWrapper: {
    paddingHorizontal: 20,
  },
  inputsWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputsContainer: {
    flex: 1,
  },
  inputField: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.grey12,
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginBottom: 10,
  },
  textInput: {
    flex: 1,
    ...Fonts.Regular,
    color: Colors.whiteColor,
    fontSize: 16,
    paddingVertical: 0,
  },
  addButton: {
    marginLeft: 10,
    backgroundColor: Colors.yellow,
    borderRadius: 10,
    padding: 10,
  },
  listContainer: {
    maxHeight: 200,
    backgroundColor: Colors.grey12,
    borderRadius: 10,
    marginTop: 5,
  },
  predictionList: {
    padding: 10,
  },
  predictionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  predictionTextContainer: {
    marginLeft: 10,
    flex: 1,
  },
  predictionMainText: {
    ...Fonts.Regular,
    color: Colors.whiteColor,
    fontSize: 16,
  },
  predictionSecondaryText: {
    ...Fonts.Regular,
    color: Colors.grey,
    fontSize: 14,
    marginTop: 2,
  },
  recentLocationsContainer: {
    marginTop: 20,
  },
  recentLocationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
  },
  clockIconContainer: {
    backgroundColor: Colors.grey12,
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  locationTextContainer: {
    flex: 1,
  },
  locationText: {
    ...Fonts.Regular,
    color: Colors.whiteColor,
    fontSize: 16,
  },
  subLocationText: {
    ...Fonts.Regular,
    color: Colors.grey,
    fontSize: 14,
    marginTop: 2,
  },
  separator: {
    height: 1,
    backgroundColor: Colors.grey11,
    marginVertical: 10,
  },
  mapContainer: {
    borderRadius: 20,
    overflow: 'hidden',
    marginHorizontal: 20,
    marginBottom: 20,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  pinContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginLeft: -15,
    marginTop: -30,
  },
});

export default SearchScreen;
