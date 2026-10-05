import type { MetadataRoute } from "next";

import { site } from "@/content/site";

export default function robots(): MetadataRoute.Robots {
  const base = site.url ? site.url.replace(/\/$/, "") : undefined;

  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: ["/api/"] },
    ],
    ...(base ? { sitemap: `${base}/sitemap.xml`, host: base } : {}),
  };
}
