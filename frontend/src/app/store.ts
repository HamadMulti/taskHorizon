import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/authSlice";
import taskReducer from "../features/taskSlice";
import projectReducer from "../features/projectSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    tasks: taskReducer,
    projects: projectReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
