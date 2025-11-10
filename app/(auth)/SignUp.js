import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, FlatList, KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';
import Constant from '../../api/constants';
import { authAPI } from '../../api/services';
import { AlertModal, BackButton, TriphButton } from '../../components';
import { Colors, Fonts } from '../../constants';

// Country data - Comprehensive list of all countries
const countries = [
  { code: 'AF', callingCode: '93', flag: '🇦🇫', name: 'Afghanistan' },
  { code: 'AL', callingCode: '355', flag: '🇦🇱', name: 'Albania' },
  { code: 'DZ', callingCode: '213', flag: '🇩🇿', name: 'Algeria' },
  { code: 'AD', callingCode: '376', flag: '🇦🇩', name: 'Andorra' },
  { code: 'AO', callingCode: '244', flag: '🇦🇴', name: 'Angola' },
  { code: 'AG', callingCode: '1268', flag: '🇦🇬', name: 'Antigua and Barbuda' },
  { code: 'AR', callingCode: '54', flag: '🇦🇷', name: 'Argentina' },
  { code: 'AM', callingCode: '374', flag: '🇦🇲', name: 'Armenia' },
  { code: 'AU', callingCode: '61', flag: '🇦🇺', name: 'Australia' },
  { code: 'AT', callingCode: '43', flag: '🇦🇹', name: 'Austria' },
  { code: 'AZ', callingCode: '994', flag: '🇦🇿', name: 'Azerbaijan' },
  { code: 'BS', callingCode: '1242', flag: '🇧🇸', name: 'Bahamas' },
  { code: 'BH', callingCode: '973', flag: '🇧🇭', name: 'Bahrain' },
  { code: 'BD', callingCode: '880', flag: '🇧🇩', name: 'Bangladesh' },
  { code: 'BB', callingCode: '1246', flag: '🇧🇧', name: 'Barbados' },
  { code: 'BY', callingCode: '375', flag: '🇧🇾', name: 'Belarus' },
  { code: 'BE', callingCode: '32', flag: '🇧🇪', name: 'Belgium' },
  { code: 'BZ', callingCode: '501', flag: '🇧🇿', name: 'Belize' },
  { code: 'BJ', callingCode: '229', flag: '🇧🇯', name: 'Benin' },
  { code: 'BT', callingCode: '975', flag: '🇧🇹', name: 'Bhutan' },
  { code: 'BO', callingCode: '591', flag: '🇧🇴', name: 'Bolivia' },
  { code: 'BA', callingCode: '387', flag: '🇧🇦', name: 'Bosnia and Herzegovina' },
  { code: 'BW', callingCode: '267', flag: '🇧🇼', name: 'Botswana' },
  { code: 'BR', callingCode: '55', flag: '🇧🇷', name: 'Brazil' },
  { code: 'BN', callingCode: '673', flag: '🇧🇳', name: 'Brunei' },
  { code: 'BG', callingCode: '359', flag: '🇧🇬', name: 'Bulgaria' },
  { code: 'BF', callingCode: '226', flag: '🇧🇫', name: 'Burkina Faso' },
  { code: 'BI', callingCode: '257', flag: '🇧🇮', name: 'Burundi' },
  { code: 'KH', callingCode: '855', flag: '🇰🇭', name: 'Cambodia' },
  { code: 'CM', callingCode: '237', flag: '🇨🇲', name: 'Cameroon' },
  { code: 'CA', callingCode: '1', flag: '🇨🇦', name: 'Canada' },
  { code: 'CV', callingCode: '238', flag: '🇨🇻', name: 'Cape Verde' },
  { code: 'CF', callingCode: '236', flag: '🇨🇫', name: 'Central African Republic' },
  { code: 'TD', callingCode: '235', flag: '🇹🇩', name: 'Chad' },
  { code: 'CL', callingCode: '56', flag: '🇨🇱', name: 'Chile' },
  { code: 'CN', callingCode: '86', flag: '🇨🇳', name: 'China' },
  { code: 'CO', callingCode: '57', flag: '🇨🇴', name: 'Colombia' },
  { code: 'KM', callingCode: '269', flag: '🇰🇲', name: 'Comoros' },
  { code: 'CG', callingCode: '242', flag: '🇨🇬', name: 'Republic of the Congo' },
  { code: 'CD', callingCode: '243', flag: '🇨🇩', name: 'Democratic Republic of the Congo' },
  { code: 'CR', callingCode: '506', flag: '🇨🇷', name: 'Costa Rica' },
  { code: 'CI', callingCode: '225', flag: '🇨🇮', name: 'Ivory Coast' },
  { code: 'HR', callingCode: '385', flag: '🇭🇷', name: 'Croatia' },
  { code: 'CU', callingCode: '53', flag: '🇨🇺', name: 'Cuba' },
  { code: 'CY', callingCode: '357', flag: '🇨🇾', name: 'Cyprus' },
  { code: 'CZ', callingCode: '420', flag: '🇨🇿', name: 'Czech Republic' },
  { code: 'DK', callingCode: '45', flag: '🇩🇰', name: 'Denmark' },
  { code: 'DJ', callingCode: '253', flag: '🇩🇯', name: 'Djibouti' },
  { code: 'DM', callingCode: '1767', flag: '🇩🇲', name: 'Dominica' },
  { code: 'DO', callingCode: '1809', flag: '🇩🇴', name: 'Dominican Republic' },
  { code: 'EC', callingCode: '593', flag: '🇪🇨', name: 'Ecuador' },
  { code: 'EG', callingCode: '20', flag: '🇪🇬', name: 'Egypt' },
  { code: 'SV', callingCode: '503', flag: '🇸🇻', name: 'El Salvador' },
  { code: 'GQ', callingCode: '240', flag: '🇬🇶', name: 'Equatorial Guinea' },
  { code: 'ER', callingCode: '291', flag: '🇪🇷', name: 'Eritrea' },
  { code: 'EE', callingCode: '372', flag: '🇪🇪', name: 'Estonia' },
  { code: 'SZ', callingCode: '268', flag: '🇸🇿', name: 'Eswatini' },
  { code: 'ET', callingCode: '251', flag: '🇪🇹', name: 'Ethiopia' },
  { code: 'FJ', callingCode: '679', flag: '🇫🇯', name: 'Fiji' },
  { code: 'FI', callingCode: '358', flag: '🇫🇮', name: 'Finland' },
  { code: 'FR', callingCode: '33', flag: '🇫🇷', name: 'France' },
  { code: 'GA', callingCode: '241', flag: '🇬🇦', name: 'Gabon' },
  { code: 'GM', callingCode: '220', flag: '🇬🇲', name: 'Gambia' },
  { code: 'GE', callingCode: '995', flag: '🇬🇪', name: 'Georgia' },
  { code: 'DE', callingCode: '49', flag: '🇩🇪', name: 'Germany' },
  { code: 'GH', callingCode: '233', flag: '🇬🇭', name: 'Ghana' },
  { code: 'GR', callingCode: '30', flag: '🇬🇷', name: 'Greece' },
  { code: 'GD', callingCode: '1473', flag: '🇬🇩', name: 'Grenada' },
  { code: 'GT', callingCode: '502', flag: '🇬🇹', name: 'Guatemala' },
  { code: 'GN', callingCode: '224', flag: '🇬🇳', name: 'Guinea' },
  { code: 'GW', callingCode: '245', flag: '🇬🇼', name: 'Guinea-Bissau' },
  { code: 'GY', callingCode: '592', flag: '🇬🇾', name: 'Guyana' },
  { code: 'HT', callingCode: '509', flag: '🇭🇹', name: 'Haiti' },
  { code: 'HN', callingCode: '504', flag: '🇭🇳', name: 'Honduras' },
  { code: 'HU', callingCode: '36', flag: '🇭🇺', name: 'Hungary' },
  { code: 'IS', callingCode: '354', flag: '🇮🇸', name: 'Iceland' },
  { code: 'IN', callingCode: '91', flag: '🇮🇳', name: 'India' },
  { code: 'ID', callingCode: '62', flag: '🇮🇩', name: 'Indonesia' },
  { code: 'IR', callingCode: '98', flag: '🇮🇷', name: 'Iran' },
  { code: 'IQ', callingCode: '964', flag: '🇮🇶', name: 'Iraq' },
  { code: 'IE', callingCode: '353', flag: '🇮🇪', name: 'Ireland' },
  { code: 'IL', callingCode: '972', flag: '🇮🇱', name: 'Israel' },
  { code: 'IT', callingCode: '39', flag: '🇮🇹', name: 'Italy' },
  { code: 'JM', callingCode: '1876', flag: '🇯🇲', name: 'Jamaica' },
  { code: 'JP', callingCode: '81', flag: '🇯🇵', name: 'Japan' },
  { code: 'JO', callingCode: '962', flag: '🇯🇴', name: 'Jordan' },
  { code: 'KZ', callingCode: '7', flag: '🇰🇿', name: 'Kazakhstan' },
  { code: 'KE', callingCode: '254', flag: '🇰🇪', name: 'Kenya' },
  { code: 'KI', callingCode: '686', flag: '🇰🇮', name: 'Kiribati' },
  { code: 'KP', callingCode: '850', flag: '🇰🇵', name: 'North Korea' },
  { code: 'KR', callingCode: '82', flag: '🇰🇷', name: 'South Korea' },
  { code: 'KW', callingCode: '965', flag: '🇰🇼', name: 'Kuwait' },
  { code: 'KG', callingCode: '996', flag: '🇰🇬', name: 'Kyrgyzstan' },
  { code: 'LA', callingCode: '856', flag: '🇱🇦', name: 'Laos' },
  { code: 'LV', callingCode: '371', flag: '🇱🇻', name: 'Latvia' },
  { code: 'LB', callingCode: '961', flag: '🇱🇧', name: 'Lebanon' },
  { code: 'LS', callingCode: '266', flag: '🇱🇸', name: 'Lesotho' },
  { code: 'LR', callingCode: '231', flag: '🇱🇷', name: 'Liberia' },
  { code: 'LY', callingCode: '218', flag: '🇱🇾', name: 'Libya' },
  { code: 'LI', callingCode: '423', flag: '🇱🇮', name: 'Liechtenstein' },
  { code: 'LT', callingCode: '370', flag: '🇱🇹', name: 'Lithuania' },
  { code: 'LU', callingCode: '352', flag: '🇱🇺', name: 'Luxembourg' },
  { code: 'MG', callingCode: '261', flag: '🇲🇬', name: 'Madagascar' },
  { code: 'MW', callingCode: '265', flag: '🇲🇼', name: 'Malawi' },
  { code: 'MY', callingCode: '60', flag: '🇲🇾', name: 'Malaysia' },
  { code: 'MV', callingCode: '960', flag: '🇲🇻', name: 'Maldives' },
  { code: 'ML', callingCode: '223', flag: '🇲🇱', name: 'Mali' },
  { code: 'MT', callingCode: '356', flag: '🇲🇹', name: 'Malta' },
  { code: 'MH', callingCode: '692', flag: '🇲🇭', name: 'Marshall Islands' },
  { code: 'MR', callingCode: '222', flag: '🇲🇷', name: 'Mauritania' },
  { code: 'MU', callingCode: '230', flag: '🇲🇺', name: 'Mauritius' },
  { code: 'MX', callingCode: '52', flag: '🇲🇽', name: 'Mexico' },
  { code: 'FM', callingCode: '691', flag: '🇫🇲', name: 'Micronesia' },
  { code: 'MD', callingCode: '373', flag: '🇲🇩', name: 'Moldova' },
  { code: 'MC', callingCode: '377', flag: '🇲🇨', name: 'Monaco' },
  { code: 'MN', callingCode: '976', flag: '🇲🇳', name: 'Mongolia' },
  { code: 'ME', callingCode: '382', flag: '🇲🇪', name: 'Montenegro' },
  { code: 'MA', callingCode: '212', flag: '🇲🇦', name: 'Morocco' },
  { code: 'MZ', callingCode: '258', flag: '🇲🇿', name: 'Mozambique' },
  { code: 'MM', callingCode: '95', flag: '🇲🇲', name: 'Myanmar' },
  { code: 'NA', callingCode: '264', flag: '🇳🇦', name: 'Namibia' },
  { code: 'NR', callingCode: '674', flag: '🇳🇷', name: 'Nauru' },
  { code: 'NP', callingCode: '977', flag: '🇳🇵', name: 'Nepal' },
  { code: 'NL', callingCode: '31', flag: '🇳🇱', name: 'Netherlands' },
  { code: 'NZ', callingCode: '64', flag: '🇳🇿', name: 'New Zealand' },
  { code: 'NI', callingCode: '505', flag: '🇳🇮', name: 'Nicaragua' },
  { code: 'NE', callingCode: '227', flag: '🇳🇪', name: 'Niger' },
  { code: 'NG', callingCode: '234', flag: '🇳🇬', name: 'Nigeria' },
  { code: 'MK', callingCode: '389', flag: '🇲🇰', name: 'North Macedonia' },
  { code: 'NO', callingCode: '47', flag: '🇳🇴', name: 'Norway' },
  { code: 'OM', callingCode: '968', flag: '🇴🇲', name: 'Oman' },
  { code: 'PK', callingCode: '92', flag: '🇵🇰', name: 'Pakistan' },
  { code: 'PW', callingCode: '680', flag: '🇵🇼', name: 'Palau' },
  { code: 'PA', callingCode: '507', flag: '🇵🇦', name: 'Panama' },
  { code: 'PG', callingCode: '675', flag: '🇵🇬', name: 'Papua New Guinea' },
  { code: 'PY', callingCode: '595', flag: '🇵🇾', name: 'Paraguay' },
  { code: 'PE', callingCode: '51', flag: '🇵🇪', name: 'Peru' },
  { code: 'PH', callingCode: '63', flag: '🇵🇭', name: 'Philippines' },
  { code: 'PL', callingCode: '48', flag: '🇵🇱', name: 'Poland' },
  { code: 'PT', callingCode: '351', flag: '🇵🇹', name: 'Portugal' },
  { code: 'QA', callingCode: '974', flag: '🇶🇦', name: 'Qatar' },
  { code: 'RO', callingCode: '40', flag: '🇷🇴', name: 'Romania' },
  { code: 'RU', callingCode: '7', flag: '🇷🇺', name: 'Russia' },
  { code: 'RW', callingCode: '250', flag: '🇷🇼', name: 'Rwanda' },
  { code: 'KN', callingCode: '1869', flag: '🇰🇳', name: 'Saint Kitts and Nevis' },
  { code: 'LC', callingCode: '1758', flag: '🇱🇨', name: 'Saint Lucia' },
  { code: 'VC', callingCode: '1784', flag: '🇻🇨', name: 'Saint Vincent and the Grenadines' },
  { code: 'WS', callingCode: '685', flag: '🇼🇸', name: 'Samoa' },
  { code: 'SM', callingCode: '378', flag: '🇸🇲', name: 'San Marino' },
  { code: 'ST', callingCode: '239', flag: '🇸🇹', name: 'São Tomé and Príncipe' },
  { code: 'SA', callingCode: '966', flag: '🇸🇦', name: 'Saudi Arabia' },
  { code: 'SN', callingCode: '221', flag: '🇸🇳', name: 'Senegal' },
  { code: 'RS', callingCode: '381', flag: '🇷🇸', name: 'Serbia' },
  { code: 'SC', callingCode: '248', flag: '🇸🇨', name: 'Seychelles' },
  { code: 'SL', callingCode: '232', flag: '🇸🇱', name: 'Sierra Leone' },
  { code: 'SG', callingCode: '65', flag: '🇸🇬', name: 'Singapore' },
  { code: 'SK', callingCode: '421', flag: '🇸🇰', name: 'Slovakia' },
  { code: 'SI', callingCode: '386', flag: '🇸🇮', name: 'Slovenia' },
  { code: 'SB', callingCode: '677', flag: '🇸🇧', name: 'Solomon Islands' },
  { code: 'SO', callingCode: '252', flag: '🇸🇴', name: 'Somalia' },
  { code: 'ZA', callingCode: '27', flag: '🇿🇦', name: 'South Africa' },
  { code: 'SS', callingCode: '211', flag: '🇸🇸', name: 'South Sudan' },
  { code: 'ES', callingCode: '34', flag: '🇪🇸', name: 'Spain' },
  { code: 'LK', callingCode: '94', flag: '🇱🇰', name: 'Sri Lanka' },
  { code: 'SD', callingCode: '249', flag: '🇸🇩', name: 'Sudan' },
  { code: 'SR', callingCode: '597', flag: '🇸🇷', name: 'Suriname' },
  { code: 'SE', callingCode: '46', flag: '🇸🇪', name: 'Sweden' },
  { code: 'CH', callingCode: '41', flag: '🇨🇭', name: 'Switzerland' },
  { code: 'SY', callingCode: '963', flag: '🇸🇾', name: 'Syria' },
  { code: 'TW', callingCode: '886', flag: '🇹🇼', name: 'Taiwan' },
  { code: 'TJ', callingCode: '992', flag: '🇹🇯', name: 'Tajikistan' },
  { code: 'TZ', callingCode: '255', flag: '🇹🇿', name: 'Tanzania' },
  { code: 'TH', callingCode: '66', flag: '🇹🇭', name: 'Thailand' },
  { code: 'TL', callingCode: '670', flag: '🇹🇱', name: 'Timor-Leste' },
  { code: 'TG', callingCode: '228', flag: '🇹🇬', name: 'Togo' },
  { code: 'TO', callingCode: '676', flag: '🇹🇴', name: 'Tonga' },
  { code: 'TT', callingCode: '1868', flag: '🇹🇹', name: 'Trinidad and Tobago' },
  { code: 'TN', callingCode: '216', flag: '🇹🇳', name: 'Tunisia' },
  { code: 'TR', callingCode: '90', flag: '🇹🇷', name: 'Turkey' },
  { code: 'TM', callingCode: '993', flag: '🇹🇲', name: 'Turkmenistan' },
  { code: 'TV', callingCode: '688', flag: '🇹🇻', name: 'Tuvalu' },
  { code: 'UG', callingCode: '256', flag: '🇺🇬', name: 'Uganda' },
  { code: 'UA', callingCode: '380', flag: '🇺🇦', name: 'Ukraine' },
  { code: 'AE', callingCode: '971', flag: '🇦🇪', name: 'United Arab Emirates' },
  { code: 'GB', callingCode: '44', flag: '🇬🇧', name: 'United Kingdom' },
  { code: 'US', callingCode: '1', flag: '🇺🇸', name: 'United States' },
  { code: 'UY', callingCode: '598', flag: '🇺🇾', name: 'Uruguay' },
  { code: 'UZ', callingCode: '998', flag: '🇺🇿', name: 'Uzbekistan' },
  { code: 'VU', callingCode: '678', flag: '🇻🇺', name: 'Vanuatu' },
  { code: 'VA', callingCode: '39', flag: '🇻🇦', name: 'Vatican City' },
  { code: 'VE', callingCode: '58', flag: '🇻🇪', name: 'Venezuela' },
  { code: 'VN', callingCode: '84', flag: '🇻🇳', name: 'Vietnam' },
  { code: 'YE', callingCode: '967', flag: '🇾🇪', name: 'Yemen' },
  { code: 'ZM', callingCode: '260', flag: '🇿🇲', name: 'Zambia' },
  { code: 'ZW', callingCode: '263', flag: '🇿🇼', name: 'Zimbabwe' },
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
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [countrySearchQuery, setCountrySearchQuery] = useState('');
  const [webViewLoading, setWebViewLoading] = useState(true);

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
      showAlert('error', 'Error', 'Please fix the validation errors before continuing');
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
        showAlert('error', 'Error', errorMessage);
      }

    } catch (error) {
      setLoading(false);
      console.error('Registration error:', error);
      console.error('Error response data:', error?.response?.data || error?.responseData);
      console.error('Error status code:', error?.response?.status);

      // Extract error message and data from error object
      // The API service wraps errors, so check both error.response.data and error.responseData
      const errorData = error?.response?.data || error?.responseData || {};
      let errorMessage = 'Registration failed. Please try again.';
      const statusCode = error?.response?.status || errorData?.statusCode;

      // Extract error message from various possible locations
      if (errorData?.message) {
        errorMessage = formatErrorMessage(errorData.message);
      } else if (errorData?.error) {
        errorMessage = formatErrorMessage(errorData.error);
      } else if (error?.message) {
        errorMessage = formatErrorMessage(error.message);
      } else if (typeof error === 'string') {
        errorMessage = formatErrorMessage(error);
      }

      const errorMessageLower = errorMessage.toLowerCase();
      console.log('Extracted error message:', errorMessage);
      console.log('Status code:', statusCode);

      // Check if user already exists (by email, phone, message, or status code)
      // Status codes 400 and 409 can indicate user already exists
      const isUserAlreadyExists = errorMessageLower.includes('user already exists') ||
        errorMessageLower.includes('already registered') ||
        errorMessageLower.includes('email already') ||
        errorMessageLower.includes('phone number already') ||
        errorMessageLower.includes('phone already') ||
        errorMessageLower.includes('email is already') ||
        errorMessageLower.includes('email has already') ||
        (statusCode === 409) || // 409 Conflict
        (statusCode === 400 && errorMessageLower.includes('already')); // 400 with "already" message

      // Check if user exists but is NOT verified (only redirect to OTP in this case)
      // We need explicit indication that the user is unverified - default to false if not specified
      const isUnverifiedUser = errorMessageLower.includes('not verified') ||
        errorMessageLower.includes('email not verified') ||
        errorMessageLower.includes('email is not verified') ||
        errorMessageLower.includes('account not verified') ||
        errorMessageLower.includes('unverified') ||
        errorMessageLower.includes('not yet verified') ||
        errorMessageLower.includes('verification pending') ||
        errorMessageLower.includes('pending verification') ||
        (errorData.isVerified === false) ||
        (errorData.verified === false) ||
        (errorData.emailVerified === false);

      console.log('User already exists:', isUserAlreadyExists);
      console.log('User is unverified:', isUnverifiedUser);

      // Only redirect to OTP if user exists AND is explicitly unverified
      // If verification status is unknown, we should NOT redirect to OTP
      if (isUserAlreadyExists && isUnverifiedUser) {
        console.log('User exists but is unverified - redirecting to OTP');
        // User already registered but not verified - redirect to OTP page
        router.push({
          pathname: '/(auth)/OTP',
          params: {
            email: email.trim(),
            userType: 'RIDER',
            fromRegistration: true
          }
        });
        return; // Don't show error alert
      }

      // If user already exists but verification status is unknown or user is verified, show error
      // This is the safe default - don't redirect to OTP unless we're certain user is unverified
      if (isUserAlreadyExists) {
        console.log('User already exists (verified or status unknown) - showing error message');
        // Check if email or phone is the issue and provide a specific message
        let specificMessage = 'An account with this information already exists. ';

        // Try to identify which field caused the conflict
        if (errorMessageLower.includes('email')) {
          specificMessage = 'An account with this email address already exists. ';
        } else if (errorMessageLower.includes('phone') || errorMessageLower.includes('phone number')) {
          specificMessage = 'An account with this phone number already exists. ';
        }

        specificMessage += 'Please try logging in instead.';
        showAlert('error', 'Account Already Exists', specificMessage);
        return;
      }

      // For all other errors, show the error message
      showAlert('error', 'Registration Error', errorMessage);
    }
  };

  const handleCountrySelect = () => {
    setShowCountryModal(true);
  };

  const selectCountry = (country) => {
    setSelectedCountry(country);
    setShowCountryModal(false);
    setCountrySearchQuery(''); // Clear search when country is selected
  };

  // Filter countries based on search query
  const filteredCountries = countrySearchQuery
    ? countries.filter(country =>
      country.name.toLowerCase().includes(countrySearchQuery.toLowerCase()) ||
      country.callingCode.includes(countrySearchQuery) ||
      country.code.toLowerCase().includes(countrySearchQuery.toLowerCase())
    )
    : countries;

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

  // Password requirements validation
  const checkPasswordRequirements = (value) => {
    return {
      minLength: value.length >= 8,
      hasUppercase: /[A-Z]/.test(value),
      hasNumber: /[0-9]/.test(value),
      hasSpecialChar: /[!@#$%^&*]/.test(value),
    };
  };

  const passwordRequirements = checkPasswordRequirements(password);

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
          <View style={styles.passwordInputContainer}>
            <TextInput
              value={password}
              onChangeText={handlePasswordChange}
              onBlur={() => handleBlur('password')}
              placeholder="Password"
              placeholderTextColor={Colors.grey8 || '#666'}
              style={[
                styles.input,
                styles.passwordInput,
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
                color={Colors.whiteColor}
              />
            </Pressable>
          </View>

          {/* Password Requirements List */}
          {password && (
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
          <View style={styles.passwordInputContainer}>
            <TextInput
              value={confirmPassword}
              onChangeText={handleConfirmPasswordChange}
              onBlur={() => handleBlur('confirmPassword')}
              placeholder="Confirm Password"
              placeholderTextColor={Colors.grey8 || '#666'}
              style={[
                styles.input,
                styles.passwordInput,
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
                color={Colors.whiteColor}
              />
            </Pressable>
          </View>
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
          <View style={styles.termsTextContainer}>
            <Text style={styles.termsText}>
              By proceeding, you accept the{' '}
            </Text>
            <Pressable onPress={() => setShowTermsModal(true)}>
              <Text style={styles.termsLink}>Terms & Condition</Text>
            </Pressable>
          </View>
          <Text style={styles.termsText}>
            for using this service
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
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalOverlay}
          keyboardVerticalOffset={0}
        >
          <Pressable
            style={styles.modalOverlay}
            onPress={() => {
              setShowCountryModal(false);
              setCountrySearchQuery('');
            }}
          >
            <Pressable
              style={styles.modalContent}
              onPress={(e) => e.stopPropagation()}
            >
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Select Country</Text>
                <TouchableOpacity
                  onPress={() => {
                    setShowCountryModal(false);
                    setCountrySearchQuery('');
                  }}
                  style={styles.closeButton}
                >
                  <Ionicons name="close" size={24} color={Colors.whiteColor} />
                </TouchableOpacity>
              </View>

              {/* Search Input */}
              <View style={styles.searchContainer}>
                <Ionicons name="search" size={20} color={Colors.grey8 || '#999'} style={styles.searchIcon} />
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search country..."
                  placeholderTextColor={Colors.grey8 || '#999'}
                  value={countrySearchQuery}
                  onChangeText={setCountrySearchQuery}
                  autoCapitalize="none"
                  returnKeyType="search"
                />
                {countrySearchQuery.length > 0 && (
                  <TouchableOpacity
                    onPress={() => setCountrySearchQuery('')}
                    style={styles.clearButton}
                  >
                    <Ionicons name="close-circle" size={20} color={Colors.grey8 || '#999'} />
                  </TouchableOpacity>
                )}
              </View>

              <FlatList
                data={filteredCountries}
                keyExtractor={(item) => item.code}
                style={styles.countryList}
                contentContainerStyle={styles.countryListContent}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                nestedScrollEnabled={true}
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
            </Pressable>
          </Pressable>
        </KeyboardAvoidingView>
      </Modal>

      {/* Terms and Conditions Modal */}
      <Modal
        visible={showTermsModal}
        animationType="slide"
        transparent={false}
        onRequestClose={() => setShowTermsModal(false)}
      >
        <SafeAreaView style={styles.termsModalContainer} edges={['top', 'bottom']}>
          <View style={styles.termsModalHeader}>
            <Text style={styles.termsModalTitle}>Terms and Conditions</Text>
            <TouchableOpacity
              onPress={() => {
                setShowTermsModal(false);
                setWebViewLoading(true);
              }}
              style={styles.termsCloseButton}
            >
              <Ionicons name="close" size={24} color={Colors.whiteColor} />
            </TouchableOpacity>
          </View>

          {webViewLoading && (
            <View style={styles.webViewLoader}>
              <ActivityIndicator size="large" color={Colors.yellow || '#FFD700'} />
              <Text style={styles.loadingText}>Loading Terms and Conditions...</Text>
            </View>
          )}

          <WebView
            source={{ uri: 'https://trihp.com/terms-and-condition' }}
            style={styles.webView}
            onLoadStart={() => setWebViewLoading(true)}
            onLoadEnd={() => setWebViewLoading(false)}
            onError={(syntheticEvent) => {
              const { nativeEvent } = syntheticEvent;
              console.error('WebView error: ', nativeEvent);
              setWebViewLoading(false);
            }}
          />
        </SafeAreaView>
      </Modal>

      {/* Alert Modal */}
      <AlertModal
        visible={alertModal.visible}
        onClose={hideAlert}
        type={alertModal.type}
        title={alertModal.title}
        message={alertModal.message}
      />
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
  passwordInputContainer: {
    position: 'relative',
  },
  passwordInput: {
    paddingRight: 50, // Add padding to make room for eye icon
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
  eyeIcon: {
    position: 'absolute',
    right: 20,
    top: (55 - 22) / 2, // Center vertically: (input height - icon size) / 2 = (55 - 22) / 2 = 16.5
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
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
  termsTextContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
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
    paddingBottom: Platform.OS === 'ios' ? 20 : 10,
    maxHeight: '80%',
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.grey11 || '#2A2A2A',
    borderRadius: 25,
    marginHorizontal: 20,
    marginVertical: 15,
    paddingHorizontal: 15,
    height: 50,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    ...Fonts.Regular,
    color: Colors.whiteColor || '#FFFFFF',
    fontSize: 16,
    paddingVertical: 0,
  },
  clearButton: {
    padding: 5,
    marginLeft: 10,
  },
  countryList: {
    flexGrow: 0,
    flexShrink: 1,
  },
  countryListContent: {
    paddingBottom: 10,
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
  // Terms Modal styles
  termsModalContainer: {
    flex: 1,
    backgroundColor: Colors.blackColor || '#000',
  },
  termsModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: Colors.grey11 || '#2A2A2A',
  },
  termsModalTitle: {
    ...Fonts.TextBold,
    fontSize: 20,
    color: Colors.whiteColor || '#FFF',
    flex: 1,
  },
  termsCloseButton: {
    padding: 5,
  },
  webView: {
    flex: 1,
    backgroundColor: Colors.blackColor || '#000',
  },
  webViewLoader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.blackColor || '#000',
    zIndex: 1,
  },
  loadingText: {
    ...Fonts.Regular,
    color: Colors.whiteColor || '#FFF',
    marginTop: 10,
    fontSize: 14,
  },
});