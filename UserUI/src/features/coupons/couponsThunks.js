import { createAsyncThunk } from "@reduxjs/toolkit";
import { applyCouponApi } from "./couponsApi";

export const applyCoupon = createAsyncThunk("coupons/applyCoupon", async (payload, { rejectWithValue }) => {
  try {
    return await applyCouponApi(payload);
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Failed to apply coupon");
  }
});
