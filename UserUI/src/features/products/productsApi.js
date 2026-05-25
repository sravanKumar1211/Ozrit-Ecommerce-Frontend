import api from "@/api/axiosInstance";
import { endpoints } from "@/api/endpoints";

export const getProductsApi = async (params = {}) => {
  const response = await api.get(endpoints.products.all, { params });
  return response.data;
};

export const getProductApi = async (id) => {
  const response = await api.get(endpoints.products.detail(id));
  return response.data;
};
