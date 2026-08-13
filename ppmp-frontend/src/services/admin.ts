import { request } from "@/services/api";
import type { PagedResponse, PlatformStats, ProjectList, UserAdmin } from "@/lib/types";

export interface AdminAnnouncement {
  title: string;
  message: string;
}

export const adminService = {
  async getUsers(page = 0, size = 20): Promise<PagedResponse<UserAdmin>> {
    return request<PagedResponse<UserAdmin>>({
      url: "/admin/users",
      method: "GET",
      params: { page, size },
    });
  },

  async getUser(id: string): Promise<UserAdmin> {
    return request<UserAdmin>({ url: `/admin/users/${id}`, method: "GET" });
  },

  async banUser(id: string): Promise<UserAdmin> {
    return request<UserAdmin>({ url: `/admin/users/${id}/ban`, method: "PATCH" });
  },

  async activateUser(id: string): Promise<UserAdmin> {
    return request<UserAdmin>({ url: `/admin/users/${id}/activate`, method: "PATCH" });
  },

  async deleteUser(id: string): Promise<void> {
    await request<void>({ url: `/admin/users/${id}`, method: "DELETE" });
  },

  async getProjects(page = 0, size = 20): Promise<PagedResponse<ProjectList>> {
    return request<PagedResponse<ProjectList>>({
      url: "/admin/projects",
      method: "GET",
      params: { page, size },
    });
  },

  async getPlatformStats(): Promise<PlatformStats> {
    return request<PlatformStats>({ url: "/admin/analytics/platform", method: "GET" });
  },

  async sendAnnouncement(payload: AdminAnnouncement): Promise<void> {
    await request<void>({ url: "/admin/announcements", method: "POST", data: payload });
  },
};
