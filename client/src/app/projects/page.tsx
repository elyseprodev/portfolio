import type { Metadata } from "next";

import { PageContainer, Section } from "@/components/layout/PageContainer";
import { PageHeader } from "@/components/layout/PageHeader";
import { RevealOnScroll } from "@/components/motion/RevealOnScroll";
import { ProjectGrid } from "@/components/projects/ProjectGrid";
import { SpotlightCard } from "@/components/ui/SpotlightCard";
import { Button } from "@/components/ui/Button";
import { Pill, SourceBadge } from "@/components/ui/Badges";
import { ArrowRightIcon, GitHubIcon } from "@/components/ui/icons";
import { loadProjects } from "@/lib/content";
import { buildMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Projects",
  description:
    "Web applications built by MURENGERANTWARI Elyse — a full-stack portfolio, the Light Education platform, a student messaging app and a video web application.",
  path: "/projects",
  keywords: ["React projects", "Next.js portfolio projects", "student developer projects"],
});

export default async function ProjectsPage() {
  const { data: projects, source, backend } = await loadProjects();
  const drafts = projects.filter((project) => project.isDraft);

  return (
    <>
      <PageHeader
        overline="Projects"
        title={
          <>
            Things I have built,
            <span className="text-accent-gradient"> and what I learned</span>
          </>
        }
        description="Each project below is real work from my own development. Where a detail — a repository link, a screenshot, a finished write-up — is not available yet, the card says so instead of filling the gap with something invented."
        actions={
          <>
            <Button
              href="/github"
              variant="primary"
              icon={<GitHubIcon width={16} height={16} />}
            >
              Development activity
            </Button>
            <Button
              href="/contact"
              variant="glass"
              icon={<ArrowRightIcon width={16} height={16} />}
            >
              Discuss a project
            </Button>
          </>
        }
        aside={
          <SpotlightCard className="w-full max-w-xs" padding="lg">
            <p className="text-[0.66rem] tracking-[0.14em] text-text-muted uppercase">
              Collection
            </p>
            <p className="mt-3 text-3xl font-semibold text-white">
              {projects.length}
            </p>
            <p className="mt-1 text-sm text-text-secondary">
              projects across full-stack and frontend work
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <Pill tone="brand">
                {projects.filter((project) => !project.isDraft).length} documented
              </Pill>
              {drafts.length ? <Pill tone="muted">{drafts.length} pending detail</Pill> : null}
            </div>
            <SourceBadge source={source} backend={backend} className="mt-5" />
          </SpotlightCard>
        }
      />

      <Section aria-label="Project collection" className="pt-0 pb-16">
        <PageContainer>
          <RevealOnScroll>
            <div className="glass-subtle mb-6 rounded-glass p-5 text-sm text-text-secondary">
              <p className="font-medium text-white">A note on honesty</p>
              <p className="mt-2 pretty-text">
                Projects labelled{" "}
                <span className="rounded-full border border-amber-400/40 bg-amber-500/12 px-2 py-0.5 text-caption text-amber-200">
                  Details pending
                </span>{" "}
                are real projects whose case-study copy, screenshots or repository
                links are still being written. Their entries are editable in{" "}
                <code className="rounded bg-white/8 px-1.5 py-0.5 font-mono text-[0.78rem] text-brand-200">
                  client/src/content/projects.ts
                </code>{" "}
                — nothing on this page is presented as finished when it is not.
              </p>
            </div>
          </RevealOnScroll>

          <RevealOnScroll delay={80}>
            <ProjectGrid projects={projects} />
          </RevealOnScroll>
        </PageContainer>
      </Section>
    </>
  );
}
