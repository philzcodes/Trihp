import { Video } from 'expo-av';
import { useRouter } from 'expo-router';
import React, { useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import { Colors } from '../constants';

const Splash = () => {
  const router = useRouter();
  const videoRef = useRef(null);

  const handleVideoFinish = () => {
    // Navigate to onboarding after video finishes
    router.replace('/Onboarding');
  };

  return (
    <View style={styles.container}>
      <Video
        ref={videoRef}
        source={require('../assets/Thrip.mp4')}
        style={styles.video}
        resizeMode="cover"
        shouldPlay
        isLooping={false}
        onPlaybackStatusUpdate={(status) => {
          // Check if video finished playing
          if (status.didJustFinish) {
            handleVideoFinish();
          }
        }}
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
