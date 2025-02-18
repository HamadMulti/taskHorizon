/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../utils/api";
import Cookies from "js-cookie";

interface AuthState {
  user: any | null;
  token: string | null;
  error: string | null;
  loading: boolean;
}

const initialState: AuthState = {
  user: null,
  token: Cookies.get("access_token") || null,
  error: null,
  loading: false,
};

// **🔹 Register a New User**
export const registerUser = createAsyncThunk(
  "auth/register",
  async (userData: { username: string; email: string; password: string, confirmPassword: string }, thunkAPI) => {
    try {
      const response = await API.post("/auth/register", userData);
      // Save the token in a cookie
      const token = response.data.access_token;
      Cookies.set("access_token", token, { expires: 7, secure: true, sameSite: "Strict" });
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);


export const loginUser = createAsyncThunk(
  "auth/login",
  async (credentials: { email: string; password: string }, thunkAPI) => {
    try {
      const response = await API.post("/auth/login", credentials);
      // Save the token in a cookie
      const token = response.data.access_token;
      Cookies.set("access_token", token, { expires: 7, secure: true, sameSite: "Strict" });
      Cookies.set("_email", credentials.email, { expires: 7, secure: true, sameSite: "Strict" });
      
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);


// **🔹 Logout User**
export const logoutUser = createAsyncThunk(
  "auth/logout",
  async () => {
    const response = await API.get("/auth/logout");
    if (response.status !== 200) {
      return {message: "Something went wrong"};
    }
    Cookies.get("access_token");
    return null;  
});

// **🔹 Send OTP for Email Verification**
export const sendOTP = createAsyncThunk(
  "auth/sendOTP",
  async ({email}: {email: string}, thunkAPI) => {
    try {
      const response = await API.post("/auth/send-otp", { email });
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

// **🔹 Verify OTP**
export const verifyOTP = createAsyncThunk(
  "auth/verifyOTP",
  async (data: { email: string; otp: string }, thunkAPI) => {
    try {
      const response = await API.post("/auth/verify-otp", data);
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

// **🔹 Forgot Password (Send Reset Link)**
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

// **🔹 Reset Password**
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

// **🔹 Update User Profile (Phone, Location, Gender, etc.)**
export const updateProfile = createAsyncThunk(
  "auth/updateProfile",
  async (profileData: { phone: string; location: string; gender: string }, thunkAPI) => {
    try {
      const response = await API.put("/user/update-profile", profileData);
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

// **🔹 Auth Slice**
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
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
        state.user = action.payload.user;
        state.token = action.payload.access_token;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.token = null;
      })
      .addCase(sendOTP.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(verifyOTP.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(forgotPassword.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.user = action.payload.user;
      });
  },
});

export default authSlice.reducer;
