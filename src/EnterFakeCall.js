import React, { useState } from 'react';
import './EnterFakeCall.css';

// This SVG component is for the red phone icon in the input field.
const PhoneIcon = () => (
    <svg 
        className="phone-icon"
        xmlns="http://www.w3.org/2000/svg" 
        width="24" 
        height="24" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
    >
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
    </svg>
);

// This SVG component is for the checkbox icon.
const CheckboxIcon = () => (
    <svg 
        className="checkbox-icon"
        xmlns="http://www.w3.org/2000/svg" 
        width="24" 
        height="24" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
    >
        <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
)

const FakeCallScheduler = ({ onSchedule }) => {
  const [callerName, setCallerName] = useState('Dad');
  const [phoneNumber, setPhoneNumber] = useState('+91 7024586068');
  const [selectedTime, setSelectedTime] = useState('5 secs');

  const timeOptions = ['5 secs', '10 secs', '1 min', '5 mins'];

  // This function now calls the onSchedule prop passed from App.js
  const handleScheduleCall = () => {
    if(typeof onSchedule === 'function') {
        onSchedule(selectedTime);
    }
  };

  return (
    <div className="scheduler-container">
      <header className="scheduler-header">
        <div className="logo-placeholder">
            <img src="/assets/Logo.png" alt="SafeHer Logo" className="header-logo"/>
            <span>SafeHer</span>
        </div>
        <h2>Caller Details</h2>
        <p>Specify time & caller details to schedule the call.</p>
      </header>

      <main className="scheduler-main">
        <section className="caller-details">
          <label>Enter the fake caller details</label>
          <div className="input-group">
            <input
              type="text"
              placeholder="Caller Name"
              value={callerName}
              onChange={(e) => setCallerName(e.target.value)}
            />
          </div>
          <div className="input-group">
            <input
              type="text"
              placeholder="Phone Number (Optional)"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
            <PhoneIcon />
          </div>
        </section>

        <section className="schedule-timer">
          <label>Schedule Timer</label>
          <div className="time-options">
            {timeOptions.map((time) => (
              <button
                key={time}
                className={`time-btn ${selectedTime === time ? 'active' : ''}`}
                onClick={() => setSelectedTime(time)}
              >
                {time}
              </button>
            ))}
          </div>
        </section>

        <div className="secure-notice">
          <CheckboxIcon />
          <span>Your details are stored securely.</span>
        </div>
      </main>

      <footer className="scheduler-footer">
        <button className="schedule-btn" onClick={handleScheduleCall}>
          Schedule a Fake Call
        </button>
      </footer>
    </div>
  );
};

export default FakeCallScheduler;

