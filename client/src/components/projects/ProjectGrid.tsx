"use client";

/**
 * ELYSE DEV — filterable project grid.
 *
 * Planning notes:
 *   • The filter row only appears when there is more than one category, so a
 *     portfolio with three projects never shows a pointless control.
 *   • Filtering is local state over data that was already fetched on the
 *     server — no request per keystroke.
 *   • The result count is announced politely for screen-reader users.
 */
import { useMemo, useState } from "react";

import { ProjectCard } from "./ProjectCard";
import { RevealOnScroll } from "@/components/motion/RevealOnScroll";
import { CloseIcon, FilterIcon, SearchIcon } from "@/components/ui/icons";
import { projectCategoryLabels } from "@/content/projects";
import type { Project, ProjectCategory } from "@elyse/database/types";
import { cn } from "@/lib/utils";

type FilterValue = ProjectCategory | "all";

export function ProjectGrid({ projects }: { projects: Project[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<FilterValue>("all");

  const categories = useMemo(() => {
    const available = new Set(projects.map((project) => project.category));
    return [...available];
  }, [projects]);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();

    return projects.filter((project) => {
      if (category !== "all" && project.category !== category) return false;
      if (!needle) return true;

      return [project.title, project.tagline, project.summary, ...project.stack]
        .join(" ")
        .toLowerCase()
        .includes(needle);
    });
  }, [projects, category, query]);

  const filtersActive = category !== "all" || query.trim().length > 0;

  return (
    <div>
      <div className="glass-subtle flex flex-col gap-4 rounded-glass p-4 sm:p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <label htmlFor="project-search" className="sr-only">
              Search projects by name, description or technology
            </label>
            <SearchIcon
              width={17}
              height={17}
              className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-text-muted"
            />
            <input
              id="project-search"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by name, description or technology…"
              className="w-full rounded-full border border-white/12 bg-ink-950/60 py-2.5 pr-4 pl-10 text-sm text-white placeholder:text-text-muted focus:border-brand-500/50 focus:outline-none"
            />
          </div>

          {filtersActive ? (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setCategory("all");
              }}
              className="btn btn-ghost !min-h-10 !px-4 !text-[0.82rem]"
            >
              <CloseIcon width={15} height={15} />
              Clear filters
            </button>
          ) : null}
        </div>

        {categories.length > 1 ? (
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 pr-1 text-caption text-text-muted">
              <FilterIcon width={14} height={14} />
              Filter
            </span>
            {(["all", ...categories] as FilterValue[]).map((value) => {
              const active = category === value;
              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => setCategory(value)}
                  aria-pressed={active}
                  className={cn(
                    "chip",
                    active && "chip-brand border-brand-500/50",
                  )}
                >
                  {value === "all" ? "All projects" : projectCategoryLabels[value]}
                  <span className="text-text-muted">
                    {value === "all"
                      ? projects.length
                      : projects.filter((project) => project.category === value)
                          .length}
                  </span>
                </button>
              );
            })}
          </div>
        ) : null}
      </div>

      <p aria-live="polite" className="mt-5 text-caption text-text-muted">
        {filtered.length} of {projects.length} project
        {projects.length === 1 ? "" : "s"} shown
        {category !== "all" ? ` · ${projectCategoryLabels[category]}` : ""}
        {query.trim() ? ` · matching “${query.trim()}”` : ""}
      </p>

      {filtered.length ? (
        <ul className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((project, index) => (
            <RevealOnScroll
              as="li"
              key={project.slug}
              delay={Math.min(index, 5) * 90}
              className="h-full"
            >
              <ProjectCard project={project} />
            </RevealOnScroll>
          ))}
        </ul>
      ) : (
        <div className="glass-subtle mt-5 rounded-glass p-8 text-center">
          <p className="text-h4 font-medium text-white">No projects match yet</p>
          <p className="mx-auto mt-2 max-w-md text-sm text-text-secondary">
            Nothing matches that combination. Try a different search term, or
            clear the filters to see everything.
          </p>
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setCategory("all");
            }}
            className="btn btn-glass mt-5"
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
}
