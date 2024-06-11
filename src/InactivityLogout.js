import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const InactivityLogout = () => {
  const navigate = useNavigate();
  const logoutTimer = useRef(null);

  useEffect(() => {
    const resetTimer = () => {
      clearTimeout(logoutTimer.current);
      logoutTimer.current = setTimeout(() => {
        localStorage.removeItem("token");
        localStorage.removeItem("phoneNumber");
        navigate("/login");
      }, 300000); // 5 minutes
    };

    const events = ["click", "mousemove", "keypress", "scroll", "touchstart"];
    events.forEach((event) => window.addEventListener(event, resetTimer));

    return () => {
      events.forEach((event) => window.removeEventListener(event, resetTimer));
      clearTimeout(logoutTimer.current);
    };
  }, [navigate]);

  return null;
};

export default InactivityLogout;
