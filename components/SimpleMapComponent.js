import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const SimpleMapComponent = ({ style, region, ...props }) => {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.mapPlaceholder}>
        <Text style={styles.mapText}>🗺️</Text>
        <Text style={styles.mapLabel}>Map View</Text>
        <Text style={styles.mapSubtext}>
          {region ? 
            `Location: ${region.latitude?.toFixed(4)}, ${region.longitude?.toFixed(4)}` : 
            'Location: Default'
          }
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mapPlaceholder: {
    flex: 1,
    backgroundColor: '#1C1C1E',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#333333',
    borderRadius: 8,
  },
  mapText: {
    fontSize: 48,
    marginBottom: 8,
  },
  mapLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  mapSubtext: {
    fontSize: 14,
    color: '#8E8E93',
    textAlign: 'center',
  },
});

export default SimpleMapComponent;
