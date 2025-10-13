import { Ionicons } from '@expo/vector-icons'; // Correct icon library
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
// Assuming TriphButton and custom constants are available
// import { TriphButton } from '../../components'; // I'll inline the button structure for a complete example
// import { Colors, Fonts } from '../../constants'; 

// --- Dummy Constants for Standalone Code ---
const Colors = {
  blackColor: '#000000',
  whiteColor: '#FFFFFF',
  yellow: '#FFC700', // Primary button color from the image
  grey10: '#333333', // Darker grey for borders
  grey11: '#222222', // Background for OTP boxes
  grey14: '#999999', // Subtitle and timer text color
};
const Fonts = {
  TextBold: { fontFamily: 'System' /* Replace with actual Bold font */, fontWeight: '700' },
  Regular: { fontFamily: 'System' /* Replace with actual Regular font */, fontWeight: '400' },
};
// --- End Dummy Constants ---

const INITIAL_TIMER = 60;

/**
 * Custom hook for countdown timer logic.
 * @param {number} initialSeconds 
 * @param {Function} onTimerEnd 
 * @returns {number} secondsLeft
 */
const useCountdown = (initialSeconds) => {
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds);
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    let interval = null;

    if (isActive && secondsLeft > 0) {
      interval = setInterval(() => {
        setSecondsLeft((s) => s - 1);
      }, 1000);
    } else if (secondsLeft === 0) {
      setIsActive(false);
      clearInterval(interval);
    }
    
    return () => clearInterval(interval);
  }, [isActive, secondsLeft]);

  const resetTimer = () => {
    setSecondsLeft(initialSeconds);
    setIsActive(true);
  };

  return { secondsLeft, resetTimer, isActive };
};

const OTP = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const inputRefs = useRef([]);
  
  const { secondsLeft, resetTimer, isActive: timerActive } = useCountdown(INITIAL_TIMER);

  const handleOtpChange = (value, index) => {
    // Only allow single digit input
    const sanitizedValue = value.slice(-1); 
    
    const newOtp = [...otp];
    newOtp[index] = sanitizedValue;
    setOtp(newOtp);

    // Auto-focus next input only if a value was entered
    if (sanitizedValue && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = ({ nativeEvent: { key } }, index) => {
    // Handle backspace to clear current and move to previous input
    if (key === 'Backspace') {
      if (!otp[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
      } else if (otp[index]) {
        // Clear the current box if it has a value
        const newOtp = [...otp];
        newOtp[index] = '';
        setOtp(newOtp);
      }
    }
  };

  const verifyOtp = async () => {
    const otpString = otp.join('');
    
    if (otpString.length !== 6) {
      Alert.alert('Error', 'Please enter the complete 6-digit code.');
      return;
    }

    try {
      setLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setLoading(false);
      
      Alert.alert('Success', 'OTP verified successfully!');
      router.replace('/');
      
    } catch (error) {
      setLoading(false);
      Alert.alert('Error', 'Invalid or expired code. Please try again.');
    }
  };

  const resendOtp = () => {
    if (timerActive) {
      Alert.alert('Wait', `You can resend the code in ${secondsLeft} seconds.`);
      return;
    }
    Alert.alert('Code Sent', 'A new code has been sent to your contacts.');
    resetTimer(); // Start the timer again
  };

  // The displayed contact information
  const contactInfo = `+232 3432**** or @gmail.com`; 

  return (
    <View style={styles.container}>
      {/* Back Button - Using Ionicons for the clean look in the image */}
      <TouchableOpacity 
        style={styles.backButton} 
        onPress={() => router.back()}
        activeOpacity={0.7}
      >
        <Ionicons name="arrow-back" size={24} color={Colors.whiteColor} />
      </TouchableOpacity>
      
      <View style={styles.content}>
        <Text style={styles.title}>OTP</Text>
        
        <Text style={styles.subtitle}>
          Enter 6 digit code sent to you at
          <Text style={styles.contactText}>
            {' '}
            {contactInfo}
          </Text>
        </Text>

        {/* OTP Input Container */}
        <View style={styles.otpContainer}>
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              ref={(ref) => (inputRefs.current[index] = ref)}
              style={styles.otpInput}
              value={digit}
              onChangeText={(value) => handleOtpChange(value, index)}
              onKeyPress={handleKeyPress}
              keyboardType="number-pad" // Better for mobile OTP
              maxLength={1}
              textAlign="center"
              autoFocus={index === 0} // Auto-focus the first input on load
            />
          ))}
        </View>

        {/* Timer Text */}
        <Text style={styles.timerText}>
          Expires in {secondsLeft}s
        </Text>

        {/* Custom Submit/TriphButton - Styled to match the image */}
        <TouchableOpacity
          style={[styles.submitButton, loading && styles.submitButtonDisabled]}
          onPress={verifyOtp}
          disabled={loading || otp.join('').length !== 6}
          activeOpacity={0.8}
        >
          {loading ? (
            <ActivityIndicator color={Colors.blackColor} size="small" />
          ) : (
            <Text style={styles.submitButtonText}>Submit</Text>
          )}
        </TouchableOpacity>

        {/* Resend Link */}
        <TouchableOpacity 
          style={styles.resendLinkContainer} 
          onPress={resendOtp}
          disabled={timerActive} // Disable resend when timer is running
          activeOpacity={timerActive ? 1 : 0.7}
        >
          <Text style={[
            styles.resendLinkText, 
            { color: timerActive ? Colors.grey14 : Colors.whiteColor }
          ]}>
            Click here to Resend Code
          </Text>
        </TouchableOpacity>

      </View>
    </View>
  );
};

export default OTP;

// --- Stylesheet ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.blackColor,
    paddingTop: 60, // Adjust based on status bar/notch height
  },
  backButton: {
    position: 'absolute',
    top: 60,
    left: 20,
    zIndex: 10, // Ensure it's above other content
    padding: 10,
  },
  content: {
    flex: 1,
    alignItems: 'center', // Center content horizontally
    paddingHorizontal: 30, // Horizontal padding for the screen content
    marginTop: 100, // Push content down a bit from the top
  },
  title: {
    ...Fonts.TextBold,
    fontSize: 30, // Slightly larger for prominence
    color: Colors.whiteColor,
    marginBottom: 40,
    // The image has 'OTP' centered
  },
  subtitle: {
    ...Fonts.Regular,
    fontSize: 16,
    color: Colors.whiteColor, // Match image: "Enter 6 digit code sent to you at" is white
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 24,
  },
  contactText: {
    ...Fonts.TextBold, // Make the phone/email bold as it stands out in the image
    color: Colors.grey14, // The contact info is a lighter grey
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    maxWidth: 300, // Max width for a neat layout on wider screens
    marginBottom: 15, // Space between OTP inputs and timer
  },
  otpInput: {
    width: 40, // Reduced width for the look
    height: 48, // Reduced height for the look
    backgroundColor: Colors.grey11,
    borderRadius: 8,
    fontSize: 22,
    color: Colors.whiteColor,
    borderWidth: 1,
    borderColor: Colors.grey10,
    ...Fonts.TextBold,
  },
  timerText: {
    ...Fonts.Regular,
    fontSize: 14,
    color: Colors.grey14,
    marginBottom: 40,
  },
  // Custom styling for the Submit button to match the image's "TriphButton"
  submitButton: {
    width: '100%',
    height: 55,
    borderRadius: 30, // More rounded corners
    backgroundColor: Colors.yellow,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40, // Space before the resend link
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    ...Fonts.TextBold,
    fontSize: 18,
    color: Colors.blackColor, // Text is black on the yellow button
  },
  resendLinkContainer: {
    // No extra styling, just for touchable area
  },
  resendLinkText: {
    ...Fonts.Regular, // The text "Click here to Resend Code" looks like a regular font
    fontSize: 16,
    color: Colors.whiteColor, // Assuming the initial look is white
  },
});