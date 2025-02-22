/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../utils/api";
import { RootState } from "../app/store";

export interface Task {
  id: number;
  title: string;
  description: string;
  status: string;
  priority?: string;
  assigned_to?: string;
  project_id: number;
  due_date?: Date;
}

interface PaginatedResponse {
  tasks?: Task[];
  my_tasks?: Task[];
  team_tasks?: Task[];
  total: number;
  pages: number;
}

interface TaskState {
  tasks: Task[];
  my_tasks: Task[];
  team_tasks: Task[];
  totalTasks: number;
  totalMyTasks: number;
  totalTeamTasks: number;
  totalPages: number;
  totalMyPages: number;
  totalTeamPages: number;
  loading: boolean;
  error: string | null;
}

const initialState: TaskState = {
  tasks: [],
  my_tasks: [],
  team_tasks: [],
  totalTasks: 0,
  totalMyTasks: 0,
  totalTeamTasks: 0,
  totalPages: 1,
  totalMyPages: 1,
  totalTeamPages: 1,
  loading: false,
  error: null,
};

// Fetch All Tasks with Pagination
export const fetchTasksDetails = createAsyncThunk(
  "tasks/fetchTasksDetails",
  async ({ page = 1 }: { page: number }, thunkAPI) => {
    try {
      const state = thunkAPI.getState() as RootState;
      const { token } = state.auth;

      if (!token) {
        throw new Error("No token found");
      }

      API.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      const response = await API.get(`/tasks?page=${page}`);
      console.log(response)
      return response.data as PaginatedResponse;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch tasks details"
      );
    }
  }
);

// Fetch My Tasks with Pagination
export const fetchMyTasksDetails = createAsyncThunk(
  "tasks/fetchMyTasksDetails",
  async ({ page = 1 }: { page: number }, thunkAPI) => {
    try {
      const state = thunkAPI.getState() as RootState;
      const { token } = state.auth;

      if (!token) {
        throw new Error("No token found");
      }

      API.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      const response = await API.get(`/tasks/user-tasks?page=${page}`);
      return response.data as PaginatedResponse;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch my task details"
      );
    }
  }
);

// Fetch Team Tasks with Pagination
export const fetchTeamTasksDetails = createAsyncThunk(
  "tasks/fetchTeamTasksDetails",
  async ({ page = 1 }: { page: number }, thunkAPI) => {
    try {
      const state = thunkAPI.getState() as RootState;
      const { token } = state.auth;

      if (!token) {
        throw new Error("No token found");
      }

      API.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      const response = await API.get(`/tasks/team-tasks?page=${page}`);
      return response.data as PaginatedResponse;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch team task details"
      );
    }
  }
);

// Create Task
export const createTask = createAsyncThunk(
  "tasks/createTask",
  async (taskData: {  title: string; status: string; description: string; project_id: number }, thunkAPI) => {
    try {
      const state = thunkAPI.getState() as RootState;
      const { token } = state.auth;

      if (!token) {
        throw new Error("No token found");
      }

      API.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      const response = await API.post("/tasks/", taskData);
      console.log(response)
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to create task"
      );
    }
  }
);

// Update Task
export const updateTask = createAsyncThunk(
  "tasks/updateTask",
  async (taskData: { id: number; title: string; status: string; description: string; project_id: number }, thunkAPI) => {
    try {
      const state = thunkAPI.getState() as RootState;
      const { token } = state.auth;

      if (!token) {
        throw new Error("No token found");
      }

      API.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      const response = await API.put(`/tasks/${taskData.id}`, taskData);
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to update task"
      );
    }
  }
);

// Assign Task
export const assignTask = createAsyncThunk(
  "tasks/assignTask",
  async (taskData: { id: number; title: string; description: string; project_id: number }, thunkAPI) => {
    try {
      const state = thunkAPI.getState() as RootState;
      const { token } = state.auth;

      if (!token) {
        throw new Error("No token found");
      }

      API.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      const response = await API.put(`/tasks/${taskData.id}/assign`, taskData);
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to assign task"
      );
    }
  }
);

// Archive Task
export const archiveTask = createAsyncThunk(
  "tasks/archiveTask",
  async (id: number, thunkAPI) => {
    try {
      const state = thunkAPI.getState() as RootState;
      const { token } = state.auth;

      if (!token) {
        throw new Error("No token found");
      }

      API.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      await API.delete(`/tasks/${id}/archive`);
      return id;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to archive task"
      );
    }
  }
);

// Task Slice
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
        state.tasks = action.payload.tasks || [];
        state.totalTasks = action.payload.total;
        state.totalPages = action.payload.pages;
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
        state.my_tasks = action.payload.my_tasks || [];
        state.totalMyTasks = action.payload.total;
        state.totalMyPages = action.payload.pages;
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
        state.team_tasks = action.payload.team_tasks || [];
        state.totalTeamTasks = action.payload.total;
        state.totalTeamPages = action.payload.pages;
      })
      .addCase(fetchTeamTasksDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createTask.pending, (state) => {
        state.loading = true;
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.tasks.push(action.payload);
      })
      .addCase(createTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateTask.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        const index = state.tasks.findIndex((task) => task.id === action.payload.id);
        if (index !== -1) {
          state.tasks[index] = action.payload;
        }
      })
      .addCase(updateTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(assignTask.pending, (state) => {
        state.loading = true;
      })
      .addCase(assignTask.fulfilled, (state, action) => {
        const index = state.tasks.findIndex((task) => task.id === action.payload.id);
        if (index !== -1) {
          state.tasks[index] = action.payload;
        }
      })
      .addCase(assignTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(archiveTask.pending, (state) => {
        state.loading = true;
      })
      .addCase(archiveTask.fulfilled, (state, action) => {
        state.tasks = state.tasks.filter((task) => task.id !== action.payload);
      })
      .addCase(archiveTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
  },
});

export default taskSlice.reducer;
