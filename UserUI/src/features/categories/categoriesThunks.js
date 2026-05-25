import { createAsyncThunk } from "@reduxjs/toolkit";
import { getCategoriesApi, getSubCategoriesApi } from "./categoriesApi";

export const fetchNavigation = createAsyncThunk("categories/fetchNavigation", async (_, { rejectWithValue }) => {
  try {
    const [categoriesResponse, subCategoriesResponse] = await Promise.all([
      getCategoriesApi({ limit: 100 }),
      getSubCategoriesApi({ limit: 200 }),
    ]);

    return {
      categories: categoriesResponse.categories || [],
      subCategories: subCategoriesResponse.subCategories || [],
    };
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Failed to load categories");
  }
});
