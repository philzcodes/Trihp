import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { FlatList, Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { authAPI } from '../../api/services';
import { AlertModal, TriphButton } from '../../components';
import { Colors, Fonts } from '../../constants';
import useUserStore from '../../store/userStore';

// Country data - Comprehensive list of all countries (same as SignUp)
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

const LoginWithPhone = () => {
  const router = useRouter();
  const { setUserData } = useUserStore();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState({
    code: 'NG',
    callingCode: '234',
    flag: '🇳🇬',
    name: 'Nigeria'
  });
  const [showCountryModal, setShowCountryModal] = useState(false);
  const [countrySearchQuery, setCountrySearchQuery] = useState('');
  
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

  const onLogin = async () => {
    try {
      console.log('Validating input...');
      
      if (!phoneNumber) {
        showAlert('error', 'Error', 'Please enter your phone number');
        return;
      }

      if (phoneNumber.length < 9) {
        showAlert('error', 'Error', 'Please enter a valid phone number');
        return;
      }
      
      if (!password) {
        showAlert('error', 'Error', 'Please enter your password');
        return;
      }

      setLoading(true);
      
      // Format phone number with country code
      const formattedPhone = `+${selectedCountry.callingCode}${phoneNumber}`;
      
      const loginData = {
        emailOrPhone: formattedPhone,
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
        
        showAlert('success', 'Success', response.message || 'Login successful! Welcome back!');
        
        // Navigate after a short delay to show success message
        setTimeout(() => {
          hideAlert();
          router.replace('/Countdown');
        }, 1500);
      } else {
        showAlert('error', 'Error', response.message || 'Login failed. Please check your credentials.');
      }
      
    } catch (error) {
      setLoading(false);
      console.error('Login error:', error);
      
      let errorMessage = 'Login failed. Please try again.';
      if (error.message) {
        errorMessage = error.message;
      } else if (error.error) {
        errorMessage = error.error;
      }
      
      showAlert('error', 'Error', errorMessage);
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
                  placeholderTextColor="#848484"
                  style={styles.phoneInput}
                  keyboardType="phone-pad"
                />
              </View>
            </View>
          </View>
          
          {/* Login with email link - Centered */}
          <Pressable
            onPress={() => router.push('/(auth)/Login')}
            style={styles.emailLoginLink}
          >
            <Text style={styles.emailLoginText}>Login with email</Text>
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
                  onPress={() => {
                    setShowCountryModal(false);
                    setCountrySearchQuery(''); // Clear search when modal closes
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
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.countryItem}
                    onPress={() => selectCountry(item)}
                  >
                    <Text style={styles.countryFlag}>{item.flag}</Text>
                    <Text style={styles.countryName}>{item.name}</Text>
                    <Text style={styles.countryCodeText}>+{item.callingCode}</Text>
                  </TouchableOpacity>
                )}
              />
            </View>
          </View>
        </Modal>

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

export default LoginWithPhone;

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
  phoneInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2A2A2A',
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
    color: Colors.whiteColor || '#FFFFFF',
    fontSize: 16,
    marginLeft: 10,
  },
  phoneInput: {
    flex: 1,
    ...Fonts.Regular,
    color: Colors.whiteColor || '#FFFFFF',
    fontSize: 16,
    paddingHorizontal: 15,
    height: '100%',
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
  emailLoginLink: {
    alignSelf: 'flex-end',
    marginBottom: 32,
  },
  emailLoginText: {
    ...Fonts.Regular,
    color: Colors.whiteColor || '#FFFFFF',
    fontSize: 14,
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
    borderBottomColor: '#2A2A2A',
  },
  modalTitle: {
    ...Fonts.TextBold,
    fontSize: 18,
    color: Colors.whiteColor || '#FFFFFF',
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
    maxHeight: 400,
  },
  countryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#2A2A2A',
  },
  countryFlag: {
    fontSize: 24,
    marginRight: 15,
  },
  countryName: {
    ...Fonts.Regular,
    fontSize: 16,
    color: Colors.whiteColor || '#FFFFFF',
    flex: 1,
  },
  countryCodeText: {
    ...Fonts.Regular,
    fontSize: 14,
    color: Colors.grey8 || '#999',
  },
});

