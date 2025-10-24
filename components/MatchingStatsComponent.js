import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { Colors } from '../constants';

const MatchingStatsComponent = ({ visible = false }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (visible) {
      fetchMatchingStats();
    }
  }, [visible]);

  const fetchMatchingStats = async () => {
    try {
      setLoading(true);
      const { rideRequestAPI } = await import('../../api/rideRequestAPI');
      const statsData = await rideRequestAPI.getMatchingStats();
      setStats(statsData);
    } catch (error) {
      console.error('Error fetching matching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!visible) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Driver Availability</Text>
      {loading ? (
        <ActivityIndicator size="small" color={Colors.yellow} />
      ) : stats ? (
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{stats.availableDrivers}</Text>
            <Text style={styles.statLabel}>Available</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{stats.onlineDrivers}</Text>
            <Text style={styles.statLabel}>Online</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{stats.totalDrivers}</Text>
            <Text style={styles.statLabel}>Total</Text>
          </View>
        </View>
      ) : (
        <Text style={styles.errorText}>Unable to load stats</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    borderRadius: 12,
    padding: 16,
    margin: 16,
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.white,
    marginBottom: 12,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.yellow,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.white,
    opacity: 0.8,
  },
  errorText: {
    fontSize: 14,
    color: Colors.red,
    textAlign: 'center',
  },
});

export default MatchingStatsComponent;
