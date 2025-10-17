import React, { useRef } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
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

  // Default region if none provided
  const defaultRegion = {
    latitude: 4.8666,
    longitude: 6.9745,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  const mapRegion = region || defaultRegion;

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
        onRegionChange={onRegionChange}
        onRegionChangeComplete={onRegionChangeComplete}
        onPress={onPress}
        onMapReady={onMapReady}
        {...props}
      />
    </View>
  );
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