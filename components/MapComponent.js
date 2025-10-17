import React, { useEffect, useRef } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import MapView, { PROVIDER_DEFAULT, PROVIDER_GOOGLE } from 'react-native-maps';

const MapComponent = React.forwardRef(({
  // Basic map configuration only
  style,
  region,
  showsUserLocation = false,
  followsUserLocation = false,
  showsMyLocationButton = false,
  zoomControlEnabled = true,
  
  // Basic map interactions
  onRegionChange,
  onRegionChangeComplete,
  onPress,
  onMapReady,
  
  // Additional props
  ...props
}, ref) => {
  const internalMapRef = useRef(null);
  const mapReference = ref || internalMapRef;
  const isMountedRef = useRef(true);
  const mapReadyRef = useRef(false);

  // Lifecycle management
  useEffect(() => {
    isMountedRef.current = true;
    mapReadyRef.current = false;
    
    return () => {
      isMountedRef.current = false;
      mapReadyRef.current = false;
      // Don't manipulate the ref - let React Native Maps handle cleanup
    };
  }, []);

  // Default region if none provided
  const defaultRegion = {
    latitude: 4.8666,
    longitude: 6.9745,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  const mapRegion = region || defaultRegion;

  // Safe event handlers
  const handleMapReady = () => {
    try {
      if (isMountedRef.current) {
        mapReadyRef.current = true;
        console.log('MapComponent: Map ready');
        if (onMapReady) {
          onMapReady();
        }
      }
    } catch (error) {
      console.error('MapComponent: Error in onMapReady:', error);
    }
  };

  const handleRegionChange = (newRegion) => {
    try {
      if (isMountedRef.current && onRegionChange) {
        onRegionChange(newRegion);
      }
    } catch (error) {
      console.error('MapComponent: Error in onRegionChange:', error);
    }
  };

  const handleRegionChangeComplete = (newRegion) => {
    try {
      if (isMountedRef.current && onRegionChangeComplete) {
        onRegionChangeComplete(newRegion);
      }
    } catch (error) {
      console.error('MapComponent: Error in onRegionChangeComplete:', error);
    }
  };

  const handlePress = (event) => {
    try {
      if (isMountedRef.current && onPress) {
        onPress(event);
      }
    } catch (error) {
      console.error('MapComponent: Error in onPress:', error);
    }
  };

  try {
    return (
      <View style={[styles.container, style]}>
        <MapView
          ref={mapReference}
          style={styles.map}
          mapType="standard"
          provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : PROVIDER_DEFAULT}
          region={mapRegion}
          showsUserLocation={showsUserLocation}
          followsUserLocation={followsUserLocation}
          showsMyLocationButton={showsMyLocationButton}
          zoomControlEnabled={zoomControlEnabled}
          onRegionChange={handleRegionChange}
          onRegionChangeComplete={handleRegionChangeComplete}
          onPress={handlePress}
          onMapReady={handleMapReady}
          {...props}
        />
      </View>
    );
  } catch (error) {
    console.error('MapComponent: Error rendering map:', error);
    // Return a fallback view if map rendering fails
    return (
      <View style={[styles.container, style, { backgroundColor: '#1C1C1E', justifyContent: 'center', alignItems: 'center' }]}>
        <View style={{ padding: 20, alignItems: 'center' }}>
          <Text style={{ color: '#FFFFFF', fontSize: 16, textAlign: 'center' }}>
            Map temporarily unavailable
          </Text>
        </View>
      </View>
    );
  }
});

MapComponent.displayName = 'MapComponent';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});

export default MapComponent;