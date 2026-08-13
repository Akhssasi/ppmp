import { request } from "@/services/api";
import type { PagedResponse, Technology, TechnologyCategory } from "@/lib/types";

export interface TechnologyRequest {
  name: string;
  category: TechnologyCategory;
  iconUrl?: string | null;
}

export const technologiesService = {
  async getAll(page = 0, size = 100): Promise<PagedResponse<Technology>> {
    return request<PagedResponse<Technology>>({
      url: "/technologies",
      method: "GET",
      params: { page, size },
    });
  },

  async getAllUnpaged(): Promise<Technology[]> {
    return request<Technology[]>({ url: "/technologies/all", method: "GET" });
  },

  async getById(id: string): Promise<Technology> {
    return request<Technology>({ url: `/technologies/${id}`, method: "GET" });
  },

  async create(payload: TechnologyRequest): Promise<Technology> {
    return request<Technology>({ url: "/technologies", method: "POST", data: payload });
  },

  async update(id: string, payload: TechnologyRequest): Promise<Technology> {
    return request<Technology>({
      url: `/technologies/${id}`,
      method: "PUT",
      data: payload,
    });
  },

  async remove(id: string): Promise<void> {
    await request<void>({ url: `/technologies/${id}`, method: "DELETE" });
  },
};
