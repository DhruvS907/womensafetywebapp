// src/App.js
import React, { useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import SplashScreen from "./SplashScreen";
import OnboardingScreen from "./OnboardingScreen";
import OnboardingScreen2 from "./OnboardingScreen2";
import EnterFakeCall from "./EnterFakeCall";
import Countdown from "./Countdown";
import FakeCallWindow from "./FakeCallWindow";
import CallEndedBackground from "./CallEndedBackground";

// Importing all the necessary CSS files
import "./App.css";
import "./SplashScreen.css";
import "./OnboardingScreen.css";
import "./OnboardingScreen2.css";
import "./EnterFakeCall.css";
import "./Countdown.css";
import "./FakeCallWindow.css";
import "./CallEndedBackground.css";

export default function App() {
  // The 'flow' state manages which component is currently displayed
  const [flow, setFlow] = useState("splash");
  const [scheduledSecs, setScheduledSecs] = useState(5);
  const [callerName, setCallerName] = useState("Dad");
  const [lastCallDuration, setLastCallDuration] = useState(0);

  // Replace with your real agent id or handle it as needed
  const AGENT_ID = "agent_placeholder_id";

  const navigate = useNavigate();

  // Handler to move from Splash to the first Onboarding screen
  function onSplashTimeout() {
    setFlow("onboarding");
  }

  // Handler to move from the first to the second Onboarding screen
  function onOnboardingNext() {
    setFlow("onboarding2");
  }

  // Handler to move from the second Onboarding screen to the call setup
  function onOnboarding2Next() {
    setFlow("enter");
  }

  // Handler to schedule the call from the EnterFakeCall component
  function onSchedule(timeLabel, name) {
    const parse = (label) => {
      if (!label) return 5;
      const [val, unit] = label.split(" ");
      const n = parseInt(val, 10) || 5;
      if (/min/i.test(unit)) return n * 60;
      return n;
    };
    setScheduledSecs(parse(timeLabel));
    setCallerName(name || "Dad");
    setFlow("count");
  }

  // Handler for when the countdown finishes
  function onCountdownFinish() {
    setFlow("call");
  }

  // Handler for when the call ends
  function onCallEnd(durationSeconds) {
    setLastCallDuration(durationSeconds || 0);
    setFlow("ended");
  }

  // Handler to start a new call from the end screen
  function onStartNewCall() {
    setFlow("enter");
  }

  return (
    <Routes>
      {/* The main route that controls the application flow */}
      <Route
        path="/"
        element={
          <div className="app-root">
            {flow === "splash" && <SplashScreen onTimeout={onSplashTimeout} />}
            {flow === "onboarding" && <OnboardingScreen onNext={onOnboardingNext} />}
            {flow === "onboarding2" && <OnboardingScreen2 onNext={onOnboarding2Next} />}
            {flow === "enter" && <EnterFakeCall onSchedule={onSchedule} />}
            {flow === "count" && (
              <Countdown
                countdownFrom={scheduledSecs}
                onFinish={onCountdownFinish}
                onSkip={onCountdownFinish}
              />
            )}
            {flow === "call" && (
              <FakeCallWindow
                callerName={callerName}
                agentId={AGENT_ID}
                onEndCall={onCallEnd}
              />
            )}
            {flow === "ended" && <CallEndedBackground duration={lastCallDuration} onNewCall={onStartNewCall} />}
          </div>
        }
      />

      {/* A deep-link route to directly start a call (optional) */}
      <Route
        path="/call/:callerName"
        element={<FakeCallWindow agentId={AGENT_ID} onEndCall={onCallEnd} />}
      />

      {/* Fallback route to prevent errors */}
      <Route path="*" element={
         <div className="app-root">
            {flow === "splash" && <SplashScreen onTimeout={onSplashTimeout} />}
            {flow === "onboarding" && <OnboardingScreen onNext={onOnboardingNext} />}
            {flow === "onboarding2" && <OnboardingScreen2 onNext={onOnboarding2Next} />}
            {flow === "enter" && <EnterFakeCall onSchedule={onSchedule} />}
            {flow === "count" && (
              <Countdown
                countdownFrom={scheduledSecs}
                onFinish={onCountdownFinish}
                onSkip={onCountdownFinish}
              />
            )}
            {flow === "call" && (
              <FakeCallWindow
                callerName={callerName}
                agentId={AGENT_ID}
                onEndCall={onCallEnd}
              />
            )}
            {flow === "ended" && <CallEndedBackground duration={lastCallDuration} onNewCall={onStartNewCall} />}
          </div>
      } />
    </Routes>
  );
}

