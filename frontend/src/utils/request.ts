import axios, { AxiosRequestConfig, isAxiosError } from "axios";
import toast from "solid-toast";

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 3000,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (isAxiosError(error)) {
      throw new Error(error.response?.data.error);
    }

    if (error instanceof Error) {
      throw error;
    }

    throw new Error("未知的网络请求错误，请稍后再试");
  }
);

export const request = {
  get: async <T>(url: string, config?: AxiosRequestConfig) => {
    const response = await instance.get<{ data: T }>(url, config);
    return response.data.data;
  },
  post: async <T>(url: string, data?: unknown, config?: AxiosRequestConfig) => {
    const response = await instance.post<{ data: T }>(url, data, config);
    return response.data.data;
  },
  put: async <T>(url: string, data?: unknown, config?: AxiosRequestConfig) => {
    const response = await instance.put<{ data: T }>(url, data, config);
    return response.data.data;
  },
  patch: async <T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ) => {
    const response = await instance.patch<{ data: T }>(url, data, config);
    return response.data.data;
  },
  delete: async <T>(url: string, config?: AxiosRequestConfig) => {
    const response = await instance.delete<{ data: T }>(url, config);
    return response.data.data;
  },
};

export function handleRequestError(error: unknown) {
  if (error instanceof Error) {
    toast.error(error.message);
    return;
  }

  toast.error("未知的应用内错误，请稍后再试");
}
