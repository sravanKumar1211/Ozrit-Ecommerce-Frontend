import { createSlice } from "@reduxjs/toolkit";
import { fetchVariantById, fetchVariants } from "./variantsThunks";

const initialState = {
  byProductId: {},
  currentVariant: null,
  loading: false,
  error: null,
};

const variantsSlice = createSlice({
  name: "variants",
  initialState,
  reducers: {
    clearCurrentVariant: (state) => {
      state.currentVariant = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchVariants.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVariants.fulfilled, (state, action) => {
        state.loading = false;
        state.byProductId[action.payload.productId] = action.payload.variants;
      })
      .addCase(fetchVariants.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchVariantById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVariantById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentVariant = action.payload;
      })
      .addCase(fetchVariantById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearCurrentVariant } = variantsSlice.actions;
export default variantsSlice.reducer;
