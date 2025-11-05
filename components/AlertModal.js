import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors, Fonts } from '../constants';

const AlertModal = ({ 
  visible, 
  onClose, 
  type = 'error', // 'success' or 'error'
  title, 
  message,
  buttonText = 'OK'
}) => {
  const isSuccess = type === 'success';
  const iconName = isSuccess ? 'checkmark-circle' : 'close-circle';
  const iconColor = isSuccess ? Colors.green || '#4CAF50' : Colors.red || '#FF2F2F';
  const defaultTitle = isSuccess ? 'Success' : 'Error';

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          {/* Icon */}
          <View style={[styles.iconContainer, { borderColor: iconColor }]}>
            <Ionicons 
              name={iconName} 
              size={48} 
              color={iconColor} 
            />
          </View>

          {/* Title */}
          <Text style={styles.title}>
            {title || defaultTitle}
          </Text>

          {/* Message */}
          <Text style={styles.message}>
            {message}
          </Text>

          {/* Button */}
          <TouchableOpacity
            style={[styles.button, { backgroundColor: iconColor }]}
            onPress={onClose}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>
              {buttonText}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default AlertModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modalContainer: {
    backgroundColor: Colors.grey11 || '#2A2A2A',
    borderRadius: 20,
    padding: 30,
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.grey10 || '#545454',
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: 'transparent',
  },
  title: {
    ...Fonts.TextBold,
    fontSize: 22,
    color: Colors.whiteColor || '#FFFFFF',
    marginBottom: 12,
    textAlign: 'center',
  },
  message: {
    ...Fonts.Regular,
    fontSize: 16,
    color: Colors.grey8 || '#E4E4E4',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 30,
  },
  button: {
    width: '100%',
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    ...Fonts.TextBold,
    fontSize: 16,
    color: Colors.whiteColor || '#FFFFFF',
  },
});

