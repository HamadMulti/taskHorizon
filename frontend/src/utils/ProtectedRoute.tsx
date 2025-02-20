import { Navigate, Outlet } from "react-router-dom";
import Loader from "./Loader";
import { useAuth } from "../hooks/useAuth";

const ProtectedRoute = () => {
  const { token, loading } = useAuth();
  const isAuthenticated = !!token;

  if (loading) {
    return (
      <>
        <Loader />
      </>
    );
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
