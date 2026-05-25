import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchDashboardStats } from "@/services/authService";

const initialState = {
  stats: null,
  loading: false,
  error: null,
};

export const loadDashboard = createAsyncThunk("dashboard/load", async (_, { rejectWithValue }) => {
  try {
    const response = await fetchDashboardStats();
    return response;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Unable to load statistics");
  }
});

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadDashboard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
    
        .addCase(loadDashboard.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload.stats || action.payload.data?.stats;
      })
      .addCase(loadDashboard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default dashboardSlice.reducer;

