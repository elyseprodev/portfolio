import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  overline?: string;
  title: ReactNode;
  description?: ReactNode;
  /** Optional action rendered on the right at desktop widths. */
  action?: ReactNode;
  align?: "left" | "center";
  /** Heading level — keeps the document outline correct per page. */
  as?: "h2" | "h3";
  id?: string;
  className?: string;
}

export function SectionHeading({
  overline,
  title,
  description,
  action,
  align = "left",
  as: Heading = "h2",
  id,
  className,
}: SectionHeadingProps) {
  const centered = align === "center";

  return (
    <div
      className={cn(
        "flex flex-col gap-5",
        Boolean(!centered && action) && "md:flex-row md:items-end md:justify-between",
        centered && "items-center text-center",
        className,
      )}
    >
      <div className={cn("max-w-2xl", centered && "mx-auto")}>
        {overline ? (
          <p className="text-overline font-medium text-brand-400 uppercase">
            <span className="mr-2 inline-block h-1.5 w-1.5 -translate-y-0.5 rounded-full bg-brand-500 align-middle" />
            {overline}
          </p>
        ) : null}
        <Heading
          id={id}
          className="mt-3 text-h2 font-semibold text-balance text-white"
        >
          {title}
        </Heading>
        {description ? (
          <p className="mt-4 text-lead text-text-secondary pretty-text">
            {description}
          </p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}
