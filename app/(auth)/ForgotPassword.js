import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { authAPI } from '../../api/services';
import { TriphButton } from '../../components';
import { Colors, Fonts } from '../../constants';

const ForgotPassword = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSendOTP = async () => {
    if (!email) {
      Alert.alert('Error', 'Please enter your email address');
      return;
    }

    if (!isValidEmail(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
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
          <Text style={styles.headerTitle}>Forgot Password?</Text>
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView 
          style={styles.scrollView} 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Instructional Text */}
          <Text style={styles.instructionText}>
            Dont worry! Enter your email address and we'll send you an OTP to reset your password
          </Text>

          {/* Email Input */}
          <View style={styles.inputWrapper}>
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="Enter email"
              placeholderTextColor="#848484"
              style={styles.input}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          {/* Send OTP Button */}
          <TriphButton
            text={loading ? "Sending..." : "Send OTP"}
            onPress={handleSendOTP}
            loading={loading}
            extraStyle={styles.sendButton}
            extraTextStyle={styles.sendButtonText}
          />

          {/* Back to Login Link */}
          <Pressable
            onPress={() => router.push('/(auth)/Login')}
            style={styles.backToLogin}
          >
            <Ionicons name="arrow-back" size={18} color={Colors.whiteColor} />
            <Text style={styles.backToLoginText}>Back to login</Text>
          </Pressable>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default ForgotPassword;

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
  instructionText: {
    ...Fonts.Regular,
    fontSize: 14,
    color: Colors.whiteColor || '#FFFFFF',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 40,
    paddingHorizontal: 10,
  },
  inputWrapper: {
    marginBottom: 32,
  },
  input: {
    ...Fonts.Regular,
    backgroundColor: '#2A2A2A',
    borderRadius: 25,
    height: 55,
    paddingHorizontal: 20,
    color: Colors.whiteColor || '#FFFFFF',
    fontSize: 16,
    textAlign: 'center',
  },
  sendButton: {
    backgroundColor: Colors.yellow || '#FFD700',
    borderRadius: 50,
    height: 55,
    marginTop: 10,
  },
  sendButtonText: {
    ...Fonts.TextBold,
    color: '#000000',
    fontSize: 16,
  },
  backToLogin: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
    paddingVertical: 12,
  },
  backToLoginText: {
    ...Fonts.Regular,
    fontSize: 14,
    color: Colors.whiteColor || '#FFFFFF',
    marginLeft: 8,
  },
});