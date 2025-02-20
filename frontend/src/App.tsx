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
import { fetchUserDetails, hydrateAuthState, logoutUser } from "./features/authSlice";
import { useEffect } from "react";
import { AppDispatch, RootState } from "./app/store";
import { useDispatch, useSelector } from "react-redux";
import MyTask from "./pages/dashboard/body/tasks/MyTasks";
import Task from "./pages/dashboard/body/tasks/Task";
import Project from "./pages/dashboard/body/projects/Project";
import Settings from "./pages/dashboard/body/settings/settings";
import { decodeToken } from "./utils/decodeToken";

function App() {
  const dispatch = useDispatch<AppDispatch>();
  const {user, token } = useSelector((state: RootState) => state.auth)

  useEffect(() => {
    dispatch(hydrateAuthState());
  }, [dispatch]);

  useEffect(() => {
      if (!user && user === null) {
        dispatch(fetchUserDetails())
      }
    }, [dispatch, user]);

    useEffect(() => {
      if (token) {
        const decoded = decodeToken(token);
        if (decoded) {
          const expiryTime = decoded.exp * 1000;
          const timeLeft = expiryTime - Date.now();
          
          if (timeLeft > 0) {
            const timer = setTimeout(() => {
              dispatch(logoutUser())
              alert('Your session has expired. Please log in again.');
              window.location.href = '/login';
            }, timeLeft);
            
            return () => clearTimeout(timer);
          }
        }
      }
    }, [dispatch, token]);
    

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
            <Route path="settings" element={<Settings />} />
          </Route>
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
