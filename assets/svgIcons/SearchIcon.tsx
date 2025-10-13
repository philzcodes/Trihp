import * as React from 'react';
import Svg, { Rect, Path } from 'react-native-svg';

function SearchIcon(props: any) {
  return (
    <Svg width={45} height={45} viewBox="0 0 45 45" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <Rect width={45} height={45} rx={22.5} fill="#FFDE59" />
      <Path
        d="M21.314 14a6.315 6.315 0 016.315 6.314 6.33 6.33 0 01-1.516 4.11l.262.262h.768L32 29.543 30.543 31l-4.857-4.857v-.768l-.263-.262a6.33 6.33 0 01-4.109 1.516 6.315 6.315 0 010-12.629zm0 1.943a4.353 4.353 0 00-4.371 4.371 4.353 4.353 0 004.371 4.372 4.353 4.353 0 004.372-4.372 4.353 4.353 0 00-4.372-4.371z"
        fill="#000"
      />
    </Svg>
  );
}

export default SearchIcon;
