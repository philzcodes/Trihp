import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import Icon3 from 'react-native-vector-icons/MaterialCommunityIcons';
import rideRequestAPI from '../../api/rideRequestAPI';
import BackHeader from '../../components/BackHeader';
import TriphButton from '../../components/TriphButton';
import { Colors, Fonts, STATUS_BAR_HEIGHT } from '../../constants';
import { showError, showSuccess } from '../../helper/Toaster';

const RideCancelScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { rideId, isFetching, reason } = params || {};

  // Debug logging
  console.log('RideCancelScreen - Received params:', params);
  console.log('RideCancelScreen - Extracted rideId:', rideId);
  console.log('RideCancelScreen - Extracted reason:', reason);
  console.log('RideCancelScreen - Params keys:', Object.keys(params));
  console.log('RideCancelScreen - Params values:', Object.values(params));

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

      // Try to get rideId from multiple sources
      const finalRideId = rideId || params?.rideId || params?.id;
      
      if (!finalRideId) {
        console.error('No ride ID provided for cancellation');
        console.error('Available params:', params);
        showError('No ride ID found. Cannot cancel ride.');
        return;
      }
      
      console.log('Using rideId for cancellation:', finalRideId);
      setHasAttemptedCancel(true); // Mark as attempted

      console.log('Canceling ride:', {
        rideId: finalRideId,
        reason: rideCancelReason?.name,
        timestamp: new Date().toISOString()
      });
      
      // Call the real API to cancel the ride
      const cancellationData = {
        cancellationReason: rideCancelReason?.name || 'User cancelled',
        status: 'CANCELLED'
      };
      
      const response = await rideRequestAPI.cancelRide(finalRideId, cancellationData);
      console.log('Ride cancellation response:', response);
      
      showSuccess('Ride has been cancelled successfully');
      router.push('/(tabs)/Dashboard');
      
    } catch (error) {
      console.error('Error cancelling ride:', error);
      
      // Handle "already cancelled" case gracefully
      if (error.message?.includes('already cancelled') || 
          error.message?.includes('Ride is already cancelled')) {
        console.log('Ride was already cancelled, showing success message');
        showSuccess('Ride has been cancelled');
        router.push('/(tabs)/Dashboard');
      } else {
        showError('Failed to cancel ride. Please try again.');
        setHasAttemptedCancel(false); // Allow retry for other errors
      }
    } finally {
      setLoading(false);
    }
  }, [rideId, router, rideCancelReason, params, hasAttemptedCancel]);

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
