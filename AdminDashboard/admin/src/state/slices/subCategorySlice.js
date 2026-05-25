import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getSubCategories, createSubCategory, updateSubCategory, deleteSubCategory } from "@/services/subCategoryService";

export const loadSubCategories = createAsyncThunk("subCategories/loadSubCategories", async (params, { rejectWithValue }) => {
  try {
    const response = await getSubCategories(params);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Failed to load subcategories");
  }
});

export const createNewSubCategory = createAsyncThunk("subCategories/createNewSubCategory", async (payload, { rejectWithValue }) => {
  try {
    const response = await createSubCategory(payload);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Failed to create subcategory");
  }
});

export const editSubCategory = createAsyncThunk("subCategories/editSubCategory", async ({ id, payload }, { rejectWithValue }) => {
  try {
    const response = await updateSubCategory(id, payload);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Failed to update subcategory");
  }
});

export const removeSubCategory = createAsyncThunk("subCategories/removeSubCategory", async (id, { rejectWithValue }) => {
  try {
    const response = await deleteSubCategory(id);
    return { id, message: response.data.message };
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Failed to delete subcategory");
  }
});

const subCategorySlice = createSlice({
  name: "subCategories",
  initialState: { subCategories: [], total: 0, limit: 10, loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadSubCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadSubCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.subCategories = action.payload?.subCategories || [];
        state.total = action.payload?.total || 0;
      })
      .addCase(loadSubCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createNewSubCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createNewSubCategory.fulfilled, (state, action) => {
        state.loading = false;
        const item = action.payload?.subCategory || action.payload;
        state.subCategories.unshift(item);
      })
      .addCase(createNewSubCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(editSubCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(editSubCategory.fulfilled, (state, action) => {
        state.loading = false;
        const updated = action.payload?.subCategory || action.payload;
        state.subCategories = state.subCategories.map((item) => item.id === updated.id ? updated : item);
      })
      .addCase(editSubCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(removeSubCategory.fulfilled, (state, action) => {
        state.subCategories = state.subCategories.filter((item) => item.id !== action.payload.id);
      });
  },
});

export default subCategorySlice.reducer;
