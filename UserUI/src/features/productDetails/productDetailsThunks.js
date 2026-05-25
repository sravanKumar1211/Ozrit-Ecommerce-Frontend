import { createAsyncThunk } from "@reduxjs/toolkit";
import { getProductDetailsApi } from "./productDetailsApi";

export const fetchProductDetails = createAsyncThunk(
  "productDetails/fetchProductDetails",
  async (productId, { rejectWithValue }) => {
    try {
      return await getProductDetailsApi(productId);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to load product details");
    }
  },
);
