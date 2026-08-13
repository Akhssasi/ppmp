import { apiClient, request } from "@/services/api";
import type { ProjectFile } from "@/lib/types";

export const filesService = {
  async getAll(projectId: string): Promise<ProjectFile[]> {
    return request<ProjectFile[]>({ url: `/projects/${projectId}/files`, method: "GET" });
  },

  async upload(projectId: string, file: File): Promise<ProjectFile> {
    const formData = new FormData();
    formData.append("file", file);
    const response = await apiClient.post(`/projects/${projectId}/files`, formData);
    return response.data.data as ProjectFile;
  },

  async remove(projectId: string, fileId: string): Promise<void> {
    await request<void>({ url: `/projects/${projectId}/files/${fileId}`, method: "DELETE" });
  },
};
