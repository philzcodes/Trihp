import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { BackButton, TriphButton } from '../../components';
import { Colors, Fonts } from '../../constants';

const Register = () => {
  const router = useRouter();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [lastName, setLastName] = useState('');
  const [gender, setGender] = useState('Male');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState({
    code: 'GB',
    callingCode: '44',
    flag: '🇬🇧',
    name: 'United Kingdom'
  });
  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    if (!phoneNumber || !email || !password || !confirmPassword || !firstName || !lastName) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    if (phoneNumber.length < 9) {
      Alert.alert('Error', 'Please enter a valid phone number');
      return;
    }

    if (!email.includes('@')) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    try {
      setLoading(true);
      
      const userData = {
        phone: phoneNumber,
        country_code: `+${selectedCountry.callingCode}`,
        phone_number: `+${selectedCountry.callingCode}${phoneNumber}`,
        email,
        password,
        first_name: firstName,
        middle_name: middleName,
        last_name: lastName,
        gender
      };

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setLoading(false);
      
      Alert.alert('Success', 'Registration successful!');
      router.push('/Login');
      
    } catch (error) {
      setLoading(false);
      Alert.alert('Error', 'Registration failed. Please try again.');
    }
  };

  const handleCountrySelect = () => {
    Alert.alert('Country Selection', 'Country selector would open here');
  };

  return (
    <View style={styles.container}>
      <BackButton onPress={() => router.back()} />
      
      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Register</Text>
        
        {/* Phone Number Input with Country Selector */}
        <View style={styles.inputWrapper}>
          <View style={styles.phoneInputContainer}>
            <Pressable 
              style={styles.flagContainer}
              onPress={handleCountrySelect}
            >
              <Text style={styles.flagText}>{selectedCountry.flag}</Text>
              <MaterialIcons 
                name="arrow-drop-down" 
                size={20} 
                color={Colors.grey8 || '#999'} 
              />
            </Pressable>
            
            <View style={styles.phoneNumberWrapper}>
              <Text style={styles.countryCode}>+{selectedCountry.callingCode}</Text>
              <TextInput
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                placeholder="Enter Phone Number"
                placeholderTextColor={Colors.grey8 || '#666'}
                style={styles.phoneInput}
                keyboardType="phone-pad"
              />
            </View>
          </View>
        </View>

        {/* Email Input */}
        <View style={styles.inputWrapper}>
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="Enter email"
            placeholderTextColor={Colors.grey8 || '#666'}
            style={styles.input}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        {/* Password Input */}
        <View style={styles.inputWrapper}>
          <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder="Password"
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
              color={Colors.grey8 || '#999'} 
            />
          </Pressable>
        </View>

        {/* Confirm Password Input */}
        <View style={styles.inputWrapper}>
          <TextInput
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholder="Confirm Password"
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
              color={Colors.grey8 || '#999'} 
            />
          </Pressable>
        </View>

        {/* First Name Input */}
        <View style={styles.inputWrapper}>
          <TextInput
            value={firstName}
            onChangeText={setFirstName}
            placeholder="First Name"
            placeholderTextColor={Colors.grey8 || '#666'}
            style={styles.input}
          />
        </View>

        {/* Middle Name Input */}
        <View style={styles.inputWrapper}>
          <TextInput
            value={middleName}
            onChangeText={setMiddleName}
            placeholder="Middle Name (Optional)"
            placeholderTextColor={Colors.grey8 || '#666'}
            style={styles.input}
          />
        </View>

        {/* Last Name Input */}
        <View style={styles.inputWrapper}>
          <TextInput
            value={lastName}
            onChangeText={setLastName}
            placeholder="Last Name"
            placeholderTextColor={Colors.grey8 || '#666'}
            style={styles.input}
          />
        </View>

        {/* Gender Selection */}
        <View style={styles.genderContainer}>
          <Pressable 
            style={styles.genderOption}
            onPress={() => setGender('Male')}
          >
            <View style={styles.radioOuter}>
              {gender === 'Male' && <View style={styles.radioInner} />}
            </View>
            <Text style={styles.genderText}>Male</Text>
          </Pressable>

          {/* <View style={styles.genderDivider} /> */}

          <Pressable 
            style={styles.genderOption}
            onPress={() => setGender('Female')}
          >
            <View style={styles.radioOuter}>
              {gender === 'Female' && <View style={styles.radioInner} />}
            </View>
            <Text style={styles.genderText}>Female</Text>
          </Pressable>
        </View>

        {/* Terms and Conditions */}
        <View style={styles.termsContainer}>
          <Text style={styles.termsText}>
            By proceeding, you accept the{' '}
            <Text style={styles.termsLink}>Terms & Condition</Text>
            {'\n'}for using this service
          </Text>
        </View>

        {/* Continue Button */}
        <TriphButton
          text={loading ? "Processing..." : "Continue"}
          onPress={onSubmit}
          loading={loading}
          extraStyle={styles.continueButton}
        />

        {/* Login Link */}
        <View style={styles.loginContainer}>
          <Text style={styles.loginText}>Have an Account already? </Text>
          <Pressable onPress={() => router.push('/Login')}>
            <Text style={styles.loginLink}>Login</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
};

export default Register;

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
    paddingBottom: 40,
  },
  title: {
    ...Fonts.TextBold,
    fontSize: 32,
    color: Colors.whiteColor || '#FFF',
    textAlign: 'center',
    marginBottom: 35,
    marginTop: 10,
  },
  inputWrapper: {
    marginBottom: 15,
    position: 'relative',
  },
  phoneInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.grey11 || '#2A2A2A',
    borderRadius: 25,
    height: 55,
    paddingHorizontal: 5,
  },
  flagContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 12,
  },
  flagText: {
    fontSize: 24,
    marginRight: 3,
  },
  phoneNumberWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  countryCode: {
    ...Fonts.Regular,
    color: Colors.whiteColor || '#FFF',
    fontSize: 16,
    marginLeft: 10,
  },
  phoneInput: {
    flex: 1,
    ...Fonts.Regular,
    color: Colors.whiteColor || '#FFF',
    fontSize: 16,
    paddingHorizontal: 15,
    height: '100%',
  },
  input: {
    ...Fonts.Regular,
    backgroundColor: Colors.grey11 || '#2A2A2A',
    borderRadius: 25,
    height: 55,
    paddingHorizontal: 20,
    color: Colors.whiteColor || '#FFF',
    fontSize: 16,
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
  genderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  genderOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  genderDivider: {
    width: 1,
    height: 20,
    backgroundColor: Colors.grey8 || '#444',
  },
  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: Colors.whiteColor || '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.whiteColor || '#FFF',
  },
  genderText: {
    ...Fonts.Regular,
    color: Colors.whiteColor || '#FFF',
    fontSize: 16,
  },
  termsContainer: {
    marginBottom: 20,
    // paddingHorizontal: 10,
  },
  termsText: {
    ...Fonts.Regular,
    color: Colors.whiteColor || '#FFF',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  termsLink: {
    ...Fonts.TextBold,
    color: Colors.yellow || '#FFD700',
  },
  continueButton: {
    marginBottom: 20,
    backgroundColor: Colors.yellow || '#FFD700',
    borderRadius: 25,
    height: 55,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  loginText: {
    ...Fonts.Regular,
    color: Colors.whiteColor || '#FFF',
    fontSize: 15,
  },
  loginLink: {
    ...Fonts.TextBold,
    color: Colors.yellow || '#FFD700',
    fontSize: 15,
  },
});