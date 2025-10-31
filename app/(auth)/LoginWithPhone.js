import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, FlatList, Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { authAPI } from '../../api/services';
import { TriphButton } from '../../components';
import { Colors, Fonts } from '../../constants';
import useUserStore from '../../store/userStore';

// Country data (same as SignUp)
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
  { code: 'BJ', callingCode: '229', flag: '🇧🇯', name: 'Benin' },
  { code: 'TG', callingCode: '228', flag: '🇹🇬', name: 'Togo' },
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

  const onLogin = async () => {
    try {
      console.log('Validating input...');
      
      if (!phoneNumber) {
        Alert.alert('Error', 'Please enter your phone number');
        return;
      }

      if (phoneNumber.length < 9) {
        Alert.alert('Error', 'Please enter a valid phone number');
        return;
      }
      
      if (!password) {
        Alert.alert('Error', 'Please enter your password');
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
        
       // Alert.alert('Success', response.message || 'Login successful! Welcome back!');
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

  const handleCountrySelect = () => {
    setShowCountryModal(true);
  };

  const selectCountry = (country) => {
    setSelectedCountry(country);
    setShowCountryModal(false);
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
                    <Text style={styles.countryCodeText}>+{item.callingCode}</Text>
                  </TouchableOpacity>
                )}
              />
            </View>
          </View>
        </Modal>
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

