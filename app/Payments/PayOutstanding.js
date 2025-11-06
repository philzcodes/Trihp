import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import {
    Image,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import InsufficientFundsModal from '../../components/Modals/InsufficientFundsModal';
import { STATUS_BAR_HEIGHT } from '../../constants/Measurements';
import { Colors, Fonts } from '../../constants/Styles';

const AFRIMONEY_LOGO = require('../../assets/images/paymentMode/afrimoney.png');

const PayOutstanding = () => {
  const router = useRouter();
  const { amount = '3.25', tripDetails = 'Trihp SUV to 23 Shiaka stevens Street freetown. Sieera leone, on Jun 5, 2025, 12:14 AM' } = useLocalSearchParams();

  // Payment methods data
  const paymentMethods = [
    {
      id: 1,
      name: 'Afrimoney',
      accountNumber: '***9846',
      logo: AFRIMONEY_LOGO,
      backgroundColor: '#95246D',
    },
    {
      id: 2,
      name: 'Afrimoney',
      accountNumber: '***2534',
      logo: AFRIMONEY_LOGO,
      backgroundColor: '#95246D',
    },
  ];

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const [isInsufficientFundsModalVisible, setIsInsufficientFundsModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSelectPaymentMethod = async (method) => {
    setSelectedPaymentMethod(method.id);
    setLoading(true);
    
    // Mock API call - simulate network delay and random success/failure
    setTimeout(() => {
      setLoading(false);
      
      // Simulate random success/failure (70% success rate)
      const isSuccess = Math.random() > 0.3;
      
      if (isSuccess) {
        // Navigate to success screen with payment details
        router.push({
          pathname: '/Payments/OutstandingPaymentSuccess',
          params: {
            amount: amount,
            paymentMethod: JSON.stringify(method),
          },
        });
      } else {
        // Show insufficient funds modal
        setIsInsufficientFundsModalVisible(true);
      }
    }, 2000); // 2 second delay to simulate API call
  };

  const handleAddPaymentMethod = () => {
    router.push('/Payments/AddPayMethods');
  };

  return (
    <View style={[styles.container, { paddingTop: STATUS_BAR_HEIGHT }]}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable
          style={({ pressed }) => [
            styles.backButton,
            pressed && styles.backButtonPressed,
          ]}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color={Colors.whiteColor} />
        </Pressable>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Payment Request Section */}
        <View style={styles.paymentSection}>
          <Text style={styles.paymentTitle}>Please pay Le{amount}</Text>
          <Text style={styles.errorMessage}>
            This payment couldn't be processed. Try again or pick another payment method to avoid service restriction
          </Text>
        </View>

        {/* Trip Details */}
        <View style={styles.tripDetailsSection}>
          <Text style={styles.tripDetails}>{tripDetails}</Text>
        </View>

        {/* Payment Methods Section */}
        <View style={styles.paymentMethodsSection}>
          <Text style={styles.sectionTitle}>Payment Methods</Text>

          {/* Payment Methods List */}
          <View style={styles.methodsList}>
            {paymentMethods.map((method) => {
              const isSelected = selectedPaymentMethod === method.id;
              const isProcessing = loading && isSelected;
              
              return (
                <Pressable
                  key={method.id}
                  style={({ pressed }) => [
                    styles.methodItem,
                    isSelected && styles.methodItemSelected,
                    pressed && !isProcessing && styles.methodItemPressed,
                    isProcessing && styles.methodItemProcessing,
                  ]}
                  onPress={() => !isProcessing && handleSelectPaymentMethod(method)}
                  disabled={isProcessing}
                >
                  <View style={styles.methodContent}>
                    <View
                      style={[
                        styles.methodLogo,
                        { backgroundColor: method.backgroundColor },
                      ]}
                    >
                      <Image
                        source={method.logo}
                        style={styles.logoImage}
                        resizeMode="contain"
                      />
                    </View>
                    <Text style={styles.methodName}>{method.name}</Text>
                    <Text style={styles.methodAccount}>{method.accountNumber}</Text>
                    {isProcessing && (
                      <View style={styles.loadingIndicator}>
                        <Text style={styles.loadingText}>Processing...</Text>
                      </View>
                    )}
                  </View>
                </Pressable>
              );
            })}
          </View>

          {/* Add Payment Method Button */}
          <Pressable
            style={({ pressed }) => [
              styles.addMethodButton,
              pressed && styles.addMethodButtonPressed,
            ]}
            onPress={handleAddPaymentMethod}
          >
            <Text style={styles.addMethodText}>Add Payment Method</Text>
          </Pressable>
        </View>
      </ScrollView>

      {/* Insufficient Funds Modal */}
      <InsufficientFundsModal 
        isVisible={isInsufficientFundsModalVisible} 
        onClose={() => setIsInsufficientFundsModalVisible(false)}
        onCancel={() => setIsInsufficientFundsModalVisible(false)}
      />
    </View>
  );
};

export default PayOutstanding;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.blackColor,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  backButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonPressed: {
    opacity: 0.7,
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  paymentSection: {
    marginTop: 24,
    marginBottom: 32,
  },
  paymentTitle: {
    ...Fonts.GrandMedium,
    fontSize: 28,
    color: Colors.whiteColor,
    fontWeight: '700',
    marginBottom: 16,
    letterSpacing: -0.5,
  },
  errorMessage: {
    ...Fonts.Regular,
    fontSize: 16,
    color: Colors.whiteColor,
    lineHeight: 24,
    opacity: 0.85,
  },
  tripDetailsSection: {
    marginBottom: 40,
  },
  tripDetails: {
    ...Fonts.Regular,
    fontSize: 16,
    color: Colors.whiteColor,
    lineHeight: 24,
    opacity: 0.85,
  },
  paymentMethodsSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    ...Fonts.GrandMedium,
    fontSize: 24,
    color: Colors.whiteColor,
    fontWeight: '700',
    marginBottom: 24,
    letterSpacing: -0.3,
  },
  methodsList: {
    marginBottom: 24,
  },
  methodItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  methodItemPressed: {
    opacity: 0.7,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  methodItemSelected: {
    backgroundColor: 'rgba(244, 209, 68, 0.15)',
    borderColor: 'rgba(244, 209, 68, 0.3)',
  },
  methodItemProcessing: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    opacity: 0.7,
  },
  methodContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  methodLogo: {
    width: 48,
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  logoImage: {
    width: 38,
    height: 18,
  },
  methodName: {
    ...Fonts.Medium,
    fontSize: 18,
    color: Colors.whiteColor,
    fontWeight: '600',
    marginRight: 8,
  },
  methodAccount: {
    ...Fonts.Regular,
    fontSize: 18,
    color: Colors.whiteColor,
    opacity: 0.7,
  },
  addMethodButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 12,
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  addMethodButtonPressed: {
    opacity: 0.7,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
  },
  addMethodText: {
    ...Fonts.Medium,
    fontSize: 18,
    color: Colors.whiteColor,
    fontWeight: '600',
  },
  loadingIndicator: {
    marginLeft: 'auto',
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
  },
  loadingText: {
    ...Fonts.Regular,
    fontSize: 14,
    color: Colors.whiteColor,
    opacity: 0.8,
  },
});