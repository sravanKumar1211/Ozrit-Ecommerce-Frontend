import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchVariantsByProduct,
  fetchSingleVariant,
  createProductVariant,
  updateProductVariant,
  deleteProductVariant,
} from "@/services/variantService";

const initialState = {
  variants: [],
  currentVariant: null,
  loading: false,
  error: null,
};

// ASYNC THUNKS
export const loadVariants = createAsyncThunk(
  "variants/loadVariants",
  async (productId, { rejectWithValue }) => {
    try {
      const response = await fetchVariantsByProduct(productId);
      
      return response.data; 
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to load variants");
    }
  }
);

export const loadSingleVariant = createAsyncThunk(
  "variants/loadSingleVariant",
  async (id, { rejectWithValue }) => {
    try {
      const response = await fetchSingleVariant(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to load variant");
    }
  }
);

export const addVariant = createAsyncThunk(
  "variants/addVariant",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await createProductVariant(formData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to create variant");
    }
  }
);

export const editVariant = createAsyncThunk(
  "variants/editVariant",
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const response = await updateProductVariant(id, formData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to update variant");
    }
  }
);

export const removeVariant = createAsyncThunk(
  "variants/removeVariant",
  async (id, { rejectWithValue }) => {
    try {
      await deleteProductVariant(id);
      return id; // Return the ID so we can filter it out of our local state array
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to delete variant");
    }
  }
);

const variantSlice = createSlice({
  name: "variants",
  initialState,
  reducers: {
    clearVariantErrors: (state) => {
      state.error = null;
    },
    clearCurrentVariant: (state) => {
      state.currentVariant = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // LOAD VARIANTS CASES
      .addCase(loadVariants.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadVariants.fulfilled, (state, action) => {
        state.loading = false;
        state.variants = Array.isArray(action.payload) ? action.payload : action.payload.variants || [];
      })
      .addCase(loadVariants.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // LOAD SINGLE VARIANT CASES
      .addCase(loadSingleVariant.fulfilled, (state, action) => {
        state.currentVariant = action.payload;
      })

      // ADD VARIANT CASES
      .addCase(addVariant.pending, (state) => {
        state.loading = true;
      })
      .addCase(addVariant.fulfilled, (state, action) => {
        state.loading = false;
        state.variants.push(action.payload.variant || action.payload);
      })
      .addCase(addVariant.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // EDIT VARIANT CASES
      .addCase(editVariant.fulfilled, (state, action) => {
        state.loading = false;
        const updatedVariant = action.payload.variant || action.payload;
        state.variants = state.variants.map((v) => 
          v.id === updatedVariant.id ? updatedVariant : v
        );
      })

      // REMOVE VARIANT CASES
      .addCase(removeVariant.fulfilled, (state, action) => {
        state.variants = state.variants.filter((v) => v.id !== action.payload);
      });
  },
});

export const { clearVariantErrors, clearCurrentVariant } = variantSlice.actions;
export default variantSlice.reducer;