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
  const { user, token, loading, error, otpVerified, role } = useSelector(
    (state: RootState) => state.auth
  );

  return {
    user,
    token,
    loading,
    error,
    otpVerified,
    role,
    handleRegister: async (
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
    },
    handleLogin: async (data: {email: string, password: string}) => {
      await dispatch(loginUser(data)).unwrap();
    },
    handleFetchUser: async () => {
      await dispatch(fetchUserDetails()).unwrap()
    },
    handleLogout: async () => {
      await dispatch(logoutUser()).unwrap();
    },
    handleUpdateProfile: async (profileData: {
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
      await dispatch(updateProfile(sanitizedProfileData)).unwrap();
      await dispatch(fetchUserDetails()).unwrap();
    },
    handleSendOTP: async () => {
      await dispatch(sendOTP()).unwrap();
    },
    handleVerifyOTP: async (otp: string) => {
      await dispatch(verifyOTP(otp)).unwrap();
    },
    handleForgotPassword: async (email: string) => {
      await dispatch(forgotPassword(email)).unwrap();
    },
    handleResetPassword: async (token: string, password: string) => {
      await dispatch(resetPassword({ token, password })).unwrap();
    },
    handleHydrateAuth: async () => {
      await dispatch(hydrateAuthState());
    },
    handleSubscriber: async (
      data: {
      email: string,
      }
    ) => {
      await dispatch(
        subscribeUsers(data)
      ).unwrap();
    },
  };
};
