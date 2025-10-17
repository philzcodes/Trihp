import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useRef } from 'react';
import { Animated, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { STATUS_BAR_HEIGHT } from '../../constants/Measurements';
import { Colors, Fonts } from '../../constants/Styles';

const AFRIMONEY_LOGO = require('../../assets/images/paymentMode/afrimoney.png');

const WalletAddedSuccess = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  // Get wallet type from params (default to Afrimoney)
  const { walletType = 'Afrimoney', walletLogo = AFRIMONEY_LOGO } = params || {};

  // Animation references
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Animate checkmark entrance
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
    // Navigate back to payment methods or home
    navigation.navigate('PaymentMethods'); // Adjust route name as needed
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
        <Text style={styles.headerTitle}>Wallet Added</Text>
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
            <Ionicons name="checkmark" size={64} color="#4CAF50" />
          </View>
        </Animated.View>

        {/* Wallet Logo with Fade Animation */}
        <Animated.View
          style={[
            styles.walletLogoContainer,
            {
              opacity: fadeAnim,
            },
          ]}
        >
          <View style={styles.logoWrapper}>
            <Image
              source={walletLogo}
              style={styles.walletLogo}
              resizeMode="contain"
            />
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
            Your {walletType} Wallet has been added{'\n'}Successfully!
          </Text>
          
          {/* Blue indicator dot */}
          <View style={styles.indicatorDot} />
        </Animated.View>
      </View>

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

export default WalletAddedSuccess;

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
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonPressed: {
    opacity: 0.7,
  },
  headerTitle: {
    ...Fonts.Medium,
    fontSize: 18,
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
    marginBottom: 32,
  },
  checkmarkCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 6,
    borderColor: '#4CAF50',
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  walletLogoContainer: {
    marginBottom: 32,
  },
  logoWrapper: {
    width: 80,
    height: 50,
    backgroundColor: '#95246D',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  walletLogo: {
    width: 60,
    height: 28,
  },
  messageContainer: {
    alignItems: 'center',
  },
  successMessage: {
    ...Fonts.Regular,
    fontSize: 16,
    color: Colors.whiteColor,
    textAlign: 'center',
    lineHeight: 24,
    fontWeight: '400',
  },
  indicatorDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#2196F3',
    marginTop: 16,
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