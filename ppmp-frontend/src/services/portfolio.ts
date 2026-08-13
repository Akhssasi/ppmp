import { request } from "@/services/api";
import type { PortfolioSettings, PublicPortfolio } from "@/lib/types";

export interface PortfolioSettingsPayload {
  headline?: string | null;
  aboutText?: string | null;
  theme?: string | null;
  showGithubStats?: boolean;
  showContactForm?: boolean;
  customLinks?: Record<string, string>;
}

export const portfolioService = {
  async getMine(): Promise<PublicPortfolio> {
    return request<PublicPortfolio>({ url: "/portfolio/me", method: "GET" });
  },

  async updateSettings(payload: PortfolioSettingsPayload): Promise<PortfolioSettings> {
    return request<PortfolioSettings>({
      url: "/portfolio/me/settings",
      method: "PUT",
      data: payload,
    });
  },

  async getBySlug(slug: string): Promise<PublicPortfolio> {
    return request<PublicPortfolio>({ url: `/portfolio/${slug}`, method: "GET" });
  },

  async exportPdf(): Promise<Blob> {
    const response = await request<{ fileUrl?: string }>({
      url: "/portfolio/me/export-pdf",
      method: "POST",
    });
    if (response.fileUrl) {
      const fileRes = await fetch(response.fileUrl);
      return fileRes.blob();
    }
    throw new Error("No PDF returned");
  },
};
