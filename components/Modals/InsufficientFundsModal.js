import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { Modal, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const InsufficientFundsModal = ({ isVisible, onClose, onCancel }) => {
  return (
    <Modal
      visible={isVisible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <View style={styles.modalContainer}>
          <Pressable onPress={(e) => e.stopPropagation()}>
            {/* Error Icon and Message */}
            <View style={styles.errorContainer}>
              <View style={styles.errorIconWrapper}>
                <MaterialIcons name="error" size={24} color="#FFFFFF" />
              </View>
              <Text style={styles.errorMessage}>Insufficient Funds</Text>
            </View>

            {/* Cancel Button */}
            <TouchableOpacity 
              style={styles.cancelButton} 
              onPress={onCancel || onClose}
              activeOpacity={0.8}
            >
              <Text style={styles.cancelButtonText}>cancel</Text>
            </TouchableOpacity>
          </Pressable>
        </View>
      </Pressable>
    </Modal>
  );
};

export default InsufficientFundsModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '85%',
    maxWidth: 340,
    backgroundColor: '#2A2A2A',
    borderRadius: 16,
    padding: 20,
    paddingBottom: 24,
  },
  errorContainer: {
    backgroundColor: '#8B2E2E',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  errorIconWrapper: {
    marginRight: 10,
  },
  errorMessage: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
  cancelButton: {
    backgroundColor: '#9E9E9E',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000000',
    textTransform: 'lowercase',
  },
});