import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { MapComponent } from '../../components';

const RideSelection = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const mapRef = useRef(null);
  const isMountedRef = useRef(true);

  // State
  const [loading, setLoading] = useState(true);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [duration, setDuration] = useState('1 Min');
  const [arrivalTime, setArrivalTime] = useState('10:30');
  const [isBottomSheetExpanded, setIsBottomSheetExpanded] = useState(false);

  // Dummy vehicle data matching the design
  const vehicles = [
    {
      id: 1,
      name: 'Trihp Smooth',
      image: require('../../assets/images/car.png'),
      seats: 4,
      price: 20,
      category: 'premium',
      available: true,
    },
    {
      id: 2,
      name: 'Trihp keke',
      image: require('../../assets/images/auto.png'),
      seats: 3,
      price: 15,
      category: 'standard',
      available: true,
    },
    {
      id: 3,
      name: 'Trihp motorcycle',
      image: require('../../assets/images/bike.png'),
      seats: 1,
      price: 15,
      category: 'economy',
      available: true,
    },
  ];

  const moreVehicles = [
    {
      id: 4,
      name: 'Trihp lite (no A/C)',
      image: require('../../assets/images/lite.png'),
      seats: 4,
      price: 15,
      category: 'economy',
      available: true,
    },
  ];

  // Dummy driver markers for the map
  const dummyDrivers = [
    { latitude: 8.4876, longitude: -13.2299, id: 1, vehicle_category_id: 1 },
    { latitude: 8.4886, longitude: -13.2289, id: 2, vehicle_category_id: 2 },
    { latitude: 8.4866, longitude: -13.2309, id: 3, vehicle_category_id: 3 },
    { latitude: 8.4896, longitude: -13.2279, id: 4, vehicle_category_id: 1 },
    { latitude: 8.4856, longitude: -13.2319, id: 5, vehicle_category_id: 2 },
  ];
  
  // Payment methods
  const paymentMethods = [
    { id: '1', icon: '💵', name: 'Cash', color: '#4CAF50' },
    { id: '2', icon: '👛', name: 'Trihp Wallet', color: '#FF9800' },
    { id: '3', icon: '💳', name: 'Credit / Debit Card', color: '#2196F3' },
    { id: '4', icon: '📱', name: 'AfriMoney', color: '#9C27B0' },
  ];

  const [selectedPayment, setSelectedPayment] = useState(paymentMethods[0]);
  const [coordinatesReady, setCoordinatesReady] = useState(false);

  // Parse coordinates and other params from URL navigation
  const parseCoordinates = (coordParam) => {
    console.log('parseCoordinates input:', coordParam, 'type:', typeof coordParam);
    
    if (!coordParam) {
      console.log('parseCoordinates: no coordParam');
      return null;
    }
    
    try {
      if (typeof coordParam === 'string') {
        console.log('parseCoordinates: parsing string:', coordParam);
        const parsed = JSON.parse(coordParam);
        console.log('parseCoordinates: parsed result:', parsed);
        if (parsed && typeof parsed.latitude === 'number' && typeof parsed.longitude === 'number') {
          return parsed;
        }
      } else if (coordParam && typeof coordParam === 'object') {
        console.log('parseCoordinates: object input:', coordParam);
        // Check if it's already a coordinate object
        if (typeof coordParam.latitude === 'number' && typeof coordParam.longitude === 'number') {
          return coordParam;
        }
        // Check if it's a stringified object that needs parsing
        if (coordParam.toString && coordParam.toString() === '[object Object]') {
          console.log('parseCoordinates: object is stringified, trying to access properties');
          // Sometimes the object might be passed but not properly accessible
          return null;
        }
      }
    } catch (error) {
      console.error('Error parsing coordinates:', error);
    }
    
    console.log('parseCoordinates: returning null');
    return null;
  };

  const parseStops = (stopsParam) => {
    if (!stopsParam) return [];
    try {
      if (typeof stopsParam === 'string') {
        return JSON.parse(stopsParam);
      }
      return Array.isArray(stopsParam) ? stopsParam : [];
    } catch (error) {
      console.error('Error parsing stops:', error);
      return [];
    }
  };

  // Parse coordinates with a delay to handle URL parameter loading
  const [parsedCoordinates, setParsedCoordinates] = useState({
    origin: null,
    destination: null,
    distance: null,
    stops: []
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      console.log('Parsing coordinates after delay...');
      const origin = parseCoordinates(params?.originCoordinates);
      const destination = parseCoordinates(params?.destinationCoordinates);
      const distance = params?.distance ? parseFloat(params.distance) : null;
      const stops = parseStops(params?.stops);
      
      setParsedCoordinates({
        origin,
        destination,
        distance,
        stops
      });
      
      if (origin && destination) {
        setCoordinatesReady(true);
        console.log('Coordinates ready!');
      } else {
        console.log('Coordinates not ready yet');
      }
    }, 500); // Give time for params to be fully loaded

    return () => clearTimeout(timer);
  }, [params]);

  const originCoordinates = parsedCoordinates.origin;
  const destinationCoordinates = parsedCoordinates.destination;
  const distance = parsedCoordinates.distance;
  const stops = parsedCoordinates.stops;

  // Cleanup on unmount - DO NOT manipulate map ref
  useEffect(() => {
    isMountedRef.current = true;
    
    return () => {
      isMountedRef.current = false;
      // Don't touch mapRef - let React Native Maps handle its own cleanup
    };
  }, []);

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      if (isMountedRef.current) {
        setLoading(false);
        setSelectedVehicle(vehicles[0]); // Select first vehicle by default
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Generate random arrival time
  useEffect(() => {
    const now = new Date();
    now.setMinutes(now.getMinutes() + Math.floor(Math.random() * 3) + 1);
    setArrivalTime(now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }));
  }, []);

  const handleConfirmRide = () => {
    if (!selectedVehicle || !originCoordinates || !destinationCoordinates || !isMountedRef.current) return;
    
    // Mark as unmounting to prevent any pending operations
    isMountedRef.current = false;
    
    // Navigate to next screen with ride details
    router.push({
      pathname: '/booking/PickupConfirm',
      params: {
        originCoordinates: JSON.stringify(originCoordinates),
        destinationCoordinates: JSON.stringify(destinationCoordinates),
        destinationLocation: params?.destinationLocation,
        originLocation: params?.originLocation,
        paymentMethod: selectedPayment?.name,
      ride_category: selectedVehicle?.name,
      vehicle_category_id: selectedVehicle?.id,
      amount: selectedVehicle?.price,
        distance: distance,
        stops: JSON.stringify(stops),
      }
    });
  };

  const renderVehicleItem = (item, isSelected = false) => (
    <TouchableOpacity
      key={item.id}
      style={[
        styles.vehicleCard,
        isSelected && styles.selectedVehicleCard
      ]}
      onPress={() => setSelectedVehicle(item)}
      activeOpacity={0.7}
    >
      <Image 
        source={item.image} 
        style={styles.vehicleImage} 
        resizeMode="contain"
      />
      <View style={styles.vehicleDetails}>
        <View style={styles.vehicleHeader}>
        <Text style={styles.vehicleName}>{item.name}</Text>
          <Icon name="person" size={14} color="#FFFFFF" style={styles.personIcon} />
          <Text style={styles.vehicleSeats}>- {item.seats}</Text>
        </View>
          <Text style={styles.vehicleTime}>
          {arrivalTime} - {duration} away
          </Text>
        </View>
      <Text style={styles.vehiclePrice}>${item.price}</Text>
    </TouchableOpacity>
  );

  // Debug logging to understand coordinate parsing
  console.log('RideSelection - Raw params:', params);
  console.log('RideSelection - Parsed originCoordinates:', originCoordinates);
  console.log('RideSelection - Parsed destinationCoordinates:', destinationCoordinates);
  console.log('RideSelection - originCoordinates type:', typeof originCoordinates);
  console.log('RideSelection - destinationCoordinates type:', typeof destinationCoordinates);

  // Show loading while coordinates are being parsed
  if (!coordinatesReady) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#000000" />
        <View style={styles.errorContainer}>
          <ActivityIndicator size="large" color="#fff" style={{ marginBottom: 20 }} />
          <Text style={styles.errorText}>Loading ride options...</Text>
          <Text style={styles.errorSubText}>Please wait while we prepare your ride</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />
      
      {/* Map View */}
      <View style={styles.mapContainer}>
      <MapComponent
        ref={mapRef}
        style={styles.map}
          region={originCoordinates || {
            latitude: 4.8666,
            longitude: 6.9745,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
          showsUserLocation={true}
          onMapReady={() => {
            console.log('Map is ready');
          }}
        />

        {/* Back Button */}
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => {
            isMountedRef.current = false;
            router.back();
          }}
          activeOpacity={0.8}
        >
          <Icon name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Bottom Sheet */}
      <View style={[styles.bottomSheet, isBottomSheetExpanded && styles.bottomSheetExpanded]}>
        {/* Drag Handle */}
        <TouchableOpacity 
          style={styles.dragHandleContainer}
          onPress={() => setIsBottomSheetExpanded(!isBottomSheetExpanded)}
          activeOpacity={0.7}
        >
          <View style={styles.dragHandle} />
        </TouchableOpacity>

        {/* Title */}
        <Text style={styles.sheetTitle}>Choose Your Ride</Text>
        <View style={styles.titleUnderline} />

        <ScrollView 
          style={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContentContainer}
        >
          {/* Loading State */}
        {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#FFD700" />
              <Text style={styles.loadingText}>Finding available rides...</Text>
          </View>
        ) : (
            <>
              {/* Main Vehicles */}
              <View style={styles.vehiclesSection}>
                {vehicles.map((item) => renderVehicleItem(item, selectedVehicle?.id === item.id))}
      </View>

              {/* More Available Rides Section */}
              <View style={styles.moreRidesSection}>
                <Text style={styles.moreRidesTitle}>More available rides</Text>
                <View style={styles.moreRidesDivider} />
                {moreVehicles.map((item) => renderVehicleItem(item, selectedVehicle?.id === item.id))}
              </View>
            </>
          )}
        </ScrollView>

        {/* Bottom Actions */}
        {!loading && (
          <View style={styles.bottomActions}>
            {/* Payment Selection */}
            <TouchableOpacity 
              style={styles.paymentSelector}
              activeOpacity={0.7}
            >
              <View style={styles.paymentLeft}>
                <Text style={styles.paymentLabel}>Payment</Text>
              </View>
              <View style={styles.paymentRight}>
                <Text style={styles.paymentIcon}>{selectedPayment.icon}</Text>
                <Text style={styles.paymentName}>{selectedPayment.name}</Text>
                <MaterialIcons name="keyboard-arrow-right" size={24} color="#FFFFFF" />
              </View>
            </TouchableOpacity>

            {/* Confirm Button */}
            <TouchableOpacity
              style={[
                styles.confirmButton,
                !selectedVehicle && styles.confirmButtonDisabled
              ]}
          onPress={handleConfirmRide}
          disabled={!selectedVehicle}
              activeOpacity={0.8}
            >
              <Text style={styles.confirmButtonText}>
                Choose {selectedVehicle?.name || 'Ride'}
              </Text>
            </TouchableOpacity>
        </View>
      )}
      </View>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  mapContainer: {
    flex: 1,
    position: 'relative',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  mapPlaceholder: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1C1C1E',
  },
  mapPlaceholderText: {
    fontSize: 16,
    color: '#8E8E93',
    marginTop: 16,
    fontWeight: '500',
  },
  backButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 60 : 20,
    left: 20,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  originMarker: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#4CAF50',
    borderWidth: 3,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  markerDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#4CAF50',
  },
  destinationMarker: {
    alignItems: 'center',
  },
  markerPin: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FF3B30',
    borderWidth: 3,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  markerPinStick: {
    width: 2,
    height: 12,
    backgroundColor: '#FF3B30',
    marginTop: -1,
  },
  driverMarker: {
    width: 40,
    height: 40,
  },
  bottomSheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#1C1C1E',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '70%',
    minHeight: '60%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  bottomSheetExpanded: {
    maxHeight: '85%',
  },
  dragHandleContainer: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  dragHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#48484A',
  },
  sheetTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 12,
    letterSpacing: 0.3,
  },
  titleUnderline: {
    height: 1,
    backgroundColor: '#48484A',
    marginHorizontal: 20,
    marginBottom: 16,
  },
  scrollContent: {
    flex: 1,
  },
  scrollContentContainer: {
    paddingBottom: 200,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    fontSize: 16,
    color: '#8E8E93',
    marginTop: 16,
    fontWeight: '500',
  },
  vehiclesSection: {
    paddingHorizontal: 20,
  },
  vehicleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2C2C2E',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedVehicleCard: {
    borderColor: '#FFFFFF',
    backgroundColor: '#3A3A3C',
  },
  vehicleImage: {
    width: 80,
    height: 50,
    marginRight: 16,
  },
  vehicleDetails: {
    flex: 1,
  },
  vehicleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  vehicleName: {
    fontSize: 17,
    fontWeight: '600',
    color: '#FFFFFF',
    marginRight: 6,
  },
  personIcon: {
    marginRight: 2,
  },
  vehicleSeats: {
    fontSize: 15,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  vehicleTime: {
    fontSize: 14,
    fontWeight: '400',
    color: '#8E8E93',
  },
  vehiclePrice: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  moreRidesSection: {
    marginTop: 24,
    paddingHorizontal: 20,
  },
  moreRidesTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  moreRidesDivider: {
    height: 1,
    backgroundColor: '#48484A',
    marginBottom: 16,
  },
  bottomActions: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#1C1C1E',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
    borderTopWidth: 1,
    borderTopColor: '#48484A',
  },
  paymentSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#2C2C2E',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  paymentLeft: {
    flex: 1,
  },
  paymentLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  paymentRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  paymentIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  paymentName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FFFFFF',
    marginRight: 4,
  },
  confirmButton: {
    backgroundColor: '#FFD700',
    borderRadius: 30,
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmButtonDisabled: {
    backgroundColor: '#48484A',
    opacity: 0.5,
  },
  confirmButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000000',
    letterSpacing: 0.5,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 24,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#FFD700',
    borderRadius: 24,
    paddingHorizontal: 32,
    paddingVertical: 14,
  },
  retryButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000000',
  },
});

export default RideSelection;
