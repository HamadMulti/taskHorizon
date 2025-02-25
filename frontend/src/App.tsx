import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/dashboard/Layout";
import LandingPage from "./pages/LandingPage";
import ResetPassword from "./pages/ResetPassword";
import ForgotPassword from "./pages/ForgotPassword";
import VerifyOTP from "./pages/VerifyOTP";
import ProtectedRoute from "./utils/ProtectedRoute";
import NotFound from "./utils/NotFound";
import { hydrateAuthState } from "./features/authSlice";
import { useEffect } from "react";
import { AppDispatch } from "./app/store";
import { useDispatch } from "react-redux";
import MyTask from "./pages/dashboard/body/tasks/MyTasks";
import Task from "./pages/dashboard/body/tasks/Task";
import Project from "./pages/dashboard/body/projects/Project";
import Settings from "./pages/dashboard/body/settings/settings";
import Verified from "./utils/VerifiedUser";
import MyProject from "./pages/dashboard/body/projects/MyProject";
import SessionManager from "./components/SessionManager";
import ErrorBoundary from "./utils/ErrorBoundry";
import Users from "./pages/dashboard/body/users/ListUsers";

function App() {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const persistedAuth = localStorage.getItem("persist:auth");
    if (!persistedAuth) {
      dispatch(hydrateAuthState());
    }
  }, [dispatch]);

  return (
    <Router>
      <SessionManager />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/verify-otp" element={<VerifyOTP />} />
          <Route element={<Verified />}>
            <Route path="/dashboard" element={<Dashboard />}>
              <Route
                path="tasks"
                element={
                  <ErrorBoundary>
                    <Task />
                  </ErrorBoundary>
                }
              />
              <Route
                path="my-tasks"
                element={
                  <ErrorBoundary>
                    <MyTask />
                  </ErrorBoundary>
                }
              />
              <Route
                path="projects"
                element={
                  <ErrorBoundary>
                    <Project />
                  </ErrorBoundary>
                }
              />
              <Route
                path="my-projects"
                element={
                  <ErrorBoundary>
                    <MyProject />
                  </ErrorBoundary>
                }
              />
              <Route
                path="users"
                element={
                  <ErrorBoundary>
                    <Users />
                  </ErrorBoundary>
                }
              />
              <Route
                path="settings"
                element={
                  <ErrorBoundary>
                    <Settings />
                  </ErrorBoundary>
                }
              />
            </Route>
          </Route>
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
