import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

function Chat(props: any) {
  return (
    <Svg width={22} height={22} viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <Path
        d="M2.2 17.529h2.2V22l5.611-4.471H15.4c1.213 0 2.2-.983 2.2-2.191V6.573a2.198 2.198 0 00-2.2-2.19H2.2c-1.213 0-2.2.982-2.2 2.19v8.765c0 1.208.987 2.191 2.2 2.191z"
        fill="#fff"
      />
      <Path
        d="M19.8 0H6.6C5.387 0 4.4.983 4.4 2.191h13.2c1.213 0 2.2.983 2.2 2.191v8.765c1.213 0 2.2-.983 2.2-2.191V2.19A2.198 2.198 0 0019.8 0z"
        fill="#fff"
      />
    </Svg>
  );
}

export default Chat;
