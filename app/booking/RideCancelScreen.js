import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import Icon3 from 'react-native-vector-icons/MaterialCommunityIcons';
import rideRequestAPI from '../../api/rideRequestAPI';
import BackHeader from '../../components/BackHeader';
import TriphButton from '../../components/TriphButton';
import { Colors, Fonts, STATUS_BAR_HEIGHT } from '../../constants';
import { showError, showSuccess } from '../../helper/Toaster';
import useBookingStore from '../../store/bookingStore';

const RideCancelScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  // Get store functions
  const setRideRequestId = useBookingStore(state => state.setRideRequestId);
  const setCurrentRide = useBookingStore(state => state.setCurrentRide);
  const storeRideId = useBookingStore(state => state.rideRequestId || state.currentRide?.id);
  const getRideIdFn = useBookingStore(state => state.getRideId);
  
  // Get rideId from multiple sources: params, store, or parsed data
  let rideIdFromParams = params?.rideId || params?.id;
  
  // Try to parse data if it's a JSON string
  let parsedData = null;
  if (params?.data && typeof params.data === 'string') {
    try {
      parsedData = JSON.parse(params.data);
      rideIdFromParams = parsedData?.id || parsedData?.rideId || parsedData?.ride?.id || rideIdFromParams;
    } catch (e) {
      // Ignore parsing errors
    }
  } else if (params?.data) {
    parsedData = params.data;
    rideIdFromParams = parsedData?.id || parsedData?.rideId || parsedData?.ride?.id || rideIdFromParams;
  }
  
  // Final rideId from all sources
  const rideId = rideIdFromParams || storeRideId || (getRideIdFn ? getRideIdFn() : null);
  
  // Set ride ID in store when available
  useEffect(() => {
    if (rideId && rideId !== storeRideId) {
      setRideRequestId(rideId);
      if (parsedData) {
        setCurrentRide(parsedData);
      }
    }
  }, [rideId, storeRideId, parsedData, setRideRequestId, setCurrentRide]);
  
  // Debug logging (only in dev)
  if (__DEV__) {
    console.log('RideCancelScreen - Received params:', params);
    console.log('RideCancelScreen - Parsed data:', parsedData);
    console.log('RideCancelScreen - Extracted rideId from params:', rideIdFromParams);
    console.log('RideCancelScreen - Store rideId:', storeRideId);
    console.log('RideCancelScreen - Final rideId:', rideId);
  }
  
  const { isFetching, reason } = params || {};

  const [loading, setLoading] = useState(false);
  const [hasAttemptedCancel, setHasAttemptedCancel] = useState(false);
  const reasons = [
    { id: 1, name: 'Driver ask to complete trip offline' },
    { id: 2, name: 'Vehicle arrived different from description in-app' },
    { id: 3, name: 'Could not find driver' },
    { id: 4, name: 'Wating time was to long' },
    { id: 5, name: 'Driver not getting closer' },
    { id: 6, name: 'Driver asked me to cancel' },
    { id: 8, name: 'Another issue' },
  ];

  const [rideCancelReason, setRideCancelReason] = useState(reasons[0]);

  const cancelRide = useCallback(async () => {
    try {
      // Prevent duplicate cancellation attempts
      if (hasAttemptedCancel) {
        console.log('Cancellation already attempted, preventing duplicate');
        return;
      }

      // Final attempt to get rideId - check all sources (re-check store in case it was updated)
      const currentStoreRideId = useBookingStore.getState().rideRequestId || useBookingStore.getState().currentRide?.id;
      const finalRideId = rideId || rideIdFromParams || storeRideId || currentStoreRideId || (getRideIdFn ? getRideIdFn() : null) || params?.rideId || params?.id;
      
      if (!finalRideId) {
        console.error('No ride ID provided for cancellation');
        console.error('Available params:', params);
        console.error('Parsed data:', parsedData);
        console.error('Store rideId:', storeRideId);
        console.error('Current store rideId:', currentStoreRideId);
        showError('No ride ID found. Cannot cancel ride. Please go back and try again.');
        return;
      }
      
      if (__DEV__) {
        console.log('Using rideId for cancellation:', finalRideId);
      }
      setHasAttemptedCancel(true); // Mark as attempted

      // Call the real API to cancel the ride
      const cancellationData = {
        cancellationReason: rideCancelReason?.name || reason || 'User cancelled',
        status: 'CANCELLED'
      };
      
      const response = await rideRequestAPI.cancelRide(finalRideId, cancellationData);
      if (__DEV__) {
        console.log('Ride cancellation response:', response);
      }
      
      showSuccess('Ride has been cancelled successfully');
      router.push('/(tabs)/Dashboard');
      
    } catch (error) {
      console.error('Error cancelling ride:', error);
      
      // Handle "already cancelled" case gracefully
      if (error.message?.includes('already cancelled') || 
          error.message?.includes('Ride is already cancelled') ||
          error.response?.data?.message?.includes('already cancelled')) {
        console.log('Ride was already cancelled, showing success message');
        showSuccess('Ride has been cancelled');
        router.push('/(tabs)/Dashboard');
      } else {
        showError(error.message || 'Failed to cancel ride. Please try again.');
        setHasAttemptedCancel(false); // Allow retry for other errors
      }
    } finally {
      setLoading(false);
    }
  }, [rideId, rideIdFromParams, storeRideId, getRideIdFn, router, rideCancelReason, reason, params, hasAttemptedCancel]);

  const handleCancelRide = () => {
    if (hasAttemptedCancel || loading) {
      console.log('Cancellation already in progress or completed');
      return;
    }
    setLoading(true);
    cancelRide();
  };

  return (
    <View style={[styles.container, { paddingTop: STATUS_BAR_HEIGHT + 20 }]}>
      <BackHeader title="Ride Query" onPress={() => router.back()} />
      <View style={styles.container}>
        <Text style={styles.headerText}>Select the reason </Text>
        <FlatList
          data={reasons}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContainer}
          renderItem={({ item }) => (
            <Pressable
              style={[styles.reasonItem, rideCancelReason?.id === item?.id && styles.selectedReasonItem]}
              onPress={() => setRideCancelReason(item)}
            >
              <Icon3 name={rideCancelReason?.id === item?.id ? 'radiobox-marked' : 'radiobox-blank'} size={22} color={Colors.yellow} />
              <Text style={styles.reasonText}>{item.name}</Text>
            </Pressable>
          )}
        />
        <View style={styles.buttonContainer}>
            <TriphButton 
              text={hasAttemptedCancel ? "Ride Cancelled" : "Cancel Ride"} 
              onPress={handleCancelRide} 
              bgColor={{ backgroundColor: Colors.yellow }} 
              loading={loading}
              disabled={hasAttemptedCancel || loading}
            />
        </View>
      </View>
    </View>
  );
};

export default RideCancelScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.blackColor,
  },
  headerText: {
    ...Fonts.GrandMedium,
    fontSize: 24,
    color: Colors.whiteColor,
    textAlign: 'center',
    marginVertical: 10,
    marginHorizontal: 10,
  },
  listContainer: {
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  reasonItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: Colors.grey10,
    borderRadius: 50,
    marginBottom: 15,
  },
  selectedReasonItem: {
    backgroundColor: Colors.grey12,
  },
  reasonText: {
    ...Fonts.TextBold,
    color: Colors.whiteColor,
    marginLeft: 10,
  },
  buttonContainer: {
    width: '100%',
    padding: 20,
  },
});
