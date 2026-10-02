import type { MetadataRoute } from "next";

import { navItems, site } from "@/content/site";
import { projects } from "@/content/projects";

/**
 * Sitemap.
 *
 * Only emitted when the production domain is known (`NEXT_PUBLIC_SITE_URL`).
 * A sitemap requires absolute URLs, and inventing a domain is worse than
 * shipping none — so without it this route intentionally returns an empty list.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  if (!site.url) return [];

  const base = site.url.replace(/\/$/, "");
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = navItems.map((item) => ({
    url: `${base}${item.href === "/" ? "" : item.href}`,
    lastModified: now,
    changeFrequency: item.href === "/" ? "monthly" : "yearly",
    priority: item.href === "/" ? 1 : 0.7,
  }));

  const projectRoutes: MetadataRoute.Sitemap = projects.map((project) => ({
    url: `${base}/projects/${project.slug}`,
    lastModified: now,
    changeFrequency: "yearly",
    priority: 0.6,
  }));

  return [...staticRoutes, ...projectRoutes];
}
