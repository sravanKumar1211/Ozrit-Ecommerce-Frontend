import api from "@/api/axiosInstance";
import { endpoints } from "@/api/endpoints";

export const createOrderApi = async (payload) => {
  const response = await api.post(endpoints.orders.create, payload);
  return response.data;
};

export const createRazorpayOrderApi = async (payload) => {
  const response = await api.post(endpoints.payment.createOrder, payload);
  return response.data;
};

export const verifyRazorpayPaymentApi = async (payload) => {
  const response = await api.post(endpoints.payment.verify, payload);
  return response.data;
};
