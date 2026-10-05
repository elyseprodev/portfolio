/**
 * ELYSE DEV — per-route metadata helper.
 *
 * Canonical URLs are only emitted when a real production domain is known
 * (`NEXT_PUBLIC_SITE_URL`) — no domain is invented.
 */
import type { Metadata } from "next";
import { site } from "@/content/site";

interface PageMetadataInput {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
  type?: "website" | "article" | "profile";
}

export function buildMetadata({
  title,
  description,
  path,
  keywords = [],
  type = "website",
}: PageMetadataInput): Metadata {
  const base = site.url || undefined;
  const url = base ? `${base.replace(/\/$/, "")}${path}` : undefined;

  return {
    title,
    description,
    keywords: [...site.keywords, ...keywords],
    alternates: url ? { canonical: url } : undefined,
    openGraph: {
      title: `${title} · ${site.name}`,
      description,
      type: type === "article" ? "article" : "website",
      siteName: site.name,
      locale: "en_US",
      ...(url ? { url } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} · ${site.name}`,
      description,
    },
  };
}
