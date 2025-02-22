import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/authSlice";
import taskReducer from "../features/taskSlice";
import projectReducer from "../features/projectSlice";
import userReducer  from "../features/userSlice";
import { persistStore } from "redux-persist";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    tasks: taskReducer,
    projects: projectReducer,
    users: userReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;