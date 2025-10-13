import { ImageBackground } from 'expo-image';
import React from 'react';
import {
    Image,
    SafeAreaView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

// Assuming the main illustration is an image asset
const illustration = require('../assets/trihp-onboarding-illustration.png'); // You'll need to save the illustration image here.

export default function OnboardingScreen() {
  // If you need to load custom fonts, uncomment and adjust:
  // const [fontsLoaded] = useFonts({
  //   'YourFont-Regular': require('./assets/fonts/YourFont-Regular.ttf'),
  //   'YourFont-SemiBold': require('./assets/fonts/YourFont-SemiBold.ttf'), // For the title
  // });

  // if (!fontsLoaded) {
  //   return null; // Or a loading spinner
  // }

  const handleNext = () => {
    console.log('Next button pressed!');
    // Navigate to the next screen or perform an action
  };

  return (
    <SafeAreaView style={styles.safeArea}>
    <ImageBackground source={require('../assets/welcome-background-image.jpg')} style={styles.backgroundImage}>
    <StatusBar barStyle="dark-content" backgroundColor="#FDD835" />

{/* Top Yellow Section */}
<View style={styles.topSection}>
  <View style={styles.illustrationContainer}>
    <View style={styles.illustrationBackgroundCircle}>
      <Image source={illustration} style={styles.illustrationImage} resizeMode="contain" />
    </View>
  </View>
</View>

{/* Bottom Black Section */}
<View style={styles.bottomSection}>
  {/* The wave effect could be a LinearGradient or an SVG, for simplicity let's assume a clean split for now
      If it's a gradient, it would look something like this, but might need absolute positioning:
      <LinearGradient
          colors={['#FDD835', '#000000']} // Adjust colors to match transition
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={styles.waveGradient}
      />
  */}

  <Text style={styles.title}>Trihp is Thrilled to have you onboard</Text>
  <Text style={styles.description}>
    You're now part of a network that's all about making transportation safe, reliable, and
    hassle-free.
  </Text>
  <Text style={styles.ctaPrompt}>Your next ride is just a tap away!</Text>

  <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
    <Text style={styles.nextButtonText}>Next</Text>
  </TouchableOpacity>
</View>
    </ImageBackground>
     
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    //backgroundColor: '#FDD835', // Background for the top section
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  topSection: {
    flex: 0.5, // Adjust this ratio as needed
    //backgroundColor: '#FDD835', // The vibrant yellow from your image
    justifyContent: 'center',
    alignItems: 'center',
    // The bottom wave shape is tricky with pure RN styles,
    // it's usually an SVG or a combination of `overflow: hidden` and a transformed child view.
    // For simplicity, we're doing a clean split here.
  },
  illustrationContainer: {
    width: '100%', // Take full width to center its child
    alignItems: 'center',
    paddingTop: 20, // Give some breathing room from the top if needed
  },
  illustrationBackgroundCircle: {
    width: 215, // Adjust size as needed
    height: 215, // Adjust size as needed, make it equal for a perfect circle
    // borderRadius: 100, // Half of width/height
    // backgroundColor: 'black', // The black background behind the illustration
    justifyContent: 'center',
    alignItems: 'center',
    // shadowColor: '#000', // Optional: subtle shadow for depth
    // shadowOffset: { width: 0, height: 4 },
    // shadowOpacity: 0.3,
    // shadowRadius: 5,
    // elevation: 8, // Android shadow
  },
  illustrationImage: {
    width: '80%', // Make the image fit within the circle
    height: '80%', // Make the image fit within the circle
  },
  bottomSection: {
    flex: 0.5, // Adjust this ratio as needed
    //backgroundColor: '#000000', // The deep black from your image
    paddingHorizontal: 12, // Padding on the sides for text
    paddingTop: 70, // Padding from the top of the black section
    alignItems: 'center', // Center text horizontally
  },
  // If a gradient wave is needed at the top of the bottom section
  // waveGradient: {
  //   position: 'absolute',
  //   top: -50, // Adjust to control how much it overlaps
  //   left: 0,
  //   right: 0,
  //   height: 100, // Height of the gradient transition
  // },
  title: {
    fontSize: 21, // Adjust font size for title
    fontWeight: '400', // Looks bold in the image
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 20, // Space below title
    fontFamily: 'System', // Use a system font, or 'YourFont-SemiBold' if loaded
  },
  description: {
    fontSize: 15, // Adjust font size for description
    color: '#D3D3D3', // Slightly lighter white for description
    textAlign: 'center',
    lineHeight: 24, // Improve readability
    marginBottom: 30, // Space below description
    fontFamily: 'System', // Use a system font, or 'YourFont-Regular' if loaded
  },
  ctaPrompt: {
    fontSize: 15, // Slightly larger than description, but smaller than title
    fontWeight: '600', // Semi-bold
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 40, // Space above the button
    fontFamily: 'System', // Use a system font, or 'YourFont-SemiBold' if loaded
  },
  nextButton: {
    backgroundColor: '#FDD835', // The same vibrant yellow as the top section
    borderRadius: 30, // Rounded corners for the button
    paddingVertical: 15,
    paddingHorizontal: 40,
    width: '80%', // Or a fixed width
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#FDD835', // Optional: subtle shadow matching button color
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 10, // Android shadow
  },
  nextButtonText: {
    color: '#000000', // Black text on the yellow button
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'System', // Use a system font, or 'YourFont-SemiBold' if loaded
  },
});