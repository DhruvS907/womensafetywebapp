// src/FakeCallWindow.js
import React, { useEffect, useState, useRef } from "react";
import "./FakeCallWindow.css";

/**
 * FakeCallWindow with Phone-like UI that works with existing convao-tools.js
 * The convao-tools.js creates its own widget, so we just need to trigger it
 */
const FakeCallWindow = ({ callerName = "Dad", onEndCall }) => {
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);
  const [isConversationActive, setIsConversationActive] = useState(true);
  const [callSeconds, setCallSeconds] = useState(0);
  const [showConvAI, setShowConvAI] = useState(true);

  const scriptLoadedRef = useRef(false);
  const scriptId = "conva-tools-loader-script";
  const CONVAO_SRC = "/convao-tools.js";

  // Timer logic
  useEffect(() => {
    let timer;
    if (isConversationActive) {
      timer = setInterval(() => setCallSeconds((s) => s + 1), 1000);
    }
    return () => clearInterval(timer);
  }, [isConversationActive]);

  // Small poll helper
  const waitFor = (predicate, interval = 200, timeout = 4000) =>
    new Promise((resolve, reject) => {
      const start = Date.now();
      (function poll() {
        try {
          if (predicate()) return resolve(true);
        } catch (e) {}
        if (Date.now() - start > timeout) return reject(new Error("timeout"));
        setTimeout(poll, interval);
      })();
    });

  // Try to start the widget that convao-tools.js created
  const tryStartWidgetProgrammatically = async () => {
    console.debug("[FakeCallWindow] attempt programmatic start");

    // 1) Use the convaiTools API from your script
    try {
      if (window.convaiTools && typeof window.convaiTools.start === "function") {
        console.debug("[FakeCallWindow] calling window.convaiTools.start()");
        window.convaiTools.start();
        return true;
      }
    } catch (err) {
      console.warn("[FakeCallWindow] window.convaiTools.start() threw:", err);
    }

    // 2) Try to find the elevenlabs-convai element your script created
    try {
      await waitFor(() => !!document.querySelector("elevenlabs-convai"), 250, 6000);
      const widgetEl = document.querySelector("elevenlabs-convai");
      if (widgetEl) {
        console.debug("[FakeCallWindow] found widget element:", widgetEl);
        
        // Try common API method names
        for (const method of ["start", "open", "connect", "init", "activate"]) {
          if (typeof widgetEl[method] === "function") {
            try {
              console.debug(`[FakeCallWindow] calling widgetEl.${method}()`);
              widgetEl[method]();
              return true;
            } catch (err) {
              console.warn(`[FakeCallWindow] widgetEl.${method}() threw:`, err);
            }
          }
        }

        // Try clicking the widget if it has clickable elements
        const clickableEl = widgetEl.querySelector('button, [role="button"], .clickable');
        if (clickableEl) {
          try {
            console.debug("[FakeCallWindow] clicking widget element:", clickableEl);
            clickableEl.click();
            return true;
          } catch (err) {
            console.warn("[FakeCallWindow] clicking widget element failed:", err);
          }
        }
      }
    } catch (err) {
      console.debug("[FakeCallWindow] widget element not ready within timeout:", err);
    }

    // 3) Dispatch custom events to trigger widget
    try {
      console.debug("[FakeCallWindow] dispatching convai:start-call event");
      window.dispatchEvent(new CustomEvent("convai:start-call"));
      return true;
    } catch (err) {
      console.warn("[FakeCallWindow] custom event dispatch failed:", err);
    }

    console.warn("[FakeCallWindow] could not start widget programmatically.");
    return false;
  };

  // Load convao-tools.js and initialize widget
  useEffect(() => {
    if (!showConvAI) {
      // Hide the widget when showConvAI is false
      const existingWidget = document.querySelector('.convai-widget');
      if (existingWidget) {
        existingWidget.style.display = 'none';
      }
      return;
    }

    // Show the widget when showConvAI is true
    const existingWidget = document.querySelector('.convai-widget');
    if (existingWidget) {
      existingWidget.style.display = 'block';
    }

    console.log("[FakeCallWindow] ConvAI effect triggered, showConvAI:", showConvAI);

    // Avoid injecting script multiple times
    if (scriptLoadedRef.current || document.getElementById(scriptId) || window.__CONVAI_WIDGET_LOADED__) {
      scriptLoadedRef.current = true;
      console.log("[FakeCallWindow] Script already loaded, attempting start...");
      
      (async () => {
        try {
          await new Promise(resolve => setTimeout(resolve, 500));
          const started = await tryStartWidgetProgrammatically();
          console.debug("[FakeCallWindow] tryStart after already-loaded script returned:", started);
        } catch (err) {
          console.warn("[FakeCallWindow] tryStart after already-loaded script error:", err);
        }
      })();
      return;
    }

    console.log("[FakeCallWindow] Loading ConvAI script...");

    // Set runtime config for your convao-tools.js
    window.CONVAI_CONFIG = window.CONVAI_CONFIG || {};
    window.CONVAI_CONFIG.agentId = window.CONVAI_CONFIG.agentId || 'agent_2801k4c88aaffanv3kvjc8sksxrm';
    window.CONVAI_CONFIG.widgetPosition = 'bottom-right';
    window.CONVAI_CONFIG.openInNewTab = true;

    // Create script tag
    const s = document.createElement("script");
    s.id = scriptId;
    s.src = CONVAO_SRC;
    s.async = true;

    s.onload = async () => {
      console.log("[FakeCallWindow] convao-tools.js loaded successfully");
      scriptLoadedRef.current = true;

      // Give time for the widget to be created and attached to DOM
      await new Promise(resolve => setTimeout(resolve, 1000));

      try {
        const started = await tryStartWidgetProgrammatically();
        console.debug("[FakeCallWindow] attempted start after load ->", started);
        
        if (started) {
          console.log("[FakeCallWindow] ✅ ConvAI widget started successfully!");
        } else {
          console.warn("[FakeCallWindow] ❌ Failed to start ConvAI widget");
          
          // Log what widgets are available
          const widgets = document.querySelectorAll('elevenlabs-convai');
          console.log("[FakeCallWindow] Available elevenlabs-convai elements:", widgets);
        }
      } catch (err) {
        console.warn("[FakeCallWindow] error while trying to start widget:", err);
      }
    };

    s.onerror = (e) => {
      console.error("[FakeCallWindow] failed to load convao-tools.js", e);
      console.error("[FakeCallWindow] Make sure the file exists at:", CONVAO_SRC);
    };

    document.head.appendChild(s);

    // Cleanup on unmount
    return () => {
      console.log("[FakeCallWindow] Cleaning up ConvAI...");
      const el = document.getElementById(scriptId);
      if (el) el.remove();

      // Remove the widget wrapper that convao-tools.js created
      const widgetWrappers = document.querySelectorAll('.convai-widget');
      widgetWrappers.forEach((wrapper) => wrapper && wrapper.remove());

      scriptLoadedRef.current = false;
    };
  }, [showConvAI]);

  const formatTime = (seconds) => {
    const mm = Math.floor(seconds / 60).toString().padStart(2, "0");
    const ss = (seconds % 60).toString().padStart(2, "0");
    return `${mm}:${ss}`;
  };

  const handleEndCallClick = () => {
    setIsConversationActive(false);
    setShowConvAI(false);

    // Use convaiTools.end() from your script
    try {
      if (window.convaiTools && typeof window.convaiTools.end === "function") {
        window.convaiTools.end();
      } else {
        window.dispatchEvent(new CustomEvent("convai:end-call"));
      }
    } catch (err) {
      console.warn("Widget end instruction failed:", err);
    }

    if (typeof onEndCall === "function") {
      try {
        onEndCall();
      } catch (err) {
        console.warn("onEndCall threw:", err);
      }
    }
  };

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

  const AIAssistantIcon = () => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 8V4H8"></path>
      <rect x="2" y="8" width="20" height="12" rx="2"></rect>
      <path d="M6 16h12"></path>
      <circle cx="9" cy="12" r="1"></circle>
      <circle cx="15" cy="12" r="1"></circle>
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
        {isConversationActive && showConvAI && (
          <div className="conversation-status">AI Assistant Active</div>
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
              className={`icon-bg ${showConvAI ? 'active' : ''}`}
              onClick={() => setShowConvAI(!showConvAI)}
              aria-label="Keypad"
            >
              <AIAssistantIcon />
            </button>
            <p>AI assist</p>
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