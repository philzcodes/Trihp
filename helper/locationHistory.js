import AsyncStorage from '@react-native-async-storage/async-storage';

const LOCATION_HISTORY_KEY = 'trihp_location_history';
const MAX_HISTORY_ITEMS = 10; // Maximum number of locations to store

/**
 * Location History Service
 * Manages recent drop-off locations (destination history) for the user
 */

/**
 * Save a location to history
 * @param {Object} locationData - Location data to save
 * @param {string} locationData.name - Location name/address
 * @param {string} locationData.address - Full address
 * @param {number} locationData.latitude - Latitude
 * @param {number} locationData.longitude - Longitude
 */
export const saveLocationToHistory = async (locationData) => {
  try {
    if (!locationData || !locationData.name || !locationData.address) {
      console.warn('Invalid location data, skipping save');
      return;
    }

    // Get existing history
    const existingHistory = await getLocationHistory();
    
    // Check if this location already exists (avoid duplicates)
    const existingIndex = existingHistory.findIndex(
      item => item.name === locationData.name && item.address === locationData.address
    );

    let updatedHistory;
    if (existingIndex !== -1) {
      // Remove the existing item and add it to the top
      updatedHistory = [
        locationData,
        ...existingHistory.filter((_, index) => index !== existingIndex)
      ];
    } else {
      // Add new location to the top
      updatedHistory = [locationData, ...existingHistory];
    }

    // Limit to MAX_HISTORY_ITEMS
    updatedHistory = updatedHistory.slice(0, MAX_HISTORY_ITEMS);

    // Save to AsyncStorage
    await AsyncStorage.setItem(LOCATION_HISTORY_KEY, JSON.stringify(updatedHistory));
    console.log('Location saved to history:', locationData.name);
  } catch (error) {
    console.error('Error saving location to history:', error);
  }
};

/**
 * Get location history
 * @returns {Promise<Array>} Array of location objects
 */
export const getLocationHistory = async () => {
  try {
    const historyJson = await AsyncStorage.getItem(LOCATION_HISTORY_KEY);
    if (historyJson) {
      const history = JSON.parse(historyJson);
      return Array.isArray(history) ? history : [];
    }
    return [];
  } catch (error) {
    console.error('Error getting location history:', error);
    return [];
  }
};

/**
 * Clear location history
 */
export const clearLocationHistory = async () => {
  try {
    await AsyncStorage.removeItem(LOCATION_HISTORY_KEY);
    console.log('Location history cleared');
  } catch (error) {
    console.error('Error clearing location history:', error);
  }
};

/**
 * Save drop-off location from a completed ride
 * This should be called when a ride is created or completed
 * @param {Object} rideData - Ride data containing dropOffAddress and coordinates
 */
export const saveRideLocation = async (rideData) => {
  if (!rideData || !rideData.dropOffAddress) {
    return;
  }

  const locationData = {
    id: rideData.id || Date.now().toString(),
    name: rideData.dropOffAddress.split(',')[0] || rideData.dropOffAddress, // Use first part as name
    address: rideData.dropOffAddress,
    latitude: rideData.dropOffLatitude,
    longitude: rideData.dropOffLongitude,
    createdAt: new Date().toISOString(),
  };

  await saveLocationToHistory(locationData);
};

/**
 * Get recent locations formatted for display
 * @param {number} limit - Maximum number of locations to return (default: 2 for dashboard/search)
 * @returns {Promise<Array>} Array of formatted location objects
 */
export const getRecentLocations = async (limit = 2) => {
  try {
    const history = await getLocationHistory();
    return history.slice(0, limit);
  } catch (error) {
    console.error('Error getting recent locations:', error);
    return [];
  }
};

/**
 * Get recent rides formatted for dashboard
 * This extracts from both location history and actual ride history
 * @param {number} limit - Maximum number of rides to return
 * @returns {Promise<Array>} Array of formatted ride history objects
 */
export const getRecentRidesHistory = async (limit = 2) => {
  try {
    // First, try to get actual ride history from API
    // For now, we'll use location history as fallback
    const locationHistory = await getLocationHistory();
    
    // Transform location history to ride history format
    return locationHistory.slice(0, limit).map((location, index) => ({
      id: location.id || `location-${index}`,
      pickup_location_name: 'Previous Pickup', // This would ideally come from ride history
      drop_location_name: location.address || location.name,
      pickup_latitude: location.pickupLatitude || location.latitude,
      pickup_longitude: location.pickupLongitude || location.longitude,
      drop_latitude: location.latitude,
      drop_longitude: location.longitude,
      distance: location.distance || '0 km',
      created_at: location.createdAt || new Date().toISOString(),
    }));
  } catch (error) {
    console.error('Error getting recent rides history:', error);
    return [];
  }
};

