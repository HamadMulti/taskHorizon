import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./useAuth";
import { decodeToken } from "../utils/decodeToken";

export function useSessionTimeout() {
  const { token, handleLogout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      const decoded = decodeToken(token);
      if (decoded) {
        const expiryTime = decoded.exp * 1000;
        const timeLeft = expiryTime - Date.now();

        if (timeLeft > 0) {
          const timer = setTimeout(() => {
            handleLogout();
            alert("Your session has expired. Please log in again.");
            navigate("/login");
            navigate(0)
          }, timeLeft);

          return () => clearTimeout(timer);
        }
      }
    }
  }, [handleLogout, token, navigate]);
}
