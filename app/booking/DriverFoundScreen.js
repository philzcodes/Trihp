import BottomSheet from '@gorhom/bottom-sheet';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Image, Linking, Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Entypo';
import Icon2 from 'react-native-vector-icons/Ionicons';
import { MapComponent } from '../../components';
import TriphButton from '../../components/TriphButton';
import { Colors, Fonts } from '../../constants';
import { calculateDropOffTime } from '../../helper/calculateDropOffTime';
import { showError, showSucess, showWarning } from '../../helper/Toaster';
import useBookingStore from '../../store/bookingStore';
import useUserStore from '../../store/userStore';

const DriverFoundScreen = () => {
  const params = useLocalSearchParams();
  const data = params?.data;
  const mapRef = useRef(null);
  const { height } = useWindowDimensions();
  const router = useRouter();
  const bottomSheetModalRef = useRef(null);
  const insets = useSafeAreaInsets();
  const rideID = data?.data?.id || data?.ride?.id;
  
  // Zustand stores
  const { userData, fetchUser } = useUserStore();
  const { 
    driverInfo, 
    setDriverInfo, 
    currentRide, 
    setCurrentRide,
    rideStartStatus,
    setRideStartStatus,
    durationMinutes,
    setDurationMinutes,
    dropOffTime,
    setDropOffTime,
    pickupTime,
    setPickupTime,
    driverCoordinates,
    setDriverCoordinates
  } = useBookingStore();
  
  const [ratingModal, setRatingModal] = useState(false);
  const [rating, setRating] = useState(0);
  const [ratingMessage, setRatingMessage] = useState('');
  const [rideCancelModal, setRideCancelModal] = useState(false);
  
  const riderUser = userData?.data;

  const snapPoints = useMemo(() => ['40%', '60%'], []);
  const [bottomSheetHeight, setBottomSheetHeight] = useState(0);

  const mapHeight = height - bottomSheetHeight;
  const handleBottomSheetChange = (index) => {
    setBottomSheetHeight(height * 0.4);
  };

  // Initialize Zustand store with route data
  useEffect(() => {
    if (data) {
      try {
        setDriverInfo(data?.driver);
        setCurrentRide(data?.data || data?.ride);
        if (data?.driver?.latitude && data?.driver?.longitude) {
          setDriverCoordinates({
            latitude: parseFloat(data.driver.latitude),
            longitude: parseFloat(data.driver.longitude),
          });
        }
      } catch (error) {
        console.error('Error initializing driver data:', error);
      }
    }
  }, [data, setDriverInfo, setCurrentRide, setDriverCoordinates]);
  const pickupCoordinates = currentRide ? {
    latitude: parseFloat(currentRide.pickup_latitude || currentRide.data?.pickup_latitude) || 4.8666,
    longitude: parseFloat(currentRide.pickup_longitude || currentRide.data?.pickup_longitude) || 6.9745,
  } : null;
  
  const dropUpCoordinates = currentRide ? {
    latitude: parseFloat(currentRide.drop_latitude || currentRide.data?.drop_latitude) || 4.8666,
    longitude: parseFloat(currentRide.drop_longitude || currentRide.data?.drop_longitude) || 6.9745,
  } : null;

  const isFetching = useRef(false);

  useEffect(() => {
    // Fetch user data when component mounts
    fetchUser();
  }, [fetchUser]);

  const calculateRegion = useCallback(() => {
    if (!driverCoordinates) return null;

    const targetCoordinates = rideStartStatus ? dropUpCoordinates : pickupCoordinates || driverCoordinates;

    const maxLat = Math.max(driverCoordinates.latitude, targetCoordinates.latitude);
    const minLat = Math.min(driverCoordinates.latitude, targetCoordinates.latitude);
    const minLon = Math.min(driverCoordinates.longitude, targetCoordinates.longitude);
    const maxLon = Math.max(driverCoordinates.longitude, targetCoordinates.longitude);
    const midLat = (minLat + maxLat) / 2;
    const midLon = (minLon + maxLon) / 2;
    const deltaLat = maxLat - minLat;
    const deltaLon = maxLon - minLon;

    return {
      latitude: midLat,
      longitude: midLon,
      latitudeDelta: pickupCoordinates || dropUpCoordinates ? deltaLat * 1.3 : deltaLat * 1.3,
      longitudeDelta: pickupCoordinates || dropUpCoordinates ? deltaLon * 1.3 : deltaLon * 1.3,
    };
  }, [driverCoordinates, pickupCoordinates, dropUpCoordinates, rideStartStatus]);

  useEffect(() => {
    if (driverCoordinates && mapRef.current) {
      try {
        const region = calculateRegion();
        if (region) {
          mapRef.current.animateToRegion(region, 1500);
        }
      } catch (error) {
        console.error('Error animating to region:', error);
      }
    }
  }, [driverCoordinates, pickupCoordinates, dropUpCoordinates, rideStartStatus]);

  const intervalIdRef = useRef(null);

  useEffect(() => {
    intervalIdRef.current = setInterval(getRideDetails, 2000);

    return () => {
      clearInterval(intervalIdRef.current);
    };
  }, [getRideDetails]);

  const getRideDetails = useCallback(async () => {
    if (isFetching.current) return;
    isFetching.current = true;
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Dummy ride details - no real API call
      const dummyRideData = {
        status: 200,
        data: {
          id: rideID,
          start_trihp_status: 0, // 0 = pickup, 1 = started, 2 = completed
          reached_driver_status: 1,
          status: 1, // 1 = active, 3 = cancelled
          pickup_latitude: currentRide?.pickup_latitude || 4.8666,
          pickup_longitude: currentRide?.pickup_longitude || 6.9745,
          drop_latitude: currentRide?.drop_latitude || 4.8666,
          drop_longitude: currentRide?.drop_longitude || 6.9745,
        },
        driver: {
          id: driverInfo?.id || 'dummy_driver_123',
          first_name: driverInfo?.first_name || 'John',
          phone_number: driverInfo?.phone_number || '+1234567890',
          latitude: (driverCoordinates?.latitude || 4.8666) + (Math.random() - 0.5) * 0.001,
          longitude: (driverCoordinates?.longitude || 6.9745) + (Math.random() - 0.5) * 0.001,
          vehicle_category_id: driverInfo?.vehicle_category_id || 1,
          rating: 4.8,
        }
      };
      
      console.log('Dummy ride details:', dummyRideData);
      
      setCurrentRide(dummyRideData.data);
      if (dummyRideData.data.start_trihp_status !== 0) {
        setRideStartStatus(true);
      }
      
      const driver = dummyRideData.driver;
      setDriverInfo(driver);
      setDriverCoordinates({
        latitude: parseFloat(driver.latitude),
        longitude: parseFloat(driver.longitude),
      });

      // Simulate ride completion after some time
      if (Math.random() < 0.1) { // 10% chance to complete ride
        clearInterval(intervalIdRef.current);
        router.push('/(tabs)/Dashboard', { rideId: rideID });
      }

      // Simulate ride cancellation (very low chance)
      if (Math.random() < 0.05) { // 5% chance to cancel
        showError('Ride is canceled by the driver');
        clearInterval(intervalIdRef.current);
        router.push('/(tabs)/Dashboard');
      }
      
    } catch (error) {
      console.log('Error in dummy ride details:', error);
    } finally {
      isFetching.current = false;
    }
  }, [rideID, router, currentRide, driverInfo, driverCoordinates]);

  const renderDriverMarker = () => {
    // Simplified marker rendering - return null to avoid Marker component issues
    return null;
  };

  const handleChat = async () => {
    const user = await AsyncStorage.getItem('userDetail');
    const userInfo = JSON.parse(user);
    try {
      // Note: Firebase integration would need to be set up for chat functionality
      showWarning('Chat functionality requires Firebase setup');
    } catch (error) {
      console.error('Error in createChatList:', error);
    }
  };

  const startTriph = async () => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Dummy start trip - no real API call
      console.log('Dummy start trip:', {
        rideId: rideID,
        timestamp: new Date().toISOString()
      });
      
      // Simulate successful trip start
      bottomSheetModalRef.current?.snapToIndex(0);
      showSucess('Trip started successfully!');
      setRideStartStatus(true);
      
    } catch (error) {
      console.log('Error in dummy start trip:', error);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: Colors.blackColor }}>
      <MapComponent
        ref={mapRef}
        style={{
          height: mapHeight,
          width: '100%',
        }}
        initialRegion={calculateRegion()}
        originMarker={currentRide?.start_trihp_status == 0 ? {
          ...pickupCoordinates,
          customMarker: (
            <Image source={require('../../assets/images/originLocation.png')} style={{ width: 22, height: 30 }} resizeMode="contain" />
          )
        } : {
          ...dropUpCoordinates,
          customMarker: (
            <Image source={require('../../assets/images/originLocation.png')} style={{ width: 22, height: 30 }} resizeMode="contain" />
          )
        }}
        driverMarkers={driverCoordinates ? [{
          ...driverCoordinates,
          customMarker: renderDriverMarker()
        }] : []}
        showDirections={true}
        originCoordinates={driverCoordinates}
        destinationCoordinates={currentRide?.start_trihp_status == 0 ? pickupCoordinates : dropUpCoordinates}
        directionsStrokeWidth={6}
        directionsStrokeColor="#000"
        onDirectionsReady={(result) => {
          try {
            if (currentRide?.start_trihp_status == 0) {
              const duration = result.legs[0].duration.text;
              setPickupTime(duration);
            } else {
              const duration = result.legs[0].duration.text;
              const durationParts = duration.split(' ');
              const durationMins = parseInt(durationParts[0]);
              setDurationMinutes(durationMins);
              setDropOffTime(calculateDropOffTime(durationMins));
            }
          } catch (error) {
            console.error('Error processing directions:', error);
          }
        }}
      />
      <BottomSheet
        ref={bottomSheetModalRef}
        index={0}
        snapPoints={snapPoints}
        enablePanDownToClose={false}
        handleIndicatorStyle={styles.bottomSheetHandleIndicator}
        backgroundStyle={styles.bottomSheetBackground}
        enableOverDrag={false}
        onChange={handleBottomSheetChange}
      >
        <View style={{ paddingVertical: 20 }}>
          <Text
            style={{
              ...Fonts.TextBold,
              fontSize: 20,
              textAlign: 'center',
              marginBottom: 10,
            }}
          >
            {currentRide?.start_trihp_status === 0 ? `Pickup-up in ${pickupTime}` : `Drop off by ${dropOffTime}`}
          </Text>
          {currentRide?.start_trihp_status !== 1 && (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                backgroundColor: Colors.grey12,
                padding: 10,
                borderRadius: 10,
                margin: 20,
              }}
            >
              <Text style={{ ...Fonts.TextBold, fontSize: 15 }}>Trip Detail</Text>
              <Pressable
                style={{
                  padding: 10,
                  backgroundColor: Colors.grey10,
                  borderRadius: 5,
                }}
                onPress={() => router.push('/booking/RideCancelScreen', { data: currentRide })}
              >
                <Icon name="info-with-circle" size={20} color={Colors.whiteColor} />
              </Pressable>
            </View>
          )}
          <View style={{ height: 2, backgroundColor: Colors.grey11, width: '100%' }} />
          <View style={{ margin: 20, flexDirection: 'row', alignItems: 'center' }}>
            <View style={{ gap: 10, flex: 1 }}>
              <Text style={{ ...Fonts.TextBold, fontSize: 15 }}>UP80ED9262</Text>
              <Text style={{ ...Fonts.Regular, fontSize: 15 }}>Maruti Suzuki Swift Dzire</Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
              }}
            >
              <Image
                source={
                  driverInfo?.vehicle_category_id === 1
                    ? require('../../assets/images/car.png')
                    : driverInfo?.vehicle_category_id === 2
                    ? require('../../assets/images/bike.png')
                    : driverInfo?.vehicle_category_id === 3
                    ? require('../../assets/images/auto.png')
                    : driverInfo?.vehicle_category_id === 4
                    ? require('../../assets/images/lite.png')
                    : driverInfo?.vehicle_category_id === 5
                    ? require('../../assets/images/suv.png')
                    : require('../../assets/images/luxe.png')
                }
                style={{ height: 50, width: 100 }}
                resizeMode="contain"
              />
            </View>
          </View>
          <View
            style={{
              paddingHorizontal: 20,
              paddingBottom: 20,
              gap: 10,
              paddingTop: 10,
            }}
          >
            <Text style={{ ...Fonts.Regular, textAlign: 'center' }}>{driverInfo?.first_name} is your Driver</Text>
            <View
              style={{
                padding: 8,
                backgroundColor: Colors.grey12,
                borderRadius: 5,
                flexDirection: 'row',
                alignItems: 'center',
                gap: 5,
                alignSelf: 'center',
              }}
            >
              <Icon name="star" size={13} color={Colors.whiteColor} />
              <Text style={{ ...Fonts.Regular, fontSize: 13 }}>{data?.review?.rating}</Text>
            </View>
          </View>
          <View
            style={{
              flexDirection: 'row',
              gap: 10,
              alignItems: 'center',
              marginBottom: 20,
              paddingHorizontal: 20,
            }}
          >
            <Pressable
              style={{
                padding: 15,
                backgroundColor: Colors.grey11,
                borderRadius: 50,
                flex: 0.7,
              }}
              onPress={() => {
                handleChat();
              }}
            >
              <Text style={{ ...Fonts.Regular, fontSize: 12 }}>Any message for driver ?</Text>
            </Pressable>
            <Pressable
              style={{
                padding: 10,
                backgroundColor: Colors.grey11,
                borderRadius: 50,
              }}
              onPress={() => Linking.openURL(`tel:${driverInfo?.phone_number}`)}
            >
              <Icon2 name="call" size={16} color={Colors.whiteColor} />
            </Pressable>
          </View>
          <View style={{ height: 2, backgroundColor: Colors.grey11, width: '100%' }} />

          {currentRide?.reached_driver_status === 1 && currentRide?.start_trihp_status === 0 && (
            <TriphButton
              text="I Have Verified My Ride"
              extraStyle={{
                margin: 10,
                borderRadius: 10,
              }}
              onPress={() => {
                startTriph();
              }}
            />
          )}
        </View>
      </BottomSheet>
    </View>
  );
};

export default DriverFoundScreen;

const styles = StyleSheet.create({
  bottomSheetHandleIndicator: {
    backgroundColor: Colors.grey9,
    width: 30,
    height: 3,
    marginTop: 5,
  },
  bottomSheetBackground: {
    backgroundColor: Colors.blackColor,
    borderRadius: 20,
  },
});
