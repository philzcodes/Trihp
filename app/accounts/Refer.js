import { useRouter } from 'expo-router';
import React from 'react';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import BackHeader from '../../components/BackHeader';
import TriphButton from '../../components/TriphButton';
import { STATUS_BAR_HEIGHT } from '../../constants/Measurements';
import { Colors, Fonts } from '../../constants/Styles';

const Refer = () => {
  const router = useRouter();
  
  // Sample referral code - you can replace this with dynamic data
  const referralCode = "X0GHTRFP";

  return (
    <View style={[styles.container, { paddingTop: STATUS_BAR_HEIGHT + 20 }]}>
      <BackHeader title="Refer" onPress={() => router.back()} />
      
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Centered image at the top - full width */}
        <Image 
          source={require('../../assets/images/refer.png')} 
          style={styles.bannerImage}
          resizeMode="cover"
        />
        
        {/* Bold title aligned to left */}
        <Text style={styles.title}>Refer a friend and get 50% off</Text>
        
        {/* Bullet points with instructions */}
        <View style={styles.bulletContainer}>
          <View style={styles.bulletRow}>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.bulletText}>Get 50% off after your friend's 1st ride.</Text>
          </View>
          
          <View style={styles.bulletRow}>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.bulletText}>Your friend gets 50% off on their 1st ride.</Text>
          </View>
        </View>
        
        {/* Referral code section - without container */}
        <View style={styles.referralContainer}>
          <Text style={styles.referralCode}>{referralCode}</Text>
          <Text style={styles.referralLabel}>Referral Code</Text>
        </View>
        
        {/* Refer button - centered text */}
        <TriphButton
          text="Refer a Friend"
          extraTextStyle={styles.buttonText}
          extraStyle={styles.button}
          onPress={() => {
            // Add your referral sharing logic here
            console.log("Refer button pressed");
          }}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.blackColor,
  },
  scrollContent: {
    padding: 20,
    alignItems: 'center',
  },
  bannerImage: {
    width: '100%',
    height: 320,
    marginBottom: 25,
  },
  title: {
    fontSize: 17,
    fontWeight: '600',
    // ...Fonts.TextBold,
    color: Colors.whiteColor,
    alignSelf: 'flex-start',
    marginBottom: 20,
  },
  bulletContainer: {
    alignSelf: 'flex-start',
    marginBottom: 30,
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  bullet: {
    color: Colors.yellow,
    fontSize: 16,
    marginRight: 10,
    marginTop: 2,
  },
  bulletText: {
    fontSize: 13,
    color: Colors.whiteColor, // Fixed: Changed to white
    // flex: 1,
    lineHeight: 22,
  },
  referralContainer: {
    alignItems: 'center',
    marginBottom: 30,
    // Removed background container styling
  },
  referralCode: {
    fontSize: 32, // Increased size
    color: Colors.whiteColor,
    // ...Fonts.TextBold,
    // color: Colors.yellow,
    // letterSpacing: 3, // Increased letter spacing
    // marginBottom: 5,
    fontWeight: '800', // Added more weight
  },
  referralLabel: {
    fontSize: 12, // Made smaller
    color: Colors.whiteColor,
    // ...Fonts.Regular,
    opacity: 0.8,
    // textTransform: 'uppercase',
    letterSpacing: 1,
  },
  buttonText: {
    ...Fonts.TextBold,
    fontSize: 16,
    color: Colors.blackColor,
    textAlign: 'center', // Centered text in button
    width: '100%',
  },
  button: {
    backgroundColor: Colors.yellow,
    width: '100%',
  },
});

export default Refer;