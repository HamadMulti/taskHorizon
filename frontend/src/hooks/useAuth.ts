import { useDispatch, useSelector } from "react-redux";
import {
  registerUser,
  loginUser,
  logoutUser,
  fetchUserDetails,
  updateProfile,
  sendOTP,
  verifyOTP,
  forgotPassword,
  resetPassword,
  hydrateAuthState,
  subscribeUsers,
} from "../features/authSlice";
import { RootState, AppDispatch } from "../app/store";

export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user, token, loading, error, otpVerified } = useSelector(
    (state: RootState) => state.auth
  );

  const handleRegister = async (
    data: {
    username: string,
    email: string,
    password: string,
    confirmPassword: string
    }
  ) => {
    return dispatch(
      registerUser(data)
    ).unwrap();
  };

  const handleLogin = async (data: {email: string, password: string}) => {
    return dispatch(loginUser(data)).unwrap();
  };

  const handleFetchUser = async () => {
    return dispatch(fetchUserDetails());
  };

  const handleLogout = async () => {
    return dispatch(logoutUser()).unwrap();
  };

  const handleUpdateProfile = async (profileData: {
    username: string | null,
    email: string | null,
    role: string | null,
    phone: string | null,
    location: string | null,
    gender: string | null,
    primary_email: string | null,
    verified: string | null,
  }) => {
    const sanitizedProfileData = {
      username: profileData.username ?? '',
      email: profileData.email ?? '',
      role: profileData.role ?? '',
      phone: profileData.phone ?? '',
      location: profileData.location ?? '',
      gender: profileData.gender ?? '',
      primary_email: profileData.primary_email ?? '',
      verified: profileData.verified ?? '',
    };
    return dispatch(updateProfile(sanitizedProfileData)).unwrap();
  };

  const handleSendOTP = async () => {
    return dispatch(sendOTP()).unwrap();
  };

  const handleVerifyOTP = async (otp: string) => {
    return dispatch(verifyOTP(otp)).unwrap();
  };

  const handleForgotPassword = async (email: string) => {
    return dispatch(forgotPassword(email)).unwrap();
  };

  const handleResetPassword = async (token: string, password: string) => {
    return dispatch(resetPassword({ token, password })).unwrap();
  };

  const handleHydrateAuth = async () => {
    return dispatch(hydrateAuthState());
  };

  const handleSubscriber = async (
    data: {
    email: string,
    }
  ) => {
    return dispatch(
      subscribeUsers(data)
    ).unwrap();
  };

  return {
    user,
    token,
    loading,
    error,
    otpVerified,
    handleRegister,
    handleLogin,
    handleFetchUser,
    handleLogout,
    handleUpdateProfile,
    handleSendOTP,
    handleVerifyOTP,
    handleForgotPassword,
    handleResetPassword,
    handleHydrateAuth,
    handleSubscriber
  };
};
