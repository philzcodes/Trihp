import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { Colors, Fonts } from '../constants';

const TriphButton = ({ 
  text, 
  onPress, 
  disabled = false, 
  loading = false, 
  bgColor = { backgroundColor: Colors.yellow },
  textColor = Colors.blackColor 
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        bgColor,
        disabled && styles.disabledButton
      ]}
      onPress={onPress}
      disabled={disabled || loading}
    >
      {loading ? (
        <ActivityIndicator color={textColor} />
      ) : (
        <Text style={[styles.buttonText, { color: textColor }]}>
          {text}
        </Text>
      )}
    </TouchableOpacity>
  );
};

export default TriphButton;

const styles = StyleSheet.create({
  button: {
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 50,
  },
  disabledButton: {
    opacity: 0.5,
  },
  buttonText: {
    ...Fonts.Medium,
    fontSize: 16,
  },
});