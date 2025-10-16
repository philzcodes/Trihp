import * as React from 'react';
import Svg, { Rect, Path } from 'react-native-svg';

function Pin(props: any) {
  return (
    <Svg width="20" height="41" viewBox="0 0 22 41" fill="none">
      <Rect x="9.59619" y="20.4067" width="1.79748" height="19.7723" rx="0.89874" fill="black" />
      <Path
        d="M10.9411 21.299C16.6475 21.299 21.2734 16.6731 21.2734 10.9667C21.2734 5.26037 16.6475 0.63446 10.9411 0.63446C5.2348 0.63446 0.608887 5.26037 0.608887 10.9667C0.608887 16.6731 5.2348 21.299 10.9411 21.299Z"
        fill="#DD352E"
      />
    </Svg>
  );
}

export default Pin;
