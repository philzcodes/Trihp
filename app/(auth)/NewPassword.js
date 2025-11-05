import { Ionicons } from '@expo/vector-icons'; // Correct icon library
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    KeyboardAvoidingView, // Good for input-heavy screens
    Platform // Used with KeyboardAvoidingView
    ,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

import { AlertModal } from '../../components';
import { Colors, Fonts } from '../../constants';

const NewPassword = () => {
  const router = useRouter();
  const [newPassword, setNewPassword] = useState('');
  const [verifyPassword, setVerifyPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showVerifyPassword, setShowVerifyPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Alert modal state
  const [alertModal, setAlertModal] = useState({
    visible: false,
    type: 'error',
    title: '',
    message: '',
  });
  
  const showAlert = (type, title, message) => {
    setAlertModal({
      visible: true,
      type,
      title,
      message,
    });
  };
  
  const hideAlert = () => {
    setAlertModal({
      visible: false,
      type: 'error',
      title: '',
      message: '',
    });
  };

  const handleSubmit = async () => {
    if (!newPassword || !verifyPassword) {
      showAlert('error', 'Error', 'Please enter and verify your new password.');
      return;
    }

    if (newPassword.length < 8) {
      showAlert('error', 'Error', 'Password must be at least 8 characters long.');
      return;
    }

    if (newPassword !== verifyPassword) {
      showAlert('error', 'Error', 'New password and verification password do not match.');
      return;
    }

    try {
      setLoading(true);
      // Simulate API call for setting new password
      await new Promise(resolve => setTimeout(resolve, 2000));
      setLoading(false);
      
      showAlert('success', 'Success', 'Your password has been updated successfully!');
      // Navigate to a success screen or home/login after delay
      setTimeout(() => {
        hideAlert();
        // router.replace('/login'); 
      }, 1500);
    } catch (error) {
      setLoading(false);
      showAlert('error', 'Error', 'Failed to update password. Please try again.');
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0} // Adjust as needed
    >
      {/* Back Button (similar to the OTP screen) */}
      <TouchableOpacity 
        style={styles.backButton} 
        onPress={() => router.back()}
        activeOpacity={0.7}
      >
        <Ionicons name="arrow-back" size={24} color={Colors.whiteColor} />
      </TouchableOpacity>
      
      <View style={styles.content}>
        <Text style={styles.title}>New Password</Text>
        
        <Text style={styles.subtitle}>
          Your Password must be at least 8 characters long.
        </Text>

        {/* New Password Input */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            placeholder="Enter new password"
            placeholderTextColor={Colors.grey14}
            secureTextEntry={!showNewPassword} // Toggle visibility
            value={newPassword}
            onChangeText={setNewPassword}
            autoCapitalize="none"
          />
          <TouchableOpacity 
            onPress={() => setShowNewPassword(!showNewPassword)} 
            style={styles.eyeIcon}
          >
            <Ionicons 
              name={showNewPassword ? "eye" : "eye-off"} 
              size={20} 
              color={Colors.grey14} 
            />
          </TouchableOpacity>
        </View>

        {/* Verify New Password Input */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            placeholder="Verify new password"
            placeholderTextColor={Colors.grey14}
            secureTextEntry={!showVerifyPassword} // Toggle visibility
            value={verifyPassword}
            onChangeText={setVerifyPassword}
            autoCapitalize="none"
          />
          <TouchableOpacity 
            onPress={() => setShowVerifyPassword(!showVerifyPassword)} 
            style={styles.eyeIcon}
          >
            <Ionicons 
              name={showVerifyPassword ? "eye" : "eye-off"} 
              size={20} 
              color={Colors.grey14} 
            />
          </TouchableOpacity>
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          style={[styles.submitButton, loading && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={loading || newPassword.length < 8 || newPassword !== verifyPassword}
          activeOpacity={0.8}
        >
          {loading ? (
            <ActivityIndicator color={Colors.blackColor} size="small" />
          ) : (
            <Text style={styles.submitButtonText}>Submit</Text>
          )}
        </TouchableOpacity>

      </View>

      {/* Alert Modal */}
      <AlertModal
        visible={alertModal.visible}
        onClose={hideAlert}
        type={alertModal.type}
        title={alertModal.title}
        message={alertModal.message}
      />
    </KeyboardAvoidingView>
  );
};

export default NewPassword;

// --- Stylesheet ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.blackColor,
    paddingTop: 60, // Adjust based on status bar/notch height
  },
  backButton: {
    position: 'absolute',
    top: 60,
    left: 20,
    zIndex: 10,
    padding: 10,
  },
  content: {
    flex: 1,
    paddingHorizontal: 30, // Horizontal padding for the screen content
    marginTop: 100, // Push content down a bit from the top
  },
  title: {
    ...Fonts.TextBold,
    fontSize: 30, 
    color: Colors.whiteColor,
    marginBottom: 10, // Closer to subtitle than previous screen
  },
  subtitle: {
    ...Fonts.Regular,
    fontSize: 16,
    color: Colors.whiteColor, 
    marginBottom: 50, // More space before inputs
    lineHeight: 24,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.grey10, // Dark grey background for inputs
    borderRadius: 30, // Highly rounded corners for the input fields
    height: 55, // Consistent height with the button
    marginBottom: 20, // Space between inputs
    paddingHorizontal: 20, // Padding for text input
  },
  textInput: {
    flex: 1, // Take up available space
    ...Fonts.Regular,
    fontSize: 16,
    color: Colors.whiteColor,
    height: '100%', // Ensure text input fills its container vertically
  },
  eyeIcon: {
    paddingLeft: 10, // Space between text and icon
  },
  submitButton: {
    width: '100%',
    height: 55,
    borderRadius: 30, 
    backgroundColor: Colors.yellow,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20, // Space after inputs
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    ...Fonts.TextBold,
    fontSize: 18,
    color: Colors.blackColor,
  },
});