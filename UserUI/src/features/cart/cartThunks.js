import { createAsyncThunk } from "@reduxjs/toolkit";
import { addToCartApi, deleteCartItemApi, getCartApi, updateCartQuantityApi } from "./cartApi";

export const fetchCart = createAsyncThunk("cart/fetchCart", async (_, { rejectWithValue }) => {
  try {
    return await getCartApi();
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Failed to load cart");
  }
});

export const addItemToCart = createAsyncThunk(
  "cart/addItemToCart",
  async ({ productVariantId, quantity }, { rejectWithValue }) => {
    try {
      await addToCartApi({ productVariantId, quantity });
      return await getCartApi();
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to add item to cart");
    }
  },
);

export const updateCartItem = createAsyncThunk(
  "cart/updateCartItem",
  async ({ cartItemId, quantity }, { rejectWithValue }) => {
    try {
      await updateCartQuantityApi({ cartItemId, quantity });
      return await getCartApi();
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to update cart item");
    }
  },
);

export const removeCartItem = createAsyncThunk(
  "cart/removeCartItem",
  async (cartItemId, { rejectWithValue }) => {
    try {
      await deleteCartItemApi(cartItemId);
      return await getCartApi();
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to remove cart item");
    }
  },
);
