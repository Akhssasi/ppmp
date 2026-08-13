import { request } from "@/services/api";
import type { Notification, PagedResponse } from "@/lib/types";

export const notificationsService = {
  async getAll(): Promise<PagedResponse<Notification>> {
    return request<PagedResponse<Notification>>({ url: "/notifications", method: "GET" });
  },

  async getUnreadCount(): Promise<number> {
    return request<number>({ url: "/notifications/unread-count", method: "GET" });
  },

  async markRead(id: string): Promise<void> {
    await request<void>({ url: `/notifications/${id}/read`, method: "PATCH" });
  },

  async markAllRead(): Promise<void> {
    await request<void>({ url: "/notifications/read-all", method: "PATCH" });
  },

  async remove(id: string): Promise<void> {
    await request<void>({ url: `/notifications/${id}`, method: "DELETE" });
  },
};
