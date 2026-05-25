import { createAsyncThunk } from "@reduxjs/toolkit";
import { getMyOrdersApi, getOrderByIdApi, cancelOrderApi } from "./ordersApi";

export const fetchMyOrders = createAsyncThunk("orders/fetchMyOrders", async (_, { rejectWithValue }) => {
  try {
    const res = await getMyOrdersApi();
    return res.data || [];
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Failed to fetch orders");
  }
});

export const fetchOrderById = createAsyncThunk("orders/fetchOrderById", async (id, { rejectWithValue }) => {
  try {
    const res = await getOrderByIdApi(id);
    return res.data || null;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Failed to fetch order");
  }
});

export const cancelOrder = createAsyncThunk("orders/cancelOrder", async (id, { rejectWithValue }) => {
  try {
    return await cancelOrderApi(id);
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Failed to cancel order");
  }
});
