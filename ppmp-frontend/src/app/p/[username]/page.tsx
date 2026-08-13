import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { PublicPortfolioView } from "@/components/portfolio/public-portfolio";
import type { ApiResponse, PublicPortfolio } from "@/lib/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080/api/v1";

interface PageProps {
  params: Promise<{ username: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { username } = await params;
  return {
    title: `${username} — Portfolio`,
    description: `Public software engineering portfolio of ${username} on PPMP.`,
  };
}

export default async function PublicPortfolioPage({ params }: PageProps) {
  const { username } = await params;

  const response = await fetch(`${API_BASE_URL}/portfolio/${encodeURIComponent(username)}`, {
    cache: "no-store",
  }).catch(() => null);

  if (!response || !response.ok) {
    notFound();
  }

  let body: ApiResponse<PublicPortfolio>;
  try {
    body = (await response.json()) as ApiResponse<PublicPortfolio>;
  } catch {
    notFound();
  }

  if (!body.success || !body.data) {
    notFound();
  }

  return <PublicPortfolioView portfolio={body.data} />;
}
