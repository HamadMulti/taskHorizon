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
import { fetchUserDetails, hydrateAuthState } from "./features/authSlice";
import { useEffect } from "react";
import { AppDispatch, RootState } from "./app/store";
import { useDispatch, useSelector } from "react-redux";
import MyTask from "./pages/dashboard/body/tasks/MyTasks";
import Task from "./pages/dashboard/body/tasks/Task";
import Project from "./pages/dashboard/body/projects/Project";

function App() {
  const dispatch = useDispatch<AppDispatch>();
  const {user } = useSelector((state: RootState) => state.auth)

  useEffect(() => {
    dispatch(hydrateAuthState());
  }, [dispatch]);

  useEffect(() => {
      if (!user && user === null) {
        dispatch(fetchUserDetails())
      }
    }, [dispatch, user]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route
          path="/login"
          element={<Login />}
        />
        <Route path="/register" element={<Register />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/verify-otp" element={<VerifyOTP />} />
          <Route
            path="/dashboard"
            element={<Dashboard />}
          >
            <Route path="tasks" element={<Task />} />
            <Route path="my-tasks" element={<MyTask />} />
            <Route path="projects" element={<Project />} />
            <Route path="my-projects" element={<Project />} />
          </Route>
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
