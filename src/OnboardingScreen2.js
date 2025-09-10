import React from 'react';
import './OnboardingScreen2.css';

/**
 * OnboardingScreen2 component with user instructions.
 * This is the second screen in the onboarding flow.
 * @param {object} props - The component props.
 * @param {function} props.onNext - Callback function to proceed to the next screen.
 */
const OnboardingScreen2 = ({ onNext }) => {
  return (
    <div className="onboarding-container-2">
      <header className="onboarding-header-2">
        <img src="/assets/logo.png" alt="SafeHer Logo" className="header-logo" />
        <span className="header-title">SafeHer</span>
      </header>

      <main className="onboarding-main-2">
        <div className="info-section">
          <h2 className="section-title">The Goal</h2>
          <p className="section-text">
            To back of the attacker by signaling that you have a guardian nearby to protect
          </p>
        </div>

        <div className="info-section">
          <h2 className="section-title">User Instructions</h2>
          <p className="section-text">
            Schedule the fake call by entering the required details and a timer
          </p>
        </div>
        
        <div className="info-section">
          <p className="section-text">
            <strong>Conversation Starts Naturally:</strong> The father's voice will start the call in Hindi by saying - "Hello beta, kaha pe ho?"
          </p>
        </div>

        <div className="info-section">
          <p className="section-text">
            <strong>Your role:</strong> simply respond by telling where you are (choose from the 4 scenarios): Cab; Bus; Metro; Walking at Night
          </p>
        </div>

        <div className="info-section">
          <p className="section-text">
            The call is optimized for <strong>4-6 exchanges</strong>. You can end anytime with phrases like "Call rakhti hoon" or "Bye"
          </p>
        </div>
      </main>

      <footer className="onboarding-footer-2">
        <button className="next-btn" onClick={onNext}>
          Next
          <span className="page-indicator">(2/2)</span>
        </button>
      </footer>
    </div>
  );
};

export default OnboardingScreen2;
