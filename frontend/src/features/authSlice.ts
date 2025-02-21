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
  message: string | null;
  loading: boolean;
  otpVerified: boolean;
}

const getTokenFromCookies = () => Cookies.get("access_token") || null;
const initialState: AuthState = {
  user: null,
  token: getTokenFromCookies(),
  error: null,
  message: null,
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
      const { error, message, user } = response.data;
      const token = response.data.access_token;
      Cookies.set("access_token", token, {
        expires: expires(token),
        path: "/",
        sameSite: "Strict",
        secure: process.env.NODE_ENV === "production"
      });
      localStorage.setItem("user", user.user);
      localStorage.setItem("token", token);
      return { error, message, user, token };
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
      localStorage.setItem("user", user.user);
      localStorage.setItem("token", token);
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
      let { token, user } = state.auth;

      if (!user && !token ){
        token = localStorage.getItem("token");
        user = localStorage.getItem("user")
        return thunkAPI.rejectWithValue("User not found");
      }
      if (!!user && !!token) {
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
      const { error, message } = response.data
      return { error, message };
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async (data: { token: string; password: string }, thunkAPI) => {
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

// **🔹 Subscribe to Our News Letter**
export const subscribeUsers = createAsyncThunk(
  "auth/subscribe",
  async (
    userData: {
      email: string;
    },
    thunkAPI
  ) => {
    try {
      const response = await API.post("/user/subscribe", userData);
      const { message, error } = response.data;
      return { message, error }
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data.error
      );
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
        state.message = action.payload.message;
        state.error = action.payload.error;
        state.token = action.payload.token;
        state.user = action.payload.user;
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
        if (action.payload && action.payload.user) {
          state.user = action.payload.user;
        } else {
          state.error = "User data is missing";
        }
        state.loading = false;
      })
      .addCase(fetchUserDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.otpVerified = false
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
      .addCase(forgotPassword.pending, (state) => {
        state.loading = true;
      })
      .addCase(forgotPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
        state.error = action.payload.error
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(subscribeUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(subscribeUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
        state.error = action.payload.error;
      })
      .addCase(subscribeUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
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
