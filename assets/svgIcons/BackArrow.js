import React from 'react';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants';

const BackArrow = ({ onPress }) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <Ionicons name="arrow-back-sharp" size={24} color={Colors.whiteColor} />
    </TouchableOpacity>
  );
};

export default BackArrow;
