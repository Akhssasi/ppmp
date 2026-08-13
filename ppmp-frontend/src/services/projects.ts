import { request } from "@/services/api";
import type { PagedResponse, Project, ProjectList, ProjectRequest, ProjectStatus, ProjectVisibility } from "@/lib/types";

export interface ProjectQuery {
  page?: number;
  size?: number;
  status?: ProjectStatus;
  visibility?: ProjectVisibility;
}

export const projectsService = {
  async getAll(query: ProjectQuery = {}): Promise<PagedResponse<ProjectList>> {
    return request<PagedResponse<ProjectList>>({
      url: "/projects",
      method: "GET",
      params: query,
    });
  },

  async getById(id: string): Promise<Project> {
    return request<Project>({ url: `/projects/${id}`, method: "GET" });
  },

  async create(payload: ProjectRequest): Promise<Project> {
    return request<Project>({ url: "/projects", method: "POST", data: payload });
  },

  async update(id: string, payload: ProjectRequest): Promise<Project> {
    return request<Project>({ url: `/projects/${id}`, method: "PUT", data: payload });
  },

  async remove(id: string): Promise<void> {
    await request<void>({ url: `/projects/${id}`, method: "DELETE" });
  },

  async updateStatus(id: string, status: ProjectStatus): Promise<Project> {
    return request<Project>({
      url: `/projects/${id}/status`,
      method: "PATCH",
      data: { status },
    });
  },

  async updateVisibility(id: string, visibility: ProjectVisibility): Promise<Project> {
    return request<Project>({
      url: `/projects/${id}/visibility`,
      method: "PATCH",
      data: { visibility },
    });
  },

  async duplicate(id: string): Promise<Project> {
    return request<Project>({ url: `/projects/${id}/duplicate`, method: "POST" });
  },

  async getActivity(id: string): Promise<unknown[]> {
    return request<unknown[]>({ url: `/projects/${id}/activity`, method: "GET" });
  },
};
