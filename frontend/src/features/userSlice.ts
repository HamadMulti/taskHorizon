/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../utils/api";

export interface User {
  id: number;
  username: string;
  email: string;
  role: string;
  phone: string;
  location: string;
  gender: string;
  primary_email: string;
  verified: boolean;
}

export interface UsersState {
  users: User[];
  total: number;
  pages: number;
  current_page: number;
  loading: boolean;
  error: string | null;
}
const initialState: UsersState = {
  users: [],
  total: 0,
  pages: 0,
  current_page: 1,
  loading: false,
  error: null,
};

export const createUser = createAsyncThunk(
  "auth/register",
  async (userData: {
    username: string;
    email: string;
  }, thunkAPI) => {
    try {
      const state: any = thunkAPI.getState();
      const { token } = state.auth;
      if (!token) {
        return thunkAPI.rejectWithValue("Token is missing");
      }

      API.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      const response = await API.post("/users/create-user", userData);
      return response.data
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Registration failed"
      );
    }
  }
);


// **🔹 Async Thunk for Fetching Users**
export const fetchUsersDetails = createAsyncThunk(
  "users/fetchUsersDetails",
  async (_, thunkAPI) => {
    try {
      const state: any = thunkAPI.getState();
      const { token } = state.auth;

      if (!token) {
        return thunkAPI.rejectWithValue("Token is missing");
      }

      API.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      const response = await API.get("/user/profiles");

      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch users details"
      );
    }
  }
);


const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    resetUsersState: (state) => {
      state.users = [];
      state.total = 0;
      state.pages = 0;
      state.current_page = 1;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsersDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsersDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload.users;
        state.total = action.payload.total;
        state.pages = action.payload.pages;
        state.current_page = action.payload.current_page;
      })
      .addCase(fetchUsersDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { resetUsersState } = userSlice.actions;
export default userSlice.reducer;
