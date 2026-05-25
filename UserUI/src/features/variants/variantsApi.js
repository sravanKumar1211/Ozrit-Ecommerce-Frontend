import api from "@/api/axiosInstance";
import { endpoints } from "@/api/endpoints";

export const getVariantsApi = async (params = {}) => {
  const response = await api.get(endpoints.productVariant.all, { params });
  return response.data;
};

export const getVariantApi = async (variantId) => {
  const response = await api.get(endpoints.productVariant.detail(variantId));
  return response.data.variant;
};
