import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Header, TriphButton } from '../components';
import { Colors, Fonts } from '../constants';

const Dashboard = () => {
  const router = useRouter();
  const [user] = useState({
    first_name: 'John',
    image: null,
  });

  const rideOptions = [
    {
      id: 1,
      title: 'Ride',
      subtitle: 'Get a ride',
      icon: 'car',
      color: Colors.yellow,
    },
    {
      id: 2,
      title: 'Package',
      subtitle: 'Send a package',
      icon: 'cube',
      color: Colors.blue,
    },
    {
      id: 3,
      title: 'Food',
      subtitle: 'Order food',
      icon: 'restaurant',
      color: Colors.green,
    },
  ];

  const quickActions = [
    {
      id: 1,
      title: 'Ride History',
      icon: 'time',
      screen: '/ride-history',
    },
    {
      id: 2,
      title: 'Payment',
      icon: 'card',
      screen: '/payment',
    },
    {
      id: 3,
      title: 'Support',
      icon: 'help-circle',
      screen: '/support',
    },
    {
      id: 4,
      title: 'Settings',
      icon: 'settings',
      screen: '/settings',
    },
  ];

  const handleRideOption = (option) => {
    if (option.id === 1) {
      router.push('/search-ride');
    } else {
      Alert.alert('Coming Soon', `${option.title} feature is coming soon!`);
    }
  };

  const handleQuickAction = (action) => {
    if (action.screen) {
      router.push(action.screen);
    } else {
      Alert.alert('Coming Soon', `${action.title} feature is coming soon!`);
    }
  };

  return (
    <View style={styles.container}>
      <Header user={user} />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.welcomeContainer}>
          <Text style={styles.welcomeText}>Where would you like to go?</Text>
        </View>

        <View style={styles.rideOptionsContainer}>
          {rideOptions.map((option) => (
            <TouchableOpacity
              key={option.id}
              style={styles.rideOption}
              onPress={() => handleRideOption(option)}
            >
              <View style={[styles.rideIcon, { backgroundColor: option.color }]}>
                <Ionicons name={option.icon} size={30} color={Colors.blackColor} />
              </View>
              <Text style={styles.rideTitle}>{option.title}</Text>
              <Text style={styles.rideSubtitle}>{option.subtitle}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.quickActionsContainer}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActionsGrid}>
            {quickActions.map((action) => (
              <TouchableOpacity
                key={action.id}
                style={styles.quickActionItem}
                onPress={() => handleQuickAction(action)}
              >
                <View style={styles.quickActionIcon}>
                  <Ionicons name={action.icon} size={24} color={Colors.whiteColor} />
                </View>
                <Text style={styles.quickActionTitle}>{action.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.promoContainer}>
          <View style={styles.promoCard}>
            <Text style={styles.promoTitle}>Get 50% off your first ride!</Text>
            <Text style={styles.promoSubtitle}>Use code WELCOME50</Text>
            <TriphButton
              text="Apply Code"
              onPress={() => Alert.alert('Promo Code', 'WELCOME50 applied!')}
              extraStyle={styles.promoButton}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default Dashboard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.blackColor,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  welcomeContainer: {
    marginBottom: 30,
  },
  welcomeText: {
    ...Fonts.TextBold,
    fontSize: 24,
    color: Colors.whiteColor,
    textAlign: 'center',
  },
  rideOptionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 40,
  },
  rideOption: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: Colors.grey11,
    borderRadius: 15,
    padding: 20,
    marginHorizontal: 5,
  },
  rideIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  rideTitle: {
    ...Fonts.TextBold,
    fontSize: 16,
    color: Colors.whiteColor,
    marginBottom: 5,
  },
  rideSubtitle: {
    ...Fonts.Regular,
    fontSize: 12,
    color: Colors.grey14,
    textAlign: 'center',
  },
  quickActionsContainer: {
    marginBottom: 30,
  },
  sectionTitle: {
    ...Fonts.TextBold,
    fontSize: 18,
    color: Colors.whiteColor,
    marginBottom: 20,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickActionItem: {
    width: '48%',
    backgroundColor: Colors.grey11,
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    marginBottom: 15,
  },
  quickActionIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.grey10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  quickActionTitle: {
    ...Fonts.Medium,
    fontSize: 14,
    color: Colors.whiteColor,
    textAlign: 'center',
  },
  promoContainer: {
    marginBottom: 30,
  },
  promoCard: {
    backgroundColor: Colors.yellow,
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
  },
  promoTitle: {
    ...Fonts.TextBold,
    fontSize: 18,
    color: Colors.blackColor,
    marginBottom: 5,
  },
  promoSubtitle: {
    ...Fonts.Regular,
    fontSize: 14,
    color: Colors.blackColor,
    marginBottom: 15,
  },
  promoButton: {
    backgroundColor: Colors.blackColor,
    paddingHorizontal: 30,
  },
});
