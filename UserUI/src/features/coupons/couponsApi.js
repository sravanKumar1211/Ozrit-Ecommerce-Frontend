import api from "@/api/axiosInstance";
import { endpoints } from "@/api/endpoints";

export const applyCouponApi = async (payload) => {
  const response = await api.post(endpoints.coupons.apply, payload);
  return response.data;
};
