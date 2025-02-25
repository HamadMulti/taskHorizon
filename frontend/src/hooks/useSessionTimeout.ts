import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./useAuth";
import { decodeToken } from "../utils/decodeToken";
import refreshAccessToken from "../utils/refresh_token";

export function useSessionTimeout() {
  const { token, handleLogout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      return;
    }

    const decoded = decodeToken(token);
    if (!decoded) {
      return;
    }

    const expiryTime = decoded.exp * 1000;
    const timeLeft = expiryTime - Date.now();
    const refreshBuffer = 2 * 60 * 1000;

    if (timeLeft > refreshBuffer) {
      const timer = setTimeout(async () => {
        const newToken = await refreshAccessToken();
        if (!newToken) {
          handleLogout();
          alert("Your session has expired. Please log in again.");
          navigate("/login");
        }
      }, timeLeft - refreshBuffer);
      return () => clearTimeout(timer);
    } else {
      refreshAccessToken();
    }
    
  }, [token, handleLogout, navigate]);
}
