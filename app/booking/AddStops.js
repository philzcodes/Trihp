import axios from 'axios';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import { debounce } from 'lodash';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
    Animated,
    Dimensions,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import Icon3 from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon2 from 'react-native-vector-icons/MaterialIcons';
import { MapComponent } from '../../components';
import TriphButton from '../../components/TriphButton';
import { Colors, Fonts } from '../../constants';
import { GOOGLE_MAPS_APIKEY } from '../../utils/Api';

// Constants
const { height, width } = Dimensions.get('window');
const initialRegion = {
  latitude: 48.8566,
  longitude: 2.3522,
  latitudeDelta: 0.0122,
  longitudeDelta: 0.0121,
};

const AddStopsScreen = ({ navigation, route }) => {
  const router = useRouter();
  // State and Refs
  const { originCoordinates, originLocation, existingStops } = route?.params || {};
  const [currentPosition, setCurrentPosition] = useState(originCoordinates || null);
  const [currentLocationAddress, setCurrentLocationAddress] = useState(originLocation || 'Current Location');
  
  const [stops, setStops] = useState(() => {
    // If we have existing stops, use them
    if (existingStops && existingStops.length > 0) {
      // Create a complete stops array with the origin location as the first stop
      return [
        {
          id: 1,
          location: originLocation || 'Loading...',
          isCurrentLocation: true,
          coordinates: originCoordinates || null,
        },
        // Map the existing stops to have sequential IDs starting from 2
        ...existingStops.map((stop, index) => ({
          id: index + 2,
          location: stop.location || '',
          coordinates: stop.coordinates || null,
        })),
      ];
    }

    // Otherwise use the default initial stops
    return [
      {
        id: 1,
        location: originLocation || 'Loading...',
        isCurrentLocation: true,
        coordinates: originCoordinates || null,
      },
      { id: 2, location: '', coordinates: null },
    ];
  });
  const [activeStopId, setActiveStopId] = useState(null);
  const [isLocating, setIsLocating] = useState(false);
  const [predictions, setPredictions] = useState([]);
  const [showPredictions, setShowPredictions] = useState(false);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const mapViewRef = useRef(null);
  const mapHeight = useRef(new Animated.Value(height * 0.5)).current;
  const scrollViewRef = useRef(null);

  // Effects
  useEffect(() => {
    if (!originCoordinates) {
      getCurrentLocation();
    }
  }, [originCoordinates]);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardVisible(true);
      Animated.timing(mapHeight, {
        toValue: height * 0.3,
        duration: 300,
        useNativeDriver: false,
      }).start();
    });

    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardVisible(false);
      Animated.timing(mapHeight, {
        toValue: height * 0.5,
        duration: 300,
        useNativeDriver: false,
      }).start();
    });

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  // Location-related Functions
  const getCurrentLocation = async () => {
    setIsLocating(true);
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        console.warn('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High
      });

      const region = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.0122,
        longitudeDelta: 0.0121,
      };

      setCurrentPosition(region);

      try {
        let address = await Location.reverseGeocodeAsync(region);
        if (address.length > 0) {
          const formattedAddress = [
            address[0].name,
            address[0].street,
            address[0].city,
            address[0].region,
            address[0].country
          ].filter(Boolean).join(', ');
          setCurrentLocationAddress(formattedAddress);

          const updatedStops = [...stops];
          if (updatedStops[0].isCurrentLocation) {
            updatedStops[0] = {
              ...updatedStops[0],
              location: formattedAddress,
              coordinates: region,
            };
            setStops(updatedStops);
          }
        }
      } catch (error) {
        console.error('Error getting address:', error);
      }

      if (!activeStopId) {
        mapViewRef.current?.animateToRegion(region);
      }
    } catch (error) {
      console.error('Error getting location:', error);
    } finally {
      setIsLocating(false);
    }
  };

  const handleRegionChangeComplete = (region) => {
    if (!activeStopId) {
      setCurrentPosition(region);
    }
  };

  // Stop-related Functions
  const addStop = () => {
    if (stops.length < 3) {
      setStops([...stops, { id: stops.length + 1, location: '', coordinates: null }]);
    }
  };

  const removeStop = (id) => {
    if (stops.length > 2) {
      const newStops = stops
        .filter((stop) => stop.id !== id)
        .map((stop, index) => ({
          ...stop,
          id: index + 1,
        }));
      setStops(newStops);
    }
  };

  const handleStopInputChange = (text, stopId) => {
    const newStops = [...stops];
    const stopIndex = newStops.findIndex((stop) => stop.id === stopId);

    if (stopIndex !== -1) {
      if (stopId === 1) {
        newStops[stopIndex] = {
          ...newStops[stopIndex],
          location: text,
          isCurrentLocation: false,
        };
      } else {
        newStops[stopIndex] = {
          ...newStops[stopIndex],
          location: text,
        };
      }

      setStops(newStops);
      searchPlaces(text, stopId);
    }
  };

  const clearStopInput = (stopId) => {
    const newStops = [...stops];
    const stopIndex = newStops.findIndex((stop) => stop.id === stopId);

    if (stopIndex !== -1) {
      if (stopId === 1) {
        newStops[stopIndex] = {
          ...newStops[stopIndex],
          location: currentLocationAddress,
          coordinates: currentPosition,
          isCurrentLocation: true,
        };
      } else {
        newStops[stopIndex] = {
          ...newStops[stopIndex],
          location: '',
          coordinates: null,
        };
      }

      setStops(newStops);
      setPredictions([]);
      setShowPredictions(false);
    }
  };

  const fitAllMarkers = () => {
    const validStops = stops.filter((stop) => stop.coordinates);

    if (validStops.length <= 1) {
      if (validStops.length === 1 && mapViewRef.current) {
        mapViewRef.current?.animateToRegion(validStops[0].coordinates, 300);
      }
      return;
    }

    if (!mapViewRef.current) return;

    const coordinates = validStops.map((stop) => ({
      latitude: stop.coordinates.latitude,
      longitude: stop.coordinates.longitude,
    }));

    mapViewRef.current?.fitToCoordinates(coordinates, {
      edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
      animated: true,
    });
  };

  const handleDone = () => {
    const validStops = stops.filter((stop, index) => index !== 0 && stop.coordinates);
    router.push('/booking/SearchScreen', {
      stops: validStops,
      timestamp: Date.now(), // Add a timestamp to ensure params are different each time
    });
  };

  // Search-related Functions
  const searchPlaces = useCallback(
    debounce(async (text, stopId) => {
      if (!text.trim()) {
        setPredictions([]);
        setShowPredictions(false);
        return;
      }

      try {
        const apiUrl = `https://maps.googleapis.com/maps/api/place/autocomplete/json?key=${GOOGLE_MAPS_APIKEY}&input=${text}`;
        const result = await axios.get(apiUrl);

        if (result.data.predictions) {
          setPredictions(result.data.predictions);
          setShowPredictions(true);
        }
      } catch (error) {
        console.error('Error searching places:', error);
      }
    }, 300),
    [],
  );

  const handleLocationSelect = async (description, stopId) => {
    try {
      // Forward geocoding using Google API
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(description)}&key=${GOOGLE_MAPS_APIKEY}`
      );
      
      if (response.data.results && response.data.results.length > 0) {
        const coordinates = response.data.results[0].geometry.location;
        const formattedAddress = response.data.results[0].formatted_address;

        const updatedStops = stops.map((stop) => {
          if (stop.id === stopId) {
            if (stopId === 1) {
              return {
                ...stop,
                location: formattedAddress,
                coordinates: {
                  latitude: coordinates.lat,
                  longitude: coordinates.lng,
                  latitudeDelta: 0.01,
                  longitudeDelta: 0.01,
                },
                isCurrentLocation: false,
              };
            } else {
              return {
                ...stop,
                location: formattedAddress,
                coordinates: {
                  latitude: coordinates.lat,
                  longitude: coordinates.lng,
                  latitudeDelta: 0.01,
                  longitudeDelta: 0.01,
                },
              };
            }
          }
          return stop;
        });

        setStops(updatedStops);
        setPredictions([]);
        setShowPredictions(false);
        Keyboard.dismiss();

        setTimeout(() => {
          fitAllMarkers();
        }, 500);
      }
    } catch (error) {
      console.error('Error getting location details:', error);
    }
  };
  
  // Render
  const shouldShowDoneButton = stops.filter((stop) => stop.coordinates).length >= 2;

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
      >
        <ScrollView>
          {/* Map Section */}
          <Animated.View style={[styles.mapContainer, { height: mapHeight }]}>
            <MapComponent
              ref={mapViewRef}
              style={styles.map}
              initialRegion={currentPosition || initialRegion}
              onRegionChangeComplete={handleRegionChangeComplete}
              markers={stops.filter(stop => stop.coordinates && stop.id !== activeStopId).map(stop => ({
                ...stop.coordinates,
                title: stop.id === 1 ? 'Current Location' : `Stop ${stop.id - 1}`,
                pinColor: stop.id === 1 ? 'blue' : 'red'
              }))}
            />
            <TouchableOpacity
              style={[styles.locationButton, isLocating && styles.disabledButton]}
              onPress={getCurrentLocation}
              disabled={isLocating}
            >
              <Icon2 name={isLocating ? 'gps-not-fixed' : 'gps-fixed'} size={24} color="#000" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
              <Icon name="arrowleft" size={24} color="#fff" />
            </TouchableOpacity>
          </Animated.View>

          {/* Stops Section */}
          <View style={styles.stopsSection}>
            <Text style={styles.title}>Add Stops</Text>

            <View style={styles.stopsContainer}>
              <View style={styles.timelineMainContainer}>
                <View style={styles.timelineLeftContainer}>
                  <View
                    style={[
                      styles.timelineDot,
                      activeStopId === 1 && styles.timelineDotActive,
                      stops[0].coordinates && styles.timelineDotCompleted,
                    ]}
                  >
                    <Icon3 name="crosshairs-gps" size={16} color="#fff" />
                  </View>
                  <View style={[styles.timelineLine, stops[0].coordinates && styles.timelineLineCompleted]} />
                  <View
                    style={[
                      styles.timelineDot,
                      activeStopId === 2 && styles.timelineDotActive,
                      stops[1].coordinates && styles.timelineDotCompleted,
                    ]}
                  >
                    <Text style={styles.stopNumber}>1</Text>
                  </View>
                  {stops.length > 2 && (
                    <>
                      <View style={[styles.timelineLine, stops[1].coordinates && styles.timelineLineCompleted]} />
                      <View
                        style={[
                          styles.timelineDot,
                          activeStopId === 3 && styles.timelineDotActive,
                          stops[2].coordinates && styles.timelineDotCompleted,
                        ]}
                      >
                        <Text style={styles.stopNumber}>2</Text>
                      </View>
                    </>
                  )}
                  {stops.length < 3 && (
                    <>
                      <View style={styles.timelineLine} />
                      <TouchableOpacity style={styles.timelinePlusContainer} onPress={addStop}>
                        <Icon3 name="plus" size={20} color="#fff" />
                      </TouchableOpacity>
                    </>
                  )}
                </View>

                <View style={styles.inputsMainContainer}>
                  <View style={styles.inputRowContainer}>
                    <View style={[styles.inputWrapper, activeStopId === 1 && styles.inputWrapperActive]}>
                      <TextInput
                        style={styles.input}
                        placeholder="Current Location"
                        placeholderTextColor="#808080"
                        value={stops[0]?.location || ''}
                        onFocus={() => {
                          setActiveStopId(1);
                          setPredictions([]);
                          setShowPredictions(false);
                        }}
                        onChangeText={(text) => handleStopInputChange(text, 1)}
                      />
                      {stops[0]?.location && (
                        <TouchableOpacity style={styles.clearButton} onPress={() => clearStopInput(1)}>
                          <Icon name="close" size={20} color="#808080" />
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>

                  <View style={styles.inputRowContainer}>
                    <View style={[styles.inputWrapper, activeStopId === 2 && styles.inputWrapperActive]}>
                      <TextInput
                        style={styles.input}
                        placeholder="Add a Stop"
                        placeholderTextColor="#808080"
                        value={stops[1]?.location || ''}
                        onFocus={() => {
                          setActiveStopId(2);
                          setPredictions([]);
                          setShowPredictions(false);
                        }}
                        onChangeText={(text) => handleStopInputChange(text, 2)}
                      />
                      {stops[1]?.location && (
                        <TouchableOpacity style={styles.clearButton} onPress={() => clearStopInput(2)}>
                          <Icon name="close" size={20} color="#808080" />
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>

                  {stops.length > 2 && (
                    <View style={styles.inputRowContainer}>
                      <View style={[styles.inputWrapper, activeStopId === 3 && styles.inputWrapperActive]}>
                        <TextInput
                          style={styles.input}
                          placeholder="Add a Stop"
                          placeholderTextColor="#808080"
                          value={stops[2]?.location || ''}
                          onFocus={() => {
                            setActiveStopId(3);
                            setPredictions([]);
                            setShowPredictions(false);
                          }}
                          onChangeText={(text) => handleStopInputChange(text, 3)}
                        />
                        {stops[2]?.location && (
                          <TouchableOpacity style={styles.clearButton} onPress={() => clearStopInput(3)}>
                            <Icon name="close" size={20} color="#808080" />
                          </TouchableOpacity>
                        )}
                      </View>
                      <TouchableOpacity style={styles.removeButton} onPress={() => removeStop(3)}>
                        <Icon name="delete" size={16} color="#fff" />
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              </View>
            </View>

            {/* Predictions Modal */}
            {showPredictions && predictions.length > 0 && (
              <View style={styles.predictionsOverlay}>
                <View style={styles.predictionsContainer}>
                  <ScrollView
                    ref={scrollViewRef}
                    style={styles.predictionsScrollView}
                    keyboardShouldPersistTaps="handled"
                    nestedScrollEnabled={true}
                  >
                    {predictions.map((prediction) => (
                      <TouchableOpacity
                        key={prediction.place_id}
                        style={styles.predictionItem}
                        onPress={() => handleLocationSelect(prediction.description, activeStopId)}
                      >
                        <Icon2 name="place" size={20} color="#808080" style={styles.predictionIcon} />
                        <View style={styles.predictionTextContainer}>
                          <Text style={styles.predictionMainText}>{prediction.structured_formatting.main_text}</Text>
                          <Text style={styles.predictionSecondaryText}>{prediction.structured_formatting.secondary_text}</Text>
                        </View>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                  <TouchableOpacity
                    style={styles.closePredictionsButton}
                    onPress={() => {
                      setShowPredictions(false);
                      setPredictions([]);
                    }}
                  >
                    <Icon name="close" size={20} color="#fff" />
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {shouldShowDoneButton && <TriphButton text="Done" onPress={handleDone} extraStyle={{ padding: 10 }} />}
          </View>
        </ScrollView>
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
  },
  mapContainer: {
    height: height * 0.5,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    backgroundColor: Colors.blackColor,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  stopsSection: {
    flex: 1,
    backgroundColor: '#000000',
    padding: 20,
  },
  title: {
    ...Fonts.Regular,
    fontSize: 16,
    color: Colors.whiteColor,
    textAlign: 'center',
    marginBottom: 20,
  },
  stopsContainer: {
    flex: 1,
    marginBottom: 20,
  },
  timelineMainContainer: {
    flexDirection: 'row',
  },
  timelineLeftContainer: {
    width: 40,
    alignItems: 'center',
    marginTop: 15,
  },
  timelineDot: {
    width: 22,
    height: 22,
    borderRadius: 5,
    backgroundColor: '#2A2A2A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  timelineDotActive: {
    backgroundColor: Colors.blackColor,
  },
  timelineDotCompleted: {
    backgroundColor: '#2A2A2A',
  },
  timelineLine: {
    width: 1,
    height: 40,
    backgroundColor: '#fff',
    marginVertical: 4,
  },
  timelineLineCompleted: {
    backgroundColor: '#2A2A2A',
  },
  timelinePlusContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stopNumber: {
    ...Fonts.Regular,
    color: '#fff',
    fontSize: 12,
  },
  inputsMainContainer: {
    flex: 1,
    marginLeft: 10,
  },
  inputRowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  inputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#252525',
    borderRadius: 5,
    height: 50,
    paddingHorizontal: 15,
  },
  inputWrapperActive: {
    backgroundColor: '#2A2A2A',
    borderColor: Colors.yellow,
    borderWidth: 1,
  },
  input: {
    flex: 1,
    color: Colors.whiteColor,
    fontSize: 14,
    height: '100%',
  },
  clearButton: {
    padding: 5,
  },
  removeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#ff4d4d',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  // New improved predictions UI
  predictionsOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  predictionsContainer: {
    width: '90%',
    maxHeight: height * 0.6,
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    position: 'relative',
  },
  predictionsScrollView: {
    maxHeight: height * 0.5,
  },
  predictionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#2A2A2A',
  },
  predictionIcon: {
    marginRight: 10,
  },
  predictionTextContainer: {
    flex: 1,
  },
  predictionMainText: {
    color: Colors.whiteColor,
    fontSize: 16,
  },
  predictionSecondaryText: {
    color: '#808080',
    fontSize: 14,
    marginTop: 4,
  },
  closePredictionsButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(0,0,0,0.5)',
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  locationButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: Colors.whiteColor,
    padding: 10,
    borderRadius: 50,
    zIndex: 2,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  disabledButton: {
    backgroundColor: Colors.grey,
  },
});

export default AddStopsScreen;
