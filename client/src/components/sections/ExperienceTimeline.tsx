import Link from "next/link";

import { RevealOnScroll } from "@/components/motion/RevealOnScroll";
import { SpotlightCard } from "@/components/ui/SpotlightCard";
import { Pill } from "@/components/ui/Badges";
import {
  BookIcon,
  BriefcaseIcon,
  CodeIcon,
  CompassIcon,
  GraduationIcon,
} from "@/components/ui/icons";
import { experienceKindLabels } from "@/content/experience";
import type { ExperienceEntry } from "@elyse/database/types";

const KIND_ICON = {
  education: GraduationIcon,
  project: CodeIcon,
  learning: BookIcon,
  work: BriefcaseIcon,
} as const;

interface ExperienceTimelineProps {
  entries: ExperienceEntry[];
}

/**
 * ELYSE DEV — experience timeline.
 *
 * Entries are split into confirmed history and items that still need real
 * information. The second group is listed as an editable checklist rather than
 * being rendered as if it were verified experience.
 */
export function ExperienceTimeline({ entries }: ExperienceTimelineProps) {
  const confirmed = entries.filter((entry) => !entry.isPlaceholder);
  const pending = entries.filter((entry) => entry.isPlaceholder);

  return (
    <div className="space-y-14">
      <ol className="relative space-y-5 border-l border-white/10 pl-5 sm:pl-8">
        {confirmed.map((entry, index) => {
          const Icon = KIND_ICON[entry.kind] ?? CompassIcon;
          return (
            <RevealOnScroll as="li" key={entry.id} delay={index * 90}>
              <span
                aria-hidden="true"
                className="absolute -left-[9px] mt-7 grid size-4 place-items-center rounded-full border border-brand-500/50 bg-ink-950"
              >
                <span className="size-1.5 rounded-full bg-brand-500" />
              </span>

              <SpotlightCard padding="lg">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <span
                      aria-hidden="true"
                      className="grid size-11 shrink-0 place-items-center rounded-xl border border-brand-500/25 bg-brand-500/10 text-brand-300"
                    >
                      <Icon width={20} height={20} />
                    </span>
                    <div>
                      <Pill tone="brand">{experienceKindLabels[entry.kind]}</Pill>
                      <h3 className="mt-3 text-h4 font-semibold text-white">
                        {entry.title}
                      </h3>
                      <p className="mt-1 text-sm text-text-secondary">
                        {[entry.organisation, entry.location]
                          .filter(Boolean)
                          .join(" · ")}
                      </p>
                    </div>
                  </div>

                  {entry.period ? (
                    <span className="chip chip-brand">{entry.period}</span>
                  ) : null}
                </div>

                <p className="mt-5 text-sm text-text-secondary pretty-text">
                  {entry.summary}
                </p>

                {entry.highlights.length ? (
                  <ul className="mt-5 grid gap-2.5 sm:grid-cols-2">
                    {entry.highlights.map((highlight) => (
                      <li
                        key={highlight}
                        className="flex items-start gap-2.5 text-sm text-text-muted"
                      >
                        <span
                          aria-hidden="true"
                          className="mt-1.5 size-1.5 shrink-0 rounded-full bg-brand-500/80"
                        />
                        {highlight}
                      </li>
                    ))}
                  </ul>
                ) : null}
              </SpotlightCard>
            </RevealOnScroll>
          );
        })}
      </ol>

      {pending.length ? (
        <RevealOnScroll>
          <div className="glass-subtle rounded-glass-lg p-5 sm:p-7">
            <div className="flex flex-wrap items-center gap-3">
              <Pill tone="muted">Editable placeholders</Pill>
              <h2 className="text-h4 font-semibold text-white">
                Sections waiting for your information
              </h2>
            </div>

            <p className="mt-4 max-w-3xl text-sm text-text-secondary pretty-text">
              These entries are intentionally empty. This portfolio does not
              invent employers, dates or certificates, so add them in{" "}
              <code className="rounded bg-white/8 px-1.5 py-0.5 font-mono text-[0.78rem] text-brand-200">
                client/src/content/experience.ts
              </code>{" "}
              (then run{" "}
              <code className="rounded bg-white/8 px-1.5 py-0.5 font-mono text-[0.78rem] text-brand-200">
                npm run db:sync
              </code>
              ) and they will appear above automatically.
            </p>

            <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {pending.map((entry) => (
                <li key={entry.id} className="rounded-2xl border border-dashed border-white/15 p-4">
                  <p className="text-[0.66rem] tracking-[0.14em] text-text-muted uppercase">
                    {experienceKindLabels[entry.kind]}
                  </p>
                  <p className="mt-2 text-sm font-medium text-white">
                    {entry.title.replace(/ — add.*$/i, "")}
                  </p>
                  <p className="mt-1.5 text-caption text-text-muted">
                    {entry.summary.split(".")[0]}.
                  </p>
                </li>
              ))}
            </ul>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/contact" className="btn btn-glass !min-h-10 !px-4 !text-[0.84rem]">
                Send me the details to add
              </Link>
            </div>
          </div>
        </RevealOnScroll>
      ) : null}
    </div>
  );
}
