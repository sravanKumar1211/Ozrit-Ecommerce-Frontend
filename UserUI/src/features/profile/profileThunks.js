import { createAsyncThunk } from "@reduxjs/toolkit";
import { fetchProfileApi, updateProfileApi } from "./profileApi";

export const fetchUserProfile = createAsyncThunk(
  "profile/fetchUserProfile",
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetchProfileApi();
      // Backend return is { success: true, user: ... }
      console.log(res.user)
      return res.user;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch profile");
    }
  }
);

export const updateUserProfile = createAsyncThunk(
  "profile/updateUserProfile",
  async (formData, { rejectWithValue }) => {
    try {
      const res = await updateProfileApi(formData);
      // Backend return is { success: true, message: ..., user: ... }
      return res.user;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to update profile");
    }
  }
);
