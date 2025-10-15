import { Entypo } from '@expo/vector-icons';
import { router, useRouter } from 'expo-router';
import React from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../constants'; // Assuming these are defined

// --- MOCK DATA ---
// Data is simplified to match the elements visible in the screenshot
const MOCK_RIDE_HISTORY = [
  {
    id: '1',
    vehicle_type: 'car', // Used for icon selection
    location: 'Main Peninsular Rd',
    dateTime: '26 Sept - 10:00AM',
    status: 'completed',
    amount: '$25',
  },
  {
    id: '2',
    vehicle_type: 'tuk-tuk',
    location: 'Main Peninsular Rd',
    dateTime: '26 Sept - 10:00AM',
    status: 'canceled',
    amount: null, // Canceled rides usually don't show a price
  },
  {
    id: '3',
    vehicle_type: 'bike',
    location: 'Main Peninsular Rd',
    dateTime: '26 Sept - 10:00AM',
    status: 'completed',
    amount: '$25',
  },
  // Add more items here if needed for scrolling demonstration
];

/**
 * Helper to get the icon (simulated with emojis) or a custom image placeholder.
 * In a real app, this would return an <Image /> or <Svg /> component.
 */
const getVehicleIcon = (type) => {
  switch (type) {
    case 'car':
      // The image shows a detailed white car illustration
      // For simulation, we use a custom component structure with a placeholder text/emoji
      return { source: '🚗', style: styles.carIconPlaceholder };
    case 'tuk-tuk':
      // The image shows a detailed yellow/green tuk-tuk
      return { source: '🛺', style: styles.tukTukIconPlaceholder };
    case 'bike':
      // The image shows a detailed yellow motorbike
      return { source: '🏍️', style: styles.bikeIconPlaceholder };
    default:
      return { source: '❓', style: styles.defaultIconPlaceholder };
  }
};

/**
 * Renders a single ride history item, closely matching the screenshot layout.
 */
const RideHistoryItem = ({ item }) => {
  const icon = getVehicleIcon(item.vehicle_type);
  const isCompleted = item.status === 'completed';

  return (
    <Pressable style={styles.itemContainer} onPress={() => router.push('/accounts/RideDetailsScreen')}>
      
      {/* Vehicle Icon / Image Placeholder */}
      <View style={styles.iconWrapper}>
        {/* Placeholder for the custom vehicle image */}
        <Text style={[styles.vehicleIcon, icon.style]}>
            {icon.source}
        </Text>
      </View>

      {/* Text Details (Location, Date, Status) */}
      <View style={styles.textContainer}>
        <Text style={styles.primaryText}>{item.location}</Text>
        <Text style={styles.secondaryText}>{item.dateTime}</Text>
        <Text 
          style={[
            styles.statusText,
            { color: isCompleted ? Colors.greenColor || '#4CAF50' : Colors.redColor || '#E91E63' }
          ]}
        >
          {isCompleted ? 'Completed' : 'Canceled'}
        </Text>
      </View>

      {/* Price (on the right) */}
      {item.amount && (
        <Text style={styles.amountText}>{item.amount}</Text>
      )}
    </Pressable>
  );
};


const RideHistory = () => {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container} edges={['top']}> 
      
      {/* Custom Header matching the screenshot */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          {/* Using Entypo for the chevron-left icon */}
          <Entypo name="chevron-left" size={26} color={Colors.whiteColor || '#FFFFFF'} />
        </Pressable>
        <Text style={styles.headerTitle}>Ride History</Text>
      </View>

      {/* Ride History List */}
      <FlatList
        data={MOCK_RIDE_HISTORY}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <RideHistoryItem item={item} />}
        contentContainerStyle={styles.listContent}
        // Use a separator component to ensure a clean line between items
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
      
    </SafeAreaView>
  );
};

// --- STYLESHEET ---
const styles = StyleSheet.create({
  // --- Global Styles ---
  container: {
    flex: 1,
    backgroundColor: Colors.blackColor || '#000000', // Deep black background
  },
  
  // --- Header Styles ---
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    // No bottom border visible in the image
  },
  backButton: {
    paddingRight: 10,
    paddingVertical: 5, 
  },
  headerTitle: {
    // Looks to be around 20-22px and bold/semi-bold
    fontSize: 22,
    color: Colors.whiteColor || '#FFFFFF',
    fontWeight: '700', // Bold/Extra-bold to match the image title
    marginLeft: 10,
  },
  
  // --- List and Item Styles ---
  listContent: {
    paddingHorizontal: 15,
    paddingTop: 10,
    paddingBottom: 20,
  },
  separator: {
    height: StyleSheet.hairlineWidth * 1.5, // Slightly thicker than hairlineWidth
    backgroundColor: Colors.separatorColor || '#222222', // Very dark grey separator
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
  },
  
  // Placeholder for Vehicle Icon/Image
  iconWrapper: {
    width: 60, // Fixed width for the icon area
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
    // Placeholder background/border is not strictly needed but helps visualize the area
  },
  vehicleIcon: {
    fontSize: 40, // Large font size for emoji icons
  },
  // You would remove these placeholders and replace with <Image> or <Svg>
  carIconPlaceholder: {
    fontSize: 40, 
  },
  tukTukIconPlaceholder: {
    fontSize: 40,
  },
  bikeIconPlaceholder: {
    fontSize: 40,
  },

  // Text details
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  primaryText: {
    fontSize: 16,
    color: Colors.whiteColor || '#FFFFFF',
    fontWeight: '600', // Semi-bold for the main address line
    marginBottom: 4,
  },
  secondaryText: {
    fontSize: 13,
    color: Colors.lightGreyColor || '#AAAAAA',
    fontWeight: '400', // Regular weight
    marginBottom: 4,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '700', // Bold status text
  },
  
  // Price
  amountText: {
    fontSize: 18,
    color: Colors.whiteColor || '#FFFFFF',
    fontWeight: '700', // Bold price text
    marginLeft: 10,
  },
});

export default RideHistory;