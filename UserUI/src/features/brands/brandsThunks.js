import { createAsyncThunk } from "@reduxjs/toolkit";
import { getBrandsApi } from "./brandsApi";

export const fetchBrands = createAsyncThunk("brands/fetchBrands", async (_, { rejectWithValue }) => {
  try {
    const payload = await getBrandsApi({ limit: 100 });
    return payload.brands || [];
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Failed to load brands");
  }
});
