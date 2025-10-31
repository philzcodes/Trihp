import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { clearRequestQueue, getQueueStats } from '../../api/client';
import rideRequestAPI from '../../api/rideRequestAPI';
import { MapComponent } from '../../components';
import PricingHelper from '../../helper/pricingHelper';
import useBookingStore from '../../store/bookingStore';

const RideSelection = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const mapRef = useRef(null);
  const isMountedRef = useRef(true);

  // Zustand store
  const { currentRide, updateRideRequest, setCurrentRide, loading: storeLoading } = useBookingStore();

  // State
  const [loading, setLoading] = useState(true);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [duration, setDuration] = useState('1 Min');
  const [arrivalTime, setArrivalTime] = useState('10:30');
  const [isBottomSheetExpanded, setIsBottomSheetExpanded] = useState(false);
  const [rideData, setRideData] = useState(null);
  const [vehiclePricing, setVehiclePricing] = useState({});
  const [pricingLoading, setPricingLoading] = useState(false);
  const [pricingError, setPricingError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  // Vehicle data matching backend VehicleType enum (without hardcoded pricing)
  const vehicles = [
    {
      id: 1,
      name: 'Trihp Smooth',
      type: 'CAR',
      image: require('../../assets/images/car.png'),
      seats: 4,
      category: 'premium',
      available: true,
    },
    {
      id: 2,
      name: 'Trihp Keke',
      type: 'KEKE',
      image: require('../../assets/images/auto.png'),
      seats: 3,
      category: 'standard',
      available: true,
    },
    {
      id: 3,
      name: 'Trihp Motorcycle',
      type: 'BIKE',
      image: require('../../assets/images/bike.png'),
      seats: 1,
      category: 'economy',
      available: true,
    },
  ];

  const moreVehicles = [
    {
      id: 4,
      name: 'Trihp Lite',
      type: 'LITE',
      image: require('../../assets/images/lite.png'),
      seats: 4,
      category: 'economy',
      available: true,
    },
    {
      id: 5,
      name: 'Trihp Luxe',
      type: 'LUXE',
      image: require('../../assets/images/luxe.png'),
      seats: 4,
      category: 'luxury',
      available: true,
    },
    {
      id: 6,
      name: 'Trihp SUV',
      type: 'SUV',
      image: require('../../assets/images/suv.png'),
      seats: 6,
      category: 'premium',
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
    // Remove artificial delay - parse immediately
    console.log('Parsing coordinates...');
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
    
    // Set coordinates ready even if parsing fails - use fallback coordinates
    setCoordinatesReady(true);
    console.log('Coordinates ready!');
  }, [params?.originCoordinates, params?.destinationCoordinates, params?.distance, params?.stops]);

  // Initialize ride data from params or store
  useEffect(() => {
    console.log('RideSelection useEffect triggered');
    const initializeRideData = async () => {
      try {
        console.log('RideSelection - Initializing with params:', {
          rideId: params.rideId,
          pickupAddress: params.pickupAddress,
          destinationAddress: params.destinationAddress,
          estimatedDistance: params.estimatedDistance,
          distance: params.distance,
          estimatedDuration: params.estimatedDuration,
          totalFare: params.totalFare,
        });
        
        let rideInfo = currentRide;
        
        // Validate that we have a ride ID
        const rideId = params.rideId || currentRide?.id || rideInfo?.id;
        
        if (!rideId) {
          console.error('No ride ID found in params or store. Cannot proceed.');
          Alert.alert(
            'Missing Ride Information',
            'No active ride found. Please go back and create a new ride request.',
            [
              {
                text: 'Go Back',
                onPress: () => router.back(),
              }
            ],
            { cancelable: false }
          );
          setLoading(false);
          return;
        }
        
        // If no current ride in store, fetch from database using rideId
        if (!rideInfo || !rideInfo.id) {
          console.log('Fetching ride data from database for rideId:', rideId);
          try {
            const response = await rideRequestAPI.getRideRequest(rideId);
            // Handle different response structures
            rideInfo = response?.data?.data || response?.data || response;
            console.log('Fetched ride data from database:', rideInfo);
            // Set the fetched ride in the store
            if (rideInfo) {
              setCurrentRide(rideInfo);
            }
          } catch (error) {
            console.error('Error fetching ride data:', error);
            // Only fallback to params if we have a valid rideId
            if (rideId && rideId !== 'temp-ride-id') {
              rideInfo = {
                id: rideId,
                pickupAddress: params.pickupAddress || 'Pickup Location',
                dropOffAddress: params.destinationAddress || 'Destination',
                estimatedDistance: parseFloat(params.estimatedDistance || params.distance || '5'),
                estimatedDuration: parseFloat(params.estimatedDuration || '15'),
                totalFare: parseFloat(params.totalFare || '100'),
              };
            } else {
              // No valid ride ID, redirect back
              Alert.alert(
                'Error',
                'Unable to load ride information. Please create a new ride request.',
                [
                  {
                    text: 'Go Back',
                    onPress: () => router.back(),
                  }
                ],
                { cancelable: false }
              );
              setLoading(false);
              return;
            }
          }
        }
        
        // Ensure rideInfo has all required fields
        if (!rideInfo || !rideInfo.id) {
          console.error('Invalid ride info:', rideInfo);
          Alert.alert(
            'Error',
            'Invalid ride information. Please create a new ride request.',
            [
              {
                text: 'Go Back',
                onPress: () => router.back(),
              }
            ],
            { cancelable: false }
          );
          setLoading(false);
          return;
        }

        console.log('Ride info created:', rideInfo);

        setRideData(rideInfo);
        
        // Set duration and arrival time based on estimated duration
        if (rideInfo.estimatedDuration) {
          setDuration(`${Math.round(rideInfo.estimatedDuration)} Min`);
          const arrival = new Date();
          arrival.setMinutes(arrival.getMinutes() + Math.round(rideInfo.estimatedDuration));
          setArrivalTime(arrival.toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: false 
          }));
        }

        setLoading(false);
        console.log('Ride data initialized - Distance:', rideInfo.estimatedDistance, 'km, Duration:', rideInfo.estimatedDuration, 'min');
        console.log('Distance source - params.estimatedDistance:', params.estimatedDistance, 'params.distance:', params.distance);
      } catch (error) {
        console.error('Error initializing ride data:', error);
        setLoading(false);
      }
    };

    // Always initialize with available data
    initializeRideData();
    
    // Ensure loading is set to false after a timeout as fallback
    const timeoutId = setTimeout(() => {
      console.log('Fallback: Setting loading to false after timeout');
      setLoading(false);
    }, 2000);
    
    return () => clearTimeout(timeoutId);
  }, [params.rideId, params.pickupAddress, params.destinationAddress, params.estimatedDistance, params.distance, params.estimatedDuration, params.totalFare, currentRide?.id, setCurrentRide]);

  // Initialize pricing from ride data if available (reduces API calls)
  useEffect(() => {
    if (rideData && rideData.vehicleType && rideData.totalFare) {
      setVehiclePricing(prev => {
        // Only set if not already set to avoid overwriting API results
        if (!prev[rideData.vehicleType]) {
          return {
            ...prev,
            [rideData.vehicleType]: {
              totalFare: rideData.totalFare,
              baseFare: rideData.baseFare,
              perKMCharge: rideData.perKMCharge,
              perMinuteCharge: rideData.perMinuteCharge,
              estimatedDistance: rideData.estimatedDistance,
              estimatedDuration: rideData.estimatedDuration,
            }
          };
        }
        return prev;
      });
    }
  }, [rideData?.vehicleType, rideData?.totalFare]);

  // Calculate pricing lazily - only for visible/main vehicles first, rest on-demand
  // This prevents making 6 API calls immediately when screen loads
  const [pricingCalculated, setPricingCalculated] = useState(false);
  
  // Only calculate pricing for main 3 vehicles on load (not all 6)
  // This reduces initial API calls from 6 to 3
  useEffect(() => {
    if (coordinatesReady && parsedCoordinates.origin && parsedCoordinates.destination && !pricingCalculated) {
      // Delay initial pricing calculation and only calculate for main vehicles
      const timer = setTimeout(() => {
        const mainVehicleTypes = vehicles.map(v => v.type); // Only first 3 vehicles
        calculateVehiclePricing(mainVehicleTypes);
        setPricingCalculated(true);
      }, 800); // Slightly longer delay to reduce initial burst
      
      return () => clearTimeout(timer);
    }
  }, [coordinatesReady, parsedCoordinates.origin, parsedCoordinates.destination, pricingCalculated]);

  // Retry pricing calculation
  const retryPricingCalculation = useCallback(async () => {
    if (retryCount >= 3) {
      Alert.alert(
        'Service Unavailable',
        'Unable to get real-time pricing. Please try again later or contact support.',
        [{ text: 'OK' }]
      );
      return;
    }

    setRetryCount(prev => prev + 1);
    setPricingError(null);
    
    // Clear cache and request queue, then retry
    PricingHelper.clearCache();
    clearRequestQueue();
    
    console.log('Queue stats before retry:', getQueueStats());
    await calculateVehiclePricing();
  }, [retryCount, calculateVehiclePricing]);

  // Calculate pricing for vehicles - optimized to reduce API calls
  const calculateVehiclePricing = useCallback(async (vehicleTypesToCalculate = null) => {
    if (!parsedCoordinates.origin || !parsedCoordinates.destination) {
      console.log('Coordinates not ready for pricing calculation');
      return;
    }

    try {
      setPricingLoading(true);
      
      // If specific vehicles requested, only calculate those
      // Otherwise calculate all (but this should be rare)
      const allVehicles = [...vehicles, ...moreVehicles];
      const vehicleTypes = vehicleTypesToCalculate || allVehicles.map(v => v.type);
      
      console.log(`Calculating pricing for ${vehicleTypes.length} vehicle(s)...`);

      const pricingParams = {
        pickupLatitude: parsedCoordinates.origin.latitude,
        pickupLongitude: parsedCoordinates.origin.longitude,
        dropOffLatitude: parsedCoordinates.destination.latitude,
        dropOffLongitude: parsedCoordinates.destination.longitude,
        estimatedDistance: parsedCoordinates.distance || rideData?.estimatedDistance,
        estimatedDuration: rideData?.estimatedDuration,
      };

      const pricingResults = await PricingHelper.calculatePricesForVehicles(
        pricingParams,
        vehicleTypes
      );

      // Convert results to a map for easy lookup
      const pricingMap = {};
      pricingResults.forEach(result => {
        pricingMap[result.vehicleType] = PricingHelper.formatPricingResult(result);
      });

      setVehiclePricing(pricingMap);
      console.log('Pricing calculated successfully:', pricingMap);
      setPricingError(null);
    } catch (error) {
      console.error('Error calculating vehicle pricing:', error);
      setPricingError(error.message);
      
      // Check if we should use fallback pricing
      if (PricingHelper.shouldUseFallback(error)) {
        console.log('Using fallback pricing due to rate limiting');
        Alert.alert(
          'Pricing Service Busy', 
          'We\'re experiencing high demand. Using estimated pricing for now.',
          [
            { text: 'OK' },
            { text: 'Retry', onPress: retryPricingCalculation }
          ]
        );
      }
      
      // Set fallback pricing only for requested vehicles
      const fallbackPricing = { ...vehiclePricing }; // Keep existing pricing
      vehicleTypes.forEach(vehicleType => {
        if (!fallbackPricing[vehicleType]) {
          fallbackPricing[vehicleType] = {
            totalFare: PricingHelper.getFallbackPrice(vehicleType, parsedCoordinates.distance || 5),
            error: 'Using fallback pricing',
          };
        }
      });
      setVehiclePricing(fallbackPricing);
    } finally {
      setPricingLoading(false);
    }
  }, [parsedCoordinates, rideData]);

  // Calculate price for selected vehicle (updated to use API pricing)
  const calculatePrice = useCallback((vehicle) => {
    const pricing = vehiclePricing[vehicle.type];
    if (pricing && !pricing.error) {
      return pricing.totalFare;
    }
    
    // Fallback to hardcoded pricing if API pricing is not available
    const distance = rideData?.estimatedDistance || 5;
    const duration = rideData?.estimatedDuration || 15;
    
    // Use fallback pricing
    return PricingHelper.getFallbackPrice(vehicle.type, distance);
  }, [vehiclePricing, rideData]);

  // Handle vehicle selection - optimized to reduce API calls
  const handleVehicleSelection = useCallback(async (vehicle) => {
    try {
      console.log('Vehicle selected:', vehicle);
      
      setSelectedVehicle(vehicle);
      
      // Check if pricing exists for this vehicle, if not calculate it on-demand
      if (!vehiclePricing[vehicle.type] && !pricingLoading) {
        console.log(`Pricing not found for ${vehicle.type}, calculating on-demand...`);
        try {
          await calculateVehiclePricing([vehicle.type]);
        } catch (pricingError) {
          console.warn('Failed to calculate pricing on-demand, using fallback');
        }
      }
      
      // Don't update ride request immediately - only update on confirmation
      // This prevents multiple API calls when user clicks different vehicles
      console.log('Vehicle selection updated. Ride will be updated on confirmation.');
      
    } catch (error) {
      console.error('Error handling vehicle selection:', error);
      // Don't show alert for selection - only for confirmation
    }
  }, [vehiclePricing, pricingLoading, calculateVehiclePricing]);

  // Handle confirm ride with auto-matching
  const handleConfirmRide = useCallback(async () => {
    if (!selectedVehicle) {
      Alert.alert('Select Vehicle', 'Please select a vehicle type to continue.');
      return;
    }

    try {
      console.log('Starting ride confirmation with auto-matching...');
      
      // Get ride ID from multiple possible sources
      const rideId = currentRide?.id || rideData?.id || params.rideId;
      
      if (!rideId) {
        Alert.alert('Error', 'No active ride found. Please go back and create a new ride request.');
        return;
      }
      
      // Get pricing data for the selected vehicle
      const pricing = vehiclePricing[selectedVehicle.type];
      const price = calculatePrice(selectedVehicle);
      
      // Update ride request with selected vehicle and pricing BEFORE auto-matching
      console.log('Updating ride request with selected vehicle and pricing...');
      
      const updateData = {
        vehicleType: selectedVehicle.type,
        totalFare: price,
        ...(pricing && !pricing.error && {
          baseFare: pricing.baseFare,
          perKMCharge: pricing.distanceCharge / (pricing.estimatedDistance || 1),
          perMinuteCharge: pricing.timeCharge / (pricing.estimatedDuration || 1),
          surgeMultiplier: pricing.surgeMultiplier,
          tax: pricing.tax,
          bookingFee: pricing.bookingFee,
        }),
      };
      
      // Update the ride request first
      const updatedRide = await updateRideRequest(rideId, updateData);
      console.log('Ride request updated successfully:', updatedRide);
      
      // Update store with updated ride
      const rideInfo = updatedRide?.data || updatedRide || currentRide || rideData;
      if (rideInfo) {
        setCurrentRide(rideInfo);
      }
      
      // Import the auto-matching API
      const { rideRequestAPI } = await import('../../api/rideRequestAPI');
      
      // Prepare ride data for auto-matching (use updated ride data)
      const finalRideData = {
        id: rideId,
        pickup_latitude: rideInfo.pickupLatitude || rideInfo.pickup_latitude,
        pickup_longitude: rideInfo.pickupLongitude || rideInfo.pickup_longitude,
        pickup_location_name: rideInfo.pickupAddress || rideInfo.pickup_location_name,
        drop_latitude: rideInfo.dropOffLatitude || rideInfo.drop_latitude,
        drop_longitude: rideInfo.dropOffLongitude || rideInfo.drop_longitude,
        drop_location_name: rideInfo.dropOffAddress || rideInfo.drop_location_name,
        amount: price?.toString() || rideInfo.totalFare?.toString() || '25',
        distance: rideInfo.estimatedDistance?.toString() || '5.2',
        payment_type: 'cash', // Default payment type
        vehicleType: selectedVehicle.type,
        totalFare: price || rideInfo.totalFare,
        estimatedDistance: rideInfo.estimatedDistance,
        estimatedDuration: rideInfo.estimatedDuration,
        riderId: rideInfo.riderId,
        status: 'SEARCHING_DRIVER'
      };

      console.log('RideSelection - Attempting auto-matching for ride:', rideId);
      
      // Find best drivers and send them notifications (with error handling to prevent rate limit issues)
      try {
        const notificationResult = await rideRequestAPI.findAndNotifyBestDrivers(rideId, {
          maxDistance: 10, // 10km radius
          maxWaitTime: 15, // 15 minutes max wait
          preferredVehicleType: selectedVehicle.type,
          prioritizeByDistance: true,
          prioritizeByRating: true,
          loadBalance: true
        });
        
        console.log('Best drivers found and notified:', notificationResult);
        
        if (notificationResult?.notifiedDrivers > 0) {
          console.log(`Ride request sent to ${notificationResult.notifiedDrivers} best drivers`);
        }
      } catch (notificationError) {
        console.warn('Failed to find and notify best drivers:', notificationError.message);
        // Don't block navigation - just log the error
        // The ride is already created, driver matching can happen in background
      }
      
      console.log('RideSelection - Navigating to FetchingRide with data:', finalRideData);
      
      // Navigate to driver search screen with ride data
      router.push({
        pathname: '/booking/FetchingRide',
        params: { 
          info: JSON.stringify(finalRideData)
        }
      });
    } catch (error) {
      console.error('Error confirming ride:', error);
      Alert.alert('Error', 'Failed to confirm ride. Please try again.');
    }
  }, [selectedVehicle, currentRide, rideData, params.rideId, calculatePrice, updateRideRequest, vehiclePricing, setCurrentRide, router]);

  const originCoordinates = parsedCoordinates.origin || {
    latitude: 4.8666,
    longitude: 6.9745,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };
  const destinationCoordinates = parsedCoordinates.destination || {
    latitude: 4.8766,
    longitude: 6.9845,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };
  const distance = parsedCoordinates.distance || 5;
  const stops = parsedCoordinates.stops || [];


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

  const renderVehicleItem = useCallback((item, isSelected = false) => {
    const pricing = vehiclePricing[item.type];
    const price = calculatePrice(item);
    const isLoading = pricingLoading && !pricing;

    return (
      <TouchableOpacity
        key={item.id}
        style={[
          styles.vehicleCard,
          isSelected && styles.selectedVehicleCard
        ]}
        onPress={() => handleVehicleSelection(item)}
        activeOpacity={0.7}
        disabled={isLoading}
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
          {pricing?.error && (
            <Text style={styles.pricingError}>Using estimated pricing</Text>
          )}
        </View>
        <View style={styles.priceContainer}>
          {isLoading ? (
            <ActivityIndicator size="small" color="#FFD700" />
          ) : (
            <Text style={styles.vehiclePrice}>${price}</Text>
          )}
        </View>
      </TouchableOpacity>
    );
  }, [handleVehicleSelection, arrivalTime, duration, calculatePrice, vehiclePricing, pricingLoading]);

  // Show loading only when actually loading
  if (loading) {
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
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
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
        {loading && !rideData ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#FFD700" />
              <Text style={styles.loadingText}>Finding available rides...</Text>
          </View>
        ) : pricingError && Object.keys(vehiclePricing).length === 0 ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>Unable to load pricing</Text>
              <Text style={styles.errorSubText}>{pricingError}</Text>
              <TouchableOpacity 
                style={styles.retryButton} 
                onPress={retryPricingCalculation}
                disabled={retryCount >= 3}
              >
                <Text style={styles.retryButtonText}>
                  {retryCount >= 3 ? 'Max Retries Reached' : 'Retry Pricing'}
                </Text>
              </TouchableOpacity>
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
  priceContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 60,
  },
  pricingError: {
    fontSize: 12,
    color: '#FFD700',
    fontStyle: 'italic',
    marginTop: 2,
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
    marginBottom: 8,
    textAlign: 'center',
  },
  errorSubText: {
    fontSize: 14,
    color: '#8E8E93',
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
