import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./useAuth";
import { decodeToken } from "../utils/decodeToken";
import refreshAccessToken from "../utils/refresh_token";

export function useSessionTimeout() {
  const { token, handleLogout } = useAuth();
  const navigate = useNavigate();
  const isRefreshing = useRef(false);

  useEffect(() => {
    if (!token) {
      return;
    }

    const decoded = decodeToken(token);
    if (!decoded || !decoded.exp) {
      return;
    }

    const expiryTime = decoded.exp * 1000;
    const timeLeft = expiryTime - Date.now();
    const refreshBuffer = 2 * 60 * 1000;

    const handleSessionCheck = async () => {
      if (isRefreshing.current) {
        return;
      }
      isRefreshing.current = true;

      try {
        const newToken = await refreshAccessToken();
        if (!newToken) {
          console.warn("Session expired. Logging out.");
          handleLogout();
          alert("Your session has expired. Please log in again.");
          navigate("/login");
        } else {
          console.warn("Session refreshed successfully.");
        }
      } catch (error) {
        console.warn("Error refreshing session:", error);
        handleLogout();
        alert("Session refresh failed. Please log in again.");
        navigate("/login");
      } finally {
        isRefreshing.current = false;
      }
    };

    if (timeLeft > refreshBuffer) {
      const timer = setTimeout(handleSessionCheck, timeLeft - refreshBuffer);
      return () => clearTimeout(timer);
    } else {
      handleSessionCheck();
    }
  }, [token, handleLogout, navigate]);
}
