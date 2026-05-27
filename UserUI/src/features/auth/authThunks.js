import { createAsyncThunk } from "@reduxjs/toolkit";
import { loginApi, logoutApi, profileApi, registerApi, updateProfileApi, verifyOtpApi, resendOtpApi } from "./authApi";

export const loginUser = createAsyncThunk("auth/loginUser", async (credentials, { rejectWithValue }) => {
  try {
    return await loginApi(credentials);
  } catch (error) {
    if (error.response?.data?.requiresVerification) {
      return rejectWithValue({
        message: error.response.data.message,
        requiresVerification: true,
        email: error.response.data.email,
      });
    }
    return rejectWithValue(error.response?.data?.message || "Login failed");
  }
});

export const registerUser = createAsyncThunk("auth/registerUser", async (payload, { rejectWithValue }) => {
  try {
    return await registerApi(payload);
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Registration failed");
  }
});

export const verifyOtp = createAsyncThunk("auth/verifyOtp", async (payload, { rejectWithValue }) => {
  try {
    return await verifyOtpApi(payload);
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Verification failed");
  }
});

export const resendOtp = createAsyncThunk("auth/resendOtp", async (payload, { rejectWithValue }) => {
  try {
    return await resendOtpApi(payload);
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Failed to resend verification code");
  }
});

export const loadProfile = createAsyncThunk("auth/loadProfile", async (_, { rejectWithValue }) => {
  try {
    return await profileApi();
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Failed to load profile");
  }
});

export const updateProfile = createAsyncThunk("auth/updateProfile", async (formData, { rejectWithValue }) => {
  try {
    return await updateProfileApi(formData);
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Failed to update profile");
  }
});

export const logoutUser = createAsyncThunk("auth/logoutUser", async () => {
  return await logoutApi();
});
