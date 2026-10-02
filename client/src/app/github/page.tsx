import type { Metadata } from "next";

import { PageContainer, Section } from "@/components/layout/PageContainer";
import { PageHeader } from "@/components/layout/PageHeader";
import { RevealOnScroll } from "@/components/motion/RevealOnScroll";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SpotlightCard } from "@/components/ui/SpotlightCard";
import { Button } from "@/components/ui/Button";
import { GitHubActivityPanel } from "@/components/github/GitHubActivityPanel";
import { GitHubIcon, SparkIcon } from "@/components/ui/icons";
import { site } from "@/content/site";
import { apiGet } from "@/lib/api";
import type { GithubActivityPayload } from "@/lib/github";
import { buildMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildMetadata({
  title: "GitHub & development activity",
  description:
    "Live GitHub activity for MURENGERANTWARI Elyse (ElissaElyse7) — repositories, primary languages and the API that proxies them, with an honest fallback when GitHub rate limits apply.",
  path: "/github",
  keywords: ["ElissaElyse7", "GitHub repositories"],
  type: "profile",
});

/**
 * Repositories that are real and verifiable. They are shown whenever live
 * GitHub data is unavailable — never as a substitute for invented statistics.
 */
const CURATED_REPOS = [
  {
    name: "elyseprodev/portfolio",
    description:
      "This portfolio: a Next.js client, an Express API and a MongoDB-ready database layer, built as one product.",
    href: "https://github.com/elyseprodev/portfolio",
  },
  {
    name: "ElissaElyse7 — GitHub profile",
    description:
      "The account where my project repositories live. Open it to see the current list, commits and languages.",
    href: site.github,
  },
];

export default async function GitHubPage() {
  // Fetched on the server through the API, which holds the optional token.
  const result = await apiGet<GithubActivityPayload>("/api/github", {
    revalidate: 300,
    tags: ["github"],
  });

  const initial = result?.data ?? null;

  return (
    <>
      <PageHeader
        overline="GitHub & activity"
        title={
          <>
            Code you can
            <span className="text-accent-gradient"> actually open</span>
          </>
        }
        description="Repositories and languages pulled from the GitHub API through this portfolio's own backend. When GitHub rate limits apply, this page says so and falls back to a curated list of real repositories instead of drawing a fake contribution graph."
        actions={
          <>
            <Button
              href={site.github}
              external
              variant="primary"
              icon={<GitHubIcon width={16} height={16} />}
            >
              github.com/ElissaElyse7
            </Button>
            <Button href="/projects" variant="glass">
              Project write-ups
            </Button>
          </>
        }
        aside={
          <SpotlightCard className="w-full max-w-xs" padding="lg">
            <p className="flex items-center gap-2 text-[0.66rem] tracking-[0.14em] text-text-muted uppercase">
              <SparkIcon width={13} height={13} />
              Data policy
            </p>
            <ul className="mt-4 space-y-2.5 text-sm text-text-secondary">
              <li>No invented contributions, streaks or totals</li>
              <li>No fabricated repository counts</li>
              <li>Live data or an honest explanation</li>
            </ul>
          </SpotlightCard>
        }
      />

      <Section aria-labelledby="activity-title" className="pt-0">
        <PageContainer>
          <RevealOnScroll>
            <SectionHeading
              id="activity-title"
              overline="Activity"
              title="Repositories and primary languages"
              description="Aggregated from the public GitHub REST API for the account below. Language counts come from each repository's primary language — they are not a proficiency score."
            />
          </RevealOnScroll>

          <RevealOnScroll delay={90} className="mt-10">
            <GitHubActivityPanel
              initial={initial}
              curated={CURATED_REPOS}
              profileHref={site.github}
            />
          </RevealOnScroll>
        </PageContainer>
      </Section>

      <Section aria-labelledby="how-title" className="pt-0 pb-16">
        <PageContainer>
          <RevealOnScroll>
            <SectionHeading
              id="how-title"
              overline="How this page works"
              title="A proxy, not a widget"
              description="The interesting part of this page is the plumbing behind it — which is also why it can fail gracefully."
            />
          </RevealOnScroll>

          <ul className="mt-10 grid gap-5 md:grid-cols-3">
            {[
              {
                title: "1 · Server-side token",
                body: "The optional GITHUB_TOKEN lives in the server environment. The browser never sees it, and the API applies a higher rate limit when it is configured.",
              },
              {
                title: "2 · Cached responses",
                body: "Results are cached in memory for five minutes, so ordinary browsing does not burn the GitHub quota. The refresh button bypasses the cache deliberately.",
              },
              {
                title: "3 · Honest degradation",
                body: "Rate limits, 404s and network failures all return `available: false` with a reason. The UI then shows the curated repository list — never invented numbers.",
              },
            ].map((item, index) => (
              <RevealOnScroll as="li" key={item.title} delay={index * 100} className="h-full">
                <SpotlightCard className="h-full" padding="lg">
                  <h3 className="text-h4 font-semibold text-white">{item.title}</h3>
                  <p className="mt-3 text-sm text-text-secondary pretty-text">
                    {item.body}
                  </p>
                </SpotlightCard>
              </RevealOnScroll>
            ))}
          </ul>
        </PageContainer>
      </Section>
    </>
  );
}
