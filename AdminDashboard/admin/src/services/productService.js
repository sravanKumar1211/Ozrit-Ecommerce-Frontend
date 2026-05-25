import http from "@/api/http";
import { API_ROUTES } from "@/constants/api";

const uploadHeaders = {
  headers: { "Content-Type": "multipart/form-data" },
};

export const getProducts = (params) => http.get(API_ROUTES.products.all, { params });
export const getProduct = (id) => http.get(API_ROUTES.products.detail(id));
export const createProduct = (payload) =>
  payload instanceof FormData
    ? http.post(API_ROUTES.products.create, payload, uploadHeaders)
    : http.post(API_ROUTES.products.create, payload);

export const updateProduct = (id, payload) =>
  payload instanceof FormData
    ? http.put(API_ROUTES.products.update(id), payload, uploadHeaders)
    : http.put(API_ROUTES.products.update(id), payload);

export const deleteProduct = (id) => http.delete(API_ROUTES.products.delete(id));
