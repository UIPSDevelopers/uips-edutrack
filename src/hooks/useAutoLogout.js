// src/hooks/useAutoLogout.js
import { useEffect } from "react";

export default function useAutoLogout(enabled = true, idleMinutes = 15) {
  useEffect(() => {
    if (!enabled) return; // 🔒 only run when enabled

    const IDLE_TIME = idleMinutes * 60 * 1000; // minutes → ms
    let timeoutId;

    const logoutNow = () => {
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      const params = new URLSearchParams({
        reason: "session_expired",
        msg: "Session expired due to inactivity",
      });

      // Hard redirect – no React Router hook needed
      window.location.href = `/login?${params.toString()}`;
    };

    const resetTimer = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(logoutNow, IDLE_TIME);
    };

    const events = ["mousemove", "keydown", "scroll", "click", "touchstart"];

    events.forEach((ev) => window.addEventListener(ev, resetTimer));

    // start timer immediately
    resetTimer();

    return () => {
      events.forEach((ev) => window.removeEventListener(ev, resetTimer));
      clearTimeout(timeoutId);
    };
  }, [enabled, idleMinutes]);
}
