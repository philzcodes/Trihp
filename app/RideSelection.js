import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { BackButton, TriphButton } from '../components';
import { Colors, Fonts } from '../constants';

const RideSelection = () => {
  const router = useRouter();
  const [selectedRide, setSelectedRide] = useState(null);

  const rideTypes = [
    {
      id: 1,
      name: 'Economy',
      icon: 'car',
      price: '₦1,200',
      estimatedTime: '5-8 min',
      description: 'Affordable rides for everyday trips',
      features: ['Up to 4 passengers', 'Standard vehicle'],
    },
    {
      id: 2,
      name: 'Comfort',
      icon: 'car-sport',
      price: '₦1,800',
      estimatedTime: '3-5 min',
      description: 'More space and comfort',
      features: ['Up to 4 passengers', 'Larger vehicle', 'Extra legroom'],
    },
    {
      id: 3,
      name: 'Premium',
      icon: 'diamond',
      price: '₦2,500',
      estimatedTime: '2-4 min',
      description: 'Luxury vehicles for special occasions',
      features: ['Up to 4 passengers', 'Luxury vehicle', 'Premium experience'],
    },
  ];

  const handleRideSelect = (ride) => {
    setSelectedRide(ride);
  };

  const handleConfirmRide = () => {
    if (!selectedRide) {
      Alert.alert('Error', 'Please select a ride type');
      return;
    }
    
    router.push('/pickup-confirm');
  };

  return (
    <View style={styles.container}>
      <BackButton onPress={() => router.back()} />
      
      <View style={styles.header}>
        <Text style={styles.title}>Choose your ride</Text>
        <View style={styles.routeInfo}>
          <Text style={styles.routeText}>Victoria Island → Ikoyi</Text>
          <Text style={styles.distanceText}>5.2 km • 15 min</Text>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {rideTypes.map((ride) => (
          <TouchableOpacity
            key={ride.id}
            style={[
              styles.rideCard,
              selectedRide?.id === ride.id && styles.selectedRideCard
            ]}
            onPress={() => handleRideSelect(ride)}
          >
            <View style={styles.rideHeader}>
              <View style={styles.rideInfo}>
                <View style={styles.rideIcon}>
                  <Ionicons name={ride.icon} size={24} color={Colors.whiteColor} />
                </View>
                <View style={styles.rideDetails}>
                  <Text style={styles.rideName}>{ride.name}</Text>
                  <Text style={styles.rideDescription}>{ride.description}</Text>
                </View>
              </View>
              <View style={styles.priceContainer}>
                <Text style={styles.price}>{ride.price}</Text>
                <Text style={styles.estimatedTime}>{ride.estimatedTime}</Text>
              </View>
            </View>

            <View style={styles.featuresContainer}>
              {ride.features.map((feature, index) => (
                <View key={index} style={styles.feature}>
                  <Ionicons name="checkmark-circle" size={16} color={Colors.green} />
                  <Text style={styles.featureText}>{feature}</Text>
                </View>
              ))}
            </View>
          </TouchableOpacity>
        ))}

        <View style={styles.promoContainer}>
          <View style={styles.promoCard}>
            <Ionicons name="gift" size={20} color={Colors.yellow} />
            <Text style={styles.promoText}>Save 20% with code SAVE20</Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.bottomContainer}>
        <TriphButton
          text={selectedRide ? `Book ${selectedRide.name} - ${selectedRide.price}` : 'Select a ride'}
          onPress={handleConfirmRide}
          extraStyle={[
            styles.confirmButton,
            !selectedRide && styles.disabledButton
          ]}
        />
      </View>
    </View>
  );
};

export default RideSelection;

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
    marginBottom: 15,
  },
  routeInfo: {
    backgroundColor: Colors.grey11,
    borderRadius: 10,
    padding: 15,
  },
  routeText: {
    ...Fonts.Medium,
    fontSize: 16,
    color: Colors.whiteColor,
    marginBottom: 5,
  },
  distanceText: {
    ...Fonts.Regular,
    fontSize: 14,
    color: Colors.grey14,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  rideCard: {
    backgroundColor: Colors.grey11,
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedRideCard: {
    borderColor: Colors.yellow,
    backgroundColor: Colors.grey12,
  },
  rideHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  rideInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  rideIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.grey10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  rideDetails: {
    flex: 1,
  },
  rideName: {
    ...Fonts.TextBold,
    fontSize: 18,
    color: Colors.whiteColor,
    marginBottom: 5,
  },
  rideDescription: {
    ...Fonts.Regular,
    fontSize: 14,
    color: Colors.grey14,
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  price: {
    ...Fonts.TextBold,
    fontSize: 20,
    color: Colors.whiteColor,
    marginBottom: 5,
  },
  estimatedTime: {
    ...Fonts.Regular,
    fontSize: 12,
    color: Colors.grey14,
  },
  featuresContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
    marginBottom: 8,
  },
  featureText: {
    ...Fonts.Regular,
    fontSize: 12,
    color: Colors.grey14,
    marginLeft: 5,
  },
  promoContainer: {
    marginBottom: 30,
  },
  promoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.grey12,
    borderRadius: 10,
    padding: 15,
  },
  promoText: {
    ...Fonts.Medium,
    fontSize: 14,
    color: Colors.yellow,
    marginLeft: 10,
  },
  bottomContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  confirmButton: {
    marginTop: 0,
  },
  disabledButton: {
    opacity: 0.5,
  },
});
