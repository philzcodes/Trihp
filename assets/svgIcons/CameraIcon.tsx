import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

function CameraIcon(props: any) {
  return (
    <Svg width={20} height={18} viewBox="0 0 20 18" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <Path
        d="M18 2h-3l-2-2H7L5 2H2C.9 2 0 2.9 0 4v12a2 2 0 002 2h16c1.11 0 2-.89 2-2V4a2 2 0 00-2-2zM3 9h2.1A4.997 4.997 0 0111 5.1c.76.15 1.43.49 2 .9l-1.44 1.45C11.11 7.17 10.58 7 10 7c-1.26 0-2.4.8-2.82 2H9l-3 3-3-3zm11.91 2c-.55 2.71-3.19 4.45-5.91 3.9a5.44 5.44 0 01-2-.9l1.44-1.45c.46.28.99.45 1.56.45 1.27 0 2.41-.8 2.83-2H11l3-3 3 3h-2.09z"
        fill="#000"
      />
    </Svg>
  );
}

export default CameraIcon;
