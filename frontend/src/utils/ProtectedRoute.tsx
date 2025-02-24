import { Navigate, Outlet } from "react-router-dom";
import Loader from "./Loader";
import { useAuth } from "../hooks/useAuth";
import { useEffect } from "react";

const ProtectedRoute = () => {
  const { token, loading, handleFetchUser } = useAuth();
  const isAuthenticated = !!token; 

  useEffect(() => {
      handleFetchUser();
  }, [handleFetchUser]);

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
