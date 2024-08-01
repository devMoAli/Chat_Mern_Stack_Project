import React from 'react';
import Lottie from 'lottie-react';
import typingAnimation from './typing.json';

const TypingIndicator = ({ visible }) => (
  <div style={{ display: visible ? 'flex' : 'none', justifyContent: 'left', padding: '10px' }}>
    <Lottie
      animationData={typingAnimation}
      loop
      style={{ width: 50, height: 50 }}
    />
  </div>
);

export default TypingIndicator;
