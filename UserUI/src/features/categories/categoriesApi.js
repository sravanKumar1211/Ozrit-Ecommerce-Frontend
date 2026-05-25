import api from "@/api/axiosInstance";
import { endpoints } from "@/api/endpoints";

export const getCategoriesApi = async (params = {}) => {
  const response = await api.get(endpoints.categories.all, { params });
  return response.data;
};

export const getSubCategoriesApi = async (params = {}) => {
  const response = await api.get(endpoints.subCategories.all, { params });
  return response.data;
};
