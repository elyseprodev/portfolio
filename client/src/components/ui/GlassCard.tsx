import type { ElementType, ReactNode } from "react";

import { cn } from "@/lib/utils";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  as?: ElementType;
  /**
   * "glass"     → standard translucent surface (default)
   * "subtle"    → softer, for large background panels
   * "solid"     → denser, for long-form text
   */
  tone?: "glass" | "subtle" | "solid";
  /** Adds hover lift + pointer highlight (pair with SpotlightCard). */
  interactive?: boolean;
  /** Draws the luminous top hairline. */
  edge?: boolean;
  padding?: "none" | "sm" | "md" | "lg";
}

const PADDING: Record<NonNullable<GlassCardProps["padding"]>, string> = {
  none: "",
  sm: "p-4 sm:p-5",
  md: "p-5 sm:p-6",
  lg: "p-6 sm:p-8",
};

export function GlassCard({
  children,
  className,
  as: Tag = "div",
  tone = "glass",
  interactive = false,
  edge = false,
  padding = "md",
}: GlassCardProps) {
  return (
    <Tag
      className={cn(
        tone === "subtle" ? "glass-subtle" : tone === "solid" ? "glass-solid" : "glass",
        "relative overflow-hidden",
        edge && "glass-edge",
        interactive && "glass-interactive",
        PADDING[padding],
        className,
      )}
    >
      {children}
    </Tag>
  );
}
