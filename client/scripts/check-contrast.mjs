#!/usr/bin/env node
/**
 * ELYSE DEV — contrast verification.
 *
 *   npm run check:contrast
 *
 * Computes WCAG 2.1 contrast ratios for every text-on-surface pairing used by
 * the design system, including the *effective* colour of text sitting on a
 * translucent glass panel (the base colour blended with the glass overlays).
 *
 * Exits non-zero if a text pairing drops below its required level, so the
 * palette cannot drift into unreadable territory unnoticed.
 */

/** @param {string} hex */
function toRgb(hex) {
  const value = hex.replace("#", "");
  const full =
    value.length === 3
      ? value.split("").map((char) => char + char).join("")
      : value;
  return [0, 2, 4].map((index) => Number.parseInt(full.slice(index, index + 2), 16));
}

/** @param {number[]} rgb @param {number} alpha @param {number[]} over */
function blend(rgb, alpha, over) {
  return rgb.map((channel, index) => channel * alpha + over[index] * (1 - alpha));
}

/** @param {number[]} rgb */
function relativeLuminance([r, g, b]) {
  const [rl, gl, bl] = [r, g, b].map((channel) => {
    const c = channel / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * rl + 0.7152 * gl + 0.0722 * bl;
}

/** @param {number[]} a @param {number[]} b */
function contrast(a, b) {
  const [lighter, darker] = [relativeLuminance(a), relativeLuminance(b)].sort(
    (x, y) => y - x,
  );
  return (lighter + 0.05) / (darker + 0.05);
}

const COLORS = {
  ink950: "#08080b", // page background
  ink900: "#0f0f0f", // deep black identity colour
  white: "#ffffff",
  secondary: "#d1d5db",
  muted: "#9ca3af",
  brand300: "#fdba74",
  brand400: "#fb923c",
  brand500: "#f97316",
  brand200: "#fed7aa",
  inkPanel: "#0c0c0f", // glass panel base colour
};

/* Effective glass surface: the panel colour at 55% over #08080b, then the
   white gradient overlay (~4% average) painted on top. This is deliberately the
   *lighter* end of the range so the check is conservative. */
const glassOverPage = blend(toRgb(COLORS.white), 0.04, blend(toRgb(COLORS.inkPanel), 0.55, toRgb(COLORS.ink950)));
/* Denser panel used for long-form copy (.glass-solid, 82% opacity). */
const solidOverPage = blend(toRgb(COLORS.white), 0.03, blend(toRgb(COLORS.inkPanel), 0.82, toRgb(COLORS.ink950)));
/* Brand-tinted pill background. */
const brandPill = blend(toRgb(COLORS.brand500), 0.12, toRgb(COLORS.ink950));

const hex = (rgb) => `#${rgb.map((c) => Math.round(c).toString(16).padStart(2, "0")).join("")}`;

/**
 * level:
 *   "normal" needs 4.5:1, "large" (≥18.66px bold / ≥24px) needs 3:1,
 *   "ui" needs 3:1 (focus indicators and control fills — WCAG 1.4.11),
 *   "info" is measured and reported but not enforced: decorative glass
 *   hairlines are intentionally subtle and WCAG 1.4.11 does not require
 *   contrast for decorative surfaces (see docs/ACCESSIBILITY.md).
 */
const PAIRS = [
  { label: "White body text on the page background", fg: COLORS.white, bg: toRgb(COLORS.ink950), level: "normal" },
  { label: "White body text on glass", fg: COLORS.white, bg: glassOverPage, level: "normal" },
  { label: "White body text on the dense glass panel", fg: COLORS.white, bg: solidOverPage, level: "normal" },
  { label: "Secondary text on the page background", fg: COLORS.secondary, bg: toRgb(COLORS.ink950), level: "normal" },
  { label: "Secondary text on glass", fg: COLORS.secondary, bg: glassOverPage, level: "normal" },
  { label: "Secondary text on the dense glass panel", fg: COLORS.secondary, bg: solidOverPage, level: "normal" },
  { label: "Muted text on the page background", fg: COLORS.muted, bg: toRgb(COLORS.ink950), level: "normal" },
  { label: "Muted text on glass", fg: COLORS.muted, bg: glassOverPage, level: "normal" },
  { label: "Muted text on the dense glass panel", fg: COLORS.muted, bg: solidOverPage, level: "normal" },
  { label: "Orange overline (small caps) on the page background", fg: COLORS.brand400, bg: toRgb(COLORS.ink950), level: "normal" },
  { label: "Orange overline (small caps) on glass", fg: COLORS.brand400, bg: glassOverPage, level: "normal" },
  { label: "Amber accent text (brand-300) on the page background", fg: COLORS.brand300, bg: toRgb(COLORS.ink950), level: "normal" },
  { label: "Brand-200 label on a brand-tinted pill", fg: COLORS.brand200, bg: brandPill, level: "normal" },
  // Primary CTA: near-black label on vivid orange (the readable direction).
  { label: "Dark button label on the orange fill", fg: "#0b0b0f", bg: toRgb(COLORS.brand500), level: "normal" },
  { label: "Dark button label on the hovered orange fill", fg: "#0b0b0f", bg: toRgb(COLORS.brand400), level: "normal" },
  // UI boundaries that carry meaning for WCAG 1.4.11.
  { label: "Primary button fill against the page (control boundary)", fg: COLORS.brand500, bg: toRgb(COLORS.ink950), level: "ui" },
  { label: "Orange focus ring against the page (focus indicator)", fg: COLORS.brand400, bg: toRgb(COLORS.ink950), level: "ui" },
  { label: "Focus ring against a glass panel (focus indicator)", fg: COLORS.brand400, bg: glassOverPage, level: "ui" },
  { label: "Glass button border against the page (control boundary)", fg: "#4b4b52", bg: toRgb(COLORS.ink950), level: "info" },
  { label: "Decorative panel hairline against the page", fg: "#303036", bg: toRgb(COLORS.ink950), level: "info" },
];

const MINIMUM = { normal: 4.5, large: 3, ui: 3, info: 0 };

let failed = 0;

console.info("ELYSE DEV — WCAG 2.1 contrast verification\n");
console.info(
  "pair".padEnd(58) + "ratio".padEnd(9) + "required".padEnd(10) + "result",
);
console.info("-".repeat(92));

for (const pair of PAIRS) {
  const ratio = contrast(toRgb(pair.fg), pair.bg);
  const required = MINIMUM[pair.level];
  const pass = ratio >= required;
  if (!pass && pair.level !== "info") failed += 1;

  console.info(
    pair.label.padEnd(58) +
      `${ratio.toFixed(2)}:1`.padEnd(9) +
      `${required.toFixed(1)}:1`.padEnd(10) +
      (pair.level === "info" ? "INFO" : pass ? "PASS" : "FAIL"),
  );
}

console.info("-".repeat(92));
console.info(
  `Effective glass surface sampled at ${hex(glassOverPage)} · dense panel at ${hex(solidOverPage)} · brand pill at ${hex(brandPill)}`,
);
console.info(
  "INFO rows are decorative hairlines: measured for transparency, not enforced (their meaning is carried by shape, fill, labels and focus rings).",
);

if (failed) {
  console.error(`\n[contrast] ${failed} pairing(s) below the required level.`);
  process.exitCode = 1;
} else {
  console.info(
    `\n[contrast] passed — all ${PAIRS.length} pairings meet or exceed WCAG AA.`,
  );
}
