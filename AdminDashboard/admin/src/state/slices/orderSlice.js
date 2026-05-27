import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getAdminOrders, updateOrderStatus } from "@/services/orderService";

const initialState = {
  orders: [],
  loading: false,
  error: null,
};

export const loadOrders = createAsyncThunk("orders/loadOrders", async (_, { rejectWithValue }) => {
  try {
    const response = await getAdminOrders();
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Failed to load orders");
  }
});

export const changeOrderStatus = createAsyncThunk("orders/changeOrderStatus", async (payload, { rejectWithValue }) => {
  try {
    const response = await updateOrderStatus(payload);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Failed to update order status");
  }
});

const orderSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload?.data?.orders || [];
      })
      .addCase(loadOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(changeOrderStatus.fulfilled, (state, action) => {
        const updatedOrder = action.payload?.data?.order;
        if (!updatedOrder) return;
        // Merge rather than replace — preserves nested User/OrderItems associations
        // that may not be returned by a partial update response
        state.orders = state.orders.map((order) =>
          order.id === updatedOrder.id
            ? { ...order, ...updatedOrder }
            : order,
        );
      });
  },
});

export default orderSlice.reducer;
