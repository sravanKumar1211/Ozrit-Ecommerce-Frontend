import { createSlice } from "@reduxjs/toolkit";
import { applyCoupon } from "./couponsThunks";

const initialState = {
  // Full coupon object from backend
  applied: null,
  // Computed discount amount returned by /coupons/apply
  discount: 0,
  // Discounted total returned by /coupons/apply
  discountedTotal: 0,
  loading: false,
  error: null,
};

const slice = createSlice({
  name: "coupons",
  initialState,
  reducers: {
    clearCoupon: (state) => {
      state.applied = null;
      state.discount = 0;
      state.discountedTotal = 0;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(applyCoupon.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(applyCoupon.fulfilled, (state, action) => {
        state.loading = false;
        // Backend: { success, coupon, totalAmount, discount, discountedTotal }
        state.applied = action.payload.coupon || null;
        state.discount = action.payload.discount || 0;
        state.discountedTotal = action.payload.discountedTotal || 0;
      })
      .addCase(applyCoupon.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearCoupon } = slice.actions;
export default slice.reducer;
