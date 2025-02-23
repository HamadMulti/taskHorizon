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

interface TaskState {
  tasks: Task[];
  my_tasks: Task[];
  team_tasks: Task[];
  loading: boolean;
  error: string | null;
  currentPage: number;
  my_currentPage: number;
  team_currentPage: number;
  totalPages: number;
  my_totalPages: number;
  team_totalPages: number;
  totalTasks: number;
  my_totalTasks: number;
  team_totalTasks: number;
}

const initialState: TaskState = {
  tasks: [],
  my_tasks: [],
  team_tasks: [],
  loading: false,
  error: null,
  currentPage: 1,
  my_currentPage: 1,
  team_currentPage: 1,
  totalPages: 1,
  my_totalPages: 1,
  team_totalPages: 1,
  totalTasks: 0,
  my_totalTasks: 0,
  team_totalTasks: 0
};

// Fetch All Tasks with Pagination
export const fetchTasksDetails = createAsyncThunk(
  "tasks/fetchTasksDetails",
  async ({ page = 1 }: { page: number }, thunkAPI) => {
    try {
      const state = thunkAPI.getState() as RootState;
      const token = state.auth.token ?? null;
      API.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      const response = await API.get(`/tasks?page=${page}`);
      return response.data;
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
      const token = state.auth.token ?? null;
      API.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      const response = await API.get(`/tasks/user-tasks?page=${page}`);
      return response.data;
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
      const token = state.auth.token ?? null;
      API.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      const response = await API.get(`/tasks/team-tasks?page=${page}`);
      return response.data;
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
  async (
    taskData: {
      title: string;
      status: string;
      description: string;
      project_id: number;
    },
    thunkAPI
  ) => {
    try {
      const state = thunkAPI.getState() as RootState;
      const token = state.auth.token ?? null;
      API.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      const response = await API.post("/tasks/", taskData);
      console.log(response);
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
  async (
    taskData: {
      id: number;
      title: string;
      status: string;
      description: string;
      project_id: number;
    },
    thunkAPI
  ) => {
    try {
      const state = thunkAPI.getState() as RootState;
      const token = state.auth.token ?? null;
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
  async (
    taskData: {
      id: number;
      title: string;
      description: string;
      project_id: number;
    },
    thunkAPI
  ) => {
    try {
      const state = thunkAPI.getState() as RootState;
      const token = state.auth.token ?? null;
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
      const token = state.auth.token ?? null;
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
        if (action.payload && action.payload.tasks) {
          state.tasks = action.payload.tasks;
          state.currentPage = action.payload.current_page;
          state.totalPages = action.payload.pages;
          state.totalTasks = action.payload.total;
        } else {
          state.error = "Tasks data is missing";
        }
        state.loading = false;
      })
      .addCase(fetchTasksDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchMyTasksDetails.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMyTasksDetails.fulfilled, (state, action) => {
        if (action.payload && action.payload.tasks) {
          state.my_tasks = action.payload.my_tasks;
          state.my_totalTasks = action.payload.total;
          state.my_totalPages = action.payload.pages;
        } else {
          state.error = "Tasks data is missing";
        }
        state.loading = false;
      })
      .addCase(fetchMyTasksDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchTeamTasksDetails.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTeamTasksDetails.fulfilled, (state, action) => {
        if (action.payload && action.payload.tasks) {
          state.team_tasks = action.payload.team_tasks;
          state.team_totalTasks = action.payload.total;
          state.team_totalPages = action.payload.pages;
        } else {
          state.error = "Tasks data is missing";
        }
        state.loading = false;
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
        const index = state.tasks.findIndex((p) => p.id === action.payload.id);
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
        const index = state.tasks.findIndex(
          (task) => task.id === action.payload.id
        );
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
      });
  }
});

export default taskSlice.reducer;
