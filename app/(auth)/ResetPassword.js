import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import Constant from '../../api/constants';
import { authAPI } from '../../api/services';
import { TriphButton } from '../../components';
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

  const isValidPassword = (password) => {
    return Constant.passwordValidation.test(password);
  };

  const handleResetPassword = async () => {
    if (!newPassword) {
      Alert.alert('Error', 'Please enter a new password');
      return;
    }

    if (!confirmPassword) {
      Alert.alert('Error', 'Please confirm your new password');
      return;
    }

    if (!isValidPassword(newPassword)) {
      Alert.alert(
        'Error', 
        'Password must be 8-16 characters long and contain at least one special character (!@#$%^&*)'
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    try {
      setLoading(true);
      
      const resetData = {
        otp: otp,
        newPassword: newPassword
      };

      console.log('Reset password data:', resetData);
      const response = await authAPI.resetPassword(resetData);
      console.log('Reset password response:', response);
      
      setLoading(false);
      
      if (response.success) {
        Alert.alert(
          'Success',
          response.message || 'Password has been reset successfully!',
          [
            {
              text: 'OK',
              onPress: () => router.replace('/(auth)/Login'),
            },
          ]
        );
      } else {
        Alert.alert('Error', response.message || 'Failed to reset password. Please try again.');
      }
      
    } catch (error) {
      setLoading(false);
      console.error('Reset password error:', error);
      
      if (error.message) {
        Alert.alert('Error', error.message);
      } else if (error.error) {
        Alert.alert('Error', error.error);
      } else {
        Alert.alert('Error', 'Failed to reset password. Please try again.');
      }
    }
  };

  return (
    <View style={styles.container}>
      <Pressable onPress={() => router.back()} style={styles.backButton}>
        <Ionicons name="arrow-back" size={24} color={Colors.whiteColor} />
      </Pressable>
      
      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Reset Password</Text>
        <Text style={styles.subtitle}>Enter your new password</Text>

        {/* New Password Input */}
        <View style={styles.inputWrapper}>
          <TextInput
            value={newPassword}
            onChangeText={setNewPassword}
            placeholder="New Password"
            placeholderTextColor={Colors.grey8}
            style={styles.input}
            secureTextEntry={!showPassword}
            autoCapitalize="none"
          />
          <Pressable
            style={styles.eyeIcon}
            onPress={() => setShowPassword(!showPassword)}
          >
            <Ionicons
              name={showPassword ? 'eye-off' : 'eye'}
              size={20}
              color={Colors.grey8}
            />
          </Pressable>
        </View>

        {/* Confirm Password Input */}
        <View style={styles.inputWrapper}>
          <TextInput
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholder="Confirm New Password"
            placeholderTextColor={Colors.grey8}
            style={styles.input}
            secureTextEntry={!showConfirmPassword}
            autoCapitalize="none"
          />
          <Pressable
            style={styles.eyeIcon}
            onPress={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            <Ionicons
              name={showConfirmPassword ? 'eye-off' : 'eye'}
              size={20}
              color={Colors.grey8}
            />
          </Pressable>
        </View>

        {/* Password Requirements */}
        <View style={styles.requirementsContainer}>
          <Text style={styles.requirementsTitle}>Password Requirements:</Text>
          <Text style={styles.requirementText}>• 8-16 characters long</Text>
          <Text style={styles.requirementText}>• At least one special character (!@#$%^&*)</Text>
        </View>

        {/* Submit Button */}
        <TriphButton
          text={loading ? "Resetting..." : "Reset Password"}
          onPress={handleResetPassword}
          loading={loading}
          extraStyle={styles.submitButton}
        />
      </ScrollView>
    </View>
  );
};

export default ResetPassword;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.blackColor || '#000',
    paddingTop: 50,
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 1,
    padding: 10,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  scrollContent: {
    paddingTop: 60,
    paddingBottom: 20,
  },
  title: {
    ...Fonts.TextBold,
    fontSize: 32,
    color: Colors.whiteColor || '#FFF',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    ...Fonts.Regular,
    fontSize: 16,
    color: Colors.grey8 || '#999',
    textAlign: 'center',
    marginBottom: 50,
  },
  inputWrapper: {
    position: 'relative',
    marginBottom: 20,
  },
  input: {
    ...Fonts.Regular,
    backgroundColor: Colors.grey11 || '#2A2A2A',
    borderRadius: 25,
    height: 55,
    paddingHorizontal: 20,
    paddingRight: 50,
    color: Colors.whiteColor || '#FFF',
    fontSize: 16,
  },
  eyeIcon: {
    position: 'absolute',
    right: 20,
    top: '50%',
    transform: [{ translateY: -10 }],
    padding: 5,
  },
  requirementsContainer: {
    backgroundColor: Colors.grey11 || '#2A2A2A',
    borderRadius: 15,
    padding: 15,
    marginBottom: 30,
  },
  requirementsTitle: {
    ...Fonts.Medium,
    fontSize: 14,
    color: Colors.whiteColor || '#FFF',
    marginBottom: 8,
  },
  requirementText: {
    ...Fonts.Regular,
    fontSize: 12,
    color: Colors.grey8 || '#999',
    marginBottom: 4,
  },
  submitButton: {
    backgroundColor: Colors.yellow || '#FFD700',
    borderRadius: 25,
    height: 55,
  },
});
