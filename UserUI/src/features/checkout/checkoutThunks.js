import { createAsyncThunk } from "@reduxjs/toolkit";
import { createOrderApi, createRazorpayOrderApi } from "./checkoutApi";

export const createOrder = createAsyncThunk("checkout/createOrder", async (payload, { rejectWithValue }) => {
  try {
    return await createOrderApi(payload);
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Failed to create order");
  }
});

export const createRazorpayOrder = createAsyncThunk("checkout/createRazorpayOrder", async (payload, { rejectWithValue }) => {
  try {
    return await createRazorpayOrderApi(payload);
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Failed to create razorpay order");
  }
});
