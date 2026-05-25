import http from "@/api/http";
import { API_ROUTES } from "@/constants/api";

const uploadHeaders = {
  headers: { "Content-Type": "multipart/form-data" },
};

export const getBrands = async (params) => {
  return await http.get(API_ROUTES.brands.all, { params });
};

export const createBrand = async (formData) => {
  return await http.post(API_ROUTES.brands.create, formData, uploadHeaders);
};

export const updateBrand = async (id, formData) => {
  return await http.put(API_ROUTES.brands.update(id), formData, uploadHeaders);
};

export const deleteBrand = async (id) => {
  return await http.delete(API_ROUTES.brands.delete(id));
};
