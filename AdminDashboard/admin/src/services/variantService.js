import http from "@/api/http";
import { API_ROUTES } from "@/constants/api";

const uploadHeaders = {
  headers: { "Content-Type": "multipart/form-data" },
};

// FETCH ALL VARIANTS FOR A PRODUCT
export const fetchVariantsByProduct = (productId) =>
  http.get(API_ROUTES.variants.all, { params: { productId } });

// FETCH SINGLE VARIANT
export const fetchSingleVariant = (id) =>
  http.get(API_ROUTES.variants.detail(id));

// CREATE NEW VARIANT (Accepts FormData payload due to image uploads)
export const createProductVariant = (payload) =>
  http.post(API_ROUTES.variants.create, payload, uploadHeaders);

// UPDATE EXISTING VARIANT (Accepts variant ID + FormData payload)
export const updateProductVariant = (id, payload) =>
  http.put(API_ROUTES.variants.update(id), payload, uploadHeaders);

// DELETE VARIANT
export const deleteProductVariant = (id) =>
  http.delete(API_ROUTES.variants.delete(id));