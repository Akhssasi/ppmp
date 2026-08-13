import { request } from "@/services/api";
import type { ProjectStatus, SearchResult } from "@/lib/types";

export interface SearchProjectsQuery {
  q?: string;
  tech?: string;
  status?: ProjectStatus;
  page?: number;
  size?: number;
}

export const searchService = {
  async searchProjects(query: SearchProjectsQuery = {}): Promise<SearchResult> {
    return request<SearchResult>({
      url: "/search/projects",
      method: "GET",
      params: query,
    });
  },

  async searchPortfolios(q: string): Promise<SearchResult> {
    return request<SearchResult>({
      url: "/search/portfolios",
      method: "GET",
      params: { q },
    });
  },
};
