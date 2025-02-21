import { Navigate, Outlet } from "react-router-dom";
import Loader from "./Loader";
import { useAuth } from "../hooks/useAuth";

const Verified = () => {
  const { loading, otpVerified } = useAuth();

  if (loading) {
    return (
      <>
        <Loader />
      </>
    );
  }

  return otpVerified ? <Outlet /> : <Navigate to="/verify-otp" replace />;
};

export default Verified;
