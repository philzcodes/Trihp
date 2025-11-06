import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useRef } from 'react';
import { Animated, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { STATUS_BAR_HEIGHT } from '../../constants/Measurements';
import { Colors, Fonts } from '../../constants/Styles';

const AFRIMONEY_LOGO = require('../../assets/images/paymentMode/afrimoney.png');

const OutstandingPaymentSuccess = () => {
  const router = useRouter();
  const { amount = '3.25', paymentMethod } = useLocalSearchParams();

  // Parse payment method if it's a string
  const parsedPaymentMethod = paymentMethod ? JSON.parse(paymentMethod) : {
    name: 'Afrimoney',
    accountNumber: '***2534',
    logo: AFRIMONEY_LOGO,
    backgroundColor: '#95246D',
  };

  // Animation references
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Animate checkmark and content entrance
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleDone = () => {
    // Navigate back to home or payment methods
    router.push('/(tabs)/Dashboard'); // Navigate to dashboard tab
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
        <Text style={styles.headerTitle}>Outstanding Payment</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Content */}
      <View style={styles.content}>
        {/* Success Icon with Animation */}
        <Animated.View
          style={[
            styles.checkmarkContainer,
            {
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <View style={styles.checkmarkCircle}>
            <Ionicons name="checkmark" size={80} color="#4CAF50" />
          </View>
        </Animated.View>

        {/* Success Message */}
        <Animated.View
          style={[
            styles.messageContainer,
            {
              opacity: fadeAnim,
            },
          ]}
        >
          <Text style={styles.successMessage}>
            Le{amount} Outstanding Payment{'\n'}Successful
          </Text>
        </Animated.View>
      </View>

      {/* Payment Details Section */}
      <Animated.View
        style={[
          styles.paymentDetailsSection,
          {
            opacity: fadeAnim,
          },
        ]}
      >
        <View style={styles.separator} />

        <View style={styles.paidWithSection}>
          <Text style={styles.paidWithTitle}>Paid with</Text>

          <View style={styles.paymentMethodCard}>
            <View
              style={[
                styles.methodLogo,
                { backgroundColor: parsedPaymentMethod.backgroundColor },
              ]}
            >
              <Image
                source={parsedPaymentMethod.logo}
                style={styles.logoImage}
                resizeMode="contain"
              />
            </View>
            <Text style={styles.methodName}>{parsedPaymentMethod.name}</Text>
            <Text style={styles.methodAccount}>{parsedPaymentMethod.accountNumber}</Text>
          </View>
        </View>
      </Animated.View>

      {/* Bottom Button */}
      <View style={styles.bottomContainer}>
        <Pressable
          style={({ pressed }) => [
            styles.doneButton,
            pressed && styles.doneButtonPressed,
          ]}
          onPress={handleDone}
        >
          <Text style={styles.doneButtonText}>Done</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default OutstandingPaymentSuccess;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.blackColor,
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
    alignItems: 'center',
  },
  backButtonPressed: {
    opacity: 0.6,
  },
  headerTitle: {
    ...Fonts.Medium,
    fontSize: 20,
    color: Colors.whiteColor,
    fontWeight: '600',
  },
  headerSpacer: {
    width: 40,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  checkmarkContainer: {
    marginBottom: 40,
  },
  checkmarkCircle: {
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 8,
    borderColor: '#4CAF50',
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  messageContainer: {
    alignItems: 'center',
  },
  successMessage: {
    ...Fonts.Regular,
    fontSize: 20,
    color: Colors.whiteColor,
    textAlign: 'center',
    lineHeight: 28,
    fontWeight: '400',
  },
  paymentDetailsSection: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  separator: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginBottom: 32,
  },
  paidWithSection: {
    marginBottom: 20,
  },
  paidWithTitle: {
    ...Fonts.GrandMedium,
    fontSize: 24,
    color: Colors.whiteColor,
    fontWeight: '700',
    marginBottom: 24,
    letterSpacing: -0.3,
  },
  paymentMethodCard: {
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
  bottomContainer: {
    paddingHorizontal: 20,
    paddingBottom: 34,
    paddingTop: 16,
  },
  doneButton: {
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
  doneButtonPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
  doneButtonText: {
    ...Fonts.Medium,
    fontSize: 18,
    color: Colors.blackColor,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
});