import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

function Account(props: any) {
  return (
    <Svg width={18} height={18} viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <Path
        d="M6.5 0a3.25 3.25 0 110 6.5 3.25 3.25 0 010-6.5zm0 8.125c3.591 0 6.5 1.454 6.5 3.25V13H0v-1.625c0-1.796 2.909-3.25 6.5-3.25z"
        fill="#fff"
      />
    </Svg>
  );
}

export default Account;
