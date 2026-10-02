import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { PageContainer, Section } from "@/components/layout/PageContainer";
import { RevealOnScroll } from "@/components/motion/RevealOnScroll";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SpotlightCard } from "@/components/ui/SpotlightCard";
import { Button } from "@/components/ui/Button";
import { Pill, SourceBadge } from "@/components/ui/Badges";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CodeIcon,
  ExternalLinkIcon,
  SparkIcon,
} from "@/components/ui/icons";
import {
  projectCategoryLabels,
  projectStatusLabels,
  projects,
} from "@/content/projects";
import { loadProject, loadProjects } from "@/lib/content";
import { buildMetadata } from "@/lib/metadata";
import { formatDate } from "@/lib/utils";

interface ProjectPageProps {
  params: Promise<{ slug: string }>;
}

/** Pre-render every known project; unknown slugs still work through the API. */
export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const local = projects.find((project) => project.slug === slug);

  if (!local) {
    return buildMetadata({
      title: "Project",
      description: "Project details.",
      path: `/projects/${slug}`,
    });
  }

  return buildMetadata({
    title: local.title,
    description: local.summary,
    path: `/projects/${local.slug}`,
    keywords: local.stack,
    type: "article",
  });
}

export default async function ProjectDetailPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const [{ data: project, source, backend }, { data: allProjects }] =
    await Promise.all([loadProject(slug), loadProjects()]);

  if (!project) notFound();

  const index = allProjects.findIndex((item) => item.slug === project.slug);
  const previous = index > 0 ? allProjects[index - 1] : undefined;
  const next =
    index >= 0 && index < allProjects.length - 1
      ? allProjects[index + 1]
      : undefined;

  const liveLink = project.links.find((link) => link.kind === "live");
  const sourceLink = project.links.find((link) => link.kind === "source");
  const otherLinks = project.links.filter(
    (link) => link.kind !== "live" && link.kind !== "source",
  );

  return (
    <>
      {/* Header ----------------------------------------------------------- */}
      <Section spacing={false} className="pt-6 pb-10 sm:pt-10">
        <PageContainer>
          <RevealOnScroll>
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 text-caption text-text-muted transition-colors hover:text-brand-300"
            >
              <ArrowLeftIcon width={15} height={15} />
              All projects
            </Link>
          </RevealOnScroll>

          <div className="mt-6 grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-start">
            <div>
              <RevealOnScroll delay={60}>
                <div className="flex flex-wrap items-center gap-2">
                  <Pill tone="brand">{projectCategoryLabels[project.category]}</Pill>
                  <Pill tone="muted">{projectStatusLabels[project.status]}</Pill>
                  <Pill tone="muted">{project.year}</Pill>
                  {project.isDraft ? (
                    <span className="rounded-full border border-amber-400/40 bg-amber-500/12 px-2.5 py-1 text-caption text-amber-200">
                      Details pending
                    </span>
                  ) : null}
                </div>
              </RevealOnScroll>

              <RevealOnScroll delay={120}>
                <h1 className="mt-5 text-h1 font-semibold text-white">
                  {project.title}
                </h1>
              </RevealOnScroll>

              <RevealOnScroll delay={180}>
                <p className="mt-4 text-lead text-text-secondary pretty-text">
                  {project.tagline}
                </p>
                <p className="mt-4 max-w-2xl text-sm text-text-muted pretty-text">
                  {project.summary}
                </p>
              </RevealOnScroll>

              <RevealOnScroll delay={240}>
                <div className="mt-7 flex flex-wrap items-center gap-3">
                  {liveLink ? (
                    <Button
                      href={liveLink.href}
                      external
                      variant="primary"
                      icon={<ExternalLinkIcon width={16} height={16} />}
                    >
                      {liveLink.label}
                    </Button>
                  ) : (
                    <span className="chip border-white/10 text-text-muted">
                      Live demo not published yet
                    </span>
                  )}

                  {sourceLink ? (
                    <Button
                      href={sourceLink.href}
                      external
                      variant="glass"
                      icon={<CodeIcon width={16} height={16} />}
                    >
                      {sourceLink.label}
                    </Button>
                  ) : (
                    <span className="chip border-white/10 text-text-muted">
                      Repository link not provided yet
                    </span>
                  )}

                  {otherLinks.map((link) => (
                    <Button key={link.href} href={link.href} external variant="ghost">
                      {link.label}
                    </Button>
                  ))}
                </div>
                <SourceBadge source={source} backend={backend} className="mt-5" />
              </RevealOnScroll>
            </div>

            {/* Stack panel */}
            <RevealOnScroll delay={200}>
              <SpotlightCard padding="lg">
                <h2 className="text-h4 font-semibold text-white">
                  Technologies used
                </h2>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {project.stack.map((tech) => (
                    <li key={tech}>
                      <span className="chip">{tech}</span>
                    </li>
                  ))}
                </ul>

                {project.challenges.length ? (
                  <>
                    <div className="hairline my-5" />
                    <p className="text-caption text-text-muted">
                      {project.challenges.length} documented challenge
                      {project.challenges.length === 1 ? "" : "s"} and
                      solution{project.challenges.length === 1 ? "" : "s"}
                    </p>
                  </>
                ) : null}
              </SpotlightCard>
            </RevealOnScroll>
          </div>
        </PageContainer>
      </Section>

      {/* Gallery ---------------------------------------------------------- */}
      {project.gallery.length ? (
        <Section spacing={false} className="pb-12">
          <PageContainer>
            <h2 className="sr-only">Project artwork</h2>
            <ul className="grid gap-5 md:grid-cols-2">
              {project.gallery.map((shot, index) => (
                <RevealOnScroll
                  as="li"
                  key={shot.src}
                  delay={index * 90}
                  className={project.gallery.length === 1 ? "md:col-span-2" : undefined}
                >
                  <figure className="glass glass-edge overflow-hidden rounded-glass p-2">
                    <Image
                      src={shot.src}
                      alt={shot.alt}
                      width={1280}
                      height={800}
                      sizes="(min-width: 768px) 45vw, 92vw"
                      className="h-auto w-full rounded-[1.2rem]"
                    />
                    {shot.caption ? (
                      <figcaption className="px-3 py-3 text-caption text-text-muted">
                        {shot.caption}
                      </figcaption>
                    ) : null}
                  </figure>
                </RevealOnScroll>
              ))}
            </ul>
            <p className="mt-4 text-caption text-text-muted">
              Artwork shown is generated concept art in this site&apos;s visual
              language — not a screenshot of a finished product.
            </p>
          </PageContainer>
        </Section>
      ) : null}

      {/* Body ------------------------------------------------------------- */}
      <Section aria-labelledby="overview-title" className="pt-0">
        <PageContainer>
          <div className="grid gap-12 lg:grid-cols-[1.3fr_0.7fr]">
            <div className="space-y-12">
              <div>
                <RevealOnScroll>
                  <SectionHeading
                    id="overview-title"
                    overline="Overview"
                    title="What it is"
                  />
                </RevealOnScroll>
                <div className="mt-6 space-y-4">
                  {project.overview.map((paragraph, index) => (
                    <RevealOnScroll key={paragraph.slice(0, 24)} delay={index * 70}>
                      <p className="text-[0.97rem] leading-relaxed text-text-secondary pretty-text">
                        {paragraph}
                      </p>
                    </RevealOnScroll>
                  ))}
                </div>
              </div>

              <div>
                <RevealOnScroll>
                  <SectionHeading
                    overline="The problem"
                    as="h2"
                    title="What it had to solve"
                  />
                </RevealOnScroll>
                <RevealOnScroll delay={80}>
                  <p className="mt-6 text-[0.97rem] leading-relaxed text-text-secondary pretty-text">
                    {project.problem || "Problem statement to be documented."}
                  </p>
                </RevealOnScroll>
              </div>

              {project.goals.length ? (
                <div>
                  <RevealOnScroll>
                    <SectionHeading overline="Goals" as="h2" title="What success looked like" />
                  </RevealOnScroll>
                  <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                    {project.goals.map((goal, index) => (
                      <RevealOnScroll as="li" key={goal} delay={index * 80}>
                        <div className="flex items-start gap-3 rounded-2xl border border-white/8 bg-white/[0.03] p-4 text-sm text-text-secondary">
                          <span
                            aria-hidden="true"
                            className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-brand-500/15 text-brand-300"
                          >
                            <SparkIcon width={12} height={12} />
                          </span>
                          {goal}
                        </div>
                      </RevealOnScroll>
                    ))}
                  </ul>
                </div>
              ) : null}

              {project.challenges.length ? (
                <div>
                  <RevealOnScroll>
                    <SectionHeading
                      overline="Challenges"
                      as="h2"
                      title="What was hard, and what I did"
                    />
                  </RevealOnScroll>
                  <ul className="mt-6 space-y-4">
                    {project.challenges.map((item, index) => (
                      <RevealOnScroll as="li" key={item.challenge} delay={index * 90}>
                        <SpotlightCard padding="lg">
                          <p className="text-[0.66rem] tracking-[0.14em] text-brand-400 uppercase">
                            Challenge
                          </p>
                          <p className="mt-2 text-sm text-white">{item.challenge}</p>
                          <p className="mt-4 text-[0.66rem] tracking-[0.14em] text-text-muted uppercase">
                            Solution
                          </p>
                          <p className="mt-2 text-sm text-text-secondary pretty-text">
                            {item.solution}
                          </p>
                        </SpotlightCard>
                      </RevealOnScroll>
                    ))}
                  </ul>
                </div>
              ) : (
                <RevealOnScroll>
                  <div className="rounded-glass border border-dashed border-white/15 p-5 text-sm text-text-muted">
                    <p className="font-medium text-text-secondary">
                      Challenges and solutions are not documented yet
                    </p>
                    <p className="mt-2 pretty-text">
                      I only publish engineering notes I can stand behind, so this
                      section stays empty until the write-up is done. Add it under{" "}
                      <code className="rounded bg-white/8 px-1.5 py-0.5 font-mono text-[0.78rem] text-brand-200">
                        challenges
                      </code>{" "}
                      in{" "}
                      <code className="rounded bg-white/8 px-1.5 py-0.5 font-mono text-[0.78rem] text-brand-200">
                        client/src/content/projects.ts
                      </code>
                      .
                    </p>
                  </div>
                </RevealOnScroll>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-5">
              {project.features.length ? (
                <RevealOnScroll delay={60}>
                  <SpotlightCard padding="lg">
                    <h2 className="text-h4 font-semibold text-white">
                      Main features
                    </h2>
                    <ul className="mt-4 space-y-2.5">
                      {project.features.map((feature) => (
                        <li
                          key={feature}
                          className="flex items-start gap-2.5 text-sm text-text-secondary"
                        >
                          <span
                            aria-hidden="true"
                            className="mt-1.5 size-1.5 shrink-0 rounded-full bg-brand-500"
                          />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </SpotlightCard>
                </RevealOnScroll>
              ) : null}

              <RevealOnScroll delay={120}>
                <SpotlightCard padding="lg">
                  <h2 className="text-h4 font-semibold text-white">Project facts</h2>
                  <dl className="mt-4 space-y-3 text-sm">
                    <div className="flex items-center justify-between gap-3">
                      <dt className="text-text-muted">Category</dt>
                      <dd className="text-text-secondary">
                        {projectCategoryLabels[project.category]}
                      </dd>
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      <dt className="text-text-muted">Status</dt>
                      <dd className="text-text-secondary">
                        {projectStatusLabels[project.status]}
                      </dd>
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      <dt className="text-text-muted">Year</dt>
                      <dd className="text-text-secondary">{project.year}</dd>
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      <dt className="text-text-muted">Documentation</dt>
                      <dd className="text-text-secondary">
                        {project.isDraft ? "In progress" : "Published"}
                      </dd>
                    </div>
                  </dl>
                  <p className="mt-4 text-caption text-text-muted">
                    Last reviewed {formatDate(new Date().toISOString())}
                  </p>
                </SpotlightCard>
              </RevealOnScroll>
            </div>
          </div>
        </PageContainer>
      </Section>

      {/* Prev / next ------------------------------------------------------ */}
      <Section spacing={false} className="pb-16">
        <PageContainer>
          <div className="grid gap-4 sm:grid-cols-2">
            {previous ? (
              <Link
                href={`/projects/${previous.slug}`}
                className="glass glass-interactive rounded-glass p-5"
              >
                <p className="text-caption text-text-muted">Previous project</p>
                <p className="mt-2 flex items-center gap-2 text-h4 font-medium text-white">
                  <ArrowLeftIcon width={17} height={17} />
                  {previous.title}
                </p>
              </Link>
            ) : (
              <span />
            )}

            {next ? (
              <Link
                href={`/projects/${next.slug}`}
                className="glass glass-interactive rounded-glass p-5 sm:text-right"
              >
                <p className="text-caption text-text-muted">Next project</p>
                <p className="mt-2 flex items-center gap-2 text-h4 font-medium text-white sm:justify-end">
                  {next.title}
                  <ArrowRightIcon width={17} height={17} />
                </p>
              </Link>
            ) : null}
          </div>
        </PageContainer>
      </Section>
    </>
  );
}
