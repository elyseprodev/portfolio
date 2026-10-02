"use client";

/**
 * ELYSE DEV — scroll reveal.
 *
 * IntersectionObserver based (no scroll listeners, no animation library).
 * The element is revealed once and then unobserved. Under
 * `prefers-reduced-motion` the CSS forces the revealed state, and a
 * `<noscript>` rule in the root layout keeps content visible without JS.
 */
import { useEffect, useRef, useState } from "react";
import type { ElementType, ReactNode } from "react";

import { cn } from "@/lib/utils";

interface RevealOnScrollProps {
  children: ReactNode;
  /** Stagger delay in milliseconds. */
  delay?: number;
  className?: string;
  /** Rendered element — keep the semantics right (section, li, article…). */
  as?: ElementType;
  /** Reveal distance in pixels. */
  distance?: number;
}

export function RevealOnScroll({
  children,
  delay = 0,
  className,
  as: Tag = "div",
  distance = 22,
}: RevealOnScrollProps) {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }

    // Already in view on mount (above the fold): reveal immediately.
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.unobserve(entry.target);
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      data-visible={visible ? "true" : "false"}
      className={cn("reveal", className)}
      style={
        {
          "--reveal-delay": `${delay}ms`,
          "--reveal-distance": `${distance}px`,
        } as React.CSSProperties
      }
    >
      {children}
    </Tag>
  );
}
