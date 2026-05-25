import http from "@/api/http";
import { API_ROUTES } from "@/constants/api";

export const getAdminOrders = () => http.get(API_ROUTES.orders.all);
export const updateOrderStatus = (payload) => http.put(API_ROUTES.orders.status, payload);
