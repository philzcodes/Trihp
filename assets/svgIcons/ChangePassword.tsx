import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

function ChangePassword(props: any) {
  return (
    <Svg width={24} height={18} viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <Path
        d="M0 14v2h6v-2H0zM0 2v2h10V2H0zm10 16v-2h8v-2h-8v-2H8v6h2zM4 6v2H0v2h4v2h2V6H4zm14 4V8H8v2h10zm-6-4h2V4h4V2h-4V0h-2v6z"
        fill="#fff"
      />
    </Svg>
  );
}

export default ChangePassword;
