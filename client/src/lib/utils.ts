/** ELYSE DEV — small shared helpers. */

export type ClassValue =
  | string
  | number
  | bigint
  | boolean
  | null
  | undefined
  | ClassValue[]
  | Record<string, boolean | null | undefined>;

/** Tiny class-name joiner (no dependency needed for this). */
export function cn(...values: ClassValue[]): string {
  const out: string[] = [];

  const walk = (value: ClassValue): void => {
    if (!value) return;
    if (
      typeof value === "string" ||
      typeof value === "number" ||
      typeof value === "bigint"
    ) {
      out.push(String(value));
      return;
    }
    if (typeof value === "boolean") return;
    if (Array.isArray(value)) {
      value.forEach(walk);
      return;
    }
    for (const [key, enabled] of Object.entries(value)) {
      if (enabled) out.push(key);
    }
  };

  values.forEach(walk);
  return out.join(" ");
}

/** "2026" → "2026"; ISO strings → readable day/month/year. */
export function formatDate(value: string | null | undefined): string {
  if (!value) return "—";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/** 1200 → "1.2k" for compact statistics. */
export function compactNumber(value: number): string {
  if (!Number.isFinite(value)) return "0";
  if (Math.abs(value) < 1000) return String(value);
  return new Intl.NumberFormat("en", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

export function pluralize(
  count: number,
  singular: string,
  plural = `${singular}s`,
): string {
  return count === 1 ? singular : plural;
}

/** Remove duplicates while keeping the original order. */
export function unique<T>(items: readonly T[]): T[] {
  return [...new Set(items)];
}

/**
 * "https://github.com/elyseprodev" → "github.com/elyseprodev"
 * Used to label GitHub links without hard-coding the handle in components.
 */
export function githubHandle(url: string): string {
  return url.replace(/^https?:\/\//, "").replace(/\/$/, "");
}

/** True for in-page anchor links ("#section"). */
export function isAnchorLink(href: string): boolean {
  return href.startsWith("#");
}

/** True for links that leave the site. */
export function isExternalLink(href: string): boolean {
  return /^(https?:)?\/\//i.test(href) || href.startsWith("mailto:");
}
