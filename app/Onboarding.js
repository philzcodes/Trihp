import { useRouter } from 'expo-router';
import React, { useEffect, useRef } from 'react';
import { Animated, BackHandler, Image, ImageBackground, StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Logo from '../assets/onboardingImages/components/Logo';
import { Colors, Fonts } from '../constants';

const Onboarding = () => {
  const { height, width } = useWindowDimensions();
  const carAnimationValue = useRef(new Animated.Value(0)).current;
  const router = useRouter();

  useEffect(() => {
    const backAction = () => {
      BackHandler.exitApp();
      return true;
    };
    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
    return () => backHandler.remove();
  }, []);

  const carTranslateX = carAnimationValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -width * 1.2], // Slide completely off screen
  });

  // Disabled animation for now - navigate directly
  // const animateCarAndNavigate = (route) => {
  //   Animated.timing(carAnimationValue, {
  //     toValue: 1,
  //     duration: 1300, // Animation duration in milliseconds
  //     useNativeDriver: true,
  //   }).start(() => {
  //     router.push(route);
  //     // Reset animation after navigation
  //     carAnimationValue.setValue(0);
  //   });
  // };

  const handleRegisterPress = () => {
    router.push('/SignUp');
  };

  const handleLoginPress = () => {
    router.push('/Login');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground source={require('../assets/onboardingImages/bg.jpg')} style={styles.backgroundImage}>
        <View style={styles.mainContainer}>
          <View style={styles.logoContainer}>
            <Logo />
          </View>
          <View style={styles.contentContainer}>
            <Animated.View
              style={{
                transform: [{ translateX: carTranslateX }],
              }}
            >
              <Image resizeMode='contain' source={require('../assets/onboardingImages/OnboardingCar.png')} style={styles.carImage} />
            </Animated.View>
             <View style={styles.dashedLineContainer}>
               {Array.from({ length: 15 }, (_, i) => (
                 <View key={i} style={styles.dash} />
               ))}
             </View>
            <View style={{width: '100%' ,flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}> <Text style={styles.subTitle}>Welcome to </Text> <Text style={{...Fonts.Medium, fontSize: 22, color: "yellow", fontWeight: 'bold'}}>T R I H P</Text></View>
          {/* <Text style={styles.tagline}>Where safety meets convenience</Text> */}
          </View>

          <View style={styles.bottomTextContainer}>
              <View style={{flexDirection: 'row', justifyContent: 'space-around', width: '100%'}}>
              <TouchableOpacity 
                style={[styles.button, {backgroundColor: Colors.whiteColor}]} 
                onPress={handleRegisterPress}
              >
                <Text style={[styles.buttonText, {color: Colors.blackColor}]}>Register</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.button} 
                onPress={handleLoginPress}
              >
                <Text style={styles.buttonText}>Login</Text>
              </TouchableOpacity>
              </View>
            {/* <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 10}}>
              <Text style={styles.subText}>Drive & Earn with Trihp </Text> 
              <MaterialIcons name="keyboard-double-arrow-right" size={24} color="black" />
            </View> */}
          </View>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
};

export default Onboarding;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: '100%',
    backgroundColor: Colors.blackColor,
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
    position: 'relative',
    flex: 1,
  },
  logoContainer: {
    paddingTop: 80,
  },
  mainContainer: {
    flex: 1,
    alignItems: 'center',
    gap: 20,
    justifyContent: 'space-between',
  },
  contentContainer: {
    width: '100%',
    alignItems: 'center',
  },
  carImage: {
    alignSelf: 'center',
  },
  dashedLineContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
    width: '90%',
    backgroundColor: Colors.whiteColor,
  },
  dash: {
    width: 12,
    height: 1,
    backgroundColor: Colors.blackColor,
    marginHorizontal: 6,
    borderRadius: 0.5,
  },
  subTitle: {
    ...Fonts.Regular,
    fontSize: 22,
    textAlign: 'center',
    lineHeight: 30,
  },
  tagline: {
    ...Fonts.Regular,
    fontSize: 14,
    textAlign: 'center',
  },
  button: {
    height: 55,
    width: '45%',
    justifyContent: 'center',
    backgroundColor: Colors.blackColor,
    borderRadius: 50,
    marginBottom: 10,
    flexDirection: 'row',
    columnGap: 5,
    alignItems: 'center',
    alignSelf: 'center',
  },
  buttonText: {
    ...Fonts.Medium,
    fontSize: 16,
    color: Colors.whiteColor,
  },
  bottomTextContainer: {
    width: '100%',
    marginBottom: 20,
  },
  subText: {
    ...Fonts.Medium,
    color: Colors.blackColor,
    textAlign: 'center',
  },
});