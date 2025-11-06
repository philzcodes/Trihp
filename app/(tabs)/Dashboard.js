import Icon from '@expo/vector-icons/AntDesign';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  FlatList,
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Components
import DashBoardInput from '../../components/DashBoardInput';
import DashboardHeader from '../../components/DashboardHeader';

// Constants
import { Colors, Fonts } from '../../constants';

// Store
import useUserStore from '../../store/userStore';

// Helper
import { getRecentRidesHistory } from '../../helper/locationHistory';

// Hooks
import { useRequireAuth } from '../../hooks';

const Dashboard = () => {
  const router = useRouter();
  
  // User store
  const { userData, fetchUser } = useUserStore();
  
  // Banner data - using the same image-based approach
  const bannerData = [
    {
      id: 1,
      image: require('../../assets/images/banner.jpg'),
      title: "Get Out & About"
    },
    {
      id: 2,
      image: require('../../assets/images/banner1.jpg'), // You can replace with different images
      title: "Explore the City"
    },
    {
      id: 3,
      image: require('../../assets/images/banner2.jpg'), // You can replace with different images
      title: "Safe & Reliable"
    }
  ];

  // Banner state
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const bannerRef = useRef(null);
  const screenWidth = Dimensions.get('window').width;
  
  // Recent ride history state
  const [recentRide, setRecentRide] = useState([]);
  
  const [loading, setLoading] = useState(false);
  const [originLocation, setOriginLocation] = useState("Your Current Location");

  // Banner functions
  const handleBannerScroll = (event) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffsetX / screenWidth);
    setCurrentBannerIndex(index);
  };

  const renderBannerItem = ({ item }) => (
    <View style={styles.bannerContainer}>
      <Image 
        source={item.image} 
        resizeMode="contain" 
        style={styles.bannerImage} 
      />
    </View>
  );

  // Direct search navigation
  const handleSearchPress = () => {
    router.push('/booking/SearchScreen', { 
      rides: recentRide,
      initialRegion: {
        latitude: 40.7128,
        longitude: -74.0060,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      }
    });
  };

  // Dummy location function
  const getLocation = async () => {
    try {
      setOriginLocation("New York, NY");
      setLoading(false);
    } catch (error) {
      console.warn('Location error:', error);
      setOriginLocation("Location unavailable");
    }
  };

  // Check for active ride and redirect if found
  const checkActiveRide = async () => {
    try {
      // Get rider ID from user store
      if (!userData || !userData.id) {
        console.log('No user data available, skipping active ride check');
        return false;
      }
      
      const riderId = userData.id;
      console.log('Checking for active ride for rider:', riderId);
      
      // Import the API dynamically to avoid circular imports
      const { rideRequestAPI } = await import('../../api/rideRequestAPI');
      console.log('Making API call to get current ride for rider:', riderId);
      const response = await rideRequestAPI.getCurrentRideForRider(riderId);
      
      console.log('Active ride check response:', response);
      
      if (response && response.data) {
        const activeRide = response.data;
        console.log('Active ride found:', activeRide);
        
        // Navigate to appropriate screen based on ride status
        if (activeRide.status === 'SEARCHING_DRIVER') {
          console.log('Redirecting to FetchingRide screen');
          router.push({
            pathname: '/booking/FetchingRide',
            params: { 
              info: JSON.stringify({
                id: activeRide.id,
                pickup_latitude: activeRide.pickupLatitude,
                pickup_longitude: activeRide.pickupLongitude,
                pickup_location_name: activeRide.pickupAddress,
                drop_latitude: activeRide.dropOffLatitude,
                drop_longitude: activeRide.dropOffLongitude,
                drop_location_name: activeRide.dropOffAddress,
                amount: activeRide.totalFare?.toString() || '25',
                distance: activeRide.estimatedDistance?.toString() || '5.2',
                payment_type: 'cash', // Default payment type
                vehicleType: activeRide.vehicleType,
                totalFare: activeRide.totalFare,
                estimatedDistance: activeRide.estimatedDistance,
                estimatedDuration: activeRide.estimatedDuration,
                riderId: activeRide.riderId,
                status: activeRide.status
              })
            }
          });
          return true; // Indicate that we redirected
        } else if (activeRide.status === 'DRIVER_ASSIGNED') {
          console.log('Redirecting to DriverFoundScreen');
          const driverData = {
            status: 200,
            driver: {
              id: activeRide.driverId,
              name: activeRide.driverName || 'Driver',
              phone: activeRide.driverPhone || '+1234567890',
              rating: 4.8,
              vehicle: {
                make: 'Vehicle',
                model: 'Model',
                year: '2020',
                color: 'Color',
                plate: activeRide.driverVehicleNumber || 'ABC-123',
                image: require('../../assets/images/TopCar.png')
              },
              location: {
                latitude: parseFloat(activeRide.pickupLatitude) + 0.001,
                longitude: parseFloat(activeRide.pickupLongitude) + 0.001,
              },
              estimated_arrival: '3-5 minutes',
              distance: '0.8 km'
            },
            ride: {
              id: activeRide.id,
              pickup_location: activeRide.pickupAddress || 'Unknown Pickup',
              drop_location: activeRide.dropOffAddress || 'Unknown Destination',
              amount: activeRide.totalFare?.toString() || '25',
              distance: activeRide.estimatedDistance?.toString() || '5.2',
              payment_type: 'cash'
            }
          };
          
          router.push('/booking/DriverFoundScreen', { data: driverData });
          return true; // Indicate that we redirected
        } else if (activeRide.status === 'DRIVER_ARRIVED') {
          console.log('Redirecting to DriverArrivedScreen');
          // You can implement DriverArrivedScreen navigation here
          // router.push('/booking/DriverArrivedScreen', { data: activeRide });
        } else if (activeRide.status === 'TRIP_STARTED') {
          console.log('Redirecting to TripInProgressScreen');
          // You can implement TripInProgressScreen navigation here
          // router.push('/booking/TripInProgressScreen', { data: activeRide });
        }
      }
      
      return false; // No active ride found
    } catch (error) {
      console.log('Error checking for active ride:', error);
      console.log('User data available:', !!userData);
      console.log('User ID available:', userData?.id);
      console.log('Is authenticated:', isAuthenticated);
      return false; // Continue with normal dashboard load
    }
  };

  // Load recent rides from history
  const loadRecentRides = async () => {
    setLoading(true);
    try {
      // Get current user data from store (it may have been updated)
      const currentUserData = useUserStore.getState().userData;
      
      // Try to get actual ride history from API first
      if (currentUserData && currentUserData.id) {
        try {
          const { rideRequestAPI } = await import('../../api/rideRequestAPI');
          const response = await rideRequestAPI.getRideByRider(currentUserData.id);
          
          // Handle both response.data and direct response arrays
          const ridesData = response?.data?.data || response?.data || response || [];
          const ridesArray = Array.isArray(ridesData) ? ridesData : [];
          
          if (ridesArray.length > 0) {
            // Transform API response to match expected format
            const formattedRides = ridesArray
              .filter(ride => ride.status === 'TRIP_COMPLETED' || ride.status === 'CANCELLED')
              .slice(0, 2)
              .map(ride => ({
                id: ride.id,
                pickup_location_name: ride.pickupAddress || 'Previous Pickup',
                drop_location_name: ride.dropOffAddress || 'Previous Destination',
                pickup_latitude: parseFloat(ride.pickupLatitude) || 0,
                pickup_longitude: parseFloat(ride.pickupLongitude) || 0,
                drop_latitude: parseFloat(ride.dropOffLatitude) || 0,
                drop_longitude: parseFloat(ride.dropOffLongitude) || 0,
                distance: ride.estimatedDistance ? `${ride.estimatedDistance} km` : '0 km',
                created_at: ride.createdAt || new Date().toISOString()
              }));
            
            if (formattedRides.length > 0) {
              setRecentRide(formattedRides);
              setLoading(false);
              return;
            }
          }
        } catch (apiError) {
          // Only log if it's not a 401 (unauthorized) - that's expected when user is not logged in
          if (apiError?.statusCode !== 401 && apiError?.response?.status !== 401) {
            console.log('Error fetching rides from API, using location history:', apiError.message || apiError);
          }
        }
      }

      // Fallback to location history (works even without authentication)
      const historyRides = await getRecentRidesHistory(2);
      if (historyRides.length > 0) {
        setRecentRide(historyRides);
      } else {
        setRecentRide([]);
      }
    } catch (error) {
      console.error('Error loading rides:', error);
      setRecentRide([]);
    } finally {
      setLoading(false);
    }
  };

  // Require authentication for dashboard
  const { isAuthenticated, userData: authUserData } = useRequireAuth({
    alertTitle: 'Authentication Required',
    alertMessage: 'Please log in to access your dashboard',
  });

  // Effects
  useEffect(() => {
    const initializeDashboard = async () => {
      // Only proceed if user is authenticated
      if (!isAuthenticated || !authUserData?.id) {
        return;
      }

      try {
        // Check for active ride only if user is logged in
        const hasActiveRide = await checkActiveRide();
        
        // Only load dashboard data if no active ride was found
        if (!hasActiveRide) {
          getLocation();
          loadRecentRides();
        }
      } catch (error) {
        console.error('Dashboard initialization error:', error);
        // On error, just load basic dashboard data
        getLocation();
        setRecentRide([]);
      }
    };
    
    initializeDashboard();
  }, [isAuthenticated, authUserData]);

  // Back button handling is now handled globally in _layout.js
  // No local handler needed - global handler will navigate back properly

  // Render Ride Item
  const renderRideItem = ({ item }) => (
    <View style={styles.historyItem}>
      <Icon name="clock-circle" size={20} color={Colors.whiteColor} />
      <TouchableOpacity
        style={styles.historyItemTextContainer}
        onPress={() => {
          if (Platform.OS === 'web') {
            Alert.alert('Map View', 'Map functionality not available on web');
            return;
          }
          
          console.log('Dashboard: Navigating to RideSelection with item:', item);
          router.push('/booking/RideSelection', {
            info: {
              originLocation: item.pickup_location_name,
              destinationLocation: item.drop_location_name,
              originCoordinates: {
                latitude: item.pickup_latitude,
                longitude: item.pickup_longitude,
              },
              destinationCoordinates: {
                latitude: item.drop_latitude,
                longitude: item.drop_longitude,
              },
              distance: item.distance,
            }
          });
        }}
      >
        <Text style={styles.historyItemAddress} numberOfLines={1}>
          {item.drop_location_name}
        </Text>
        <Text style={styles.historyItemSubAddress} numberOfLines={1}>
          {item.pickup_location_name}
        </Text>
      </TouchableOpacity>
    </View>
  );

  // Skeleton Loading Component
  const renderSkeletonItem = () => (
    <View style={styles.skeletonItem}>
      <View style={styles.skeletonIcon} />
      <View style={styles.skeletonTextContainer}>
        <View style={styles.skeletonTextLine} />
        <View style={[styles.skeletonTextLine, { width: '70%' }]} />
      </View>
    </View>
  );


  return (
    <SafeAreaView style={styles.safeArea}>
      <ImageBackground
        source={require('../../assets/images/map-background.png')}
        style={styles.backgroundImage}
        imageStyle={styles.backgroundImageStyle}
        resizeMode="cover"
      >
        <View style={styles.overlay} />
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
          style={{ flex: 1 }}
        >
          <View style={styles.container}>
            <DashboardHeader />
            
            {loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={Colors.yellow} />
              </View>
            ) : (
              <ScrollView 
                showsVerticalScrollIndicator={false} 
                contentContainerStyle={styles.scrollView}
              >
                {/* Swipable Banner */}
                <View style={styles.bannerWrapper}>
                  <FlatList
                    ref={bannerRef}
                    data={bannerData}
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    onScroll={handleBannerScroll}
                    scrollEventThrottle={16}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderBannerItem}
                  />
                  
                  {/* Banner Indicators */}
                  <View style={styles.bannerIndicators}>
                    {bannerData.map((_, index) => (
                      <View
                        key={index}
                        style={[
                          styles.indicator,
                          index === currentBannerIndex && styles.activeIndicator
                        ]}
                      />
                    ))}
                  </View>
                </View>

                {/* Search Input */}
                <DashBoardInput onPress={handleSearchPress} />

                {/* Recent Rides */}
                <View>
                  <FlatList
                    data={loading ? Array(2).fill({}) : recentRide}
                    scrollEnabled={false}
                    keyExtractor={(item, index) => item?.id?.toString() || index.toString()}
                    ListEmptyComponent={() => (
                      <View style={styles.emptyContainer}>
                        <Text style={styles.noRecentRideText}>No recent ride available</Text>
                      </View>
                    )}
                    contentContainerStyle={styles.historyList}
                    renderItem={loading ? renderSkeletonItem : renderRideItem}
                  />
                </View>

              </ScrollView>
            )}
          </View>
        </KeyboardAvoidingView>
      </ImageBackground>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.blackColor,
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  backgroundImageStyle: {
    opacity: 0.3, // Dark opacity for the background image
    transform: [{ scale: 1.2 }], // Zoom in the background image
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.7)', // Additional dark overlay for better contrast
  },
  container: {
    flex: 1,
    padding: 20,
    // paddingBottom: 50,
  },
  scrollView: {
    paddingBottom: 50,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bannerWrapper: {
    marginVertical: 20,
    alignItems: 'center',
  },
  bannerContainer: {
    alignItems: 'center',
  },
  bannerImage: {
    height: 125,
    width: Dimensions.get('window').width - 40, // Full width minus padding
    borderRadius: 20,
  },
  bannerIndicators: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15,
    gap: 8,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.whiteColor,
    opacity: 0.3,
  },
  activeIndicator: {
    backgroundColor: Colors.yellow,
    opacity: 1,
    width: 20, // Wider active indicator
    borderRadius: 10, // Adjust border radius for wider shape
  },
  historyList: {
    padding: 10,
    gap: 10,
    marginTop: 10,
    marginBottom: 30,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'start',
    gap: 20,
    paddingTop: 20,
  },
  historyItemTextContainer: {
    flex: 1,
    marginVertical: -6,
    flexDirection: 'column',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderBottomColor: Colors.whiteColor,
    paddingBottom: 15,
  },
  historyItemAddress: {
    ...Fonts.Regular,
    color: Colors.whiteColor,
    fontSize: 16,
  },
  historyItemSubAddress: {
    ...Fonts.Regular,
    color: Colors.whiteColor,
    fontSize: 13,
    opacity: 0.7,
  },
  noRecentRideText: {
    ...Fonts.Regular,
    color: Colors.yellow,
    textAlign: 'center',
    fontSize: 16,
    padding: 10,
  },
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
  },
  skeletonItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
  },
  skeletonIcon: {
    width: 30,
    height: 30,
    borderRadius: 10,
    backgroundColor: Colors.whiteColor,
  },
  skeletonTextContainer: {
    flex: 1,
    marginLeft: 15,
    justifyContent: 'space-between',
  },
  skeletonTextLine: {
    height: 12,
    width: '100%',
    borderRadius: 4,
    backgroundColor: Colors.whiteColor,
    marginBottom: 6,
  },
});

export default Dashboard;