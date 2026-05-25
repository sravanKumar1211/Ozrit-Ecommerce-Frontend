import api from "@/api/axiosInstance";
import { endpoints } from "@/api/endpoints";

export const getCartApi = async () => {
  const response = await api.get(endpoints.cart.base);
  return response.data.cart;
};

export const addToCartApi = async (payload) => {
  const response = await api.post(endpoints.cart.add, payload);
  return response.data;
};

export const updateCartQuantityApi = async (payload) => {
  const response = await api.put(endpoints.cart.update, payload);
  return response.data;
};

export const deleteCartItemApi = async (cartItemId) => {
  const response = await api.delete(endpoints.cart.removeItem(cartItemId));
  return response.data;
};
