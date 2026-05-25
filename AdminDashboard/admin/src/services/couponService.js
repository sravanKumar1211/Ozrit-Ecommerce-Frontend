import http from "@/api/http";
import { API_ROUTES } from "@/constants/api";

export const getCoupons = () => http.get(API_ROUTES.coupons.all);
export const createCoupon = (payload) => http.post(API_ROUTES.coupons.create, payload);
export const updateCoupon = (id, payload) => http.put(API_ROUTES.coupons.update(id), payload);
export const deleteCoupon = (id) => http.delete(API_ROUTES.coupons.delete(id));
