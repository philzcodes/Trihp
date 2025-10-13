import * as React from 'react';
import Svg, { Circle, Path } from 'react-native-svg';

function BackArrow(props: any) {
  return (
    <Svg width={42} height={42} viewBox="0 0 42 42" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <Circle cx={21} cy={21} r={21} fill="#000" />
      <Path
        d="M10.293 20.293a1 1 0 000 1.414l6.364 6.364a1 1 0 001.414-1.414L12.414 21l5.657-5.657a1 1 0 00-1.414-1.414l-6.364 6.364zM31 20H11v2h20v-2z"
        fill="#fff"
      />
    </Svg>
  );
}

export default BackArrow;
