import React, { useState } from 'react';
import { StyleSheet, View, TextInput, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Fonts } from '../constants';

const TriphInput = (props) => {
  const [secureTextEntry, setSecureTextEntry] = useState(props.isPassword || false);

  const toggleSecureTextEntry = () => {
    setSecureTextEntry(!secureTextEntry);
  };

  return (
    <View style={[styles.container, props?.extraContainerStyle]}>
      {props.isPassword && <View style={{ padding: 15 }} />}
      <TextInput
        value={props?.value}
        onChangeText={props?.onChangeText}
        placeholderTextColor="#848484"
        placeholder={props?.placeholder}
        style={[styles.textStyle, props.extraTextStyle]}
        cursorColor={Colors.whiteColor}
        secureTextEntry={secureTextEntry}
        {...props}
      />
      {props.isPassword && (
        <Pressable style={styles.iconStyle} onPress={toggleSecureTextEntry}>
          <Ionicons name={secureTextEntry ? 'eye-off' : 'eye'} size={20} color={Colors.blackColor} />
        </Pressable>
      )}
    </View>
  );
};

export default TriphInput;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.grey11,
    borderRadius: 50,
    marginBottom: 20,
    paddingHorizontal: 10,
    gap: 10,
  },
  textStyle: {
    flex: 1,
    paddingVertical: 15,
    ...Fonts.Regular,
    textAlign: 'center',
    color: Colors.whiteColor,
    fontSize: 16,
  },
  iconStyle: {
    padding: 8,
    borderRadius: 50,
    backgroundColor: Colors.yellow,
  },
});
