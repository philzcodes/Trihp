import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BackButton } from '../../components';
import { Colors, Fonts } from '../../constants';

const RideHistory = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // Mock data - in a real app, this would come from an API
  const [rideHistory] = useState([
    {
      id: 1,
      pickup_location: 'Victoria Island, Lagos',
      drop_location: 'Ikoyi, Lagos',
      date: '2024-01-15',
      time: '14:30',
      amount: '₦1,200',
      status: 'completed', // completed, cancelled
      driver_name: 'John Doe',
      vehicle_info: 'Toyota Camry - ABC 123 XY',
    },
    {
      id: 2,
      pickup_location: 'Lekki Phase 1, Lagos',
      drop_location: 'Surulere, Lagos',
      date: '2024-01-14',
      time: '09:15',
      amount: '₦2,100',
      status: 'completed',
      driver_name: 'Jane Smith',
      vehicle_info: 'Honda Accord - DEF 456 AB',
    },
    {
      id: 3,
      pickup_location: 'Ikoyi, Lagos',
      drop_location: 'Victoria Island, Lagos',
      date: '2024-01-13',
      time: '18:45',
      amount: '₦1,500',
      status: 'cancelled',
      driver_name: 'Mike Johnson',
      vehicle_info: 'Nissan Altima - GHI 789 CD',
    },
  ]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  const handleViewDetails = (ride) => {
    Alert.alert('Ride Details', `Ride ID: ${ride.id}\nDriver: ${ride.driver_name}\nVehicle: ${ride.vehicle_info}`);
  };

  const handleRideAgain = (ride) => {
    Alert.alert('Ride Again', `Booking ride from ${ride.pickup_location} to ${ride.drop_location}`);
    // In a real app, this would navigate to ride selection with pre-filled locations
  };

  const handleRefresh = () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  };

  const renderRideItem = ({ item }) => (
    <View style={styles.rideItem}>
      <View style={styles.statusContainer}>
        <Text style={[
          styles.statusText,
          { color: item.status === 'completed' ? Colors.green : Colors.red }
        ]}>
          {item.status === 'completed' ? 'Completed' : 'Cancelled'}
        </Text>
      </View>

      <View style={styles.routeContainer}>
        <View style={styles.routeIcon}>
          <Ionicons name="radio-button-on" size={20} color={Colors.red} />
          <View style={styles.routeLine} />
          <Ionicons name="location" size={20} color={Colors.green} />
        </View>
        <View style={styles.routeText}>
          <Text style={styles.pickupText} numberOfLines={2}>
            {item.pickup_location}
          </Text>
          <Text style={styles.dropText} numberOfLines={2}>
            {item.drop_location}
          </Text>
        </View>
      </View>

      <View style={styles.rideDetails}>
        <Text style={styles.dateText}>
          {formatDate(item.date)} at {item.time}
        </Text>
        <Text style={styles.amountText}>{item.amount}</Text>
      </View>

      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={[styles.actionButton, styles.viewDetailsButton]}
          onPress={() => handleViewDetails(item)}
        >
          <Text style={styles.viewDetailsText}>View Details</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.rideAgainButton]}
          onPress={() => handleRideAgain(item)}
        >
          <Text style={styles.rideAgainText}>Ride Again</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="car" size={64} color={Colors.grey14} />
      <Text style={styles.emptyText}>No ride history found</Text>
      <Text style={styles.emptySubtext}>Your completed and cancelled rides will appear here</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
     
      <BackButton onPress={() => router.back()} />
      
      <View style={styles.header}>
        <Text style={styles.title}>Ride History</Text>
      </View>

      <FlatList
        data={rideHistory}
        renderItem={renderRideItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        refreshing={loading}
        onRefresh={handleRefresh}
        ListEmptyComponent={renderEmptyComponent}
      />
    </SafeAreaView>
  );
};

export default RideHistory;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.blackColor,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  title: {
    ...Fonts.TextBold,
    fontSize: 24,
    color: Colors.whiteColor,
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  rideItem: {
    backgroundColor: Colors.grey11,
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: Colors.grey10,
  },
  statusContainer: {
    marginBottom: 15,
  },
  statusText: {
    ...Fonts.Medium,
    fontSize: 14,
  },
  routeContainer: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  routeIcon: {
    alignItems: 'center',
    marginRight: 15,
    paddingVertical: 5,
  },
  routeLine: {
    width: 2,
    height: 40,
    backgroundColor: Colors.grey14,
    marginVertical: 5,
  },
  routeText: {
    flex: 1,
  },
  pickupText: {
    ...Fonts.Regular,
    fontSize: 14,
    color: Colors.whiteColor,
    marginBottom: 5,
  },
  dropText: {
    ...Fonts.Regular,
    fontSize: 14,
    color: Colors.whiteColor,
  },
  rideDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: Colors.grey10,
  },
  dateText: {
    ...Fonts.Regular,
    fontSize: 13,
    color: Colors.grey14,
  },
  amountText: {
    ...Fonts.TextBold,
    fontSize: 16,
    color: Colors.whiteColor,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  actionButton: {
    flex: 1,
    height: 45,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewDetailsButton: {
    backgroundColor: Colors.yellow,
  },
  rideAgainButton: {
    backgroundColor: Colors.grey14,
  },
  viewDetailsText: {
    ...Fonts.TextBold,
    fontSize: 14,
    color: Colors.blackColor,
  },
  rideAgainText: {
    ...Fonts.TextBold,
    fontSize: 14,
    color: Colors.blackColor,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    ...Fonts.TextBold,
    fontSize: 18,
    color: Colors.whiteColor,
    marginTop: 20,
    marginBottom: 10,
  },
  emptySubtext: {
    ...Fonts.Regular,
    fontSize: 14,
    color: Colors.grey14,
    textAlign: 'center',
    paddingHorizontal: 40,
  },
});
