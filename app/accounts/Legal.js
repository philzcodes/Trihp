import { Entypo } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../constants'; // Assuming these are defined in your project

// Mock Legal Content (Structured to match the image)
const LEGAL_CONTENT = [
  {
    title: 'Terms and Conditions',
    body: `Trihp Wallet is a secure and convenient digital wallet designed to simplify your transactions on the Trihp platform. Whether you're riding, driving, or managing a fleet, the Trihp Wallet ensures you have complete control over your funds, all from the comfort of your app. 
    Say goodbye to cash hassles or multiple payment platforms. With Trihp Wallet, everything you need is at your fingertips, making your experience smoother, faster, and safer.`,
  },
  {
    title: 'Privacy Policy',
    body: `Trihp Wallet is a secure and convenient digital wallet designed to simplify your transactions on the Trihp platform. Whether you're riding, driving, or managing a fleet, the Trihp Wallet ensures you have complete control over your funds, all from the comfort of your app. 
    Say goodbye to cash hassles or multiple payment platforms. With Trihp Wallet, everything you need is at your fingertips, making your experience smoother, faster, and safer. complete control over your funds, all from the comfort of your app.
    Say goodbye to cash hassles or multiple payment platforms. With`,
  },
  // You would add more sections here like 'Cookie Policy', etc.
];

const LegalScreen = () => {
  const router = useRouter();

  return (
    // SafeAreaView ensures content is below the notch/status bar
    <SafeAreaView style={styles.container} edges={['top']}>
      
      {/* Custom Header matching the screenshot */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          {/* Using Entypo for the chevron-left icon */}
          <Entypo name="chevron-left" size={26} color={Colors.whiteColor || '#FFFFFF'} />
        </Pressable>
        <Text style={styles.headerTitle}>Legal</Text>
      </View>

      {/* Scrollable Content */}
      <ScrollView style={styles.content}>
        {LEGAL_CONTENT.map((section, index) => (
          <View key={index} style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <Text style={styles.sectionBody}>{section.body}</Text>
          </View>
        ))}
        {/* Added extra padding at the bottom for comfortable scrolling */}
        <View style={{ height: 50 }} />
      </ScrollView>
      
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  // --- Global Styles ---
  container: {
    flex: 1,
    backgroundColor: Colors.blackColor || '#000000', // Deep black background
  },
  
  // --- Header Styles ---
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    // The image shows a clean header without a bottom border
  },
  backButton: {
    paddingRight: 10,
    paddingVertical: 5, 
  },
  headerTitle: {
    // Looks slightly larger and bolder than the body text
    fontSize: 20,
    color: Colors.whiteColor || '#FFFFFF',
    fontWeight: '600', // Semi-bold to match the image
    marginLeft: 10,
  },
  
  // --- Content Styles ---
  content: {
    flex: 1,
    paddingHorizontal: 20, // Padding from the sides
  },
  sectionContainer: {
    marginBottom: 30, // Space between legal sections
  },
  sectionTitle: {
    fontSize: 22,
    color: Colors.whiteColor || '#FFFFFF',
    fontWeight: '700', // Bold for the section titles
    marginBottom: 10, // Space below the title
  },
  sectionBody: {
    fontSize: 15, // Slightly smaller than the title, common body text size
    lineHeight: 24, // Increased line height for readability
    color: Colors.whiteColor || '#FFFFFF',
    opacity: 0.9, // Slight opacity reduction for body text
    fontWeight: '400', // Regular weight for body text
  },
});

export default LegalScreen;
