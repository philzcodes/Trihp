import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { BackButton, TriphButton } from '../../components';
import { Colors, Fonts } from '../../constants';

const SearchRide = () => {
  const router = useRouter();
  const [pickup, setPickup] = useState('');
  const [destination, setDestination] = useState('');
  const [pickupLocation, setPickupLocation] = useState(null);
  const [destinationLocation, setDestinationLocation] = useState(null);

  const handleLocationSelect = (type) => {
    // In a real app, this would open a map or location picker
    if (type === 'pickup') {
      setPickup('Current Location');
      setPickupLocation({ lat: 0, lng: 0 });
    } else {
      setDestination('Select Destination');
      setDestinationLocation({ lat: 0, lng: 0 });
    }
  };

  const handleSwapLocations = () => {
    const temp = pickup;
    setPickup(destination);
    setDestination(temp);
    
    const tempLocation = pickupLocation;
    setPickupLocation(destinationLocation);
    setDestinationLocation(tempLocation);
  };

  const handleSearchRides = () => {
    if (!pickup || !destination) {
      Alert.alert('Error', 'Please select both pickup and destination');
      return;
    }
    
    router.push('/ride-selection');
  };

  const recentLocations = [
    { name: 'Home', address: '123 Main St, Lagos', icon: 'home' },
    { name: 'Work', address: '456 Business Ave, Lagos', icon: 'briefcase' },
    { name: 'Airport', address: 'Lagos Airport', icon: 'airplane' },
  ];

  return (
    <View style={styles.container}>
      <BackButton onPress={() => router.back()} />
      
      <View style={styles.header}>
        <Text style={styles.title}>Where are you going?</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.locationContainer}>
          <View style={styles.locationRow}>
            <View style={styles.locationIcon}>
              <View style={[styles.dot, { backgroundColor: Colors.green }]} />
            </View>
            <TouchableOpacity 
              style={styles.locationInput}
              onPress={() => handleLocationSelect('pickup')}
            >
              <Text style={styles.locationText}>
                {pickup || 'Pickup location'}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.swapContainer}>
            <TouchableOpacity style={styles.swapButton} onPress={handleSwapLocations}>
              <Ionicons name="swap-vertical" size={20} color={Colors.whiteColor} />
            </TouchableOpacity>
          </View>

          <View style={styles.locationRow}>
            <View style={styles.locationIcon}>
              <View style={[styles.dot, { backgroundColor: Colors.red }]} />
            </View>
            <TouchableOpacity 
              style={styles.locationInput}
              onPress={() => handleLocationSelect('destination')}
            >
              <Text style={styles.locationText}>
                {destination || 'Where to?'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.recentContainer}>
          <Text style={styles.sectionTitle}>Recent destinations</Text>
          {recentLocations.map((location, index) => (
            <TouchableOpacity
              key={index}
              style={styles.recentItem}
              onPress={() => {
                if (destination) {
                  setPickup(location.name);
                  setPickupLocation({ lat: 0, lng: 0 });
                } else {
                  setDestination(location.name);
                  setDestinationLocation({ lat: 0, lng: 0 });
                }
              }}
            >
              <View style={styles.recentIcon}>
                <Ionicons name={location.icon} size={20} color={Colors.grey14} />
              </View>
              <View style={styles.recentText}>
                <Text style={styles.recentName}>{location.name}</Text>
                <Text style={styles.recentAddress}>{location.address}</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color={Colors.grey14} />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <View style={styles.bottomContainer}>
        <TriphButton
          text="Search rides"
          onPress={handleSearchRides}
          extraStyle={styles.searchButton}
        />
      </View>
    </View>
  );
};

export default SearchRide;

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
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  locationContainer: {
    backgroundColor: Colors.grey11,
    borderRadius: 15,
    padding: 20,
    marginBottom: 30,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationIcon: {
    width: 30,
    alignItems: 'center',
    marginRight: 15,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  locationInput: {
    flex: 1,
    paddingVertical: 15,
  },
  locationText: {
    ...Fonts.Regular,
    fontSize: 16,
    color: Colors.whiteColor,
  },
  swapContainer: {
    alignItems: 'center',
    marginVertical: 10,
  },
  swapButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.grey10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  recentContainer: {
    marginBottom: 30,
  },
  sectionTitle: {
    ...Fonts.TextBold,
    fontSize: 18,
    color: Colors.whiteColor,
    marginBottom: 20,
  },
  recentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: Colors.grey10,
  },
  recentIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.grey11,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  recentText: {
    flex: 1,
  },
  recentName: {
    ...Fonts.Medium,
    fontSize: 16,
    color: Colors.whiteColor,
    marginBottom: 2,
  },
  recentAddress: {
    ...Fonts.Regular,
    fontSize: 14,
    color: Colors.grey14,
  },
  bottomContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  searchButton: {
    marginTop: 0,
  },
});
