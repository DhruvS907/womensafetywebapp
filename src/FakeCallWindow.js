import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import './FakeCallWindow.css';

const FakeCallWindow = ({ callerName: propCallerName = "Dad", onEndCall, agentId, autoStart=false }) => {
  const params = useParams();
  const callerNameFromUrl = params?.callerName ? decodeURIComponent(params.callerName) : null;
  const callerName = callerNameFromUrl || propCallerName || "Dad";
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);
  const [isConversationActive, setIsConversationActive] = useState(true);
  const [callSeconds, setCallSeconds] = useState(0);

  // Timer logic
  useEffect(() => {
    let timer;
    if (isConversationActive) {
      timer = setInterval(() => setCallSeconds((s) => s + 1), 1000);
    }
    return () => clearInterval(timer);
  }, [isConversationActive]);

  const formatTime = (seconds) => {
    const mm = Math.floor(seconds / 60).toString().padStart(2, "0");
    const ss = (seconds % 60).toString().padStart(2, "0");
    return `${mm}:${ss}`;
  };

  const handleEndCallClick = () => {
    setIsConversationActive(false);
    if (typeof onEndCall === "function") {
      try {
        onEndCall();
      } catch (err) {
        console.warn("onEndCall threw:", err);
      }
    }
  };

  // load Convai script visibly
  useEffect(() => {
    if (!document.getElementById("convai-tools-loader")) {
      const s = document.createElement("script");
      s.id = "convai-tools-loader";
      s.src = "/convao-tools.js";
      s.async = true;
      document.body.appendChild(s);
    }
  }, []);

  // Phone call action icons (SVG components)
  const MuteIcon = () => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      {isMuted ? (
        <>
          <line x1="1" y1="1" x2="23" y2="23"></line>
          <path d="m9 9 3 3m0 0v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6"></path>
          <path d="M17 16.95A7 7 0 0 1 5 12v-2a1 1 0 0 1 1-1h1"></path>
        </>
      ) : (
        <>
          <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
          <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
          <line x1="12" y1="19" x2="12" y2="23"></line>
          <line x1="8" y1="23" x2="16" y2="23"></line>
        </>
      )}
    </svg>
  );

  const KeypadIcon = () => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="6" cy="6" r="1" />
      <circle cx="12" cy="6" r="1" />
      <circle cx="18" cy="6" r="1" />
      <circle cx="6" cy="12" r="1" />
      <circle cx="12" cy="12" r="1" />
      <circle cx="18" cy="12" r="1" />
      <circle cx="6" cy="18" r="1" />
      <circle cx="12" cy="18" r="1" />
      <circle cx="18" cy="18" r="1" />
    </svg>
  );

  const SpeakerIcon = () => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      {isSpeakerOn ? (
        <>
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
          <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
          <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
        </>
      ) : (
        <>
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
          <line x1="22" y1="9" x2="16" y2="15"></line>
          <line x1="16" y1="9" x2="22" y2="15"></line>
        </>
      )}
    </svg>
  );

  const VideoIcon = () => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polygon points="23 7 16 12 23 17 23 7"></polygon>
      <rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
    </svg>
  );

  const AddCallIcon = () => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
      <line x1="12" y1="1" x2="12" y2="7"></line>
      <line x1="9" y1="4" x2="15" y2="4"></line>
    </svg>
  );

  const ContactsIcon = () => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
      <circle cx="9" cy="7" r="4"></circle>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
    </svg>
  );

  const PhoneOffIcon = () => (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
      <line x1="1" y1="1" x2="23" y2="23"></line>
    </svg>
  );

  return (
    <div className="call-screen">
      {/* Caller Information */}
      <div className="caller-info">
        <h1 className="caller-name">{callerName}</h1>
        <div className="call-timer">{formatTime(callSeconds)}</div>
        {isConversationActive && (
          <div className="conversation-status">Connected</div>
        )}
      </div>

      {/* Call Actions */}
      <div className="call-actions">
        <div className="action-row">
          <div className="action-item">
            <button 
              className={`icon-bg ${isMuted ? 'active' : ''}`}
              onClick={() => setIsMuted(!isMuted)}
              aria-label="Mute"
            >
              <MuteIcon />
            </button>
            <p>mute</p>
          </div>
          
          <div className="action-item">
            <button 
              className="icon-bg"
              aria-label="Keypad"
            >
              <KeypadIcon />
            </button>
            <p>keypad</p>
          </div>
          
          <div className="action-item">
            <button 
              className={`icon-bg ${isSpeakerOn ? 'active' : ''}`}
              onClick={() => setIsSpeakerOn(!isSpeakerOn)}
              aria-label="Speaker"
            >
              <SpeakerIcon />
            </button>
            <p>speaker</p>
          </div>
        </div>

        <div className="action-row">
          <div className="action-item">
            <button className="icon-bg" aria-label="Add Call">
              <AddCallIcon />
            </button>
            <p>add call</p>
          </div>
          
          <div className="action-item">
            <button className="icon-bg" aria-label="FaceTime">
              <VideoIcon />
            </button>
            <p>FaceTime</p>
          </div>
          
          <div className="action-item">
            <button className="icon-bg" aria-label="Contacts">
              <ContactsIcon />
            </button>
            <p>contacts</p>
          </div>
        </div>
      </div>

      {/* End Call Button */}
      <div className="end-call-wrapper">
        <button className="end-call-btn" onClick={handleEndCallClick} aria-label="End Call">
          <PhoneOffIcon />
        </button>
      </div>
    </div>
  );
};

export default FakeCallWindow;