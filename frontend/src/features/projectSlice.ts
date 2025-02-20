/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../utils/api";
import { RootState } from "../app/store";

interface Project {
  id: number;
  name: string;
  description: string;
}

interface ProjectState {
  projects: Project[];
  my_projects: Project[];
  loading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  totalProjects: number;
  my_currentPage: number;
  my_totalPages: number;
  my_totalProjects: number;
}

const initialState: ProjectState = {
  projects: [],
  my_projects: [],
  loading: false,
  error: null,
  currentPage: 1,
  totalPages: 1,
  totalProjects: 0,
  my_currentPage: 1,
  my_totalPages: 1,
  my_totalProjects: 0
};

export const fetchProjects = createAsyncThunk(
  "projects/fetchAll",
  async ({ page = 1 }: { page: number }, thunkAPI) => {
    try {
      const state = thunkAPI.getState() as RootState;
      const token = state.auth.token ?? null;
      API.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      const response = await API.get(`/projects/?page=${page}`);
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Error fetching projects"
      );
    }
  }
);

export const fetchMyProjects = createAsyncThunk(
  "projects/fetchAllUsers",
  async ({ page = 1 }: { page: number }, thunkAPI) => {
    try {
      const state = thunkAPI.getState() as RootState;
      const token = state.auth.token ?? null;
      API.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      const response = await API.get(`/projects/user?page=${page}`);
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Error fetching user projects"
      );
    }
  }
);

export const createProject = createAsyncThunk(
  "projects/create",
  async (projectData: { name: string; description: string }, thunkAPI) => {
    try {
      const state = thunkAPI.getState() as RootState;
      const token = state.auth.token ?? null;
      API.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      const response = await API.post("/projects/", projectData);
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Error creating project"
      );
    }
  }
);

export const updateProject = createAsyncThunk(
  "projects/update",
  async (
    {
      id,
      name,
      description
    }: { id: number; name: string; description: string },
    thunkAPI
  ) => {
    try {
      const state = thunkAPI.getState() as RootState;
      const token = state.auth.token ?? null;
      API.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      const response = await API.put(`/projects/${id}`, { name, description });
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Error updating project"
      );
    }
  }
);

export const deleteProject = createAsyncThunk(
  "projects/delete",
  async (id: number, thunkAPI) => {
    try {
      const state = thunkAPI.getState() as RootState;
      const token = state.auth.token ?? null;
      API.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      await API.delete(`/projects/${id}`);
      return id;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Error deleting project"
      );
    }
  }
);

const projectSlice = createSlice({
  name: "projects",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch all projects
      .addCase(fetchProjects.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.loading = false;
        state.projects = action.payload.projects;
        state.currentPage = action.payload.current_page;
        state.totalPages = action.payload.pages;
        state.totalProjects = action.payload.total;
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Fetch user's projects
      .addCase(fetchMyProjects.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMyProjects.fulfilled, (state, action) => {
        state.loading = false;
        state.my_projects = action.payload.my_projects;
        state.my_currentPage = action.payload.current_page;
        state.my_totalPages = action.payload.pages;
        state.my_totalProjects = action.payload.total;
      })
      .addCase(fetchMyProjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(createProject.fulfilled, (state, action) => {
        state.projects.push(action.payload);
      })

      .addCase(updateProject.fulfilled, (state, action) => {
        const index = state.projects.findIndex(
          (p) => p.id === action.payload.id
        );
        if (index !== -1) {
          state.projects[index] = action.payload;
        }
      })

      .addCase(deleteProject.fulfilled, (state, action) => {
        state.projects = state.projects.filter((p) => p.id !== action.payload);
      });
  }
});

export default projectSlice.reducer;
