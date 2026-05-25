import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  loginAdmin,
  logoutAdmin,
  fetchProfile,
  fetchAdminUsers,
  fetchDashboardStats,
  updateAdminProfile,
  changeAdminPassword,
} from "@/services/authService";

const initialState = {
  admin: null,
  token: localStorage.getItem("adminToken") || null,
  loading: false,
  error: null,
};

export const loginUser = createAsyncThunk("auth/loginUser", async (credentials, { rejectWithValue }) => {
  try {
    const response = await loginAdmin(credentials);
    return response;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Login failed");
  }
});

export const logoutUser = createAsyncThunk("auth/logoutUser", async () => {
  await logoutAdmin();
});

export const loadProfile = createAsyncThunk("auth/loadProfile", async (_, { rejectWithValue }) => {
  try {
    const response = await fetchProfile();
    return response;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Failed to load profile");
  }
});

export const loadAdminUsers = createAsyncThunk("auth/loadAdminUsers", async (_, { rejectWithValue }) => {
  try {
    const response = await fetchAdminUsers();
    return response;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Failed to load customers");
  }
});

export const loadDashboardStats = createAsyncThunk("auth/loadDashboardStats", async (_, { rejectWithValue }) => {
  try {
    const response = await fetchDashboardStats();
    return response;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Failed to load dashboard stats");
  }
});

export const saveAdminProfile = createAsyncThunk("auth/saveAdminProfile", async (payload, { rejectWithValue }) => {
  try {
    const response = await updateAdminProfile(payload);
    return response;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Failed to update profile");
  }
});

export const resetAdminPassword = createAsyncThunk("auth/resetAdminPassword", async (payload, { rejectWithValue }) => {
  try {
    const response = await changeAdminPassword(payload);
    return response;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Failed to update password");
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearAuth: (state) => {
      state.admin = null;
      state.token = null;
      localStorage.removeItem("adminToken");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.admin = action.payload.user;
        state.token = action.payload.token;
        localStorage.setItem("adminToken", action.payload.token);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.admin = null;
        state.token = null;
        localStorage.removeItem("adminToken");
      })
      .addCase(loadProfile.fulfilled, (state, action) => {
        state.admin = action.payload.user;
      })
      .addCase(loadProfile.rejected, (state) => {
        state.token = null;
        localStorage.removeItem("adminToken");
      })
      .addCase(saveAdminProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(saveAdminProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.admin = action.payload.user;
      })
      .addCase(saveAdminProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(resetAdminPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resetAdminPassword.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(resetAdminPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearAuth } = authSlice.actions;
export default authSlice.reducer;
