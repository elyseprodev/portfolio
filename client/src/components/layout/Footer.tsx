import Link from "next/link";

import { BackToTop } from "@/components/ui/BackToTop";
import { SourceBadge } from "@/components/ui/Badges";
import { GitHubIcon } from "@/components/ui/icons";
import { PageContainer } from "./PageContainer";
import { navItems, site } from "@/content/site";
import { githubHandle } from "@/lib/utils";
import { loadProfile, loadServiceStatus } from "@/lib/content";

/**
 * ELYSE DEV — global footer.
 *
 * The status line reports the real state of the API/database rather than
 * pretending everything is always fine.
 */
export async function Footer() {
  const [{ data: profile }, status] = await Promise.all([
    loadProfile(),
    loadServiceStatus(),
  ]);

  // Rendered per request; the year is therefore always current.
  const year = new Date().getFullYear();

  return (
    <footer className="relative mt-8 border-t border-white/8 bg-ink-950/40 backdrop-blur-xl">
      <PageContainer className="py-12 sm:py-14">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr_1fr]">
          {/* Identity */}
          <div>
            <Link
              href="/"
              className="inline-flex items-center gap-2.5"
              aria-label={`${site.name} — home`}
            >
              <span
                aria-hidden="true"
                className="grid size-9 place-items-center rounded-xl border border-brand-500/40 bg-gradient-to-br from-brand-500/30 to-brand-700/10 font-mono text-[0.78rem] font-semibold text-brand-200"
              >
                ED
              </span>
              <span className="text-[0.98rem] font-semibold tracking-tight text-white">
                ELYSE <span className="text-brand-400">DEV</span>
              </span>
            </Link>

            <p className="mt-4 max-w-md text-sm text-text-secondary pretty-text">
              {site.developerName} — {site.role}. I build modern web
              applications with React, Next.js, Node.js, Express and PHP, and I
              am currently going deeper into cybersecurity.
            </p>

            <p className="mt-4 text-caption text-text-muted">
              Based in {profile.location} · {profile.availability}
            </p>

            <div className="mt-5 flex flex-wrap items-center gap-3">
              <a
                href={site.github}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-glass !min-h-10 !px-4 !text-[0.84rem]"
              >
                <GitHubIcon width={17} height={17} />
                {githubHandle(site.github)}
                <span className="sr-only">(opens in a new tab)</span>
              </a>
              <Link
                href="/contact"
                className="btn btn-ghost !min-h-10 !px-4 !text-[0.84rem]"
              >
                Contact
              </Link>
            </div>
          </div>

          {/* Navigation */}
          <nav aria-label="Footer">
            <h2 className="text-overline font-medium text-text-muted uppercase">
              Explore
            </h2>
            <ul className="mt-4 grid gap-2.5">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-text-secondary transition-colors duration-300 hover:text-brand-300"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Build info */}
          <div>
            <h2 className="text-overline font-medium text-text-muted uppercase">
              How this is built
            </h2>
            <ul className="mt-4 grid gap-2.5 text-sm text-text-secondary">
              <li>Next.js App Router client</li>
              <li>Express + Zod API</li>
              <li>MongoDB via Mongoose, JSON-store fallback</li>
              <li>Tailwind CSS design system</li>
            </ul>

            <div className="mt-5 space-y-2">
              <SourceBadge source={status.reachable ? "api" : "local"} backend={status.backend} />
              <p className="text-caption text-text-muted">
                {status.reachable
                  ? status.status === "degraded"
                    ? "API online — database running in degraded mode."
                    : "API and database online."
                  : "API offline — this page is served from the bundled content."}
              </p>
            </div>
          </div>
        </div>

        <div className="hairline my-8" />

        <div className="flex flex-col-reverse items-start justify-between gap-4 sm:flex-row sm:items-center">
          <p className="text-caption text-text-muted">
            © {year} {site.developerName}. Built from scratch — client, server and
            database.
          </p>
          <div className="flex items-center gap-4">
            <Link
              href="/projects"
              className="text-caption text-text-secondary transition-colors hover:text-brand-300"
            >
              Projects
            </Link>
            <Link
              href="/contact"
              className="text-caption text-text-secondary transition-colors hover:text-brand-300"
            >
              Contact
            </Link>
            <BackToTop />
          </div>
        </div>
      </PageContainer>
    </footer>
  );
}
