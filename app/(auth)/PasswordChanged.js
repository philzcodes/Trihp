import { Ionicons } from '@expo/vector-icons'; // Used for the checkmark icon
import { useRouter } from 'expo-router';
import React from 'react';
import {
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

// --- Dummy Constants for Standalone Code (Replace with your actual imports) ---
const Colors = {
  blackColor: '#000000',
  whiteColor: '#FFFFFF',
  yellow: '#FFC700', // Primary button color from the image
  successGreen: '#32CD32', // A vibrant green color for the checkmark outline
};
const Fonts = {
  TextBold: { fontFamily: 'System' /* Replace with actual Bold font */, fontWeight: '700' },
  Regular: { fontFamily: 'System' /* Replace with actual Regular font */, fontWeight: '400' },
};
// --- End Dummy Constants ---

const PasswordChanged = () => {
  const router = useRouter();

  const handleContinue = () => {
    // Navigate the user to the login/home screen after successful reset
    // For a real app, you might navigate to the main app dashboard or the login screen.
    // router.replace('/login'); 
    alert('Navigating to the Login or Home Screen...');
  };

  // Note: The back button is typically omitted on success screens to prevent users from going back 
  // and performing the successful action again.

  return (
    <View style={styles.container}>
      {/* Set status bar style to match the black background */}
      <StatusBar barStyle="light-content" backgroundColor={Colors.blackColor} />
      
      <View style={styles.content}>
        
        {/* Success Icon: Large checkmark with green outline */}
        <View style={styles.iconContainer}>
            <Ionicons 
                name="checkmark-circle-outline" 
                size={100} 
                color={Colors.successGreen} 
                style={styles.checkmarkIcon}
            />
        </View>

        {/* Success Message */}
        <Text style={styles.message}>
          Password Reset Successful
        </Text>

      </View>

      {/* Continue Button */}
      <TouchableOpacity
        style={styles.continueButton}
        onPress={handleContinue}
        activeOpacity={0.8}
      >
        <Text style={styles.continueButtonText}>Continue</Text>
      </TouchableOpacity>
    </View>
  );
};

export default PasswordChanged;

// --- Stylesheet ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.blackColor,
    paddingHorizontal: 30, 
    justifyContent: 'space-between', // Align content to the top/middle and button to the bottom
    paddingBottom: 50, // Padding for the button at the bottom
  },
  content: {
    flex: 1,
    justifyContent: 'center', // Center content vertically in the available space
    alignItems: 'center',
  },
  iconContainer: {
    // No specific styles needed here, just a wrapper for layout
  },
  checkmarkIcon: {
    // The Ionicons 'outline' variant provides the ring/circle
    // We adjust the size and color to match the prominent green circle.
    // The 'outline' makes the center transparent/black, but the default Ionicons behavior 
    // is to fill the checkmark itself with the color. If the checkmark needs to be white, 
    // a different approach or icon might be necessary, but this provides the green outline effect.
  },
  message: {
    ...Fonts.TextBold,
    fontSize: 24, // Prominent size for the main message
    color: Colors.whiteColor,
    marginTop: 20, // Space below the icon
    textAlign: 'center',
  },
  // Custom styling for the Continue button
  continueButton: {
    width: '100%',
    height: 55,
    borderRadius: 30, 
    backgroundColor: Colors.yellow,
    justifyContent: 'center',
    alignItems: 'center',
  },
  continueButtonText: {
    ...Fonts.TextBold,
    fontSize: 18,
    color: Colors.blackColor,
  },
});