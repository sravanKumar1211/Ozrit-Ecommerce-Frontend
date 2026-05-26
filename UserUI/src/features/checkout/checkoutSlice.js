import { createSlice } from "@reduxjs/toolkit";
import { createOrder, createRazorpayOrder, verifyRazorpayPayment } from "./checkoutThunks";

const initialState = {
  loading: false,
  error: null,
  lastOrder: null,
  // Razorpay order data returned by /payment/create-order
  razorpayData: null,
};

const slice = createSlice({
  name: "checkout",
  initialState,
  reducers: {
    clearCheckout: (state) => {
      state.loading = false;
      state.error = null;
      state.lastOrder = null;
      state.razorpayData = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create ecommerce order
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        // Backend: { success, data: { order } }
        state.lastOrder = action.payload.data?.order || null;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create Razorpay order
      .addCase(createRazorpayOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createRazorpayOrder.fulfilled, (state, action) => {
        state.loading = false;
        // Backend: { success, data: { orderId, key, razorpayOrder } }
        state.razorpayData = action.payload.data || null;
      })
      .addCase(createRazorpayOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Verify payment
      .addCase(verifyRazorpayPayment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyRazorpayPayment.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(verifyRazorpayPayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearCheckout } = slice.actions;
export default slice.reducer;
