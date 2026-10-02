import type { Metadata } from "next";

import { NotFoundContent } from "@/components/ui/NotFoundContent";

export const metadata: Metadata = {
  title: "Page not found",
  description:
    "That page does not exist on ELYSE DEV. Head back to the homepage or browse the projects instead.",
  robots: { index: false, follow: true },
};

/**
 * ELYSE DEV — 404.
 *
 * App Router uses this for any unmatched route, so unknown URLs are handled by
 * the framework and styled like the rest of the site.
 */
export default function NotFound() {
  return <NotFoundContent />;
}
