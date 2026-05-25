import http from "@/api/http";
import { API_ROUTES } from "@/constants/api";

const uploadHeaders = {
  headers: { "Content-Type": "multipart/form-data" },
};

export const getSubCategories = async (params) => {
  return await http.get(API_ROUTES.subCategories.all, { params });
};

export const createSubCategory = async (data) => {
  return await http.post(API_ROUTES.subCategories.create, data, uploadHeaders);
};

export const updateSubCategory = async (id, data) => {
  return await http.put(API_ROUTES.subCategories.update(id), data, uploadHeaders);
};

export const deleteSubCategory = async (id) => {
  return await http.delete(API_ROUTES.subCategories.delete(id));
};
