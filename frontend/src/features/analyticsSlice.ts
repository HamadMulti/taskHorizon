/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../utils/api";
import { RootState } from "../app/store";

export interface AnalyticsData {
  user_id?: number;
  username?: string;
  total_tasks: number;
  completed_tasks: number;
  due_tasks?: number;
  pending_tasks?: number;
  productivity_percentage: number;
}

export interface AnalyticsState {
  analytics: AnalyticsData[];
  loading: boolean;
  error: string | null;
}

const initialState: AnalyticsState = {
  analytics: [],
  loading: false,
  error: null,
};

export const fetchAnalytics = createAsyncThunk(
  "analytics/fetchAnalytics",
  async (_, thunkAPI) => {
    try {
      const state = thunkAPI.getState() as RootState;
      const token = state.auth.token ?? null;

      if (!token) {
        return thunkAPI.rejectWithValue("Token is missing");
      }

      API.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      const response = await API.get("/analytics/stats");

      console.log(response);

      return response.data.analytics.map((entry: any) => entry.analytics);
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch analytics data"
      );
    }
  }
);

const analyticsSlice = createSlice({
  name: "analytics",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAnalytics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAnalytics.fulfilled, (state, action) => {
        state.loading = false;
        state.analytics = action.payload;
      })
      .addCase(fetchAnalytics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default analyticsSlice.reducer;

