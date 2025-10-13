import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

function Home(props: any) {
  return (
    <Svg width={20} height={20} viewBox="0 0 13 11" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <Path d="M5.2 11V7.118h2.6V11h3.25V5.824H13L6.5 0 0 5.824h1.95V11H5.2z" fill="#fff" />
    </Svg>
  );
}

export default Home;
