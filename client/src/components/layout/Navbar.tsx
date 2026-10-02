"use client";

/**
 * ELYSE DEV — primary navigation.
 *
 * Sticky glass bar that becomes denser once the page is scrolled. The desktop
 * menu shows the active route with an animated underline; below `lg` the menu
 * collapses into an accessible dialog panel (see MobileNavigation).
 */
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { MobileNavigation } from "./MobileNavigation";
import { MenuIcon } from "@/components/ui/icons";
import { navItems, site } from "@/content/site";
import { cn } from "@/lib/utils";

export function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-60 focus:rounded-full focus:bg-brand-500 focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-white"
      >
        Skip to content
      </a>

      <header className="fixed inset-x-0 top-0 z-40 pt-3 sm:pt-4">
        <div className="rail">
          <div
            className={cn(
              "flex items-center justify-between gap-4 rounded-full px-3 py-2 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] sm:px-4",
              "glass glass-subtle",
            )}
          >
            {/* Wordmark */}
            <Link
              href="/"
              className="group flex items-center gap-2.5 rounded-full py-1 pr-2 pl-1"
              aria-label={`${site.name} — home`}
            >
              <span
                aria-hidden="true"
                className="relative grid size-9 place-items-center rounded-xl border border-brand-500/40 bg-gradient-to-br from-brand-500/30 to-brand-700/10 font-mono text-[0.78rem] font-semibold text-brand-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.18)] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
              >
                ED
                <span className="absolute -inset-px rounded-xl bg-brand-500/10 opacity-0 blur-[6px] transition-opacity duration-500 group-hover:opacity-100" />
              </span>
              <span className="flex flex-col leading-none">
                <span className="text-[0.95rem] font-semibold tracking-tight text-white">
                  ELYSE <span className="text-brand-400">DEV</span>
                </span>
                <span className="mt-0.5 hidden text-[0.66rem] tracking-[0.14em] text-text-muted uppercase sm:block">
                  {site.role.split(" ").slice(0, 2).join(" ")}
                </span>
              </span>
            </Link>

            {/* Desktop navigation */}
            <nav aria-label="Main" className="hidden lg:block">
              <ul className="flex items-center gap-1">
                {navItems.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={isActive(item.href) ? "page" : undefined}
                      className="nav-link inline-block rounded-full px-3 py-2 text-sm"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="flex items-center gap-2">
              <Link
                href="/contact"
                className="btn btn-primary !min-h-10 !px-4 !text-[0.86rem] max-sm:hidden"
              >
                Let&apos;s work together
              </Link>

              <button
                type="button"
                onClick={() => setMenuOpen(true)}
                aria-expanded={menuOpen}
                aria-controls="mobile-navigation"
                aria-label="Open navigation menu"
                className="btn btn-glass !min-h-10 !w-10 !px-0 lg:hidden"
              >
                <MenuIcon />
              </button>
            </div>
          </div>
        </div>
      </header>

      <MobileNavigation
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        items={navItems}
        pathname={pathname}
        github={site.github}
      />
    </>
  );
}
