import { useNavigation } from '@react-navigation/native';
import { router } from 'expo-router';
import { useState } from 'react';
import {
    Image,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';
import BackHeader from '../../components/BackHeader';
import { STATUS_BAR_HEIGHT } from '../../constants/Measurements';
import { Colors, Fonts } from '../../constants/Styles';

const AFRIMONEY_LOGO = require('../../assets/images/paymentMode/afrimoney.png');

const AddAfrimoneyWallet = () => {
  const navigation = useNavigation();
  
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [walletNickname, setWalletNickname] = useState('');

  const handleAddWallet = () => {
    // Validate and submit wallet details
    if (firstName && lastName && accountNumber) {
      // Handle wallet addition logic
      console.log({
        firstName,
        lastName,
        accountNumber,
        walletNickname,
      });
      router.push('/Payments/WalletaddedSuccess');
    }
  };

  const isFormValid = firstName.trim() && lastName.trim() && accountNumber.trim();

  return (
    <View style={[styles.container, { paddingTop: STATUS_BAR_HEIGHT }]}>
      <BackHeader 
        title="Add Afrimoney Wallet" 
        onPress={() => navigation.goBack()} 
      />

      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollViewContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Provider Header */}
          <View style={styles.providerSection}>
            <View style={styles.logoContainer}>
              <Image
                source={AFRIMONEY_LOGO}
                style={styles.logoImage}
                resizeMode="contain"
              />
            </View>
            <Text style={styles.providerName}>Afrimoney</Text>
          </View>

          <View style={styles.separator} />

          {/* Form Section */}
          <View style={styles.formSection}>
            <Text style={styles.formTitle}>
              Enter your Afrimoney wallet details
            </Text>

            <View style={styles.inputsContainer}>
              <TextInput
                style={styles.input}
                placeholder="First Name"
                placeholderTextColor="rgba(255, 255, 255, 0.4)"
                value={firstName}
                onChangeText={setFirstName}
                autoCapitalize="words"
                returnKeyType="next"
              />

              <TextInput
                style={styles.input}
                placeholder="Last Name"
                placeholderTextColor="rgba(255, 255, 255, 0.4)"
                value={lastName}
                onChangeText={setLastName}
                autoCapitalize="words"
                returnKeyType="next"
              />

              <TextInput
                style={styles.input}
                placeholder="Account number"
                placeholderTextColor="rgba(255, 255, 255, 0.4)"
                value={accountNumber}
                onChangeText={setAccountNumber}
                keyboardType="numeric"
                returnKeyType="next"
              />

              <Text style={styles.optionalLabel}>Optional</Text>

              <TextInput
                style={styles.input}
                placeholder="Wallet Nickname"
                placeholderTextColor="rgba(255, 255, 255, 0.4)"
                value={walletNickname}
                onChangeText={setWalletNickname}
                autoCapitalize="words"
                returnKeyType="done"
                onSubmitEditing={handleAddWallet}
              />
            </View>
          </View>
        </ScrollView>

        {/* Bottom Button */}
        <View style={styles.bottomContainer}>
          <Pressable
            style={({ pressed }) => [
              styles.addButton,
              !isFormValid && styles.addButtonDisabled,
              pressed && isFormValid && styles.addButtonPressed,
            ]}
            onPress={handleAddWallet}
            disabled={!isFormValid}
          >
            <Text style={styles.addButtonText}>Add Wallet</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

export default AddAfrimoneyWallet;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.blackColor,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  providerSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 24,
  },
  logoContainer: {
    width: 60,
    height: 60,
    backgroundColor: '#95246D',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  logoImage: {
    width: 50,
    height: 24,
  },
  providerName: {
    ...Fonts.Medium,
    fontSize: 20,
    color: Colors.whiteColor,
    fontWeight: '600',
  },
  separator: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginHorizontal: -20,
  },
  formSection: {
    paddingTop: 32,
  },
  formTitle: {
    ...Fonts.Regular,
    fontSize: 18,
    color: Colors.whiteColor,
    marginBottom: 28,
    fontWeight: '500',
  },
  inputsContainer: {
    gap: 20,
  },
  input: {
    backgroundColor: '#3A3A3A',
    borderRadius: 28,
    paddingHorizontal: 24,
    paddingVertical: 18,
    fontSize: 16,
    color: Colors.whiteColor,
    ...Fonts.Regular,
    height: 56,
  },
  optionalLabel: {
    ...Fonts.Regular,
    fontSize: 16,
    color: Colors.whiteColor,
    marginTop: 12,
    marginBottom: -8,
    fontWeight: '400',
  },
  bottomContainer: {
    paddingHorizontal: 20,
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
    paddingTop: 16,
    backgroundColor: Colors.blackColor,
  },
  addButton: {
    backgroundColor: '#F4D144',
    borderRadius: 28,
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
    height: 56,
    shadowColor: '#F4D144',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  addButtonDisabled: {
    backgroundColor: '#3A3A3A',
    shadowOpacity: 0,
    elevation: 0,
  },
  addButtonPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
  addButtonText: {
    ...Fonts.Medium,
    fontSize: 18,
    color: Colors.blackColor,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
});