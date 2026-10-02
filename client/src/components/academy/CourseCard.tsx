import Image from "next/image";
import Link from "next/link";

import { Pill } from "@/components/ui/Badges";
import { SpotlightCard } from "@/components/ui/SpotlightCard";
import { cn } from "@/lib/utils";
import {
  courseLevelLabels,
  courseStatusLabels,
  getTrackById,
} from "@/content/courses";
import type { CourseStatus, CourseSummary } from "@elyse/database/types";

const STATUS_TONES: Record<CourseStatus, string> = {
  available: "border-emerald-400/35 bg-emerald-500/12 text-emerald-200",
  "in-development": "border-brand-400/35 bg-brand-500/12 text-brand-200",
  planned: "border-white/12 bg-white/[0.04] text-text-muted",
};

/**
 * ELYSE DEV — academy course card.
 *
 * The whole card is a link, so the target is one tap on a phone and one click
 * on a desktop. Status is stated, never implied: a course that is not finished
 * says so on its card, not only on its detail page.
 */
export function CourseCard({
  course,
  priority = false,
  className,
}: {
  course: CourseSummary;
  priority?: boolean;
  className?: string;
}) {
  const track = getTrackById(course.trackId);

  return (
    <article data-cursor="card" className={cn("group relative flex h-full", className)}>
      <SpotlightCard interactive edge padding="none" className="flex h-full flex-col">
        <div className="relative aspect-16/10 overflow-hidden">
          <Image
            src={course.image}
            alt={`Generated cover artwork for the ${course.language} course`}
            fill
            priority={priority}
            sizes="(min-width: 1280px) 30vw, (min-width: 768px) 45vw, 92vw"
            className="object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/40 to-transparent"
          />

          <div className="absolute top-4 left-4 flex flex-wrap gap-2">
            <Pill tone="muted">{courseLevelLabels[course.level]}</Pill>
            <Pill className={STATUS_TONES[course.status]}>
              {courseStatusLabels[course.status]}
            </Pill>
          </div>

          <div className="absolute inset-x-4 bottom-3 flex items-end justify-between gap-3">
            <span className="font-display-numeric text-2xl font-bold text-white">
              {course.mark}
            </span>
            <span className="text-caption text-text-muted">
              {track ? `${track.emoji ? `${track.emoji} ` : ""}${track.name}` : ""}
            </span>
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-3 p-5 sm:p-6">
          <h3 className="text-h4 font-semibold text-white">
            <Link
              href={`/academy/${course.slug}`}
              className="focus-visible:outline-brand-400 after:absolute after:inset-0 after:content-['']"
            >
              {course.language}
            </Link>
          </h3>
          <p className="text-sm text-text-muted pretty-text">{course.tagline}</p>

          <dl className="mt-auto grid grid-cols-3 gap-3 border-t border-white/8 pt-4 text-center">
            <div>
              <dt className="text-[0.66rem] tracking-[0.12em] text-text-muted uppercase">
                Weeks
              </dt>
              <dd className="font-display-numeric text-sm font-semibold text-white">
                {course.weeks}
              </dd>
            </div>
            <div>
              <dt className="text-[0.66rem] tracking-[0.12em] text-text-muted uppercase">
                Hours
              </dt>
              <dd className="font-display-numeric text-sm font-semibold text-white">
                {course.hours}
              </dd>
            </div>
            <div>
              <dt className="text-[0.66rem] tracking-[0.12em] text-text-muted uppercase">
                Modules
              </dt>
              <dd className="font-display-numeric text-sm font-semibold text-white">
                {course.moduleCount}
              </dd>
            </div>
          </dl>
        </div>
      </SpotlightCard>
    </article>
  );
}
