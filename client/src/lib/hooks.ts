"use client";

/**
 * ELYSE DEV — shared client hooks.
 */
import { useCallback, useEffect, useRef, useState } from "react";
import {
  canHover,
  hasFinePointer,
  prefersReducedMotion,
  subscribePointer,
  type PointerSample,
} from "./pointer";

/** Subscribes to the shared pointer stream. */
export function usePointerSample(
  listener: (sample: PointerSample) => void,
  enabled = true,
): void {
  const saved = useRef(listener);
  saved.current = listener;

  useEffect(() => {
    if (!enabled) return;
    return subscribePointer((sample) => saved.current(sample));
  }, [enabled]);
}

/** Reactive media-query hook with SSR-safe defaults. */
export function useMediaQuery(queryString: string, fallback = false): boolean {
  const [matches, setMatches] = useState(fallback);

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const list = window.matchMedia(queryString);
    setMatches(list.matches);

    const onChange = (event: MediaQueryListEvent) => setMatches(event.matches);
    list.addEventListener("change", onChange);
    return () => list.removeEventListener("change", onChange);
  }, [queryString]);

  return matches;
}

/** True when decorative pointer-driven effects may run. */
export function usePointerEffectsEnabled(): boolean {
  const fine = useMediaQuery("(pointer: fine)");
  const hover = useMediaQuery("(hover: hover)");
  const reduced = useMediaQuery("(prefers-reduced-motion: reduce)");
  const [resolved, setResolved] = useState(false);

  useEffect(() => {
    // Re-evaluate once after hydration: SSR cannot know the input device.
    setResolved(true);
  }, []);

  if (!resolved) return false;
  return fine && hover && !reduced;
}

/** True once the page has been scrolled past `threshold` pixels. */
export function useScrolled(threshold = 24): boolean {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > threshold);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, [threshold]);

  return scrolled;
}

/**
 * Tracks which in-page section is currently in view — used by the homepage
 * navigation rail. Uses IntersectionObserver rather than scroll maths.
 */
export function useActiveSection(sectionIds: readonly string[]): string | null {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    if (!sectionIds.length || typeof IntersectionObserver === "undefined") {
      return;
    }

    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter((element): element is HTMLElement => Boolean(element));

    if (!elements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        const first = visible[0];
        if (first?.target.id) setActive(first.target.id);
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: [0, 0.25, 0.6, 1] },
    );

    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [sectionIds]);

  return active;
}

/** Locks body scroll (used by the mobile menu) and restores it on unmount. */
export function useScrollLock(locked: boolean): void {
  useEffect(() => {
    if (!locked) return;
    const { overflow, paddingRight } = document.body.style;
    const scrollbar = window.innerWidth - document.documentElement.clientWidth;

    document.body.style.overflow = "hidden";
    if (scrollbar > 0) document.body.style.paddingRight = `${scrollbar}px`;

    return () => {
      document.body.style.overflow = overflow;
      document.body.style.paddingRight = paddingRight;
    };
  }, [locked]);
}

/** Calls `onEscape` when Escape is pressed while `active`. */
export function useEscapeKey(active: boolean, onEscape: () => void): void {
  const saved = useRef(onEscape);
  saved.current = onEscape;

  useEffect(() => {
    if (!active) return;
    const handler = (event: KeyboardEvent) => {
      if (event.key === "Escape") saved.current();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [active]);
}

/**
 * Magnetic attraction for interactive elements.
 * Returns a ref plus pointer handlers to spread onto the element.
 */
export function useMagnetic(strength = 12) {
  const ref = useRef<HTMLElement | null>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [supported, setSupported] = useState(false);

  useEffect(() => {
    setSupported(hasFinePointer() && canHover() && !prefersReducedMotion());
  }, []);

  const onPointerMove = useCallback(
    (event: React.PointerEvent<HTMLElement>) => {
      if (!supported) return;
      const element = ref.current;
      if (!element) return;
      const rect = element.getBoundingClientRect();
      const relX = (event.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
      const relY = (event.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);
      setOffset({
        x: Math.max(-1, Math.min(1, relX)) * strength,
        y: Math.max(-1, Math.min(1, relY)) * strength * 0.6,
      });
    },
    [strength, supported],
  );

  const onPointerLeave = useCallback(() => setOffset({ x: 0, y: 0 }), []);

  return { ref, offset, onPointerMove, onPointerLeave, supported };
}
