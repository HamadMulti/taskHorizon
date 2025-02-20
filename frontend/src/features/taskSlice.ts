/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../utils/api";
import { RootState } from "../app/store";

interface Task {
  id: number;
  title: string;
  description: string;
  status: string;
  priority: string;
  projectId: number;
}

interface TaskState {
  tasks: Task[];
  loading: boolean;
  error: string | null;
}

const initialState: TaskState = {
  tasks: [],
  loading: false,
  error: null,
};

export const fetchTasksDetails = createAsyncThunk(
  "auth/fetchTaskDetails",
  async (_, thunkAPI) => {
    try {
      const state: any = thunkAPI.getState() as RootState
      const { token } = state.auth;

      if (!token) {
        throw new Error("No token found");
      }

      API.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      const response = await API.get("/tasks");
      return response.data.tasks;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch tasks details"
      );
    }
  }
);

export const fetchMyTasksDetails = createAsyncThunk(
  "auth/fetchMyTaskDetails",
  async (_, thunkAPI) => {
    try {
      const state: any = thunkAPI.getState() as RootState
      const { token } = state.auth;

      if (!token) {
        throw new Error("No token found");
      }

      API.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      const response = await API.get("/tasks/user-tasks");
      return response.data.tasks;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch my task details"
      );
    }
  }
);

export const fetchTeamTasksDetails = createAsyncThunk(
  "auth/fetchTeamTaskDetails",
  async (_, thunkAPI) => {
    try {
      const state: any = thunkAPI.getState() as RootState
      const { token } = state.auth;

      if (!token) {
        throw new Error("No token found");
      }

      API.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      const response = await API.get("/tasks/team-tasks");
      return response.data.tasks;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch team tasks details"
      );
    }
  }
);


export const createTask = createAsyncThunk(
  "auth/createTaskDetails",
  async (taskData: { title: string; description: string; projectId: number }, thunkAPI) => {
    try {
      const state: any = thunkAPI.getState() as RootState
      const { token } = state.auth;

      if (!token) {
        throw new Error("No token found");
      }

      API.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      const response = await API.post("/tasks", taskData);
      return response.data;
    } catch (error: any) {
      console.error("Fetch User Details Error:", error);
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch user details"
      );
    }
  }
);

export const updateTask = createAsyncThunk(
  "auth/updateTaskDetails",
  async (taskData: { id: number, title: string; description: string; projectId: number }, thunkAPI) => {
    try {
      const state: any = thunkAPI.getState() as RootState
      const { token } = state.auth;

      if (!token) {
        throw new Error("No token found");
      }

      API.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      const response = await API.put(`/tasks/${taskData.id}`, taskData);
      return response.data;
    } catch (error: any) {
      console.error("Fetch User Details Error:", error);
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch user details"
      );
    }
  }
);

export const assignTask = createAsyncThunk(
  "auth/assignTaskDetails",
  async (taskData: { id: number, title: string; description: string; projectId: number }, thunkAPI) => {
    try {
      const state: any = thunkAPI.getState() as RootState
      const { token } = state.auth;

      if (!token) {
        throw new Error("No token found");
      }

      API.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      const response = await API.put(`/tasks/${taskData.id}/assign`, taskData);
      return response.data;
    } catch (error: any) {
      console.error("Fetch User Details Error:", error);
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch user details"
      );
    }
  }
);

export const archiveTask = createAsyncThunk(
  "auth/archiveTaskDetails",
  async (id: number, thunkAPI) => {
    try {
      const state: any = thunkAPI.getState() as RootState
      const { token } = state.auth;

      if (!token) {
        throw new Error("No token found");
      }

      API.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      const response = await API.delete(`/tasks/${id}/archive`);
      return response.data;
    } catch (error: any) {
      console.error("Fetch User Details Error:", error);
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch user details"
      );
    }
  }
);

// Task slice
const taskSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasksDetails.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTasksDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = action.payload;
      })
      .addCase(fetchTasksDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchMyTasksDetails.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMyTasksDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = action.payload;
      })
      .addCase(fetchMyTasksDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchTeamTasksDetails.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTeamTasksDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = action.payload;
      })
      .addCase(fetchTeamTasksDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createTask.pending, (state) => {
        state.loading = true;
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.loading = false
        state.tasks.push(action.payload);
      })
      .addCase(updateTask.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        state.loading = false
        state.tasks.push(action.payload);
      })
      .addCase(assignTask.pending, (state) => {
        state.loading = true;
      })
      .addCase(assignTask.fulfilled, (state, action) => {
        state.loading = false
        state.tasks.push(action.payload);
      })
      .addCase(archiveTask.pending, (state) => {
        state.loading = true;
      })
      .addCase(archiveTask.fulfilled, (state, action) => {
        state.loading = false
        state.tasks.push(action.payload);
      });
  },
});

export default taskSlice.reducer;
