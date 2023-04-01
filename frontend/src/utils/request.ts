import { getLocalStorage } from "./storage";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

async function fetcher<T>(url: string, init?: RequestInit) {
  const token = getLocalStorage("token");

  const response = await fetch(new URL(url, BASE_URL), {
    ...init,
    headers: {
      ...init?.headers,
      Authorization: "Bearer " + token,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const { error }: { error: string } = await response.json();
    throw new Error(error);
  }

  const { data }: { data: T } = await response.json();
  return data;
}

export const request = {
  get<T>(url: string) {
    return fetcher<T>(url);
  },
  post<T>(url: string, payload: unknown = {}) {
    return fetcher<T>(url, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },
  put<T>(url: string, payload: unknown = {}) {
    return fetcher<T>(url, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  },
  patch<T>(url: string, payload: unknown = {}) {
    return fetcher<T>(url, {
      method: "PATCH",
      body: JSON.stringify(payload),
    });
  },
  delete<T>(url: string, payload: unknown = {}) {
    return fetcher<T>(url, {
      method: "DELETE",
      body: JSON.stringify(payload),
    });
  },
};
