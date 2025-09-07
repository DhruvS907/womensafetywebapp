// src/App.js
import React, { useState } from "react";
import SplashScreen from "./SplashScreen";
import EnterFakeCall from "./EnterFakeCall";
import Countdown from "./Countdown";
import FakeCallWindow from "./FakeCallWindow";
import CallEndedBackground from "./CallEndedBackground";

import "./App.css";
import "./SplashScreen.css";
import "./EnterFakeCall.css";
import "./Countdown.css";
import "./FakeCallWindow.css";
import "./CallEndedBackground.css";

export default function App() {
  // flow: 'splash' -> 'enter' -> 'count' -> 'call' -> 'ended'
  const [flow, setFlow] = useState("splash");
  const [scheduledSecs, setScheduledSecs] = useState(5);
  const [callerName, setCallerName] = useState("Dad");
  const [lastCallDuration, setLastCallDuration] = useState(0);

  // Replace with your real agent id or keep empty and set window.CONVAI_CONFIG elsewhere
  const AGENT_ID = "your_real_elevenlabs_agent_id_here";

  // Splash -> Enter (after 2s)
  function onSplashTimeout() {
    setFlow("enter");
  }

  // EnterFakeCall -> schedule
  // Receives (timeLabel, name)
  function onSchedule(timeLabel, name) {
    // Convert label like "5 secs", "1 min" -> seconds
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

  // Countdown finished or skip
  function onCountdownFinish() {
    setFlow("call");
  }

  // FakeCallWindow ended: receives durationSeconds
  function onCallEnd(durationSeconds) {
    setLastCallDuration(durationSeconds || 0);
    setFlow("ended");
  }

  // From CallEnded -> start new flow
  function onStartNewCall() {
    setFlow("enter");
  }

  return (
    <div className="app-root">
      {flow === "splash" && <SplashScreen onTimeout={onSplashTimeout} />}

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
          autoStart={true}
          onEndCall={onCallEnd}
        />
      )}

      {flow === "ended" && <CallEndedBackground duration={lastCallDuration} onNewCall={onStartNewCall} />}
    </div>
  );
}
