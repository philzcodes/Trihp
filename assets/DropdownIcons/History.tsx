import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

function History(props: any) {
  return (
    <Svg width={20} height={22} viewBox="0 0 13 11" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <Path
        d="M7.738 3.056H6.81V6.11l2.649 1.552.446-.74-2.167-1.27V3.056zM7.428 0C5.952 0 4.535.58 3.49 1.61A5.464 5.464 0 001.857 5.5H0l2.451 2.463L4.952 5.5H3.095a4.25 4.25 0 011.27-3.025 4.362 4.362 0 013.064-1.253c1.149 0 2.251.45 3.064 1.253A4.25 4.25 0 0111.762 5.5a4.25 4.25 0 01-1.27 3.025 4.362 4.362 0 01-6.122-.006l-.879.868A5.543 5.543 0 007.43 11c1.477 0 2.894-.58 3.94-1.61A5.465 5.465 0 0013 5.5a5.465 5.465 0 00-1.632-3.89A5.609 5.609 0 007.428 0z"
        fill="#fff"
      />
    </Svg>
  );
}

export default History;
