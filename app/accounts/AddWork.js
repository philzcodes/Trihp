import { AntDesign, Entypo, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../constants'; // Assuming these are defined in your project

// Mock data for the search results/suggestions
const MOCK_RECENT_LOCATIONS = [
  { id: '1', primary: 'Main Peninsular Rd', secondary: 'Hamilton Freetown, Sierra Leone.' },
  { id: '2', primary: 'Main Peninsular Rd', secondary: 'Hamilton Freetown, Sierra Leone.' },
  { id: '3', primary: 'Main Peninsular Rd', secondary: 'Hamilton Freetown, Sierra Leone.' },
  { id: '4', primary: 'Main Peninsular Rd', secondary: 'Hamilton Freetown, Sierra Leone.' },
  { id: '5', primary: 'Main Peninsular Rd', secondary: 'Hamilton Freetown, Sierra Leone.' },
  { id: '6', primary: 'Main Peninsular Rd', secondary: 'Hamilton Freetown, Sierra Leone.' },
];

/**
 * Renders a single row for a recent or suggested location.
 * @param {object} item - The location data.
 * @param {function} onPress - Handler for row press.
 */
const LocationItem = ({ item, onPress }) => (
  <Pressable style={styles.itemContainer} onPress={() => onPress(item)}>
    {/* Using MaterialCommunityIcons for the history/clock icon (as it looks most similar) */}
    <MaterialCommunityIcons 
      name="clock-time-three-outline" 
      size={24} 
      color={Colors.whiteColor} 
      style={styles.itemIcon} 
    />
    <View style={styles.itemTextContainer}>
      <Text style={styles.itemPrimaryText}>{item.primary}</Text>
      <Text style={styles.itemSecondaryText}>{item.secondary}</Text>
    </View>
  </Pressable>
);

const AddWork = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  /**
   * Handles selecting a location from the list.
   * @param {object} location - The selected location object.
   */
  const handleLocationSelect = (location) => {
    // In a real app, this would trigger navigation or a state update
    console.log('Location selected:', location);
    // For now, let's just populate the search bar
    setSearchQuery(location.primary);
  };

  /**
   * Clears the search input field.
   */
  const clearSearch = () => {
    setSearchQuery('');
  };

  return (
    // SafeAreaView ensures content is below the notch/status bar
    <SafeAreaView style={styles.container} edges={['top']}> 
      
      {/* Custom Header matching the screenshot */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          {/* Using Entypo for the chevron-left icon */}
          <Entypo name="chevron-left" size={26} color={Colors.whiteColor} />
        </Pressable>
        <Text style={styles.headerTitle}>Add Work</Text>
      </View>

      {/* Search Input Area */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.textInput}
          value={searchQuery}
          onChangeText={setSearchQuery}
          // The placeholder is empty in the image, but let's keep it functional
          placeholder="" 
          placeholderTextColor={Colors.whiteColor}
          keyboardAppearance="dark" // Important for dark theme consistency
        />
        {/* Clear Button (the 'x' icon) */}
        {searchQuery.length > 0 && (
          <Pressable onPress={clearSearch} style={styles.clearButton}>
            {/* Using AntDesign for the closecircle icon to match the 'x' look */}
            <AntDesign name="closecircle" size={16} color={Colors.inputPlaceholderColor || '#666'} />
          </Pressable>
        )}
      </View>

      {/* Location List */}
      <FlatList
        data={MOCK_RECENT_LOCATIONS}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <LocationItem item={item} onPress={handleLocationSelect} />
        )}
        // The list in the image has a thin separator line between items
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        style={styles.list}
      />
      
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  // --- Global Styles ---
  container: {
    flex: 1,
    backgroundColor: Colors.blackColor || '#000000', // Ensure a deep black background
  },
  
  // --- Header Styles ---
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  backButton: {
    paddingRight: 10,
    // Add a small hit area for easier tapping
    paddingVertical: 5, 
  },
  headerTitle: {
    // Assuming Fonts.Regular sets the default font family
    // The title looks to be around 18-20px and bold/semi-bold
    fontSize: 20,
    color: Colors.whiteColor || '#FFFFFF',
    fontWeight: '600', // Semi-bold for a modern look
    marginLeft: 10,
  },
  
  // --- Search Bar Styles ---
  searchContainer: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth, // Use a very thin line for separator
    borderBottomColor: Colors.separatorColor || '#333333',
  },
  textInput: {
    minHeight: 44,
    backgroundColor: Colors.inputBackground || '#1c1c1c', // Dark gray background for the input box
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingRight: 40, // Space for the clear button
    fontSize: 16,
    color: Colors.whiteColor || '#FFFFFF',
    // The input box looks quite prominent, maybe a bit taller than minHeight
    height: 50, 
  },
  clearButton: {
    position: 'absolute',
    right: 30,
    top: 22, // Center vertically
    padding: 5, // Tappable area
  },
  
  // --- List and Item Styles ---
  list: {
    flex: 1,
    // The list in the image seems to start right after the input, without a major break
  },
  separator: {
    height: StyleSheet.hairlineWidth, // Very thin line
    backgroundColor: Colors.separatorColor || '#333333',
    marginLeft: 55, // Align with the start of the text content
    marginRight: 0,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 15,
    // No explicit background color change on press, relying on default Pressable opacity
  },
  itemIcon: {
    marginRight: 20,
    opacity: 0.7, // Subtle clock icon
  },
  itemTextContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  itemPrimaryText: {
    fontSize: 16,
    color: Colors.whiteColor || '#FFFFFF',
    fontWeight: '500', // Medium weight for the main address line
    marginBottom: 2,
  },
  itemSecondaryText: {
    fontSize: 14,
    color: Colors.secondaryTextColor || '#AAAAAA', // Lighter color for the secondary info
    opacity: 0.8,
  },
});

export default AddWork;

// **NOTE:** For this code to run successfully, you need to ensure the 
// `../../constants` import (especially `Colors` and `Fonts`) is correctly 
// implemented in your project structure. I've added sensible fallbacks (`#000000`, 
// `#FFFFFF`, etc.) where appropriate.