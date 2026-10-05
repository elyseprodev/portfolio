"use client";

/**
 * ELYSE DEV — mobile navigation panel.
 *
 * • `aria-modal` dialog semantics with a focus handover on open
 * • Escape closes, focus returns to the trigger, body scroll is locked
 * • the panel closes automatically after a link is chosen
 */
import Link from "next/link";
import { useEffect, useRef } from "react";

import type { NavItem } from "@/content/site";
import { CloseIcon, GitHubIcon } from "@/components/ui/icons";
import { useEscapeKey, useScrollLock } from "@/lib/hooks";
import { cn } from "@/lib/utils";

interface MobileNavigationProps {
  open: boolean;
  onClose: () => void;
  items: NavItem[];
  pathname: string;
  github: string;
}

export function MobileNavigation({
  open,
  onClose,
  items,
  pathname,
  github,
}: MobileNavigationProps) {
  const panelRef = useRef<HTMLDivElement | null>(null);
  const firstLinkRef = useRef<HTMLAnchorElement | null>(null);

  useScrollLock(open);
  useEscapeKey(open, onClose);

  useEffect(() => {
    if (!open) return;
    // Move focus into the panel so keyboard users are not left behind it.
    const timeout = window.setTimeout(() => firstLinkRef.current?.focus(), 40);
    return () => window.clearTimeout(timeout);
  }, [open]);

  return (
    <div
      id="mobile-navigation"
      role="dialog"
      aria-modal="true"
      aria-label="Site navigation"
      hidden={!open}
      className={cn(
        "fixed inset-0 z-50 lg:hidden",
        open ? "pointer-events-auto" : "pointer-events-none",
      )}
    >
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Close navigation"
        onClick={onClose}
        className={cn(
          "absolute inset-0 h-full w-full bg-ink-950/70 backdrop-blur-sm transition-opacity duration-300",
          open ? "opacity-100" : "opacity-0",
        )}
        tabIndex={open ? 0 : -1}
      />

      <div
        ref={panelRef}
        className={cn(
          "glass glass-solid absolute inset-x-3 top-3 rounded-glass-lg p-5 transition-[opacity,transform] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
          open ? "translate-y-0 opacity-100" : "-translate-y-3 opacity-0",
        )}
      >
        <div className="flex items-center justify-between gap-4">
          <span className="text-overline font-medium tracking-[0.18em] text-brand-400 uppercase">
            Navigate
          </span>
          <button
            type="button"
            onClick={onClose}
            className="btn btn-glass !min-h-9 !px-3 text-caption"
          >
            <CloseIcon width={16} height={16} />
            Close
          </button>
        </div>

        <div className="hairline my-4" />

        <nav aria-label="Mobile">
          <ul className="flex flex-col gap-1">
            {items.map((item, index) => {
              const matches = (prefix: string) =>
                prefix === "/" ? pathname === "/" : pathname.startsWith(prefix);
              const active =
                matches(item.href) || (item.related ?? []).some(matches);

              return (
                <li key={item.href}>
                  <Link
                    ref={index === 0 ? firstLinkRef : undefined}
                    href={item.href}
                    onClick={onClose}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "group flex items-baseline justify-between gap-4 rounded-2xl px-3 py-3 transition-colors duration-200",
                      active
                        ? "bg-brand-500/12 text-white"
                        : "text-text-secondary hover:bg-white/5 hover:text-white",
                    )}
                  >
                    <span className="text-h4 font-medium">{item.label}</span>
                    <span className="text-caption text-text-muted group-hover:text-text-secondary">
                      {item.hint}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="hairline my-4" />

        <div className="flex flex-wrap items-center gap-3">
          <Link href="/contact" onClick={onClose} className="btn btn-primary flex-1">
            Start a conversation
          </Link>
          <a
            href={github}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-glass"
            aria-label="GitHub profile (opens in a new tab)"
          >
            <GitHubIcon width={18} height={18} />
            GitHub
          </a>
        </div>
      </div>
    </div>
  );
}
