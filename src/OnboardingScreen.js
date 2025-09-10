import React from 'react';
import './OnboardingScreen.css';

/**
 * OnboardingScreen component that introduces the app to the user.
 * This screen appears after the splash screen.
 * @param {object} props - The component props.
 * @param {function} props.onNext - Callback function to proceed to the next screen.
 */
const OnboardingScreen = ({ onNext }) => {
  return (
    <div className="onboarding-container">
      <header className="onboarding-header">
        {/* The logo uses the same path as your other components */}
        <img src="/assets/logo.png" alt="SafeHer Logo" className="header-logo" />
        <span className="header-title">SafeHer</span>
      </header>

      <main className="onboarding-main">
        {/* Make sure you have this image in your public/assets folder */}
        <img 
            src="/assets/Onboarding_image.png" 
            alt="A woman walking safely while using her phone" 
            className="onboarding-illustration" 
        />
        <h2 className="onboarding-title">
          SafeHer is a women's safety app that helps you feel secure.
        </h2>
        <p className="onboarding-description">
          With its Fake Guardian Call, it sounds like your guardian is nearby, making you safer and discourages anyone with wrong intentions.
        </p>
      </main>

      <footer className="onboarding-footer">
        <button className="next-btn" onClick={onNext}>
          Next
          <span className="page-indicator">(1/2)</span>
        </button>
      </footer>
    </div>
  );
};

export default OnboardingScreen;
