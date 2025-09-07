import React from 'react';
import './CallEndedBackground.css';

// SVG Icons for the CallEnded screen
const CallEndedIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12.22 12.22a2.5 2.5 0 0 0-3.54 0l-1.76 1.76a5.5 5.5 0 0 0 7.78 7.78l1.76-1.76a2.5 2.5 0 0 0 0-3.54l-1.24-1.24" />
        <path d="m18.36 5.64-1.06-1.06a2 2 0 0 0-2.83 0L12.22 6.83" />
        <path d="m2 2 20 20" />
    </svg>
);

const RefreshIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="23 4 23 10 17 10" />
        <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
    </svg>
);

const CallEnded = ({ duration = 0, onNewCall }) => {
    // Formats seconds into MM:SS format
    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60).toString().padStart(2, '0');
        const secs = (seconds % 60).toString().padStart(2, '0');
        return `${minutes}:${secs}`;
    };

    return (
        <div className="call-ended-container">
            <main className="call-ended-main">
                <div className="icon-wrapper">
                    <CallEndedIcon />
                </div>
                <h1 className="call-ended-title">Call Ended</h1>
                <p className="call-ended-duration">Duration - {formatTime(duration)}</p>
            </main>

            <div className="new-call-section">
                <button className="new-call-btn" onClick={onNewCall}>
                    <RefreshIcon />
                    <span>Start New Call</span>
                </button>
            </div>


            <footer className="call-ended-footer">
                <p className="footer-message">We Hope you are feeling safe now!</p>
                <div className="footer-logo">
                    <img src="/assets/logo.png" alt="SafeHer Logo" className="footer-logo-img" />
                    <span>SafeHer</span>
                </div>
                <p className="footer-subtitle">Your AI-powered guardian angel</p>
            </footer>
        </div>
    );
};

export default CallEnded;
