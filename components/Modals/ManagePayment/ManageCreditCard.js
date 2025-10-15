import React from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors, Fonts } from '../../../constants/Styles';

const ManageCreditCard = ({ isVisible, onClose, cardDetails }) => {
  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.title}>Manage Credit Card</Text>
          <Text style={styles.description}>Credit card management coming soon...</Text>
          <TouchableOpacity style={styles.button} onPress={onClose}>
            <Text style={styles.buttonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default ManageCreditCard;

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
    marginBottom: 10,
  },
  description: {
    ...Fonts.Regular,
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
  },
  button: {
    backgroundColor: Colors.yellow,
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    ...Fonts.Medium,
    color: Colors.blackColor,
    textAlign: 'center',
  },
});
