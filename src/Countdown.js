import React, { useState, useEffect } from 'react';
import './Countdown.css';

const Countdown = ({ countdownFrom = 5, onFinish, onSkip }) => {
  const [count, setCount] = useState(countdownFrom);

  useEffect(() => {
    // When the count reaches 0, call the onFinish function if it exists.
    if (count <= 0) {
      if (typeof onFinish === 'function') {
        onFinish();
      }
      return;
    }

    // Set up an interval to decrease the count every second.
    const timer = setInterval(() => {
      setCount(prevCount => prevCount - 1);
    }, 1000);

    // Clean up the interval when the component unmounts or the count changes.
    return () => clearInterval(timer);
  }, [count, onFinish]);

  const handleSkip = () => {
    // Call the onSkip function if it's provided.
    if(typeof onSkip === 'function') {
        onSkip();
    }
  }

  return (
    <div className="countdown-container">
      <header className="countdown-header">
        <div className="logo-placeholder">
            <img src="/assets/Logo.png" alt="SafeHer Logo" className="header-logo"/>
            <span>SafeHer</span>
        </div>
      </header>
      <main className="countdown-main">
        <div className="timer-circle">
          <span className="timer-count">{count}</span>
        </div>
        <p className="countdown-text">Preparing a Guardian Call</p>
      </main>
      <footer className="countdown-footer">
        <button className="skip-btn" onClick={handleSkip}>
          Skip countdown
        </button>
      </footer>
    </div>
  );
};

export default Countdown;
