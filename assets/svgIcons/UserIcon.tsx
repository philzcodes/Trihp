import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

function UserIcon({ width, height, ...props }: { width?: number; height?: number }) {
  return (
    <Svg width={width || 24} height={height || 18} viewBox="0 0 11 11" fill="none" {...props}>
      <Path
        d="M5.5 0a2.75 2.75 0 110 5.5 2.75 2.75 0 010-5.5zm0 6.875c3.039 0 5.5 1.23 5.5 2.75V11H0V9.625c0-1.52 2.461-2.75 5.5-2.75z"
        fill="#fff"
      />
    </Svg>
  );
}

export default UserIcon;
