import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import Video from 'react-native-video';
import { Colors } from '../constants';

const Splash = () => {
  const router = useRouter();

  const handleVideoFinish = () => {
    // Navigate to onboarding after video finishes
    router.replace('/Onboarding');
  };

  return (
    <View style={styles.container}>
      <Video
        source={require('../assets/Thrip.mp4')}
        style={styles.video}
        resizeMode="cover"
        paused={false}
        repeat={false}
        onEnd={handleVideoFinish}
      />
    </View>
  );
};

export default Splash;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.blackColor,
    justifyContent: 'center',
    alignItems: 'center',
  },
  video: {
    width: '100%',
    height: '100%',
  },
});
