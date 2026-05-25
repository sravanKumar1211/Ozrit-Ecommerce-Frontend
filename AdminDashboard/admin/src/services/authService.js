import http from "@/api/http";
import { API_ROUTES } from "@/constants/api";

export const loginAdmin = async (credentials) => {
  const response = await http.post(API_ROUTES.auth.login, credentials);
  return response.data; 
};

export const logoutAdmin = async () => {
  const response = await http.post(API_ROUTES.auth.logout);
  return response.data;
};

export const fetchProfile = async () => {
  const response = await http.get(API_ROUTES.auth.profile);
  return response.data;
};

export const updateAdminProfile = async (payload) => {
  const response = await http.put(API_ROUTES.auth.profile, payload, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const changeAdminPassword = async (payload) => {
  const response = await http.put("/reset-password", payload);
  return response.data;
};

export const fetchAdminUsers = async () => {
  const response = await http.get(API_ROUTES.auth.users);
  return response.data;
};

export const fetchDashboardStats = async () => {
  const response = await http.get(API_ROUTES.auth.dashboard);
  return response.data;
};
