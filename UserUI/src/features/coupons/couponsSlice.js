import { createSlice } from "@reduxjs/toolkit";
import { applyCoupon } from "./couponsThunks";

const initialState = {
  applied: null,
  loading: false,
  error: null,
};

const slice = createSlice({
  name: "coupons",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(applyCoupon.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(applyCoupon.fulfilled, (state, action) => {
        state.loading = false;
        state.applied = action.payload.coupon || null;
      })
      .addCase(applyCoupon.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default slice.reducer;
