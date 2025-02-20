import { Navigate, Outlet } from "react-router-dom";
import Loader from "./Loader";
import { useSelector } from "react-redux";
import { RootState } from "../app/store";

const ProtectedRoute = () => {
  const { token, loading } = useSelector((state: RootState) => state.auth);
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
