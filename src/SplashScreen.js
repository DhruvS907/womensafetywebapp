// src/SplashScreen.js
import React, { useEffect } from "react";
import "./SplashScreen.css";

export default function SplashScreen({ onTimeout }) {
  useEffect(() => {
    const t = setTimeout(() => {
      if (typeof onTimeout === "function") onTimeout();
    }, 2000);
    return () => clearTimeout(t);
  }, [onTimeout]);

  return (
    <div className="splash-screen">
      <img src="/assets/logo.png" alt="Logo" className="splash-logo" />
      <h1 className="splash-title">SafeHer</h1>
      <p className="splash-sub">Your AI powered guardian</p>
    </div>
  );
}
