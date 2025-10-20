import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { authAPI } from '../../api/services';
import { TriphButton } from '../../components';
import { Colors, Fonts } from '../../constants';

const Login = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const onLogin = async () => {
    try {
      console.log('Validating input...');
      
      if (!email) {
        Alert.alert('Error', 'Please enter your email or phone number');
        return;
      }
      
      if (!password) {
        Alert.alert('Error', 'Please enter your password');
        return;
      }

      setLoading(true);
      
      const loginData = {
        emailOrPhone: email,
        password: password,
        userType: 'RIDER' // Default to RIDER for this app
      };

      console.log('Login data being sent:', loginData);
      const response = await authAPI.login(loginData);
      console.log('Login response:', response);
      
      setLoading(false);
      
      if (response.success) {
        Alert.alert('Success', response.message || 'Login successful! Welcome back!');
        
        // Store user data in AsyncStorage if needed
        if (response.data) {
          // You might want to store user data and token here
          console.log('User data:', response.data);
        }
        
        router.replace('/(tabs)/Dashboard');
      } else {
        Alert.alert('Error', response.message || 'Login failed. Please check your credentials.');
      }
      
    } catch (error) {
      setLoading(false);
      console.error('Login error:', error);
      
      if (error.message) {
        Alert.alert('Error', error.message);
      } else if (error.error) {
        Alert.alert('Error', error.error);
      } else {
        Alert.alert('Error', 'Login failed. Please try again.');
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
        <Text style={styles.title}>Login</Text>
        
        {/* Email Input */}
        <View style={styles.inputWrapper}>
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="Enter email or phone number"
            placeholderTextColor={ '#848484'}
            style={styles.input}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        {/* Login with phone number link */}
        <Pressable
          onPress={() => router.push('/LoginWithPhone')}
          style={styles.phoneLoginLink}
        >
          <Text style={styles.phoneLoginText}>Login with phone number</Text>
        </Pressable>
        
        {/* Password Input */}
        <View style={styles.inputWrapper}>
          <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder="Password"
            placeholderTextColor={ '#848484'}
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
              color={Colors.grey8 || '#999'} 
            />
          </Pressable>
        </View>
        
        {/* Forgot Password Link */}
        <Pressable
          onPress={() => router.push('/ForgotPassword')}
          style={styles.forgotPassword}
        >
          <Text style={styles.forgotPasswordText}>Forgot password?</Text>
        </Pressable>

        {/* Done Button */}
        <TriphButton 
          text={loading ? "Processing..." : "Done"} 
          onPress={onLogin}
          loading={loading}
          extraStyle={styles.doneButton}
        />
      </ScrollView>
    </View>
  );
};

export default Login;

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
    paddingTop: 60,
    paddingBottom: 40,
  },
  title: {
    ...Fonts.TextBold,
    fontSize: 32,
    color: Colors.whiteColor || '#FFF',
    textAlign: 'center',
    marginBottom: 60,
  },
  inputWrapper: {
    marginBottom: 15,
    position: 'relative',
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
  phoneLoginLink: {
    alignSelf: 'flex-end',
    // paddingVertical: 12,
    marginBottom: 45,
  },
  phoneLoginText: {
    ...Fonts.Regular,
    color: Colors.whiteColor || '#FFF',
    fontSize: 14,
  },
  eyeIcon: {
    position: 'absolute',
    right: 20,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 5,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    // paddingVertical: 12,
    marginBottom: 45,
  },
  forgotPasswordText: {
    ...Fonts.Regular,
    fontSize: 14,
    color: Colors.whiteColor || '#FFF',
  },
  doneButton: {
    backgroundColor: Colors.yellow || '#FFD700',
    borderRadius: 50,
    height: 55,
  },
});