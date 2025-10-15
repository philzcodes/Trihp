import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Colors, Fonts } from '../constants';

const BackHeader = ({ title, onPress, iconFilter, onFilterPress, styles: customStyles }) => {
  const router = useRouter();

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      router.back();
    }
  };

  return (
    <View style={[styles.container, customStyles]}>
      <TouchableOpacity style={styles.backButton} onPress={handlePress}>
        <Ionicons name="arrow-back-sharp" size={24} color={Colors.whiteColor} />
      </TouchableOpacity>
      <Text style={styles.title}>{title}</Text>
      {iconFilter && (
        <TouchableOpacity style={styles.filterButton} onPress={onFilterPress}>
          <Ionicons name="filter" size={20} color={Colors.whiteColor} />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default BackHeader;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: Colors.lightBlack,
  },
  backButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    marginRight: 15,
  },
  title: {
    ...Fonts.Medium,
    fontSize: 18,
    flex: 1,
  },
  filterButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
});
