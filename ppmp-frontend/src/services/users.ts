import { request } from "@/services/api";
import type { User } from "@/lib/types";

export interface UpdateProfilePayload {
  fullName?: string;
  bio?: string;
  portfolioSlug?: string;
  avatarUrl?: string;
}

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}

export const usersService = {
  async getMe(): Promise<User> {
    return request<User>({ url: "/users/me", method: "GET" });
  },

  async updateMe(payload: UpdateProfilePayload): Promise<User> {
    return request<User>({ url: "/users/me", method: "PUT", data: payload });
  },

  async uploadAvatar(file: File): Promise<User> {
    const formData = new FormData();
    formData.append("file", file);
    return request<User>({ url: "/users/me/avatar", method: "PUT", data: formData });
  },

  async changePassword(payload: ChangePasswordPayload): Promise<void> {
    await request<void>({ url: "/users/me/password", method: "PUT", data: payload });
  },

  async deleteMe(): Promise<void> {
    await request<void>({ url: "/users/me", method: "DELETE" });
  },

  async getPublicByUsername(username: string): Promise<User> {
    return request<User>({ url: `/users/${username}/public`, method: "GET" });
  },
};
