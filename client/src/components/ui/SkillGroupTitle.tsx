import { cn } from "@/lib/utils";

interface SkillGroupTitleProps {
  emoji?: string;
  title: string;
  /** Heading level so the document outline stays correct on each page. */
  as?: "h2" | "h3";
  className?: string;
}

/**
 * ELYSE DEV — skill group heading.
 *
 * The pictograph is rendered in its own span marked `aria-hidden`, so screen
 * readers announce "Backend" rather than "gear Backend". Shared by the skills
 * page and the homepage preview so both stay identical.
 */
export function SkillGroupTitle({
  emoji,
  title,
  as: Heading = "h3",
  className,
}: SkillGroupTitleProps) {
  return (
    <Heading className={cn("flex items-center gap-2.5", className)}>
      {emoji ? (
        <span
          aria-hidden="true"
          className="grid size-8 shrink-0 place-items-center rounded-xl border border-white/10 bg-white/[0.05] text-[1.05rem] leading-none"
        >
          {emoji}
        </span>
      ) : null}
      <span>{title}</span>
    </Heading>
  );
}
