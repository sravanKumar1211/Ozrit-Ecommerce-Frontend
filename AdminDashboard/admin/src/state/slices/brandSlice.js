import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getBrands, createBrand, updateBrand, deleteBrand } from "@/services/brandService";

export const loadBrands = createAsyncThunk("brands/loadBrands", async (params, { rejectWithValue }) => {
  try {
    const response = await getBrands(params);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Failed to load brands");
  }
});

export const createNewBrand = createAsyncThunk("brands/createNewBrand", async (formData, { rejectWithValue }) => {
  try {
    const response = await createBrand(formData);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Failed to create brand");
  }
});

export const editBrand = createAsyncThunk("brands/editBrand", async ({ id, formData }, { rejectWithValue }) => {
  try {
    const response = await updateBrand(id, formData);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Failed to update brand");
  }
});

export const removeBrand = createAsyncThunk("brands/removeBrand", async (id, { rejectWithValue }) => {
  try {
    const response = await deleteBrand(id);
    return { id, message: response.data.message };
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Failed to delete brand");
  }
});

const brandSlice = createSlice({
  name: "brands",
  initialState: { brands: [], total: 0, loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadBrands.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadBrands.fulfilled, (state, action) => {
        state.loading = false;
        state.brands = action.payload?.brands || [];
        state.total = action.payload?.total || 0;
      })
      .addCase(loadBrands.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createNewBrand.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createNewBrand.fulfilled, (state, action) => {
        state.loading = false;
        const item = action.payload?.brand || action.payload;
        state.brands.unshift(item);
      })
      .addCase(createNewBrand.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(editBrand.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(editBrand.fulfilled, (state, action) => {
        state.loading = false;
        const updated = action.payload?.brand || action.payload;
        state.brands = state.brands.map((item) => item.id === updated.id ? updated : item);
      })
      .addCase(editBrand.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(removeBrand.fulfilled, (state, action) => {
        state.brands = state.brands.filter((item) => item.id !== action.payload.id);
      });
  },
});

export default brandSlice.reducer;
