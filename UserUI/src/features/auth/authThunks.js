import { createAsyncThunk } from "@reduxjs/toolkit";
import { loginApi, logoutApi, profileApi, registerApi } from "./authApi";

export const loginUser = createAsyncThunk("auth/loginUser", async (credentials, { rejectWithValue }) => {
  try {
    return await loginApi(credentials);
  } catch (error) {
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

export const loadProfile = createAsyncThunk("auth/loadProfile", async (_, { rejectWithValue }) => {
  try {
    return await profileApi();
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Failed to load profile");
  }
});

export const logoutUser = createAsyncThunk("auth/logoutUser", async () => {
  return await logoutApi();
});
