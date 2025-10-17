import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import Icon3 from 'react-native-vector-icons/MaterialCommunityIcons';
import BackHeader from '../../components/BackHeader';
import TriphButton from '../../components/TriphButton';
import { Colors, Fonts, STATUS_BAR_HEIGHT } from '../../constants';
import { showError } from '../../helper/Toaster';

const RideCancelScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { rideId, setIsFetching } = params || {};

  const [loading, setLoading] = useState(false);
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
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Dummy ride cancellation - no real API call
      console.log('Dummy ride cancellation:', {
        rideId,
        reason: rideCancelReason?.name,
        timestamp: new Date().toISOString()
      });
      
      // Simulate successful cancellation
      setIsFetching(false);
      showError('Ride has been canceled');
      router.push('/(tabs)/Dashboard', { radius: 10 });
      
    } catch (error) {
      setLoading(false);
      showError('Error canceling ride');
      console.error('Error in dummy ride cancellation:', error);
    }
  }, [rideId, router, rideCancelReason, setIsFetching]);

  const handleCancelRide = () => {
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
          <TriphButton text="Cancel Ride" onPress={handleCancelRide} bgColor={{ backgroundColor: Colors.yellow }} loading={loading} />
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
