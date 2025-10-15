import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { Colors, Fonts } from '../../constants';

const FilterModal = ({ isVisible, onBackdropPress, onBackButtonPress, onApply, onFilterChange, initialFilter }) => {
  const filters = ['All', 'Success', 'Failed', 'Pending'];
  
  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="slide"
      onRequestClose={onBackButtonPress}
    >
      <TouchableOpacity style={styles.overlay} onPress={onBackdropPress}>
        <View style={styles.modal}>
          <Text style={styles.title}>Filter Transactions</Text>
          {filters.map((filter) => (
            <TouchableOpacity
              key={filter}
              style={[
                styles.filterOption,
                initialFilter === filter && styles.selectedFilter
              ]}
              onPress={() => {
                onFilterChange(filter);
                onApply();
              }}
            >
              <Text style={[
                styles.filterText,
                initialFilter === filter && styles.selectedFilterText
              ]}>
                {filter}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

export default FilterModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    backgroundColor: Colors.lightBlack,
    borderRadius: 10,
    padding: 20,
    width: '80%',
  },
  title: {
    ...Fonts.Medium,
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
  },
  filterOption: {
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
  },
  selectedFilter: {
    backgroundColor: Colors.yellow,
  },
  filterText: {
    ...Fonts.Regular,
    fontSize: 16,
    textAlign: 'center',
  },
  selectedFilterText: {
    color: Colors.blackColor,
  },
});
