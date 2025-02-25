/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../utils/api";
import { RootState } from "../app/store";

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
  message: string | null;
}
const initialState: UsersState = {
  users: [],
  total: 0,
  pages: 0,
  current_page: 1,
  loading: false,
  error: null,
  message: null
};

export const createUser = createAsyncThunk(
  "users/create",
  async (
    userData: {
      username: string;
      email: string;
    },
    thunkAPI
  ) => {
    try {
      const state: any = thunkAPI.getState();
      const { token } = state.auth;
      if (!token) {
        return thunkAPI.rejectWithValue("Token is missing");
      }

      API.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      const response = await API.post("/user/create-user", userData);
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Registration failed"
      );
    }
  }
);

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

export const updatesProfile = createAsyncThunk(
  "users/updatesProfile",
  async (
    { id, username, email }: { id: number; username: string; email: string },
    thunkAPI
  ) => {
    try {
      const state = thunkAPI.getState() as RootState;
      const token = state.auth.token ?? null;
      API.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      const response = await API.put(`/user/updates-profile/${id}`, {
        username,
        email
      });
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Error updating user"
      );
    }
  }
);

export const deleteUser = createAsyncThunk(
  "users/delete",
  async (id: number, thunkAPI) => {
    try {
      const state = thunkAPI.getState() as RootState;
      const token = state.auth.token ?? null;
      API.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      await API.delete(`/user/${id}`);
      return id;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Error deleting project"
      );
    }
  }
);

export const changeUserPassword = createAsyncThunk(
  "users/changesPassword",
  async (id: number, thunkAPI) => {
    try {
      const state = thunkAPI.getState() as RootState;
      const token = state.auth.token ?? null;
      API.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      await API.put(`/user/change-password/${id}`);
      return id;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Error deleting project"
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
    }
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
      })
      .addCase(createUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
        state.error = action.payload.error;
      })
      .addCase(createUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updatesProfile.fulfilled, (state, action) => {
        const index = state.users.findIndex((p) => p.id === action.payload.id);
        if (index !== -1) {
          state.users[index] = action.payload;
        }
      })
      .addCase(changeUserPassword.fulfilled, (state, action) => {
        state.users = state.users.filter((p) => p.id !== action.payload);
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.users = state.users.filter((p) => p.id !== action.payload);
      });
  }
});

export const { resetUsersState } = userSlice.actions;
export default userSlice.reducer;
