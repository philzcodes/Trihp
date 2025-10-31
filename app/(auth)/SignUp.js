import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, FlatList, Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Constant from '../../api/constants';
import { authAPI } from '../../api/services';
import { BackButton, TriphButton } from '../../components';
import { Colors, Fonts } from '../../constants';

// Country data
const countries = [
  { code: 'NG', callingCode: '234', flag: '🇳🇬', name: 'Nigeria' },
  { code: 'US', callingCode: '1', flag: '🇺🇸', name: 'United States' },
  { code: 'GB', callingCode: '44', flag: '🇬🇧', name: 'United Kingdom' },
  { code: 'CA', callingCode: '1', flag: '🇨🇦', name: 'Canada' },
  { code: 'AU', callingCode: '61', flag: '🇦🇺', name: 'Australia' },
  { code: 'DE', callingCode: '49', flag: '🇩🇪', name: 'Germany' },
  { code: 'FR', callingCode: '33', flag: '🇫🇷', name: 'France' },
  { code: 'IT', callingCode: '39', flag: '🇮🇹', name: 'Italy' },
  { code: 'ES', callingCode: '34', flag: '🇪🇸', name: 'Spain' },
  { code: 'NL', callingCode: '31', flag: '🇳🇱', name: 'Netherlands' },
  { code: 'BE', callingCode: '32', flag: '🇧🇪', name: 'Belgium' },
  { code: 'CH', callingCode: '41', flag: '🇨🇭', name: 'Switzerland' },
  { code: 'AT', callingCode: '43', flag: '🇦🇹', name: 'Austria' },
  { code: 'SE', callingCode: '46', flag: '🇸🇪', name: 'Sweden' },
  { code: 'NO', callingCode: '47', flag: '🇳🇴', name: 'Norway' },
  { code: 'DK', callingCode: '45', flag: '🇩🇰', name: 'Denmark' },
  { code: 'FI', callingCode: '358', flag: '🇫🇮', name: 'Finland' },
  { code: 'PL', callingCode: '48', flag: '🇵🇱', name: 'Poland' },
  { code: 'CZ', callingCode: '420', flag: '🇨🇿', name: 'Czech Republic' },
  { code: 'HU', callingCode: '36', flag: '🇭🇺', name: 'Hungary' },
  { code: 'RO', callingCode: '40', flag: '🇷🇴', name: 'Romania' },
  { code: 'BG', callingCode: '359', flag: '🇧🇬', name: 'Bulgaria' },
  { code: 'GR', callingCode: '30', flag: '🇬🇷', name: 'Greece' },
  { code: 'PT', callingCode: '351', flag: '🇵🇹', name: 'Portugal' },
  { code: 'IE', callingCode: '353', flag: '🇮🇪', name: 'Ireland' },
  { code: 'LU', callingCode: '352', flag: '🇱🇺', name: 'Luxembourg' },
  { code: 'MT', callingCode: '356', flag: '🇲🇹', name: 'Malta' },
  { code: 'CY', callingCode: '357', flag: '🇨🇾', name: 'Cyprus' },
  { code: 'EE', callingCode: '372', flag: '🇪🇪', name: 'Estonia' },
  { code: 'LV', callingCode: '371', flag: '🇱🇻', name: 'Latvia' },
  { code: 'LT', callingCode: '370', flag: '🇱🇹', name: 'Lithuania' },
  { code: 'SI', callingCode: '386', flag: '🇸🇮', name: 'Slovenia' },
  { code: 'SK', callingCode: '421', flag: '🇸🇰', name: 'Slovakia' },
  { code: 'HR', callingCode: '385', flag: '🇭🇷', name: 'Croatia' },
  { code: 'IN', callingCode: '91', flag: '🇮🇳', name: 'India' },
  { code: 'CN', callingCode: '86', flag: '🇨🇳', name: 'China' },
  { code: 'JP', callingCode: '81', flag: '🇯🇵', name: 'Japan' },
  { code: 'KR', callingCode: '82', flag: '🇰🇷', name: 'South Korea' },
  { code: 'SG', callingCode: '65', flag: '🇸🇬', name: 'Singapore' },
  { code: 'MY', callingCode: '60', flag: '🇲🇾', name: 'Malaysia' },
  { code: 'TH', callingCode: '66', flag: '🇹🇭', name: 'Thailand' },
  { code: 'PH', callingCode: '63', flag: '🇵🇭', name: 'Philippines' },
  { code: 'ID', callingCode: '62', flag: '🇮🇩', name: 'Indonesia' },
  { code: 'VN', callingCode: '84', flag: '🇻🇳', name: 'Vietnam' },
  { code: 'BR', callingCode: '55', flag: '🇧🇷', name: 'Brazil' },
  { code: 'AR', callingCode: '54', flag: '🇦🇷', name: 'Argentina' },
  { code: 'MX', callingCode: '52', flag: '🇲🇽', name: 'Mexico' },
  { code: 'CL', callingCode: '56', flag: '🇨🇱', name: 'Chile' },
  { code: 'CO', callingCode: '57', flag: '🇨🇴', name: 'Colombia' },
  { code: 'PE', callingCode: '51', flag: '🇵🇪', name: 'Peru' },
  { code: 'ZA', callingCode: '27', flag: '🇿🇦', name: 'South Africa' },
  { code: 'EG', callingCode: '20', flag: '🇪🇬', name: 'Egypt' },
  { code: 'KE', callingCode: '254', flag: '🇰🇪', name: 'Kenya' },
  { code: 'GH', callingCode: '233', flag: '🇬🇭', name: 'Ghana' },
  { code: 'MA', callingCode: '212', flag: '🇲🇦', name: 'Morocco' },
  { code: 'TN', callingCode: '216', flag: '🇹🇳', name: 'Tunisia' },
  { code: 'DZ', callingCode: '213', flag: '🇩🇿', name: 'Algeria' },
  { code: 'LY', callingCode: '218', flag: '🇱🇾', name: 'Libya' },
  { code: 'SD', callingCode: '249', flag: '🇸🇩', name: 'Sudan' },
  { code: 'ET', callingCode: '251', flag: '🇪🇹', name: 'Ethiopia' },
  { code: 'UG', callingCode: '256', flag: '🇺🇬', name: 'Uganda' },
  { code: 'TZ', callingCode: '255', flag: '🇹🇿', name: 'Tanzania' },
  { code: 'RW', callingCode: '250', flag: '🇷🇼', name: 'Rwanda' },
  { code: 'BI', callingCode: '257', flag: '🇧🇮', name: 'Burundi' },
  { code: 'MW', callingCode: '265', flag: '🇲🇼', name: 'Malawi' },
  { code: 'ZM', callingCode: '260', flag: '🇿🇲', name: 'Zambia' },
  { code: 'ZW', callingCode: '263', flag: '🇿🇼', name: 'Zimbabwe' },
  { code: 'BW', callingCode: '267', flag: '🇧🇼', name: 'Botswana' },
  { code: 'NA', callingCode: '264', flag: '🇳🇦', name: 'Namibia' },
  { code: 'SZ', callingCode: '268', flag: '🇸🇿', name: 'Eswatini' },
  { code: 'LS', callingCode: '266', flag: '🇱🇸', name: 'Lesotho' },
  { code: 'MG', callingCode: '261', flag: '🇲🇬', name: 'Madagascar' },
  { code: 'MU', callingCode: '230', flag: '🇲🇺', name: 'Mauritius' },
  { code: 'SC', callingCode: '248', flag: '🇸🇨', name: 'Seychelles' },
  { code: 'KM', callingCode: '269', flag: '🇰🇲', name: 'Comoros' },
  { code: 'DJ', callingCode: '253', flag: '🇩🇯', name: 'Djibouti' },
  { code: 'SO', callingCode: '252', flag: '🇸🇴', name: 'Somalia' },
  { code: 'ER', callingCode: '291', flag: '🇪🇷', name: 'Eritrea' },
  { code: 'SS', callingCode: '211', flag: '🇸🇸', name: 'South Sudan' },
  { code: 'CF', callingCode: '236', flag: '🇨🇫', name: 'Central African Republic' },
  { code: 'TD', callingCode: '235', flag: '🇹🇩', name: 'Chad' },
  { code: 'CM', callingCode: '237', flag: '🇨🇲', name: 'Cameroon' },
  { code: 'GQ', callingCode: '240', flag: '🇬🇶', name: 'Equatorial Guinea' },
  { code: 'GA', callingCode: '241', flag: '🇬🇦', name: 'Gabon' },
  { code: 'CG', callingCode: '242', flag: '🇨🇬', name: 'Republic of the Congo' },
  { code: 'CD', callingCode: '243', flag: '🇨🇩', name: 'Democratic Republic of the Congo' },
  { code: 'AO', callingCode: '244', flag: '🇦🇴', name: 'Angola' },
  { code: 'ST', callingCode: '239', flag: '🇸🇹', name: 'São Tomé and Príncipe' },
  { code: 'CV', callingCode: '238', flag: '🇨🇻', name: 'Cape Verde' },
  { code: 'GM', callingCode: '220', flag: '🇬🇲', name: 'Gambia' },
  { code: 'SN', callingCode: '221', flag: '🇸🇳', name: 'Senegal' },
  { code: 'GN', callingCode: '224', flag: '🇬🇳', name: 'Guinea' },
  { code: 'GW', callingCode: '245', flag: '🇬🇼', name: 'Guinea-Bissau' },
  { code: 'SL', callingCode: '232', flag: '🇸🇱', name: 'Sierra Leone' },
  { code: 'LR', callingCode: '231', flag: '🇱🇷', name: 'Liberia' },
  { code: 'CI', callingCode: '225', flag: '🇨🇮', name: 'Ivory Coast' },
  { code: 'ML', callingCode: '223', flag: '🇲🇱', name: 'Mali' },
  { code: 'BF', callingCode: '226', flag: '🇧🇫', name: 'Burkina Faso' },
  { code: 'NE', callingCode: '227', flag: '🇳🇪', name: 'Niger' },
  { code: 'NG', callingCode: '234', flag: '🇳🇬', name: 'Nigeria' },
  { code: 'BJ', callingCode: '229', flag: '🇧🇯', name: 'Benin' },
  { code: 'TG', callingCode: '228', flag: '🇹🇬', name: 'Togo' },
];

// Helper function to format error messages (handles arrays and objects)
const formatErrorMessage = (error) => {
  if (!error) return 'An unexpected error occurred.';
  
  // If error is an array, join the messages
  if (Array.isArray(error)) {
    return error.join('\n');
  }
  
  // If error is an object with message property
  if (typeof error === 'object' && error.message) {
    if (Array.isArray(error.message)) {
      return error.message.join('\n');
    }
    return error.message;
  }
  
  // If error is a string
  if (typeof error === 'string') {
    return error;
  }
  
  // Fallback
  return 'An unexpected error occurred. Please try again.';
};

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
    code: 'NG',
    callingCode: '234',
    flag: '🇳🇬',
    name: 'Nigeria'
  });
  const [showCountryModal, setShowCountryModal] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Validation errors state
  const [errors, setErrors] = useState({
    phoneNumber: '',
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: ''
  });
  
  // Track if fields have been touched
  const [touched, setTouched] = useState({
    phoneNumber: false,
    email: false,
    password: false,
    confirmPassword: false,
    firstName: false,
    lastName: false
  });

  const onSubmit = async () => {
    // Validate all fields
    if (!validateAllFields()) {
      Alert.alert('Error', 'Please fix the validation errors before continuing');
      return;
    }

    try {
      setLoading(true);
      
      // Build userData object, only including middleName if it has a valid value
      const userData = {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        password: password,
        phoneNumber: `+${selectedCountry.callingCode}${phoneNumber}`,
        userType: 'RIDER', // Default to RIDER for this app
        country: selectedCountry.name,
        gender: gender.toUpperCase(),
        agreedToTerms: true
      };

      // Only add middleName if it's not empty
      if (middleName && middleName.trim().length > 0) {
        userData.middleName = middleName.trim();
      }

      const response = await authAPI.register(userData);
      
      setLoading(false);
      
      if (response.success) {
        Alert.alert('Success', response.message || 'Registration successful! Please check your email for verification.');
        // Navigate to OTP verification screen with email
        router.push({
          pathname: '/(auth)/OTP',
          params: { 
            email: email,
            userType: 'RIDER',
            fromRegistration: true
          }
        });
      } else {
        // Handle error response from API
        const errorMessage = formatErrorMessage(response.message || 'Registration failed. Please try again.');
        Alert.alert('Error', errorMessage);
      }
      
    } catch (error) {
      setLoading(false);
      console.error('Registration error:', error);
      
      // Extract error message from error object
      let errorMessage = 'Registration failed. Please try again.';
      
      if (error?.response?.data) {
        // Error from axios response
        const errorData = error.response.data;
        errorMessage = formatErrorMessage(errorData.message || errorData.error || errorMessage);
      } else if (error?.message) {
        // Direct error message
        errorMessage = formatErrorMessage(error.message);
      } else if (typeof error === 'string') {
        // String error
        errorMessage = formatErrorMessage(error);
      }
      
      Alert.alert('Registration Error', errorMessage);
    }
  };

  const handleCountrySelect = () => {
    setShowCountryModal(true);
  };

  const selectCountry = (country) => {
    setSelectedCountry(country);
    setShowCountryModal(false);
  };

  // Validation functions
  const validatePhoneNumber = (value) => {
    if (!value) {
      return 'Phone number is required';
    }
    if (value.length < 9) {
      return 'Phone number must be at least 9 digits';
    }
    if (!/^\d+$/.test(value)) {
      return 'Phone number must contain only numbers';
    }
    return '';
  };

  const validateEmail = (value) => {
    if (!value) {
      return 'Email is required';
    }
    if (!Constant.emailValidationRegx.test(value)) {
      return 'Please enter a valid email address';
    }
    return '';
  };

  const validatePassword = (value) => {
    if (!value) {
      return 'Password is required';
    }
    if (!Constant.passwordValidation.test(value)) {
      return 'Password must be 8-16 characters with at least one special character';
    }
    return '';
  };

  const validateConfirmPassword = (value, passwordValue) => {
    if (!value) {
      return 'Please confirm your password';
    }
    if (value !== passwordValue) {
      return 'Passwords do not match';
    }
    return '';
  };

  const validateName = (value, fieldName) => {
    if (!value) {
      return `${fieldName} is required`;
    }
    if (value.trim().length < 2) {
      return `${fieldName} must be at least 2 characters`;
    }
    if (!/^[a-zA-Z\s'-]+$/.test(value.trim())) {
      return `${fieldName} can only contain letters, spaces, hyphens, and apostrophes`;
    }
    return '';
  };

  // Update error for a specific field
  const updateError = (field, error) => {
    setErrors(prev => ({ ...prev, [field]: error }));
  };

  // Handle field changes with validation - validate while typing
  const handlePhoneNumberChange = (value) => {
    setPhoneNumber(value);
    // Mark as touched and validate immediately
    if (!touched.phoneNumber) {
      setTouched(prev => ({ ...prev, phoneNumber: true }));
    }
    updateError('phoneNumber', validatePhoneNumber(value));
  };

  const handleEmailChange = (value) => {
    setEmail(value);
    // Mark as touched and validate immediately
    if (!touched.email) {
      setTouched(prev => ({ ...prev, email: true }));
    }
    updateError('email', validateEmail(value));
  };

  const handlePasswordChange = (value) => {
    setPassword(value);
    // Mark as touched and validate immediately
    if (!touched.password) {
      setTouched(prev => ({ ...prev, password: true }));
    }
    updateError('password', validatePassword(value));
    // Also validate confirm password if it's been touched
    if (touched.confirmPassword && confirmPassword) {
      updateError('confirmPassword', validateConfirmPassword(confirmPassword, value));
    }
  };

  const handleConfirmPasswordChange = (value) => {
    setConfirmPassword(value);
    // Mark as touched and validate immediately
    if (!touched.confirmPassword) {
      setTouched(prev => ({ ...prev, confirmPassword: true }));
    }
    updateError('confirmPassword', validateConfirmPassword(value, password));
  };

  const handleFirstNameChange = (value) => {
    setFirstName(value);
    // Mark as touched and validate immediately
    if (!touched.firstName) {
      setTouched(prev => ({ ...prev, firstName: true }));
    }
    updateError('firstName', validateName(value, 'First name'));
  };

  const handleLastNameChange = (value) => {
    setLastName(value);
    // Mark as touched and validate immediately
    if (!touched.lastName) {
      setTouched(prev => ({ ...prev, lastName: true }));
    }
    updateError('lastName', validateName(value, 'Last name'));
  };

  // Mark field as touched when user leaves it
  const handleBlur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    
    // Validate on blur
    switch (field) {
      case 'phoneNumber':
        updateError('phoneNumber', validatePhoneNumber(phoneNumber));
        break;
      case 'email':
        updateError('email', validateEmail(email));
        break;
      case 'password':
        updateError('password', validatePassword(password));
        break;
      case 'confirmPassword':
        updateError('confirmPassword', validateConfirmPassword(confirmPassword, password));
        break;
      case 'firstName':
        updateError('firstName', validateName(firstName, 'First name'));
        break;
      case 'lastName':
        updateError('lastName', validateName(lastName, 'Last name'));
        break;
    }
  };

  // Validate all fields before submission
  const validateAllFields = () => {
    const newErrors = {
      phoneNumber: validatePhoneNumber(phoneNumber),
      email: validateEmail(email),
      password: validatePassword(password),
      confirmPassword: validateConfirmPassword(confirmPassword, password),
      firstName: validateName(firstName, 'First name'),
      lastName: validateName(lastName, 'Last name')
    };
    
    setErrors(newErrors);
    setTouched({
      phoneNumber: true,
      email: true,
      password: true,
      confirmPassword: true,
      firstName: true,
      lastName: true
    });
    
    return !Object.values(newErrors).some(error => error !== '');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <BackButton onPress={() => router.back()} />
      
      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Register</Text>
        
        {/* Phone Number Input with Country Selector */}
        <View style={styles.inputWrapper}>
          <View style={[
            styles.phoneInputContainer,
            errors.phoneNumber && styles.inputError
          ]}>
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
                onChangeText={handlePhoneNumberChange}
                onBlur={() => handleBlur('phoneNumber')}
                placeholder="Enter Phone Number"
                placeholderTextColor={Colors.grey8 || '#666'}
                style={[
                  styles.phoneInput,
                  errors.phoneNumber && styles.inputError
                ]}
                keyboardType="phone-pad"
              />
            </View>
          </View>
          {errors.phoneNumber ? (
            <Text style={styles.errorText}>{errors.phoneNumber}</Text>
          ) : null}
        </View>

        {/* Email Input */}
        <View style={styles.inputWrapper}>
          <TextInput
            value={email}
            onChangeText={handleEmailChange}
            onBlur={() => handleBlur('email')}
            placeholder="Enter email"
            placeholderTextColor={Colors.grey8 || '#666'}
            style={[
              styles.input,
              errors.email && styles.inputError
            ]}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          {errors.email ? (
            <Text style={styles.errorText}>{errors.email}</Text>
          ) : null}
        </View>

        {/* Password Input */}
        <View style={styles.inputWrapper}>
          <TextInput
            value={password}
            onChangeText={handlePasswordChange}
            onBlur={() => handleBlur('password')}
            placeholder="Password"
            placeholderTextColor={Colors.grey8 || '#666'}
            style={[
              styles.input,
              errors.password && styles.inputError
            ]}
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
          {errors.password ? (
            <Text style={styles.errorText}>{errors.password}</Text>
          ) : null}
        </View>

        {/* Confirm Password Input */}
        <View style={styles.inputWrapper}>
          <TextInput
            value={confirmPassword}
            onChangeText={handleConfirmPasswordChange}
            onBlur={() => handleBlur('confirmPassword')}
            placeholder="Confirm Password"
            placeholderTextColor={Colors.grey8 || '#666'}
            style={[
              styles.input,
              errors.confirmPassword && styles.inputError
            ]}
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
          {errors.confirmPassword ? (
            <Text style={styles.errorText}>{errors.confirmPassword}</Text>
          ) : null}
        </View>

        {/* First Name Input */}
        <View style={styles.inputWrapper}>
          <TextInput
            value={firstName}
            onChangeText={handleFirstNameChange}
            onBlur={() => handleBlur('firstName')}
            placeholder="First Name"
            placeholderTextColor={Colors.grey8 || '#666'}
            style={[
              styles.input,
              errors.firstName && styles.inputError
            ]}
          />
          {errors.firstName ? (
            <Text style={styles.errorText}>{errors.firstName}</Text>
          ) : null}
        </View>

        {/* Middle Name Input */}
        {/* <View style={styles.inputWrapper}>
          <TextInput
            value={middleName}
            onChangeText={setMiddleName}
            placeholder="Middle Name (Optional)"
            placeholderTextColor={Colors.grey8 || '#666'}
            style={styles.input}
          />
        </View> */}

        {/* Last Name Input */}
        <View style={styles.inputWrapper}>
          <TextInput
            value={lastName}
            onChangeText={handleLastNameChange}
            onBlur={() => handleBlur('lastName')}
            placeholder="Last Name"
            placeholderTextColor={Colors.grey8 || '#666'}
            style={[
              styles.input,
              errors.lastName && styles.inputError
            ]}
          />
          {errors.lastName ? (
            <Text style={styles.errorText}>{errors.lastName}</Text>
          ) : null}
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

      {/* Country Selection Modal */}
      <Modal
        visible={showCountryModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowCountryModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Country</Text>
              <TouchableOpacity
                onPress={() => setShowCountryModal(false)}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={24} color={Colors.whiteColor} />
              </TouchableOpacity>
            </View>
            
            <FlatList
              data={countries}
              keyExtractor={(item) => item.code}
              style={styles.countryList}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.countryItem}
                  onPress={() => selectCountry(item)}
                >
                  <Text style={styles.countryFlag}>{item.flag}</Text>
                  <Text style={styles.countryName}>{item.name}</Text>
                  <Text style={styles.countryCode}>+{item.callingCode}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default Register;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.blackColor,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.blackColor || '#000',
    // paddingTop: 50,
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
  inputError: {
    borderWidth: 1,
    borderColor: '#FF4444',
  },
  errorText: {
    ...Fonts.Regular,
    fontSize: 12,
    color: '#FF4444',
    marginTop: 5,
    marginLeft: 20,
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
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Colors.blackColor || '#000',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '70%',
    paddingBottom: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: Colors.grey11 || '#2A2A2A',
  },
  modalTitle: {
    ...Fonts.TextBold,
    fontSize: 18,
    color: Colors.whiteColor || '#FFF',
  },
  closeButton: {
    padding: 5,
  },
  countryList: {
    maxHeight: 400,
  },
  countryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: Colors.grey11 || '#2A2A2A',
  },
  countryFlag: {
    fontSize: 24,
    marginRight: 15,
  },
  countryName: {
    ...Fonts.Regular,
    fontSize: 16,
    color: Colors.whiteColor || '#FFF',
    flex: 1,
  },
  countryCode: {
    ...Fonts.Regular,
    fontSize: 14,
    color: Colors.grey8 || '#999',
  },
});