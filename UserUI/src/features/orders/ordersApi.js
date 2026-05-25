import api from "@/api/axiosInstance";
import { endpoints } from "@/api/endpoints";

export const createOrderApi = async (payload) => {
  const response = await api.post(endpoints.orders.create, payload);
  return response.data;
};

export const getMyOrdersApi = async () => {
  const response = await api.get(endpoints.orders.myOrders);
  return response.data;
};

export const getOrderByIdApi = async (id) => {
  const response = await api.get(endpoints.orders.myOrderById(id));
  return response.data;
};

export const cancelOrderApi = async (id) => {
  const response = await api.put(endpoints.orders.cancel(id));
  return response.data;
};
