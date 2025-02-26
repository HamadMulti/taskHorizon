import API from "./api";
import Cookies from "js-cookie";
import { expireDate } from "./decodeToken";

const refreshAccessToken = async () => {
  try {
    const refreshToken = Cookies.get("refresh_token");

    if (!refreshToken) {
      console.warn("No refresh token found. Cannot refresh session.");
      return null;
    }

    const response = await API.post("/auth/refresh", { refresh_token: refreshToken });
    const newAccessToken = response.data.access_token;

    Cookies.set("access_token", newAccessToken, {
      expires: expireDate(newAccessToken) || 1,
      path: "/",
      sameSite: "Lax",
      secure: process.env.NODE_ENV === "production",
    });

    localStorage.setItem("token", newAccessToken);
    return newAccessToken;
  } catch (error) {
    console.warn("Token refresh failed. Trying again...");
    console.warn("Refresh error", error)
    return null;
  }
};

export default refreshAccessToken;
