import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

function Coupons(props: any) {
  return (
    <Svg width={20} height={20} viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <Path
        d="M2.275 3.25a.975.975 0 110-1.95.975.975 0 010 1.95zm10.341 2.977L6.767.377A1.292 1.292 0 005.85 0H1.3C.578 0 0 .579 0 1.3v4.55c0 .357.143.683.384.917l5.843 5.85c.24.233.566.383.923.383.357 0 .682-.15.916-.383l4.55-4.55A1.27 1.27 0 0013 7.15c0-.364-.15-.689-.383-.923z"
        fill="#fff"
      />
    </Svg>
  );
}

export default Coupons;
