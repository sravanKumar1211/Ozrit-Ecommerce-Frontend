import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getCoupons, createCoupon, updateCoupon, deleteCoupon } from "@/services/couponService";

const initialState = {
  coupons: [],
  loading: false,
  error: null,
};

export const loadCoupons = createAsyncThunk("coupons/loadCoupons", async (_, { rejectWithValue }) => {
  try {
    const response = await getCoupons();
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Failed to load coupons");
  }
});

export const createNewCoupon = createAsyncThunk("coupons/createNewCoupon", async (payload, { rejectWithValue }) => {
  try {
    const response = await createCoupon(payload);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Failed to create coupon");
  }
});

export const editCoupon = createAsyncThunk("coupons/editCoupon", async ({ id, payload }, { rejectWithValue }) => {
  try {
    const response = await updateCoupon(id, payload);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Failed to update coupon");
  }
});

export const removeCoupon = createAsyncThunk("coupons/removeCoupon", async (id, { rejectWithValue }) => {
  try {
    const response = await deleteCoupon(id);
    return { id, message: response.data.message };
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Failed to delete coupon");
  }
});

const couponSlice = createSlice({
  name: "coupons",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadCoupons.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadCoupons.fulfilled, (state, action) => {
        state.loading = false;
        state.coupons = action.payload.coupons;
      })
      .addCase(loadCoupons.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createNewCoupon.fulfilled, (state, action) => {
        state.coupons.unshift(action.payload.coupon);
      })
      .addCase(editCoupon.fulfilled, (state, action) => {
        state.coupons = state.coupons.map((coupon) =>
          coupon.id === action.payload.coupon.id ? action.payload.coupon : coupon,
        );
      })
      .addCase(removeCoupon.fulfilled, (state, action) => {
        state.coupons = state.coupons.filter((coupon) => coupon.id !== action.payload.id);
      });
  },
});

export default couponSlice.reducer;
