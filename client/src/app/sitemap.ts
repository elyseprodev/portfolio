import type { MetadataRoute } from "next";

import { navItems, site } from "@/content/site";
import { projects } from "@/content/projects";
import { courses } from "@/content/courses";

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

  // The academy is a first-class section: every course gets its own entry so
  // search engines discover the catalogue from one place.
  const academyRoutes: MetadataRoute.Sitemap = [
    {
      url: `${base}/academy`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${base}/academy/program`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${base}/certificate`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    },
  ];

  const courseRoutes: MetadataRoute.Sitemap = courses.map((course) => ({
    url: `${base}/academy/${course.slug}`,
    lastModified: now,
    changeFrequency: "yearly",
    priority: 0.6,
  }));

  return [...staticRoutes, ...academyRoutes, ...projectRoutes, ...courseRoutes];
}
