"use client";

/**
 * ELYSE DEV — page transition.
 *
 * A CSS animation (not a JS animation library) keyed on the route, which means:
 *   • the incoming route fades and lifts into place on every navigation
 *   • content is visible even if JavaScript never finishes loading
 *   • `prefers-reduced-motion` neutralises it through the global CSS rules
 *   • browser history, direct URLs and back navigation are untouched
 */
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import "./page-transition.css";

export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div key={pathname} className="page-transition">
      {children}
    </div>
  );
}
