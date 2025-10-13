import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Fonts } from '../constants';

const TriphButton = (props) => {
  const backgroundOpacity = props.loading ? 0.6 : 1;

  return (
    <View style={{ opacity: backgroundOpacity }}>
      <TouchableOpacity 
        style={[styles.container, props.extraStyle, props.bgColor]} 
        onPress={props?.onPress} 
        {...props}
      >
        {props?.leftIcon && !props.loading ? (
          <Ionicons name={props?.IconName} size={20} color={Colors.blackColor} />
        ) : null}
        {props.loading ? (
          <ActivityIndicator size="small" color={Colors.blackColor} />
        ) : (
          <Text style={[styles.text, { marginLeft: props?.leftIcon ? 10 : 0 }, props?.extraTextStyle]}>
            {props?.text}
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default TriphButton;

const styles = StyleSheet.create({
  container: {
    padding: 15,
    backgroundColor: Colors.yellow,
    borderRadius: 50,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  text: {
    ...Fonts.TextBold,
    color: Colors.blackColor,
  },
});
