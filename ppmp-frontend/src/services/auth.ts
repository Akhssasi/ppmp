import { request, setStoredTokens } from "@/services/api";
import type { AuthResponse } from "@/lib/types";

export interface RegisterPayload {
  username: string;
  email: string;
  password: string;
  fullName: string;
}

export interface LoginPayload {
  usernameOrEmail: string;
  password: string;
}

export const authService = {
  async register(payload: RegisterPayload): Promise<AuthResponse> {
    return request<AuthResponse>({ url: "/auth/register", method: "POST", data: payload });
  },

  async login(payload: LoginPayload): Promise<AuthResponse> {
    const auth = await request<AuthResponse>({ url: "/auth/login", method: "POST", data: payload });
    setStoredTokens({ accessToken: auth.accessToken, refreshToken: auth.refreshToken });
    return auth;
  },

  async logout(): Promise<void> {
    const tokens = JSON.parse(localStorage.getItem("ppmp_tokens") ?? "{}");
    if (tokens?.refreshToken) {
      try {
        await request<void>({
          url: "/auth/logout",
          method: "POST",
          data: { refreshToken: tokens.refreshToken },
        });
      } catch {
        // ignore logout failures
      }
    }
    setStoredTokens(null);
  },

  async refreshToken(refreshToken: string): Promise<AuthResponse> {
    return request<AuthResponse>({
      url: "/auth/refresh-token",
      method: "POST",
      data: { refreshToken },
    });
  },

  async forgotPassword(email: string): Promise<void> {
    await request<void>({ url: "/auth/forgot-password", method: "POST", data: { email } });
  },

  async resetPassword(token: string, newPassword: string): Promise<void> {
    await request<void>({
      url: "/auth/reset-password",
      method: "POST",
      data: { token, newPassword },
    });
  },

  async verifyEmail(token: string): Promise<void> {
    await request<void>({ url: "/auth/verify-email", method: "POST", data: { token } });
  },
};
