import http from "@/api/http";
import { API_ROUTES } from "@/constants/api";

export const getAllUsers = () => http.get(API_ROUTES.auth.users);
export const updateProfile = (payload) => http.put(API_ROUTES.auth.profile, payload);
