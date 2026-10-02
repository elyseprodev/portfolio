import type { ElementType, ReactNode } from "react";

import { cn } from "@/lib/utils";

interface PageContainerProps {
  children: ReactNode;
  /** Constrain to the reading measure (56rem) instead of the full rail. */
  narrow?: boolean;
  className?: string;
  as?: ElementType;
}

/** Consistent horizontal rail + max width for every page and section. */
export function PageContainer({
  children,
  narrow = false,
  className,
  as: Tag = "div",
}: PageContainerProps) {
  return (
    <Tag className={cn(narrow ? "rail-narrow" : "rail", className)}>
      {children}
    </Tag>
  );
}

interface SectionProps {
  children: ReactNode;
  id?: string;
  className?: string;
  /** Adds the vertical rhythm used between page sections. */
  spacing?: boolean;
  "aria-label"?: string;
  "aria-labelledby"?: string;
}

/** Semantic page section with the shared vertical rhythm. */
export function Section({
  children,
  id,
  className,
  spacing = true,
  ...aria
}: SectionProps) {
  return (
    <section
      id={id}
      className={cn(spacing && "section-y", "scroll-mt-28", className)}
      {...aria}
    >
      {children}
    </section>
  );
}
