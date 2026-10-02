import Link from "next/link";

import { PageContainer, Section } from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/Button";
import { ArrowRightIcon, CompassIcon, GitHubIcon } from "@/components/ui/icons";
import { navItems, site } from "@/content/site";

/**
 * ELYSE DEV — branded 404 content.
 *
 * Reused by `app/not-found.tsx` (and available for any nested not-found route).
 * The animation is a single CSS pulse, so it respects reduced-motion through
 * the global rules and costs nothing.
 */
export function NotFoundContent() {
  return (
    <Section spacing={false} className="pt-10 pb-20">
      <PageContainer narrow>
        <div className="glass glass-edge relative overflow-hidden rounded-glass-lg px-6 py-12 text-center sm:px-12 sm:py-16">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-28 left-1/2 size-80 -translate-x-1/2 animate-pulse-soft rounded-full"
            style={{
              background:
                "radial-gradient(circle at center, rgba(249,115,22,0.20), transparent 68%)",
            }}
          />

          <div className="relative">
            <span
              aria-hidden="true"
              className="mx-auto grid size-14 place-items-center rounded-2xl border border-brand-500/30 bg-brand-500/10 text-brand-300"
            >
              <CompassIcon width={26} height={26} />
            </span>

            <p className="mt-6 font-mono text-[3.4rem] leading-none font-semibold text-gradient sm:text-[4.5rem]">
              404
            </p>

            <h1 className="mt-4 text-h2 font-semibold text-white">
              This page does not exist
            </h1>
            <p className="mx-auto mt-4 max-w-md text-sm text-text-secondary pretty-text">
              The link may be outdated, or the address may have a typo. Nothing
              is broken on your side — the page simply is not here.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Button
                href="/"
                variant="primary"
                icon={<ArrowRightIcon width={16} height={16} />}
              >
                Back to home
              </Button>
              <Button href="/projects" variant="glass">
                Browse projects
              </Button>
              <a
                href={site.github}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-ghost"
              >
                <GitHubIcon width={17} height={17} />
                GitHub
              </a>
            </div>

            <div className="hairline my-9" />

            <p className="text-caption text-text-muted">
              Looking for something specific? These are all the pages on this
              site:
            </p>
            <ul className="mt-4 flex flex-wrap justify-center gap-2">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="chip">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </PageContainer>
    </Section>
  );
}
