import Icon from '@expo/vector-icons/AntDesign';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  BackHandler,
  Dimensions,
  FlatList,
  Image,
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

const Dashboard = () => {
  const router = useRouter();
  
  // User store
  const { userData, fetchUser, isAuthenticated } = useUserStore();
  
  // Banner data - using the same image-based approach
  const bannerData = [
    {
      id: 1,
      image: require('../../assets/images/banner.jpg'),
      title: "Get Out & About"
    },
    {
      id: 2,
      image: require('../../assets/images/banner2.jpg'), // You can replace with different images
      title: "Explore the City"
    },
    {
      id: 3,
      image: require('../../assets/images/banner.jpg'), // You can replace with different images
      title: "Safe & Reliable"
    }
  ];

  // Banner state
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const bannerRef = useRef(null);
  const screenWidth = Dimensions.get('window').width;
  
  // Dummy data states
  const [recentRide, setRecentRide] = useState([
    {
      id: 1,
      pickup_location_name: "123 Main St",
      drop_location_name: "456 Central Ave",
      pickup_latitude: 40.7128,
      pickup_longitude: -74.0060,
      drop_latitude: 40.7328,
      drop_longitude: -74.0260,
      distance: "5.2 km",
      created_at: new Date().toISOString()
    },
    {
      id: 2,
      pickup_location_name: "789 Broadway",
      drop_location_name: "321 Park Ave",
      pickup_latitude: 40.7228,
      pickup_longitude: -74.0160,
      drop_latitude: 40.7428,
      drop_longitude: -74.0360,
      distance: "3.8 km",
      created_at: new Date(Date.now() - 86400000).toISOString()
    }
  ]);
  
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
        resizeMode="cover" 
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

  // Dummy recent rides
  const loadRecentRides = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setLoading(false);
    } catch (error) {
      console.log('Error loading rides:', error);
      setLoading(false);
    }
  };

  // Effects
  useEffect(() => {
    const initializeDashboard = async () => {
      try {
        // First fetch user data
        console.log('Dashboard: Fetching user data...');
        await fetchUser();
        
        // Small delay to ensure user data is available
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Then check for active ride
        console.log('Dashboard: Checking for active ride...');
        const hasActiveRide = await checkActiveRide();
        
        // Only load dashboard data if no active ride was found
        if (!hasActiveRide) {
          console.log('Dashboard: No active ride found, loading dashboard data...');
          getLocation();
          loadRecentRides();
        } else {
          console.log('Dashboard: Active ride found, skipping dashboard data load');
        }
      } catch (error) {
        console.error('Dashboard initialization error:', error);
        // Fallback: load dashboard data anyway
        getLocation();
        loadRecentRides();
      }
    };
    
    initializeDashboard();
  }, []);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        BackHandler.exitApp();
        return true;
      }
    );
    return () => backHandler.remove();
  }, []);

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

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.blackColor,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.blackColor,
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