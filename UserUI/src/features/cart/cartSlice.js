import { createSlice } from "@reduxjs/toolkit";
import { addItemToCart, fetchCart, removeCartItem, updateCartItem } from "./cartThunks";

const initialState = {
  items: [],
  subtotal: 0,
  tax: 0,
  grandTotal: 0,
  count: 0,
  loading: false,
  error: null,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    clearCartError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items || [];
        state.subtotal = action.payload.subtotal || 0;
        state.tax = action.payload.tax || 0;
        state.grandTotal = action.payload.grandTotal || 0;
        state.count = action.payload.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addItemToCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addItemToCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items || [];
        state.subtotal = action.payload.subtotal || 0;
        state.tax = action.payload.tax || 0;
        state.grandTotal = action.payload.grandTotal || 0;
        state.count = action.payload.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
      })
      .addCase(addItemToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateCartItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCartItem.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items || [];
        state.subtotal = action.payload.subtotal || 0;
        state.tax = action.payload.tax || 0;
        state.grandTotal = action.payload.grandTotal || 0;
        state.count = action.payload.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
      })
      .addCase(updateCartItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(removeCartItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeCartItem.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items || [];
        state.subtotal = action.payload.subtotal || 0;
        state.tax = action.payload.tax || 0;
        state.grandTotal = action.payload.grandTotal || 0;
        state.count = action.payload.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
      })
      .addCase(removeCartItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearCartError } = cartSlice.actions;
export default cartSlice.reducer;
