import { BlurView } from 'expo-blur';
import React from 'react';
import {
    Modal,
    Platform,
    Pressable,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { Colors, Fonts } from '../../constants/Styles';

const RemoveWalletModal = ({
  isVisible,
  onConfirm,
  onCancel,
  walletName = 'Afrimoney',
  accountNumber = '****2344',
}) => {
  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onCancel}
    >
      <View style={styles.modalOverlay}>
        {/* Blur Background for iOS, Dark overlay for Android */}
        {Platform.OS === 'ios' ? (
          <BlurView intensity={20} style={StyleSheet.absoluteFill} tint="dark" />
        ) : (
          <View style={styles.androidOverlay} />
        )}

        {/* Modal Content */}
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {/* Message */}
            <Text style={styles.modalText}>
              Confirm to remove {walletName} wallet ...{accountNumber}
              {'\n'}from your payment methods
            </Text>

            {/* Buttons Container */}
            <View style={styles.buttonsContainer}>
              {/* Confirm Button */}
              <Pressable
                style={({ pressed }) => [
                  styles.button,
                  styles.confirmButton,
                  pressed && styles.confirmButtonPressed,
                ]}
                onPress={onConfirm}
              >
                <Text style={styles.confirmButtonText}>Confirm</Text>
              </Pressable>

              {/* Cancel Button */}
              <Pressable
                style={({ pressed }) => [
                  styles.button,
                  styles.cancelButton,
                  pressed && styles.cancelButtonPressed,
                ]}
                onPress={onCancel}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default RemoveWalletModal;

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
  },
  androidOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
  },
  modalContainer: {
    width: '85%',
    maxWidth: 400,
    paddingHorizontal: 20,
  },
  modalContent: {
    backgroundColor: '#1C1C1E',
    borderRadius: 16,
    paddingTop: 24,
    paddingHorizontal: 20,
    paddingBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
  modalText: {
    ...Fonts.Regular,
    fontSize: 15,
    color: Colors.whiteColor,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
    fontWeight: '400',
  },
  buttonsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  confirmButton: {
    backgroundColor: '#F4D144',
  },
  confirmButtonPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  confirmButtonText: {
    ...Fonts.Medium,
    fontSize: 16,
    color: Colors.blackColor,
    fontWeight: '600',
  },
  cancelButton: {
    backgroundColor: '#E5E5E7',
  },
  cancelButtonPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  cancelButtonText: {
    ...Fonts.Medium,
    fontSize: 16,
    color: Colors.blackColor,
    fontWeight: '600',
  },
});