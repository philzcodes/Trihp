import * as React from 'react';
import Svg, { Path } from 'react-native-svg';
import { Colors } from 'react-native/Libraries/NewAppScreen';

function Logout(props: any) {
  return (
    <Svg width={24} height={20} viewBox="0 0 18 20" fill="#FF0000" xmlns="http://www.w3.org/2000/svg" {...props}>
      <Path
        d="M13 15v-3H6V8h7V5l5 5-5 5zM11 0a2 2 0 012 2v2h-2V2H2v16h9v-2h2v2a2 2 0 01-2 2H2a2 2 0 01-2-2V2a2 2 0 012-2h9z"
        fill="#FF0000"
      />
    </Svg>
  );
}

export default Logout;
