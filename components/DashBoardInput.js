import React from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import { Colors, Fonts } from '../constants';
import SearchIcon from '../assets/svgIcons/SearchIcon';

const DashBoardInput = ({ onPress }) => {
  return (
    <Pressable 
      style={styles.container} 
      onPress={onPress}
    >
      <SearchIcon />
      <View style={styles.textContainer}>
        <Text style={styles.text}>Search Destination</Text>
      </View>
    </Pressable>
  );
};

export default DashBoardInput;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 8,
    backgroundColor: Colors.blackColor,
    borderRadius: 43,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.whiteColor,
    marginVertical: 10,
  },
  textContainer: {
    overflow: 'hidden',
    flex: 1,
    justifyContent: 'center',
  },
  text: {
    ...Fonts.Regular,
    paddingHorizontal: 10,
    color: Colors.whiteColor,
  },
});
