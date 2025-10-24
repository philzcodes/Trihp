import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import BottomSheet from '@gorhom/bottom-sheet';
import { useLocalSearchParams, useRouter } from 'expo-router';
import LottieView from 'lottie-react-native';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
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
import MapComponent from '../../components/MapComponent';
import MatchingStatsComponent from '../../components/MatchingStatsComponent';
import PaymentModal from '../../components/Modals/PaymentTypeModal';
import TriphButton from '../../components/TriphButton';
import { Colors, Fonts } from '../../constants';
import { showError } from '../../helper/Toaster';

const FetchingRide = () => {
  const paymentMode = [
    { 
      id: '1', 
      image: require('../../assets/images/paymentMode/cash.png'), 
      name: 'cash', 
      label: 'Cash' 
    },
    { 
      id: '2', 
      image: require('../../assets/images/paymentMode/wallet.png'), 
      name: 'wallet', 
      label: 'Trihp Wallet' 
    },
    { 
      id: '3', 
      image: require('../../assets/images/paymentMode/card.png'), 
      name: 'card', 
      label: 'Credit / Debit Card' 
    },
    { 
      id: '4', 
      image: require('../../assets/images/paymentMode/afrimoney.png'), 
      name: 'afrimoney', 
      label: 'AfriMoney' 
    },
  ];
  
  const params = useLocalSearchParams();
  
  // Parse the info parameter if it's a JSON string
  let data = null;
  try {
    if (params?.info) {
      if (typeof params.info === 'string') {
        data = JSON.parse(params.info);
      } else {
        data = params.info;
      }
    } else if (params?.data) {
      // Fallback to data parameter for backward compatibility
      if (typeof params.data === 'string') {
        data = JSON.parse(params.data);
      } else {
        data = params.data;
      }
    }
  } catch (error) {
    console.error('Error parsing info/data parameter:', error);
    data = null;
  }
  
  // Debug logging
  console.log('FetchingRide - Received params:', params);
  console.log('FetchingRide - Parsed data:', data);
  console.log('FetchingRide - Data is null/undefined:', !data);
  console.log('FetchingRide - Will use fallback data:', !data);
  
  const rideId = data?.id;
  const mapRef = useRef(null);
  const router = useRouter();
  const bottomSheetModalRef = useRef(null);
  const snapPoints = useMemo(() => ['45%', '55%', '70%'], []);
  const [bottomSheetHeight, setBottomSheetHeight] = useState(0);
  const [isFetching, setIsFetching] = useState(true);
  const [currentRideId, setCurrentRideId] = useState(rideId);
  const [showMatchingStats, setShowMatchingStats] = useState(false);
  const intervalIdRef = useRef(null);
  const timeoutIdRef = useRef(null);
  const insets = useSafeAreaInsets();
  const { height, width } = useWindowDimensions();
  const aspectRatio = width / height;
  const latitudeDelta = 0.01;
  const longitudeDelta = latitudeDelta * aspectRatio;
  const [paymentModal, setPaymentModal] = useState(false);
  
  // Debug logging for payment modal state
  useEffect(() => {
    console.log('FetchingRide - Payment modal state changed:', paymentModal);
  }, [paymentModal]);
  
  const [paymentMethod, setPaymentMethod] = useState(
    fallbackData?.payment_type 
      ? paymentMode.find((item) => item.name === fallbackData.payment_type) 
      : paymentMode[0]
  );

  const region = useMemo(
    () => ({
      latitude: fallbackData?.pickup_latitude || 4.8666,
      longitude: fallbackData?.pickup_longitude || 6.9745,
      latitudeDelta,
      longitudeDelta,
    }),
    [fallbackData, latitudeDelta, longitudeDelta]
  );

  const handleBottomSheetChange = (index) => {
    const snapPointValue = parseFloat(snapPoints[index]);
    setBottomSheetHeight(height * (snapPointValue / 100));
  };

  const mapHeight = height - bottomSheetHeight;

  const getRideDetails = useCallback(async () => {
    try {
      console.log('Checking for driver acceptance for ride:', rideId);
      
      if (!rideId) {
        console.error('No ride ID provided for driver checking');
        console.log('Available data:', data);
        console.log('Available params:', params);
        
        // Try to get rideId from different sources
        const alternativeRideId = data?.id || params?.rideId || params?.id;
        if (alternativeRideId) {
          console.log('Found alternative ride ID:', alternativeRideId);
          setCurrentRideId(alternativeRideId); // Update the state with the found ride ID
          // Import rideRequestAPI dynamically to avoid circular imports
          const { rideRequestAPI } = await import('../../api/rideRequestAPI');
          const rideRequest = await rideRequestAPI.getRideRequest(alternativeRideId);
          console.log('Current ride request status:', rideRequest);
          
          if (rideRequest.status === 'DRIVER_ASSIGNED' && rideRequest.driverId) {
            console.log('Driver assigned! Driver ID:', rideRequest.driverId);
            
            const driverData = {
              status: 200,
              driver: {
                id: rideRequest.driverId,
                name: rideRequest.driverName || 'Driver',
                phone: rideRequest.driverPhone || '+1234567890',
                rating: 4.8,
                vehicle: {
                  make: 'Vehicle',
                  model: 'Model',
                  year: '2020',
                  color: 'Color',
                  plate: rideRequest.driverVehicleNumber || 'ABC-123',
                  image: require('../../assets/images/TopCar.png')
                },
                location: {
                  latitude: parseFloat(rideRequest.pickupLatitude) + 0.001,
                  longitude: parseFloat(rideRequest.pickupLongitude) + 0.001,
                },
                estimated_arrival: '3-5 minutes',
                distance: '0.8 km'
              },
              ride: {
                id: rideRequest.id,
                pickup_location: rideRequest.pickupAddress || 'Unknown Pickup',
                drop_location: rideRequest.dropOffAddress || 'Unknown Destination',
                amount: rideRequest.totalFare?.toString() || '25',
                distance: rideRequest.estimatedDistance?.toString() || '5.2',
                payment_type: fallbackData?.payment_type || 'cash'
              }
            };
            
            console.log('Driver found and assigned:', driverData);
            
            setIsFetching(false);
            clearInterval(intervalIdRef.current);
            clearTimeout(timeoutIdRef.current);
            router.push('/booking/DriverFoundScreen', { data: driverData });
          } else if (rideRequest.status === 'CANCELLED') {
            console.log('Ride request was cancelled');
            setIsFetching(false);
            clearInterval(intervalIdRef.current);
            clearTimeout(timeoutIdRef.current);
            router.push({
              pathname: '/booking/RideCancelScreen',
              params: { 
                rideId: alternativeRideId,
                reason: 'Ride was cancelled'
              }
            });
          } else {
            console.log('Still waiting for driver. Current status:', rideRequest.status);
          }
        } else {
          console.error('No ride ID found in any parameter');
          setIsFetching(false);
          clearInterval(intervalIdRef.current);
          clearTimeout(timeoutIdRef.current);
          router.push({
            pathname: '/booking/RideCancelScreen',
            params: { 
              rideId: alternativeRideId,
              reason: 'No ride ID found'
            }
          });
        }
        return;
      }

      // Import rideRequestAPI dynamically to avoid circular imports
      const { rideRequestAPI } = await import('../../api/rideRequestAPI');
      
      // Update the current ride ID state
      setCurrentRideId(rideId);
      
      // Check the current status of the ride request
      const rideRequest = await rideRequestAPI.getRideRequest(rideId);
      console.log('Current ride request status:', rideRequest);
      
      // Check if a driver has been assigned
      if (rideRequest.status === 'DRIVER_ASSIGNED' && rideRequest.driverId) {
        console.log('Driver assigned! Driver ID:', rideRequest.driverId);
        
        // Get driver details (you may need to implement this API endpoint)
        // For now, we'll use the driver info from the ride request
        const driverData = {
          status: 200,
          driver: {
            id: rideRequest.driverId,
            name: rideRequest.driverName || 'Driver',
            phone: rideRequest.driverPhone || '+1234567890',
            rating: 4.8, // You may want to get this from driver profile
            vehicle: {
              make: 'Vehicle',
              model: 'Model',
              year: '2020',
              color: 'Color',
              plate: rideRequest.driverVehicleNumber || 'ABC-123',
              image: require('../../assets/images/TopCar.png')
            },
            location: {
              latitude: parseFloat(rideRequest.pickupLatitude) + 0.001,
              longitude: parseFloat(rideRequest.pickupLongitude) + 0.001,
            },
            estimated_arrival: '3-5 minutes',
            distance: '0.8 km'
          },
          ride: {
            id: rideRequest.id,
            pickup_location: rideRequest.pickupAddress || 'Unknown Pickup',
            drop_location: rideRequest.dropOffAddress || 'Unknown Destination',
            amount: rideRequest.totalFare?.toString() || '25',
            distance: rideRequest.estimatedDistance?.toString() || '5.2',
            payment_type: fallbackData?.payment_type || 'cash'
          }
        };
        
        console.log('Driver found and assigned:', driverData);
        
        setIsFetching(false);
        clearInterval(intervalIdRef.current);
        clearTimeout(timeoutIdRef.current);
        router.push('/booking/DriverFoundScreen', { data: driverData });
        
      } else if (rideRequest.status === 'CANCELLED') {
        console.log('Ride request was cancelled');
        setIsFetching(false);
        clearInterval(intervalIdRef.current);
        clearTimeout(timeoutIdRef.current);
        router.push({
          pathname: '/booking/RideCancelScreen',
          params: { 
            rideId: currentRideId || rideId,
            reason: 'Ride was cancelled'
          }
        });
      } else {
        console.log('Still waiting for driver. Current status:', rideRequest.status);
        // Continue polling - driver not assigned yet
      }
      
    } catch (error) {
      console.error('Error checking for driver:', error);
      
      // If it's a network error, continue polling
      // If it's a serious error, stop polling
      if (error.message?.includes('Network Error') || error.message?.includes('timeout')) {
        console.log('Network error, continuing to poll...');
        return;
      }
      
      // For other errors, stop polling and show error
      setIsFetching(false);
      clearInterval(intervalIdRef.current);
      clearTimeout(timeoutIdRef.current);
      
      // Navigate to error screen or show error message
      router.push({
        pathname: '/booking/RideCancelScreen',
        params: { 
          rideId: currentRideId || rideId,
          reason: 'Error finding driver'
        }
      });
    }
   }, [rideId, router, fallbackData, currentRideId]);

  useEffect(() => {
    if (!isFetching) return;

    // Start polling every 3 seconds for driver assignment
    intervalIdRef.current = setInterval(() => {
      getRideDetails();
    }, 3000);

    // Set timeout to 5 minutes (300 seconds) - reasonable time to wait for driver
    timeoutIdRef.current = setTimeout(() => {
      console.log('Timeout reached - no driver found within 5 minutes');
      clearInterval(intervalIdRef.current);
      setIsFetching(false);
      
      // Navigate to cancellation screen with timeout reason
      router.push({
        pathname: '/booking/RideCancelScreen',
        params: { 
          rideId: currentRideId || rideId,
          reason: 'No driver found within 5 minutes'
        }
      });
    }, 300000); // 5 minutes

    return () => {
      clearInterval(intervalIdRef.current);
      clearTimeout(timeoutIdRef.current);
    };
  }, [getRideDetails, isFetching, rideId, router, currentRideId]);

  const handlePaymentMethod = (method) => {
    try {
      console.log('Setting payment method:', method);
      setPaymentMethod(method);
      setPaymentModal(false);
    } catch (error) {
      console.error('Error handling payment method:', error);
      setPaymentModal(false);
    }
  };

  // Provide fallback data if missing to ensure screen renders properly
  const fallbackData = data || {
    id: 'temp-ride-id',
    pickup_latitude: 4.8666,
    pickup_longitude: 6.9745,
    pickup_location_name: 'Pickup Location',
    drop_latitude: 4.8670,
    drop_longitude: 6.9750,
    drop_location_name: 'Destination',
    amount: '25',
    distance: '5.2',
    payment_type: 'cash'
  };

  try {
    return (
      <View style={styles.container}>
        {/* Map Component */}
        <MapComponent
          ref={mapRef}
          style={[styles.map, { height: mapHeight }]}
          initialRegion={region}
          showsUserLocation={true}
          showsMyLocationButton={true}
          markers={[{
            ...region,
            customMarker: (
              <Image 
                source={require('../../assets/images/pin.png')} 
                style={styles.markerImage} 
                resizeMode="contain" 
              />
            )
          }]}
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

        {/* Stats Toggle Button */}
        <Pressable 
          style={[styles.statsButton, { top: Platform.OS === 'ios' ? 60 : 20 }]} 
          onPress={() => setShowMatchingStats(!showMatchingStats)}
        >
          <View style={styles.statsButtonCircle}>
            <Ionicons name="stats-chart" size={20} color={Colors.whiteColor} />
          </View>
        </Pressable>

        {/* Matching Stats Component */}
        <MatchingStatsComponent visible={showMatchingStats} />

        {/* Bottom Sheet */}
        <BottomSheet
          ref={bottomSheetModalRef}
          index={2}
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
              <Text style={styles.modalTitle}>Confirming Your Trip</Text>
              <Text style={styles.modalMessage}>
                Please wait while we find you a driver
              </Text>
            </View>

            {/* Loading Spinner */}
            {isFetching && (
              <View style={styles.lottieContainer}>
                <LottieView 
                  source={require('../../assets/svgIcons/spinner.json')} 
                  autoPlay 
                  loop 
                  style={styles.lottie} 
                />
              </View>
            )}

            {/* Divider */}
            <View style={styles.divider} />

            {/* Location Section */}
            <View style={styles.locationSection}>
              <View style={styles.locationRow}>
                <Ionicons 
                  name="location-sharp" 
                  size={24} 
                  color={Colors.whiteColor} 
                />
                 <Text style={styles.locationText}>
                   {fallbackData?.pickup_location_name || 'Main Peninsular Rd'}
                 </Text>
              </View>
              <Pressable 
                onPress={() => router.push('/booking/SearchScreen')}
                hitSlop={8}
              >
                <Text style={styles.addOrChangeText}>Add or Change</Text>
              </Pressable>
            </View>

            {/* Divider */}
            <View style={styles.divider} />

            {/* Payment Section */}
            <View style={styles.paymentSection}>
              <Pressable 
                style={styles.paymentMethodButton} 
                onPress={() => setPaymentModal(true)}
              >
                <View style={styles.paymentMethodContent}>
                  <Image 
                    source={paymentMethod?.image} 
                    style={styles.paymentImage} 
                    resizeMode="contain" 
                  />
                  <Text style={styles.paymentMethodName}>
                    {paymentMethod?.label || 'Cash'}
                  </Text>
                  <MaterialIcons 
                    name="keyboard-arrow-right" 
                    size={24} 
                    color={Colors.whiteColor} 
                  />
                </View>
              </Pressable>
              
               <Text style={styles.paymentAmount}>
                 ${fallbackData?.amount || '25'}
               </Text>
            </View>

            {/* Divider */}
            <View style={styles.divider} />

            {/* Cancel Button */}
            <View style={styles.buttonContainer}>
              <TriphButton
                text="Cancel Trip"
                extraStyle={styles.cancelButton}
                extraTextStyle={styles.cancelButtonText}
                onPress={async () => {
                  console.log('Cancel button pressed - currentRideId:', currentRideId);
                  console.log('Cancel button pressed - rideId:', rideId);
                  console.log('Cancel button pressed - data:', data);
                  
                  const finalRideId = currentRideId || rideId;
                  console.log('Final rideId for navigation:', finalRideId);
                  
                  if (finalRideId) {
                    try {
                      // Check if ride is already cancelled before navigating
                      const { rideRequestAPI } = await import('../../api/rideRequestAPI');
                      const rideRequest = await rideRequestAPI.getRideRequest(finalRideId);
                      
                      if (rideRequest.status === 'CANCELLED') {
                        console.log('Ride is already cancelled, navigating to dashboard');
                        showError('Ride has already been cancelled');
                        router.push('/(tabs)/Dashboard');
                        return;
                      }
                      
                      router.push({
                        pathname: '/booking/RideCancelScreen',
                        params: { 
                          rideId: finalRideId,
                          reason: 'User cancelled'
                        }
                      });
                    } catch (error) {
                      console.error('Error checking ride status:', error);
                      // Navigate anyway if we can't check status
                      router.push({
                        pathname: '/booking/RideCancelScreen',
                        params: { 
                          rideId: finalRideId,
                          reason: 'User cancelled'
                        }
                      });
                    }
                  } else {
                    console.error('No ride ID available for navigation');
                    showError('Unable to cancel ride - no ride ID found');
                  }
                }}
                bgColor={{ backgroundColor: '#FFD700' }}
              />
            </View>
          </View>
        </BottomSheet>

        {/* Payment Modal */}
        {paymentModal && (
          <PaymentModal
            visible={paymentModal}
            setVisible={setPaymentModal}
             amount={fallbackData?.amount}
            isWallet={false}
            selectedPaymentMethod={paymentMethod}
            setSelectedPaymentMethod={handlePaymentMethod}
          />
        )}
      </View>
    );
  } catch (error) {
    console.error('FetchingRide: Error rendering component:', error);
    return (
      <View style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorTitle}>Error Loading Screen</Text>
          <Text style={styles.errorMessage}>
            Something went wrong. Please try again.
          </Text>
          <Pressable style={styles.errorButton} onPress={() => router.back()}>
            <Text style={styles.errorButtonText}>Go Back</Text>
          </Pressable>
        </View>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  map: {
    width: '100%',
  },
  markerImage: {
    width: 40,
    height: 40,
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

  // Stats Button Styles
  statsButton: {
    position: 'absolute',
    right: 20,
    zIndex: 10,
  },
  statsButtonCircle: {
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

  // Header Section
  headerSection: {
    paddingTop: 10,
    paddingBottom: 15,
    paddingHorizontal: 20,
  },
  modalTitle: {
    ...Fonts.Regular,
    fontSize: 22,
    fontWeight: '600',
    textAlign: 'center',
    color: Colors.whiteColor,
    marginBottom: 8,
  },
  modalMessage: {
    ...Fonts.Regular,
    fontSize: 14,
    textAlign: 'center',
    color: 'rgba(255, 255, 255, 0.6)',
    fontWeight: '400',
  },

  // Loading Spinner
  lottieContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  lottie: {
    width: 80,
    height: 80,
  },

  // Divider
  divider: {
    width: '100%',
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },

  // Location Section
  locationSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 18,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 10,
  },
  locationText: {
    ...Fonts.Regular,
    fontSize: 16,
    color: Colors.whiteColor,
    flex: 1,
  },
  addOrChangeText: {
    ...Fonts.Regular,
    fontSize: 15,
    color: Colors.whiteColor,
    fontWeight: '400',
  },

  // Payment Section
  paymentSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 18,
  },
  paymentMethodButton: {
    flex: 1,
  },
  paymentMethodContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  paymentImage: {
    height: 28,
    width: 28,
  },
  paymentMethodName: {
    ...Fonts.Regular,
    fontSize: 16,
    color: Colors.whiteColor,
    textTransform: 'capitalize',
  },
  paymentAmount: {
    ...Fonts.Regular,
    fontSize: 32,
    fontWeight: '600',
    color: Colors.whiteColor,
  },

  // Button Container
  buttonContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  cancelButton: {
    backgroundColor: '#FFD700',
    borderRadius: 30,
    paddingVertical: 16,
  },
  cancelButtonText: {
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

  // Error State
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorTitle: {
    fontSize: 18,
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 10,
    fontWeight: '600',
  },
  errorMessage: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
    textAlign: 'center',
    marginBottom: 20,
  },
  errorButton: {
    backgroundColor: '#FFD700',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
  },
  errorButtonText: {
    color: '#000000',
    fontWeight: '600',
    fontSize: 16,
  },
});

export default FetchingRide;