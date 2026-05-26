import api from "@/api/axiosInstance";
import { endpoints } from "@/api/endpoints";

export const fetchProfileApi = async () => {
  const response = await api.get(endpoints.auth.profile);
  return response.data;
};

export const updateProfileApi = async (formData) => {
  const response = await api.put(endpoints.auth.profile, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};
