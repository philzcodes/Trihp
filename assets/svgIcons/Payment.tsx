import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

function Payment(props: any) {
  return (
    <Svg width={20} height={20} viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <Path
        d="M10.8 2.4H1.2V1.2h9.6m0 7.2H1.2V4.8h9.6m0-4.8H1.2C.534 0 0 .534 0 1.2v7.2a1.2 1.2 0 001.2 1.2h9.6A1.2 1.2 0 0012 8.4V1.2A1.2 1.2 0 0010.8 0zM3 10.8h1.2V12H3v-1.2zm2.4 0h1.2V12H5.4v-1.2zm2.4 0H9V12H7.8v-1.2z"
        fill="#fff"
      />
    </Svg>
  );
}

export default Payment;
