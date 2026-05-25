import http from "@/api/http";
import { API_ROUTES } from "@/constants/api";

export const getCategories = (params) => http.get(API_ROUTES.categories.all, { params });
export const createCategory = (payload, config) => http.post(API_ROUTES.categories.create, payload, config);
export const updateCategory = (id, payload, config) => http.put(API_ROUTES.categories.update(id), payload, config);
export const deleteCategory = (id) => http.delete(API_ROUTES.categories.delete(id));

