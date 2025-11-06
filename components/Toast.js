import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Fonts } from '../constants';

// Global toast state
let toastState = {
  visible: false,
  message: '',
  type: 'success',
  duration: 3000,
};

let toastListeners = [];

const notifyListeners = () => {
  toastListeners.forEach(listener => listener(toastState));
};

export const showToast = (message, type = 'success', duration = 3000) => {
  toastState = {
    visible: true,
    message,
    type,
    duration,
  };
  notifyListeners();
};

export const hideToast = () => {
  toastState = {
    ...toastState,
    visible: false,
  };
  notifyListeners();
};

const Toast = () => {
  const [toast, setToast] = useState(toastState);
  const slideAnim = useRef(new Animated.Value(-100)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const listener = (newState) => {
      setToast(newState);
    };
    toastListeners.push(listener);
    return () => {
      toastListeners = toastListeners.filter(l => l !== listener);
    };
  }, []);

  useEffect(() => {
    if (toast.visible) {
      // Slide in and fade in
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();

      // Auto hide after duration
      const timer = setTimeout(() => {
        hideToast();
      }, toast.duration);

      return () => clearTimeout(timer);
    } else {
      // Slide out and fade out
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: -100,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [toast.visible, toast.duration]);

  if (!toast.visible) return null;

  const getToastStyle = () => {
    switch (toast.type) {
      case 'success':
        return { backgroundColor: Colors.green };
      case 'error':
        return { backgroundColor: Colors.red };
      case 'warning':
        return { backgroundColor: Colors.yellow };
      default:
        return { backgroundColor: Colors.green };
    }
  };

  const getIconName = () => {
    switch (toast.type) {
      case 'success':
        return 'checkmark-circle';
      case 'error':
        return 'close-circle';
      case 'warning':
        return 'warning';
      default:
        return 'information-circle';
    }
  };

  const getTextColor = () => {
    return toast.type === 'warning' ? Colors.blackColor : Colors.whiteColor;
  };

  return (
    <SafeAreaView style={styles.container} pointerEvents="box-none" edges={['top']}>
      <Animated.View
        style={[
          styles.toast,
          getToastStyle(),
          {
            transform: [{ translateY: slideAnim }],
            opacity: opacityAnim,
          },
        ]}
      >
        <Ionicons name={getIconName()} size={24} color={getTextColor()} style={styles.icon} />
        <Text style={[styles.message, { color: getTextColor() }]}>{toast.message}</Text>
      </Animated.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 9999,
    alignItems: 'center',
  },
  toast: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 12,
    marginHorizontal: 20,
    marginTop: 10,
    minHeight: 50,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  icon: {
    marginRight: 12,
  },
  message: {
    ...Fonts.Regular,
    fontSize: 15,
    flex: 1,
  },
});

export default Toast;
