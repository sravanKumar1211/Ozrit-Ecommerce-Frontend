import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getCategories, createCategory, updateCategory, deleteCategory } from "@/services/categoryService";

const initialState = {
  categories: [],
  list: [],
  total: 0,
  page: 1,
  limit: 10,
  loading: false,
  error: null,
};

export const loadCategories = createAsyncThunk("categories/loadCategories", async (params, { rejectWithValue }) => {
  try {
    const response = await getCategories(params);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Failed to load categories");
  }
});

export const createNewCategory = createAsyncThunk(
  "categories/createNewCategory", 
  async (formData, { rejectWithValue }) => {
    try {
      // FORCE multipart/form-data content headers for file transmissions
      const response = await createCategory(formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to create category");
    }
  }
);

export const editCategory = createAsyncThunk(
  "categories/editCategory", 
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const response = await updateCategory(id, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to update category");
    }
  }
);

export const removeCategory = createAsyncThunk("categories/removeCategory", async (id, { rejectWithValue }) => {
  try {
    const response = await deleteCategory(id);
    return { id, message: response.data.message };
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Failed to delete category");
  }
});

const categorySlice = createSlice({
  name: "categories",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadCategories.fulfilled, (state, action) => {
        state.loading = false;
        const categories = action.payload?.categories || [];
        state.categories = categories;
        state.list = categories;
        state.total = action.payload?.total || 0;
        state.page = action.payload?.page || 1;
      })
      .addCase(loadCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createNewCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createNewCategory.fulfilled, (state, action) => {
        state.loading = false;
        const category = action.payload?.category || action.payload;
        state.categories.unshift(category);
        state.list.unshift(category);
      })
      .addCase(createNewCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(editCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(editCategory.fulfilled, (state, action) => {
        state.loading = false;
        const category = action.payload?.category || action.payload;
        state.categories = state.categories.map((item) =>
          item.id === category.id ? category : item,
        );
        state.list = state.list.map((item) =>
          item.id === category.id ? category : item,
        );
      })
      .addCase(editCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(removeCategory.fulfilled, (state, action) => {
        state.categories = state.categories.filter((item) => item.id !== action.payload.id);
        state.list = state.list.filter((item) => item.id !== action.payload.id);
      });
  },
});

export default categorySlice.reducer;
