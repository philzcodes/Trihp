import React from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors, Fonts } from '../../constants';

const PaymentTypeModal = ({ 
  visible, 
  setVisible, 
  amount, 
  isWallet, 
  selectedPaymentMethod, 
  setSelectedPaymentMethod,
  isVisible: isVisibleProp, 
  onClose 
}) => {
  // Handle both prop naming conventions
  const isModalVisible = visible || isVisibleProp;
  const closeModal = () => {
    if (setVisible) {
      setVisible(false);
    } else if (onClose) {
      onClose();
    }
  };

  return (
    <Modal
      visible={isModalVisible}
      transparent
      animationType="slide"
      onRequestClose={closeModal}
    >
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.title}>Payment Type</Text>
          <Text style={styles.description}>Payment type selection coming soon...</Text>
          {amount && (
            <Text style={styles.amountText}>Amount: ${amount}</Text>
          )}
          <TouchableOpacity style={styles.button} onPress={closeModal}>
            <Text style={styles.buttonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default PaymentTypeModal;

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
  amountText: {
    ...Fonts.Medium,
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: Colors.yellow,
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
