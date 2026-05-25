import api from "@/api/axiosInstance";
import { endpoints } from "@/api/endpoints";

export const getBrandsApi = async (params = {}) => {
  const response = await api.get(endpoints.brands.all, { params });
  return response.data;
};
