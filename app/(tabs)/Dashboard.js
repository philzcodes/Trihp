import Icon from '@expo/vector-icons/AntDesign';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  BackHandler,
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

const Dashboard = () => {
  const router = useRouter();
  
  
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

  // Direct search navigation
  const handleSearchPress = () => {
    router.push('/search', { 
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
    getLocation();
    loadRecentRides();
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
      <Icon name="clockcircle" size={20} color={Colors.whiteColor} />
      <TouchableOpacity
        style={styles.historyItemTextContainer}
        onPress={() => {
          if (Platform.OS === 'web') {
            Alert.alert('Map View', 'Map functionality not available on web');
            return;
          }
          
          router.push('/ride-selection', {
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
              {/* Banner */}
              <View style={styles.bannerContainer}>
                <Image 
                  source={require('../../assets/images/banner.jpg')} 
                  resizeMode="cover" 
                  style={styles.bannerImage} 
                />
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
  bannerContainer: {
    marginVertical: 20,
    alignItems: 'center',
  },
  bannerImage: {
    height: 125,
    width: '100%',
    borderRadius: 20,
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