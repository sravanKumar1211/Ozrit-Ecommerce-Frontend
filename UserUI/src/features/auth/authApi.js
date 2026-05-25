import api from "@/api/axiosInstance";
import { endpoints } from "@/api/endpoints";

export const loginApi = async (credentials) => {
  const response = await api.post(endpoints.auth.login, credentials);
  return response.data;
};

export const registerApi = async (payload) => {
  const response = await api.post(endpoints.auth.register, payload);
  return response.data;
};

export const profileApi = async () => {
  const response = await api.get(endpoints.auth.profile);
  return response.data;
};

export const logoutApi = async () => {
  const response = await api.post(endpoints.auth.logout);
  return response.data;
};
