/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import API from "../utils/api";
import Cookies from "js-cookie";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { expireDate } from "../utils/decodeToken";

interface AuthState {
  user: any | null;
  token: string | null;
  error: string | null;
  loading: boolean;
  otpVerified: boolean;
}

const getTokenFromCookies = () => Cookies.get("access_token") || null;
const initialState: AuthState = {
  user: null,
  token: getTokenFromCookies(),
  error: null,
  loading: false,
  otpVerified: false
};

const expires = (t: string) => expireDate(t) || 1

// **🔹 Register a New User**
export const registerUser = createAsyncThunk(
  "auth/register",
  async (
    userData: {
      username: string;
      email: string;
      password: string;
      confirmPassword: string;
    },
    thunkAPI
  ) => {
    try {
      const response = await API.post("/auth/register", userData);
      const token = response.data.access_token;

      Cookies.set("access_token", token, {
        expires: expires(token),
        path: "/",
        sameSite: "Strict",
        secure: process.env.NODE_ENV === "production"
      });

      return { token };
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Registration failed"
      );
    }
  }
);

// **🔹 Login User**
export const loginUser = createAsyncThunk(
  "auth/login",
  async (credentials: { email: string; password: string }, thunkAPI) => {
    try {
      const response = await API.post("/auth/login", credentials);
      const token = response.data.access_token;
      const {user} = response.data;

      Cookies.set("access_token", token, {
        expires: expires(token),
        path: "/",
        sameSite: "Strict",
        secure: process.env.NODE_ENV === "production"
      });
      return { token, user };
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data || "Login failed");
    }
  }
);

// **🔹 Fetch User Details**
export const fetchUserDetails = createAsyncThunk(
  "auth/fetchUserDetails",
  async (_, thunkAPI) => {
    try {
      const state: any = thunkAPI.getState();
      const { token, user } = state.auth;

      if (user && token) {
        return thunkAPI.rejectWithValue("User already exists");
      }

      API.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      const response = await API.get("/user/profile");
      return response.data.user;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch user details"
      );
    }
  }
);

// **🔹 Logout User**
export const logoutUser = createAsyncThunk("auth/logout", async (_, thunkAPI) => {
  try {
    await API.get("/auth/logout");
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.response.data);
  }

  Cookies.remove("access_token");
  return null;
});

export const updateProfile = createAsyncThunk(
  "auth/updateProfile",
  async (
    profileData: { phone: string; location: string; gender: string },
    thunkAPI
  ) => {
    try {
      const state: any = thunkAPI.getState();
      const { token } = state.auth;

      if (!token) {
        throw new Error("No token found");
      }

      API.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      const response = await API.put("/user/update-profile", profileData);
      state.auth.user = response.data.user;
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Profile update failed"
      );
    }
  }
);

export const sendOTP = createAsyncThunk(
  "auth/sendOTP",
  async (_, thunkAPI) => {
    try {
      const state: any = thunkAPI.getState();
      const { user } = state.auth;
      const email = user?.email
      const token = state.auth.token ?? null;
      if (!email) {
        return thunkAPI.rejectWithValue("Email is missing.");
      }
      API.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      const response = await API.post("/auth/send-otp", { email });
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data || "Error sending OTP");
    }
  }
);

export const verifyOTP = createAsyncThunk(
  "auth/verifyOTP",
  async (otp: string, thunkAPI) => {
    try {
      const state: any = thunkAPI.getState();
      const { user } = state.auth;
      const email = user?.email
      const token = state.auth.token ?? null;
      if (!email) {
        return thunkAPI.rejectWithValue("Email is missing.");
      }
      API.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      const response = await API.post("/auth/verify-otp", { email, otp });
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data || "Invalid OTP");
    }
  }
);


export const forgotPassword = createAsyncThunk(
  "auth/forgotPassword",
  async (email: string, thunkAPI) => {
    try {
      const response = await API.post("/auth/forgot-password", { email });
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async (data: { token: string; newPassword: string }, thunkAPI) => {
    try {
      const response = await API.post("/auth/reset-password", data);
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const hydrateAuthState = createAsyncThunk(
  "auth/hydrateAuthState",
  async (_, thunkAPI) => {
    try {
      const state: any = thunkAPI.getState();
      const { token } = state.auth;

      if (token) {
        API.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      } else {
        delete API.defaults.headers.common["Authorization"];
      }
      return { token };
    } catch (error: any) {
      return { token: null, error: error };
    }
  }
);

// **🔹 Auth Slice**
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCurrentUser(state, action: PayloadAction<any>) {
      state.user = action.payload.user;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.user = action.payload.user
        state.error = null;
        Cookies.set("access_token", action.payload.token, {
          expires: expires(action.payload.token),
          path: "/"
        });
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(hydrateAuthState.pending, (state) => {
        state.loading = true;
      })
      .addCase(hydrateAuthState.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
      })
      .addCase(fetchUserDetails.pending, (state) => {
        if (!state.user) {
          state.loading = true;
        }
      })
      .addCase(fetchUserDetails.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.loading = false;
      })
      .addCase(fetchUserDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.token = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
      })
      .addCase(sendOTP.fulfilled, (state) => {
        state.loading = false;
        state.otpVerified = false
      })
      .addCase(verifyOTP.fulfilled, (state) => {
        state.loading = false;
        state.otpVerified = true
      })
      .addCase(forgotPassword.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.loading = false;
      });
  }
});

// **🔹 Persist Configuration**
const persistConfig = {
  key: "auth",
  storage,
  whitelist: ["token", "user", "otpVerified"]
};

export const { setCurrentUser } = authSlice.actions;
export default persistReducer(persistConfig, authSlice.reducer);
