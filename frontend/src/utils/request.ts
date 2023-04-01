import axios, { isAxiosError } from "axios";
import toast from "solid-toast";
import { getLocalStorage } from "./storage";

export const request = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 5000,
  headers: { "Content-Type": "application/json" },
});

request.interceptors.request.use((config) => {
  const token = getLocalStorage("token");
  config.headers.Authorization = "Bearer " + token;
  return config;
});

request.interceptors.response.use((response) => response.data.data);

export function handleRequestError(error: unknown) {
  if (isAxiosError(error)) {
    toast.error(error.response?.data.error);
    return;
  }

  if (error instanceof Error) {
    toast.error(error.message);
    return;
  }

  toast.error("未知错误，请稍后再试");
}
