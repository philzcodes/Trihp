import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { Animated, Easing, Image, ImageBackground, StyleSheet, useWindowDimensions, View } from 'react-native';
import LeftLogo from '../assets/onboardingImages/components/LeftLogo';
import RightLogo from '../assets/onboardingImages/components/RightLogo';
import { Colors } from '../constants';

const Splash = () => {
  const { height, width } = useWindowDimensions();
  const animationValue = new Animated.Value(0);
  const carAnimationValue = new Animated.Value(0);
  const router = useRouter();

  useEffect(() => {
    const leftAnimation = Animated.timing(animationValue, {
      toValue: 1,
      duration: 1500,
      easing: Easing.ease,
      useNativeDriver: true,
    });

    const carAnimation = Animated.timing(carAnimationValue, {
      toValue: 1,
      duration: 1500,
      easing: Easing.ease,
      useNativeDriver: true,
    });

    Animated.parallel([leftAnimation, carAnimation]).start(() => {
      // Navigate to onboarding after animation completes
      setTimeout(() => {
        router.replace('/Onboarding');
      }, 500);
    });
  }, [router]);

  const leftOpacity = animationValue.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0],
  });

  const rightOpacity = animationValue.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0],
  });

  const leftTranslateX = animationValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -width],
  });

  const rightTranslateX = animationValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, width],
  });

  const carTranslateY = carAnimationValue.interpolate({
    inputRange: [0, 1],
    outputRange: [height, -300],
  });

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../assets/onboardingImages/road.jpg')}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <View style={styles.splitContainer}>
          <Animated.View
            style={[
              styles.leftSide,
              {
                opacity: leftOpacity,
                transform: [{ translateX: leftTranslateX }],
              },
            ]}
          >
            <Image 
              source={require('../assets/onboardingImages/left.jpg')} 
              style={styles.sideImage} 
              resizeMode="cover"
            />
            <View style={styles.leftLogoContainer}>
              <LeftLogo />
            </View>
          </Animated.View>
          
          <Animated.View
            style={[
              styles.rightSide,
              {
                opacity: rightOpacity,
                transform: [{ translateX: rightTranslateX }],
              },
            ]}
          >
            <Image 
              source={require('../assets/onboardingImages/right.jpg')} 
              style={styles.sideImage} 
              resizeMode="cover"
            />
            <View style={styles.rightLogoContainer}>
              <RightLogo />
            </View>
          </Animated.View>
        </View>
        
        <Animated.View
          style={[
            styles.carContainer,
            {
              transform: [{ translateY: carTranslateY }],
            },
          ]}
        >
          <Image 
            source={require('../assets/onboardingImages/Car.png')} 
            style={styles.carImage}
            resizeMode="contain"
          />
        </Animated.View>
      </ImageBackground>
    </View>
  );
};

export default Splash;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.blackColor,
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  splitContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flex: 1,
  },
  leftSide: {
    flex: 1,
    position: 'relative',
  },
  rightSide: {
    flex: 1,
    position: 'relative',
  },
  sideImage: {
    width: '100%',
    height: '100%',
  },
  leftLogoContainer: {
    position: 'absolute',
    right: -70,
    top: '45%',
    zIndex: 1,
  },
  rightLogoContainer: {
    position: 'absolute',
    left: -70,
    top: '45%',
    zIndex: 1,
  },
  carContainer: {
    position: 'absolute',
    alignItems: 'center',
    width: '100%',
  },
  carImage: {
    alignSelf: 'center',
  },
});
