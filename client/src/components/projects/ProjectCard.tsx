import Image from "next/image";
import Link from "next/link";

import { SpotlightCard } from "@/components/ui/SpotlightCard";
import { Pill } from "@/components/ui/Badges";
import { ArrowUpRightIcon, CodeIcon, ExternalLinkIcon } from "@/components/ui/icons";
import { projectCategoryLabels, projectStatusLabels } from "@/content/projects";
import type { Project } from "@elyse/database/types";
import { cn } from "@/lib/utils";

const FALLBACK_ART = "/images/projects/placeholder.svg";

interface ProjectCardProps {
  project: Project;
  /** Reveal delay applied by the parent grid. */
  className?: string;
  priority?: boolean;
}

/**
 * ELYSE DEV — project card.
 *
 * The whole card is one link target (stretched link pattern) while genuine
 * outbound links stay independently clickable and keyboard reachable. Projects
 * whose details are still pending are labelled as such instead of being dressed
 * up as finished case studies.
 */
export function ProjectCard({ project, className, priority = false }: ProjectCardProps) {
  const artwork = project.gallery[0];
  const liveLink = project.links.find((link) => link.kind === "live");
  const sourceLink = project.links.find((link) => link.kind === "source");

  return (
    <article
      data-cursor="card"
      className={cn("group relative flex h-full flex-col", className)}
    >
      <SpotlightCard
        interactive
        edge
        padding="none"
        className="flex h-full flex-col"
      >
        <div className="relative aspect-16/10 overflow-hidden">
          <Image
            src={artwork?.src ?? FALLBACK_ART}
            alt={artwork?.alt ?? `Concept artwork for ${project.title}`}
            fill
            priority={priority}
            sizes="(min-width: 1280px) 30vw, (min-width: 768px) 45vw, 92vw"
            className="object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/45 to-transparent"
          />

          <div className="absolute top-4 left-4 flex flex-wrap gap-2">
            <Pill tone="brand">{projectCategoryLabels[project.category]}</Pill>
            <Pill tone="muted">{projectStatusLabels[project.status]}</Pill>
          </div>

          {project.isDraft ? (
            <span className="absolute top-4 right-4 rounded-full border border-amber-400/40 bg-amber-500/12 px-2.5 py-1 text-caption text-amber-200">
              Details pending
            </span>
          ) : null}
        </div>

        <div className="flex flex-1 flex-col gap-4 p-5 sm:p-6">
          <div>
            <p className="text-overline text-brand-400 uppercase">{project.year}</p>
            <h3 className="mt-2 text-h3 font-semibold text-white">
              {project.title}
            </h3>
            <p className="mt-2 text-sm text-text-secondary">{project.tagline}</p>
          </div>

          <p className="text-sm text-text-muted">{project.summary}</p>

          <ul className="mt-auto flex flex-wrap gap-2">
            {project.stack.slice(0, 5).map((tech) => (
              <li key={tech}>
                <span className="chip">{tech}</span>
              </li>
            ))}
            {project.stack.length > 5 ? (
              <li>
                <span className="chip">+{project.stack.length - 5}</span>
              </li>
            ) : null}
          </ul>

          <div className="relative z-20 flex flex-wrap items-center gap-2 border-t border-white/8 pt-4">
            {liveLink ? (
              <a
                href={liveLink.href}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-glass !min-h-9 !px-3.5 !text-[0.8rem]"
              >
                <ExternalLinkIcon width={15} height={15} />
                {liveLink.label}
              </a>
            ) : null}

            {sourceLink ? (
              <a
                href={sourceLink.href}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-glass !min-h-9 !px-3.5 !text-[0.8rem]"
              >
                <CodeIcon width={15} height={15} />
                {sourceLink.label}
              </a>
            ) : null}

            {!liveLink && !sourceLink ? (
              <span className="text-caption text-text-muted">
                Repository link not provided yet
              </span>
            ) : null}

            <span className="ml-auto inline-flex items-center gap-1.5 text-caption text-brand-300 transition-transform duration-300 group-hover:translate-x-0.5">
              View details
              <ArrowUpRightIcon width={15} height={15} />
            </span>
          </div>
        </div>
      </SpotlightCard>

      {/* Stretched link: makes the whole card navigable without nesting anchors. */}
      <Link
        href={`/projects/${project.slug}`}
        className="absolute inset-0 z-10 rounded-[var(--radius-glass)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-400"
        aria-label={`View details for ${project.title}`}
      >
        <span className="sr-only">{project.title}</span>
      </Link>
    </article>
  );
}
