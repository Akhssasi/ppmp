import { request } from "@/services/api";
import type { Milestone, MilestoneRequest } from "@/lib/types";

export const milestonesService = {
  async getAll(projectId: string): Promise<Milestone[]> {
    return request<Milestone[]>({ url: `/projects/${projectId}/milestones`, method: "GET" });
  },

  async create(projectId: string, payload: MilestoneRequest): Promise<Milestone> {
    return request<Milestone>({
      url: `/projects/${projectId}/milestones`,
      method: "POST",
      data: payload,
    });
  },

  async update(projectId: string, milestoneId: string, payload: MilestoneRequest): Promise<Milestone> {
    return request<Milestone>({
      url: `/projects/${projectId}/milestones/${milestoneId}`,
      method: "PUT",
      data: payload,
    });
  },

  async remove(projectId: string, milestoneId: string): Promise<void> {
    await request<void>({
      url: `/projects/${projectId}/milestones/${milestoneId}`,
      method: "DELETE",
    });
  },

  async setCompleted(projectId: string, milestoneId: string, completed: boolean): Promise<Milestone> {
    return request<Milestone>({
      url: `/projects/${projectId}/milestones/${milestoneId}/complete`,
      method: "PATCH",
      data: { completed },
    });
  },
};
