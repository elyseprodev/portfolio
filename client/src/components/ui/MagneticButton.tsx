"use client";

/**
 * ELYSE DEV — magnetic button.
 *
 * Applies a gentle attraction towards the pointer (a few pixels, never more),
 * then springs back on leave. Disabled entirely on touch devices and under
 * `prefers-reduced-motion` (the wrapper then renders as a plain element).
 */
import Link from "next/link";
import type { ReactNode } from "react";

import { buttonClasses, type ButtonSize, type ButtonVariant } from "./Button";
import { useMagnetic } from "@/lib/hooks";
import { cn, isExternalLink } from "@/lib/utils";

interface MagneticButtonProps {
  href: string;
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  icon?: ReactNode;
  external?: boolean;
  /** Attraction distance in pixels (default 10). */
  strength?: number;
}

export function MagneticButton({
  href,
  children,
  variant = "glass",
  size = "md",
  className,
  icon,
  external,
  strength = 10,
}: MagneticButtonProps) {
  const { ref, offset, onPointerMove, onPointerLeave, supported } = useMagnetic(strength);
  const leavesSite = external ?? isExternalLink(href);
  const classes = buttonClasses(variant, size, cn("group/btn", className));

  const inner = (
    <>
      {children}
      {icon ? (
        <span
          aria-hidden="true"
          className="ml-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-white/12 transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/btn:translate-x-0.5"
        >
          {icon}
        </span>
      ) : null}
    </>
  );

  const style = supported
    ? { transform: `translate3d(${offset.x}px, ${offset.y}px, 0)` }
    : undefined;

  const commonProps = {
    ref: ref as React.Ref<HTMLAnchorElement>,
    onPointerMove,
    onPointerLeave,
    style,
    className: cn(
      classes,
      "transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
    ),
  };

  if (leavesSite) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" {...commonProps}>
        {inner}
      </a>
    );
  }

  return (
    <Link href={href} {...commonProps}>
      {inner}
    </Link>
  );
}
