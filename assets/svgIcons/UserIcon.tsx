import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

function UserIcon(props: any) {
  return (
    <Svg width={16} height={16} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <Path d="M8 0a4 4 0 110 8 4 4 0 010-8zm0 10c4.42 0 8 1.79 8 4v2H0v-2c0-2.21 3.58-4 8-4z" fill="#fff" />
    </Svg>
  );
}

export default UserIcon;
