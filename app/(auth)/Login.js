import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { authAPI } from '../../api/services';
import { TriphButton } from '../../components';
import { Colors, Fonts } from '../../constants';
import useUserStore from '../../store/userStore';

const Login = () => {
  const router = useRouter();
  const { setUserData } = useUserStore();
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
        // Store user data and tokens in AsyncStorage
        if (response.data) {
          const userData = {
            token: response.data.accessToken,
            refreshToken: response.data.refreshToken,
            user: {
              id: response.data.id,
              email: response.data.email,
              firstName: response.data.firstName,
              lastName: response.data.lastName,
              middleName: response.data.middleName,
              phoneNumber: response.data.phoneNumber,
              userType: response.data.userType,
              country: response.data.country,
              gender: response.data.gender,
              walletBalance: response.data.walletBalance,
              isEmailVerified: response.data.isEmailVerified,
              isPhoneVerified: response.data.isPhoneVerified,
              profilePicture: response.data.profilePicture,
              homeAddress: response.data.homeAddress,
              workAddress: response.data.workAddress,
            }
          };
          
          try {
            await AsyncStorage.setItem('userDetail', JSON.stringify(userData));
            console.log('User data saved to AsyncStorage');
            
            // Update Zustand store
            setUserData(userData);
          } catch (storageError) {
            console.error('Error saving user data:', storageError);
          }
        }
        
        Alert.alert('Success', response.message || 'Login successful! Welcome back!');
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
          <Text style={styles.headerTitle}>Login</Text>
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView 
          style={styles.scrollView} 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
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

          {/* Login with phone number link - Centered */}
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
              placeholderTextColor="#848484"
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
          </View>
          
          {/* Forgot Password Link - Right aligned */}
          <Pressable
            onPress={() => router.push('/(auth)/ForgotPassword')}
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
            extraTextStyle={styles.doneButtonText}
          />

          {/* Registration Prompt */}
          <View style={styles.registerContainer}>
            <Text style={styles.registerText}>Don't Have an account? </Text>
            <Pressable onPress={() => router.push('/(auth)/SignUp')}>
              <Text style={styles.registerLink}>Register</Text>
            </Pressable>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default Login;

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
  inputWrapper: {
    marginBottom: 16,
    position: 'relative',
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
  phoneLoginLink: {
    alignSelf: 'flex-end',
    marginBottom: 32,
  },
  phoneLoginText: {
    ...Fonts.Regular,
    color: Colors.whiteColor || '#FFFFFF',
    fontSize: 14,
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
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 45,
  },
  forgotPasswordText: {
    ...Fonts.Regular,
    fontSize: 14,
    color: Colors.whiteColor || '#FFFFFF',
  },
  doneButton: {
    backgroundColor: Colors.yellow || '#FFD700',
    borderRadius: 50,
    height: 55,
    marginTop: 10,
  },
  doneButtonText: {
    ...Fonts.TextBold,
    color: '#000000',
    fontSize: 16,
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
    paddingBottom: 20,
  },
  registerText: {
    ...Fonts.Regular,
    fontSize: 14,
    color: Colors.whiteColor || '#FFFFFF',
  },
  registerLink: {
    ...Fonts.TextBold,
    fontSize: 14,
    color: Colors.yellow || '#FFD700',
  },
});