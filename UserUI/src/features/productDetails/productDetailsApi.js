import api from "@/api/axiosInstance";
import { endpoints } from "@/api/endpoints";

export const getProductDetailsApi = async (productId) => {
  const response = await api.get(endpoints.products.detail(productId));
  return response.data.product;
};
