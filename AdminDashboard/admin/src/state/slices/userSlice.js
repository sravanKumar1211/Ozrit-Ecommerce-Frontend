import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getAllUsers, updateProfile } from "@/services/userService";

const initialState = {
  profile: null,
  users: [],
  loading: false,
  error: null,
};

export const loadUsers = createAsyncThunk("users/loadUsers", async (_, { rejectWithValue }) => {
  try {
    const response = await getAllUsers();
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Failed to load users");
  }
});

export const saveProfile = createAsyncThunk("users/saveProfile", async (payload, { rejectWithValue }) => {
  try {
    const response = await updateProfile(payload);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Failed to update profile");
  }
});

const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload.users;
      })
      .addCase(loadUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(saveProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(saveProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload.user;
      })
      .addCase(saveProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default userSlice.reducer;
