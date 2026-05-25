import { createAsyncThunk } from "@reduxjs/toolkit";
import { getProductApi, getProductsApi } from "./productsApi";

export const fetchProducts = createAsyncThunk("products/fetchProducts", async (params = {}, { rejectWithValue }) => {
  try {
    return await getProductsApi(params);
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Failed to load products");
  }
});

export const fetchFeaturedProducts = createAsyncThunk("products/fetchFeaturedProducts", async (_, { rejectWithValue }) => {
  try {
    return await getProductsApi({ limit: 24 });
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Failed to load featured products");
  }
});

export const fetchProductDetails = createAsyncThunk("products/fetchProductDetails", async (id, { rejectWithValue }) => {
  try {
    return await getProductApi(id);
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Failed to load product");
  }
});
