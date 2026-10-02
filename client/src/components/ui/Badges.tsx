import type { ReactNode } from "react";

import { cn } from "@/lib/utils";
import type { ServiceMeta } from "@elyse/database/types";

/** Small glass pill used for categories, statuses and metadata. */
export function Pill({
  children,
  className,
  tone = "default",
}: {
  children: ReactNode;
  className?: string;
  tone?: "default" | "brand" | "muted";
}) {
  return (
    <span
      className={cn(
        "chip",
        tone === "brand" && "chip-brand",
        tone === "muted" && "border-white/8 bg-white/[0.03] text-text-muted",
        className,
      )}
    >
      {children}
    </span>
  );
}

interface SourceBadgeProps {
  /** Where the content on this page came from. */
  source: "api" | "local";
  backend?: ServiceMeta;
  className?: string;
}

/**
 * Honest provenance label: states whether content came from the API/database or
 * from the bundled local content, and flags a degraded database.
 */
export function SourceBadge({ source, backend, className }: SourceBadgeProps) {
  const degraded = backend?.degraded ?? false;

  const label =
    source === "api"
      ? degraded
        ? "API · database degraded"
        : backend?.backend === "mongodb"
          ? "API · MongoDB"
          : "API · JSON store"
      : "Bundled content";

  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-2.5 py-1 text-caption",
        degraded
          ? "border-amber-500/35 bg-amber-500/10 text-amber-200"
          : "border-white/10 bg-white/[0.04] text-text-muted",
        className,
      )}
      title={backend?.details}
    >
      <span
        aria-hidden="true"
        className={cn(
          "size-1.5 rounded-full",
          degraded ? "bg-amber-400" : source === "api" ? "bg-emerald-400" : "bg-white/40",
        )}
      />
      {label}
    </span>
  );
}
