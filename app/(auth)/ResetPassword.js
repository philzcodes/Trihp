import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Constant from '../../api/constants';
import { authAPI } from '../../api/services';
import { AlertModal, TriphButton } from '../../components';
import { Colors, Fonts } from '../../constants';

const ResetPassword = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  // Get data from route params
  const email = params.email || '';
  const userType = params.userType || 'RIDER';
  const otp = params.otp || '';
  
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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

  const isValidPassword = (password) => {
    return Constant.passwordValidation.test(password);
  };

  // Password requirements validation
  const checkPasswordRequirements = (value) => {
    return {
      minLength: value.length >= 8,
      hasUppercase: /[A-Z]/.test(value),
      hasNumber: /[0-9]/.test(value),
      hasSpecialChar: /[!@#$%^&*]/.test(value),
    };
  };

  const passwordRequirements = checkPasswordRequirements(newPassword);

  const handleResetPassword = async () => {
    if (!newPassword) {
      showAlert('error', 'Error', 'Please enter a new password');
      return;
    }

    if (!confirmPassword) {
      showAlert('error', 'Error', 'Please confirm your new password');
      return;
    }

    if (!isValidPassword(newPassword)) {
      showAlert(
        'error', 
        'Error',
        'Password must be 8-16 characters long and contain at least one special character (!@#$%^&*)'
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      showAlert('error', 'Error', 'Passwords do not match');
      return;
    }

    try {
      setLoading(true);
      
      const resetData = {
        otp: otp,
        newPassword: newPassword,
        email: email, // Include email for OTP verification
        userType: userType // Include userType if needed
      };

      console.log('Reset password data:', resetData);
      const response = await authAPI.resetPassword(resetData);
      console.log('Reset password response:', response);
      
      setLoading(false);
      
      if (response.success) {
        showAlert('success', 'Success', response.message || 'Password has been reset successfully!');
        
        // Navigate after a short delay to show success message
        setTimeout(() => {
          hideAlert();
          router.replace('/(auth)/Login');
        }, 1500);
      } else {
        showAlert('error', 'Error', response.message || 'Failed to reset password. Please try again.');
      }
      
    } catch (error) {
      setLoading(false);
      console.error('Reset password error:', error);
      
      let errorMessage = 'Failed to reset password. Please try again.';
      if (error.message) {
        errorMessage = error.message;
      } else if (error.error) {
        errorMessage = error.error;
      }
      
      showAlert('error', 'Error', errorMessage);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable 
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color={Colors.whiteColor} />
          </Pressable>
          <Text style={styles.headerTitle}>Reset Password</Text>
          <View style={styles.headerSpacer} />
        </View>
        
        <ScrollView 
          style={styles.scrollView} 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.subtitle}>Enter your new password</Text>

          {/* New Password Input */}
          <View style={styles.inputWrapper}>
            <TextInput
              value={newPassword}
              onChangeText={setNewPassword}
              placeholder="New Password"
              placeholderTextColor={Colors.grey8 || '#666'}
              style={styles.input}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
            />
            <Pressable
              style={styles.eyeIcon}
              onPress={() => setShowPassword(!showPassword)}
            >
              <Ionicons
                name={showPassword ? "eye-outline" : "eye-off-outline"}
                size={22}
                color={Colors.whiteColor}
              />
            </Pressable>
            
            {/* Password Requirements List */}
            {newPassword && (
              <View style={styles.passwordRequirementsContainer}>
                <View style={styles.requirementItem}>
                  <Ionicons 
                    name={passwordRequirements.minLength ? "checkmark-circle" : "ellipse-outline"} 
                    size={18} 
                    color={passwordRequirements.minLength ? "#4CAF50" : "#666666"} 
                  />
                  <Text style={[
                    styles.requirementText,
                    passwordRequirements.minLength && styles.requirementTextMet
                  ]}>
                    At least 8 characters
                  </Text>
                </View>
                
                <View style={styles.requirementItem}>
                  <Ionicons 
                    name={passwordRequirements.hasUppercase ? "checkmark-circle" : "ellipse-outline"} 
                    size={18} 
                    color={passwordRequirements.hasUppercase ? "#4CAF50" : "#666666"} 
                  />
                  <Text style={[
                    styles.requirementText,
                    passwordRequirements.hasUppercase && styles.requirementTextMet
                  ]}>
                    At least one uppercase letter
                  </Text>
                </View>
                
                <View style={styles.requirementItem}>
                  <Ionicons 
                    name={passwordRequirements.hasNumber ? "checkmark-circle" : "ellipse-outline"} 
                    size={18} 
                    color={passwordRequirements.hasNumber ? "#4CAF50" : "#666666"} 
                  />
                  <Text style={[
                    styles.requirementText,
                    passwordRequirements.hasNumber && styles.requirementTextMet
                  ]}>
                    At least one number
                  </Text>
                </View>
                
                <View style={styles.requirementItem}>
                  <Ionicons 
                    name={passwordRequirements.hasSpecialChar ? "checkmark-circle" : "ellipse-outline"} 
                    size={18} 
                    color={passwordRequirements.hasSpecialChar ? "#4CAF50" : "#666666"} 
                  />
                  <Text style={[
                    styles.requirementText,
                    passwordRequirements.hasSpecialChar && styles.requirementTextMet
                  ]}>
                    At least one special character (#$@&%)
                  </Text>
                </View>
              </View>
            )}
          </View>

          {/* Confirm Password Input */}
          <View style={styles.inputWrapper}>
            <TextInput
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="Confirm New Password"
              placeholderTextColor={Colors.grey8 || '#666'}
              style={styles.input}
              secureTextEntry={!showConfirmPassword}
              autoCapitalize="none"
            />
            <Pressable
              style={styles.eyeIcon}
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              <Ionicons
                name={showConfirmPassword ? "eye-outline" : "eye-off-outline"}
                size={22}
                color={Colors.whiteColor}
              />
            </Pressable>
          </View>

          {/* Submit Button */}
          <TriphButton
            text={loading ? "Resetting..." : "Reset Password"}
            onPress={handleResetPassword}
            loading={loading}
            extraStyle={styles.submitButton}
            extraTextStyle={styles.submitButtonText}
          />
        </ScrollView>

        {/* Alert Modal */}
        <AlertModal
          visible={alertModal.visible}
          onClose={hideAlert}
          type={alertModal.type}
          title={alertModal.title}
          message={alertModal.message}
        />
      </View>
    </SafeAreaView>
  );
};

export default ResetPassword;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.blackColor || '#000000',
  },
  container: {
    flex: 1,
    backgroundColor: Colors.blackColor || '#000000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  headerTitle: {
    ...Fonts.TextBold,
    fontSize: 24,
    color: Colors.whiteColor || '#FFFFFF',
    flex: 1,
    textAlign: 'center',
  },
  headerSpacer: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 40,
  },
  subtitle: {
    ...Fonts.Regular,
    fontSize: 14,
    color: Colors.whiteColor || '#FFFFFF',
    textAlign: 'center',
    marginBottom: 40,
  },
  inputWrapper: {
    position: 'relative',
    marginBottom: 16,
  },
  input: {
    ...Fonts.Regular,
    backgroundColor: '#2A2A2A',
    borderRadius: 25,
    height: 55,
    paddingHorizontal: 20,
    paddingRight: 50,
    color: Colors.whiteColor || '#FFFFFF',
    fontSize: 16,
    textAlign: 'center',
  },
  eyeIcon: {
    position: 'absolute',
    right: 20,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    width: 40,
  },
  passwordRequirementsContainer: {
    marginTop: 12,
    marginLeft: 20,
    marginBottom: 5,
  },
  requirementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  requirementText: {
    ...Fonts.Regular,
    fontSize: 13,
    color: '#666666',
    marginLeft: 10,
  },
  requirementTextMet: {
    color: '#4CAF50',
  },
  submitButton: {
    backgroundColor: Colors.yellow || '#FFD700',
    borderRadius: 50,
    height: 55,
    marginTop: 10,
  },
  submitButtonText: {
    ...Fonts.TextBold,
    color: '#000000',
    fontSize: 16,
  },
});
