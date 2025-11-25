import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function useAutoLogout() {
  const navigate = useNavigate();
  const IDLE_TIME = 15 * 60 * 1000; // 15 minutes

  useEffect(() => {
    let timeout;

    const resetTimer = () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/login?reason=session_expired&msg=Session expired due to inactivity");
      }, IDLE_TIME);
    };

    // Activity events
    const events = ["mousemove", "keydown", "scroll", "click", "touchstart"];

    events.forEach((ev) => window.addEventListener(ev, resetTimer));

    resetTimer(); // Start on load

    return () => {
      events.forEach((ev) => window.removeEventListener(ev, resetTimer));
      clearTimeout(timeout);
    };
  }, [navigate]);
}
