import { request } from "@/services/api";
import type { DashboardStats, ProjectStats, TechUsage } from "@/lib/types";

export const analyticsService = {
  async getDashboardStats(): Promise<DashboardStats> {
    return request<DashboardStats>({ url: "/analytics/dashboard", method: "GET" });
  },

  async getProjectStats(): Promise<ProjectStats> {
    return request<ProjectStats>({ url: "/analytics/projects/stats", method: "GET" });
  },

  async getTechUsage(): Promise<TechUsage[]> {
    return request<TechUsage[]>({ url: "/analytics/technologies/usage", method: "GET" });
  },
};
