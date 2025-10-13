import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

function HomeIcon(props: any) {
  return (
    <Svg width={24} height={18} viewBox="0 0 16 18" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <Path d="M8 0l8 6v12h-5v-5H5v5H0V6l8-6z" fill="#fff" />
    </Svg>
  );
}

export default HomeIcon;
