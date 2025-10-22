import { Entypo } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { authAPI } from '../../api/services';
// Assuming Colors and Fonts are defined in '../../constants' as per original code
import { Colors, Fonts } from '../../constants';

const ChangePassword = () => {
  const router = useRouter();
  
  // State for all password fields
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // State for password visibility
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // State for loading and validation
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Regex for password strength validation
  const passwordRequirements = {
    minLength: 8,
    hasUppercase: /[A-Z]/,
    hasDigit: /[0-9]/,
  };

  // Validation function
  const validateForm = () => {
    const newErrors = {};

    // Current password validation
    if (!currentPassword.trim()) {
      newErrors.currentPassword = 'Please enter your current password';
    }

    // New password validation
    if (!newPassword.trim()) {
      newErrors.newPassword = 'Please enter a new password';
    } else if (newPassword.length < passwordRequirements.minLength) {
      newErrors.newPassword = `Password must be at least ${passwordRequirements.minLength} characters long`;
    } else if (!passwordRequirements.hasUppercase.test(newPassword)) {
      newErrors.newPassword = 'Password must contain at least one uppercase letter';
    } else if (!passwordRequirements.hasDigit.test(newPassword)) {
      newErrors.newPassword = 'Password must contain at least one digit';
    }

    // Confirm password validation
    if (!confirmPassword.trim()) {
      newErrors.confirmPassword = 'Please confirm your new password';
    } else if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = 'New passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChangePassword = async () => {
    // Clear previous errors
    setErrors({});

    // Validate form
    if (!validateForm()) {
      return;
    }

    // Show confirmation dialog
    Alert.alert(
      'Update Password',
      'Are you sure you want to update your password?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Update', 
          onPress: async () => {
            await changePassword();
          }
        }
      ]
    );
  };

  const changePassword = async () => {
    try {
      setIsLoading(true);
      
      const changePasswordData = {
        currentPassword,
        newPassword,
        confirmPassword
      };

      const response = await authAPI.changePassword(changePasswordData);
      
      Alert.alert(
        'Success', 
        'Password updated successfully',
        [
          {
            text: 'OK',
            onPress: () => {
              // Clear form
              setCurrentPassword('');
              setNewPassword('');
              setConfirmPassword('');
              // Navigate back
              router.back();
            }
          }
        ]
      );
      
    } catch (error) {
      console.error('Change password error:', error);
      
      let errorMessage = 'Failed to update password. Please try again.';
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      Alert.alert('Error', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        {/* Back Button */}
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Entypo name="chevron-left" size={24} color={Colors.whiteColor} />
        </Pressable>
        {/* Header Title from image */}
        <Text style={styles.headerTitle}>Trihp Account</Text>
      </View>

      <View style={styles.content}>
        {/* Password Title from image */}
        <Text style={styles.title}>Password</Text>
        
        {/* Password Requirements Description from image */}
        <Text style={styles.description}>
          Your Password must be at least {passwordRequirements.minLength} characters 
          long and contain one upper case letter and one digit.
        </Text>

        {/* --- Current Password Input --- */}
        <View style={styles.inputContainer}>
          <View style={styles.passwordInputWrapper}>
            <TextInput
              style={styles.passwordInput}
              value={currentPassword}
              onChangeText={setCurrentPassword}
              placeholder="Current password"
              placeholderTextColor={Colors.whiteColor}
              secureTextEntry={!showCurrentPassword}
              keyboardType="default" 
              autoCapitalize="none"
            />
            <Pressable
              style={styles.eyeButton}
              onPress={() => setShowCurrentPassword(!showCurrentPassword)}
            >
              <Entypo
                name={showCurrentPassword ? 'eye' : 'eye-with-line'}
                size={20}
                color={Colors.whiteColor}
              />
            </Pressable>
          </View>
          {errors.currentPassword && (
            <Text style={styles.errorText}>{errors.currentPassword}</Text>
          )}
        </View>
        <View style={styles.inputContainer}>
          <View style={styles.passwordInputWrapper}>
            <TextInput
              style={styles.passwordInput}
              value={newPassword}
              onChangeText={setNewPassword}
              placeholder="New password"
              placeholderTextColor={Colors.whiteColor}
              secureTextEntry={!showNewPassword}
              // Added keyboardType and autoCapitalize for better UX/Security
              keyboardType="default" 
              autoCapitalize="none"
              // The text is black in the input, which is incorrect for dark mode, using Colors.whiteColor
            />
            <Pressable
              style={styles.eyeButton}
              onPress={() => setShowNewPassword(!showNewPassword)}
            >
              <Entypo
                name={showNewPassword ? 'eye' : 'eye-with-line'}
                size={20}
                color={Colors.whiteColor} // Eye icon color
              />
            </Pressable>
          </View>
          {errors.newPassword && (
            <Text style={styles.errorText}>{errors.newPassword}</Text>
          )}
        </View>

        {/* --- Confirm New Password Input --- */}
        <View style={styles.inputContainer}>
          <View style={styles.passwordInputWrapper}>
            <TextInput
              style={styles.passwordInput}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="Confirm new password"
              placeholderTextColor={Colors.whiteColor}
              secureTextEntry={!showConfirmPassword}
              keyboardType="default"
              autoCapitalize="none"
            />
            <Pressable
              style={styles.eyeButton}
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              <Entypo
                name={showConfirmPassword ? 'eye' : 'eye-with-line'}
                size={20}
                color={Colors.whiteColor} // Eye icon color
              />
            </Pressable>
          </View>
          {errors.confirmPassword && (
            <Text style={styles.errorText}>{errors.confirmPassword}</Text>
          )}
        </View>

        {/* --- Update Button --- */}
        <Pressable 
          style={[styles.updateButton, isLoading && styles.updateButtonDisabled]} 
          onPress={handleChangePassword}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color={Colors.blackColor} size="small" />
          ) : (
            <Text style={styles.updateButtonText}>Update</Text>
          )}
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

// --- Stylesheet for Visual Accuracy ---

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.blackColor, // Assuming a dark background
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    // Removed border as it's not visible in the top section of the image
  },
  backButton: {
    padding: 5, // Increased hit area
  },
  headerTitle: {
    ...Fonts.Regular,
    fontSize: 20, // Adjusted font size to look closer to the image
    color: Colors.whiteColor,
    fontWeight: 'bold',
    marginLeft: 15, // Space between back arrow and title
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 10, // Adjust spacing from header
  },
  // Re-styling for the primary text elements
  title: {
    ...Fonts.Regular,
    fontSize: 28, // Prominent 'Password' title
    color: Colors.whiteColor,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  description: {
    ...Fonts.Regular,
    fontSize: 15,
    color: Colors.whiteColor,
    opacity: 0.8, // Slightly lower opacity for secondary text
    marginBottom: 40, // Large gap after description
    lineHeight: 22,
  },

  // --- Input Field Styles (Key visual elements) ---
  inputContainer: {
    marginBottom: 20, // Spacing between inputs
  },
  passwordInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    // The key styling: large, rounded, dark background, no border
    backgroundColor: '#262626', // A darker grey for the input background
    borderRadius: 30, // Highly rounded corners
    paddingHorizontal: 20,
    height: 60, // A fixed height to match the large appearance
  },
  passwordInput: {
    flex: 1,
    ...Fonts.Regular,
    fontSize: 16,
    color: Colors.whiteColor,
    paddingVertical: 10, // Adjust vertical padding for centered text
  },
  eyeButton: {
    padding: 5,
    marginLeft: 10, // Space between text and icon
  },

  // --- Update Button Styles (Key visual elements) ---
  updateButton: {
    backgroundColor: Colors.yellow, // Assuming a 'yellow' color constant for the main button
    borderRadius: 30, // Highly rounded corners to match inputs
    paddingVertical: 18, // Large vertical padding
    alignItems: 'center',
    marginTop: 40, // Large margin to push it down
  },
  updateButtonText: {
    ...Fonts.Regular,
    fontSize: 18, // Slightly larger, bold text
    color: Colors.blackColor,
    fontWeight: 'bold',
  },
  updateButtonDisabled: {
    opacity: 0.6,
  },
  errorText: {
    ...Fonts.Regular,
    fontSize: 14,
    color: '#FF3B30', // Red color for errors
    marginTop: 5,
    marginLeft: 5,
  },
});

export default ChangePassword;