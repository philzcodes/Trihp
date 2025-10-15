import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { Colors, Fonts } from '../../constants';

const CardModal = ({ isVisible, onClose }) => {
  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.title}>Add Credit/Debit Card</Text>
          <Text style={styles.description}>Card functionality coming soon...</Text>
          <TouchableOpacity style={styles.button} onPress={onClose}>
            <Text style={styles.buttonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default CardModal;

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
