import { createSlice } from "@reduxjs/toolkit";
import { fetchNavigation } from "./categoriesThunks";

const initialState = {
  categories: [],
  subCategories: [],
  loading: false,
  error: null,
};

const categoriesSlice = createSlice({
  name: "categories",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchNavigation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNavigation.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload.categories;
        state.subCategories = action.payload.subCategories;
      })
      .addCase(fetchNavigation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default categoriesSlice.reducer;
