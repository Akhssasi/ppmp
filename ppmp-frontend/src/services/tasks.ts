import { request } from "@/services/api";
import type { Task, TaskRequest, TaskStatus } from "@/lib/types";

export const tasksService = {
  async getAll(projectId: string): Promise<Task[]> {
    return request<Task[]>({ url: `/projects/${projectId}/tasks`, method: "GET" });
  },

  async create(projectId: string, payload: TaskRequest): Promise<Task> {
    return request<Task>({ url: `/projects/${projectId}/tasks`, method: "POST", data: payload });
  },

  async update(projectId: string, taskId: string, payload: TaskRequest): Promise<Task> {
    return request<Task>({
      url: `/projects/${projectId}/tasks/${taskId}`,
      method: "PUT",
      data: payload,
    });
  },

  async remove(projectId: string, taskId: string): Promise<void> {
    await request<void>({ url: `/projects/${projectId}/tasks/${taskId}`, method: "DELETE" });
  },

  async updateStatus(projectId: string, taskId: string, status: TaskStatus): Promise<Task> {
    return request<Task>({
      url: `/projects/${projectId}/tasks/${taskId}/status`,
      method: "PATCH",
      data: { status },
    });
  },

  async assign(projectId: string, taskId: string, assigneeId: string): Promise<Task> {
    return request<Task>({
      url: `/projects/${projectId}/tasks/${taskId}/assign`,
      method: "PATCH",
      data: { assigneeId },
    });
  },
};
