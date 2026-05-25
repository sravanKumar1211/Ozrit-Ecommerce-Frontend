import { createAsyncThunk } from "@reduxjs/toolkit";
import { getVariantApi, getVariantsApi } from "./variantsApi";

export const fetchVariants = createAsyncThunk(
  "variants/fetchVariants",
  async ({ productId, limit = 50 }, { rejectWithValue }) => {
    try {
      const payload = await getVariantsApi({ productId, limit });
      return { productId, variants: payload.variants || [] };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to load variants");
    }
  },
);

export const fetchVariantById = createAsyncThunk(
  "variants/fetchVariantById",
  async (variantId, { rejectWithValue }) => {
    try {
      return await getVariantApi(variantId);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to load variant");
    }
  },
);
