import axios, { AxiosError, type AxiosRequestConfig } from "axios";
import type { ApiResponse, AuthResponse } from "@/lib/types";

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080/api/v1";

const TOKEN_KEY = "ppmp_tokens";

interface StoredTokens {
  accessToken: string;
  refreshToken: string;
}

export function getStoredTokens(): StoredTokens | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(TOKEN_KEY);
    return raw ? (JSON.parse(raw) as StoredTokens) : null;
  } catch {
    return null;
  }
}

export function setStoredTokens(tokens: StoredTokens | null) {
  if (typeof window === "undefined") return;
  if (tokens) {
    window.localStorage.setItem(TOKEN_KEY, JSON.stringify(tokens));
  } else {
    window.localStorage.removeItem(TOKEN_KEY);
  }
}

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

apiClient.interceptors.request.use((config) => {
  const tokens = getStoredTokens();
  if (tokens?.accessToken) {
    config.headers.Authorization = `Bearer ${tokens.accessToken}`;
  }
  return config;
});

let isRefreshing = false;
let pendingQueue: Array<(token: string | null) => void> = [];

function flushQueue(token: string | null) {
  pendingQueue.forEach((resolve) => resolve(token));
  pendingQueue = [];
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const original = error.config as (AxiosRequestConfig & { _retry?: boolean }) | undefined;
    const tokens = getStoredTokens();

    const isAuthCall = original?.url?.includes("/auth/login") || original?.url?.includes("/auth/register");

    if (
      error.response?.status === 401 &&
      original &&
      !original._retry &&
      tokens?.refreshToken &&
      !isAuthCall
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          pendingQueue.push((token) => {
            if (!token) {
              reject(error);
              return;
            }
            original._retry = true;
            original.headers = { ...original.headers, Authorization: `Bearer ${token}` };
            resolve(apiClient(original));
          });
        });
      }

      original._retry = true;
      isRefreshing = true;

      try {
        const { data } = await axios.post<ApiResponse<AuthResponse>>(
          `${API_BASE_URL}/auth/refresh-token`,
          { refreshToken: tokens.refreshToken },
        );
        const newTokens: StoredTokens = {
          accessToken: data.data.accessToken,
          refreshToken: data.data.refreshToken,
        };
        setStoredTokens(newTokens);
        flushQueue(newTokens.accessToken);
        original.headers = { ...original.headers, Authorization: `Bearer ${newTokens.accessToken}` };
        return apiClient(original);
      } catch (refreshError) {
        flushQueue(null);
        setStoredTokens(null);
        if (typeof window !== "undefined") {
          window.location.replace("/login");
        }
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

export async function request<T>(config: AxiosRequestConfig): Promise<T> {
  const response = await apiClient.request<ApiResponse<T>>(config);
  return response.data.data;
}
