"use client";

/**
 * ELYSE DEV — pointer-responsive glass card.
 *
 * A glass surface whose specular highlight follows the pointer. Updates are
 * batched into a single requestAnimationFrame, so a fast pointer costs one
 * style write per frame. On touch devices nothing is attached at all.
 */
import { useCallback, useRef, type ReactNode } from "react";

import { cn } from "@/lib/utils";
import { usePointerEffectsEnabled } from "@/lib/hooks";

interface SpotlightCardProps {
  children: ReactNode;
  className?: string;
  tone?: "glass" | "subtle" | "solid";
  padding?: "none" | "sm" | "md" | "lg";
  edge?: boolean;
  /** Disable the lift/highlight (e.g. for static informational cards). */
  interactive?: boolean;
}

const PADDING: Record<NonNullable<SpotlightCardProps["padding"]>, string> = {
  none: "",
  sm: "p-4 sm:p-5",
  md: "p-5 sm:p-6",
  lg: "p-6 sm:p-8",
};

export function SpotlightCard({
  children,
  className,
  tone = "glass",
  padding = "md",
  edge = false,
  interactive = true,
}: SpotlightCardProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const frame = useRef<number | null>(null);
  const enabled = usePointerEffectsEnabled();

  const handlePointerMove = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (!enabled || !interactive) return;
      const element = ref.current;
      if (!element) return;

      const { clientX, clientY } = event;
      if (frame.current !== null) return;

      frame.current = window.requestAnimationFrame(() => {
        frame.current = null;
        const rect = element.getBoundingClientRect();
        element.style.setProperty("--spot-x", `${clientX - rect.left}px`);
        element.style.setProperty("--spot-y", `${clientY - rect.top}px`);
      });
    },
    [enabled, interactive],
  );

  return (
    <div
      ref={ref}
      onPointerMove={handlePointerMove}
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
    </div>
  );
}
