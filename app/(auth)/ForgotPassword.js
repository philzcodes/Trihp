import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { authAPI } from '../../api/services';
import { TriphButton } from '../../components';
import { Colors, Fonts } from '../../constants';

const ResetPassword = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [verifyEmail, setVerifyEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleResetPassword = async () => {
    if (!email) {
      Alert.alert('Error', 'Please enter your email address');
      return;
    }

    if (!verifyEmail) {
      Alert.alert('Error', 'Please verify your email address');
      return;
    }

    if (!isValidEmail(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    if (email !== verifyEmail) {
      Alert.alert('Error', 'Email addresses do not match');
      return;
    }

    try {
      setLoading(true);
      
      const forgotPasswordData = {
        email: email,
        userType: 'RIDER' // Default to RIDER for this app
      };

      console.log('Forgot password data:', forgotPasswordData);
      const response = await authAPI.forgotPassword(forgotPasswordData);
      console.log('Forgot password response:', response);
      
      setLoading(false);
      
      if (response.success) {
        Alert.alert(
          'Success',
          response.message || 'Password reset OTP has been sent to your email address.',
          [
            {
              text: 'OK',
              onPress: () => router.push({
                pathname: '/(auth)/OTP',
                params: {
                  email: email,
                  userType: 'RIDER',
                  fromForgotPassword: true
                }
              }),
            },
          ]
        );
      } else {
        Alert.alert('Error', response.message || 'Failed to send reset instructions. Please try again.');
      }
      
    } catch (error) {
      setLoading(false);
      console.error('Forgot password error:', error);
      
      if (error.message) {
        Alert.alert('Error', error.message);
      } else if (error.error) {
        Alert.alert('Error', error.error);
      } else {
        Alert.alert('Error', 'Failed to send reset instructions. Please try again.');
      }
    }
  };

  return (
    <View style={styles.container}>
      {/* <BackButton onPress={() => router.back()} /> */}
      
      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Reset Password</Text>

        {/* Enter Email Input */}
        <View style={styles.inputWrapper}>
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="Enter email"
            placeholderTextColor={ '#848484'}
            style={styles.input}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        {/* Verify Email Input */}
        <View style={styles.inputWrapper}>
          <TextInput
            value={verifyEmail}
            onChangeText={setVerifyEmail}
            placeholder="Verify email"
            placeholderTextColor={ '#848484'}
            style={styles.input}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        {/* Submit Button */}
        <TriphButton
          text={loading ? "Submitting..." : "Submit"}
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
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  scrollContent: {
    paddingTop: 20,
    paddingBottom: 20,
  },
  title: {
    ...Fonts.TextBold,
    fontSize: 32,
    color: Colors.whiteColor || '#FFF',
    textAlign: 'center',
    marginBottom: 100,
  },
  inputWrapper: {
    marginBottom: 60,
  },
  input: {
    ...Fonts.Regular,
    backgroundColor: Colors.grey11 || '#2A2A2A',
    borderRadius: 25,
    height: 55,
    paddingHorizontal: 20,
    color: Colors.whiteColor || '#FFF',
    fontSize: 16,
    textAlign: 'center',
  },
  submitButton: {
    backgroundColor: Colors.yellow || '#FFD700',
    borderRadius: 25,
    height: 55,
    // marginTop: 10,
  },
});