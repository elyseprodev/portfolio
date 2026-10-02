#!/usr/bin/env node
/**
 * ELYSE DEV ACADEMY — course artwork generator.
 *
 *   node scripts/generate-course-artwork.mjs
 *
 * The academy ships no stock photography for its courses. Each language gets a
 * generated cover in the same visual language as the rest of the site: a dark
 * glass panel, the language mark drawn large, the language name, and a code
 * motif whose rhythm differs per level. Track artwork uses the same engine with
 * a wider layout.
 *
 * Output: `public/images/courses/<slug>.svg` and `public/images/courses/tracks/<track>.svg`.
 * Replace any file with a real photograph or screenshot of the same name and the
 * site picks it up with no code change.
 */
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = join(here, "..", "public", "images", "courses");

const W = 1200;
const H = 750;

/** Slight per-index variation so a page of covers never looks like one image. */
const VARIANTS = [
  { glowX: 0.16, glowY: 0.08, angle: -8, offset: 0 },
  { glowX: 0.82, glowY: 0.14, angle: 6, offset: 40 },
  { glowX: 0.5, glowY: 0.02, angle: 0, offset: 80 },
  { glowX: 0.24, glowY: 0.3, angle: 10, offset: 120 },
  { glowX: 0.74, glowY: 0.34, angle: -6, offset: 160 },
];

const defs = (id, variant) => {
  const glowX = W * variant.glowX;
  const glowY = H * variant.glowY;
  return `
  <defs>
    <linearGradient id="bg${id}" x1="0" y1="0" x2="${W}" y2="${H}" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#121218"/>
      <stop offset="0.55" stop-color="#0b0b0f"/>
      <stop offset="1" stop-color="#08080b"/>
    </linearGradient>
    <radialGradient id="glow${id}" cx="${glowX}" cy="${glowY}" r="${W * 0.62}" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#f97316" stop-opacity="0.34"/>
      <stop offset="0.55" stop-color="#f97316" stop-opacity="0.10"/>
      <stop offset="1" stop-color="#f97316" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="accent${id}" x1="0" y1="0" x2="${W}" y2="0" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#fdba74"/>
      <stop offset="1" stop-color="#ea580c"/>
    </linearGradient>
    <clipPath id="clip${id}">
      <rect x="72" y="60" width="${W - 144}" height="${H - 150}" rx="34"/>
    </clipPath>
    <linearGradient id="panel${id}" x1="0" y1="0" x2="0" y2="${H}" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#ffffff" stop-opacity="0.10"/>
      <stop offset="1" stop-color="#ffffff" stop-opacity="0.02"/>
    </linearGradient>
  </defs>`;
};

const escapeXml = (value) =>
  value.replace(/[<>&"']/g, (character) => {
    switch (character) {
      case "<":
        return "&lt;";
      case ">":
        return "&gt;";
      case "&":
        return "&amp;";
      case '"':
        return "&quot;";
      default:
        return "&apos;";
    }
  });

/** Deterministic pseudo-random so the artwork is reproducible. */
function seeded(seed) {
  let state = 0;
  for (const character of seed) state = (state * 31 + character.charCodeAt(0)) % 100000;
  return () => {
    state = (state * 1103515245 + 12345) % 2147483648;
    return state / 2147483648;
  };
}

const LEVEL_BARS = { beginner: 2, intermediate: 3, advanced: 4 };

function courseArtwork(course, variant) {
  const id = course.slug.slice(0, 6);
  const random = seeded(course.slug);
  const bars = LEVEL_BARS[course.level] ?? 3;

  const codeLines = Array.from({ length: 9 }, (_, index) => {
    const width = 120 + Math.round(random() * 320);
    const opacity = 0.06 + random() * 0.14;
    return `<rect x="${96 + (index % 3) * 30}" y="${470 + index * 26}" width="${width}" height="10" rx="5" fill="#ffffff" fill-opacity="${opacity.toFixed(2)}"/>`;
  }).join("\n  ");

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="${escapeXml(`Generated artwork for the ${course.language} course`)}">
${defs(id, variant)}
  <rect width="${W}" height="${H}" fill="url(#bg${id})"/>
  <rect width="${W}" height="${H}" fill="url(#glow${id})"/>
  <g opacity="0.35" stroke="#ffffff" stroke-opacity="0.045">
    ${Array.from({ length: 14 }, (_, i) => `<path d="M${(i + 1) * 80} 0V${H}"/>`).join("")}
    ${Array.from({ length: 9 }, (_, i) => `<path d="M0 ${(i + 1) * 80}H${W}"/>`).join("")}
  </g>

  <g transform="rotate(${variant.angle * 0.15} ${W * 0.5} ${H * 0.5})">
    <!-- glass panel -->
    <rect x="72" y="60" width="${W - 144}" height="${H - 150}" rx="34" fill="url(#panel${id})" stroke="#ffffff" stroke-opacity="0.12"/>
    <circle cx="126" cy="110" r="6" fill="#ffffff" fill-opacity="0.28"/>
    <circle cx="150" cy="110" r="6" fill="#ffffff" fill-opacity="0.18"/>
    <circle cx="174" cy="110" r="6" fill="#ffffff" fill-opacity="0.10"/>
    <rect x="${W - 300}" y="94" width="180" height="32" rx="16" fill="url(#accent${id})" fill-opacity="0.85"/>

    <!-- mark -->
    <text x="120" y="360" fill="#ffffff" fill-opacity="0.92" font-family="ui-monospace, SFMono-Regular, Menlo, monospace" font-size="150" font-weight="700" letter-spacing="2">${escapeXml(course.mark)}</text>
    <rect x="124" y="392" width="${120 + bars * 44}" height="8" rx="4" fill="url(#accent${id})"/>

    <!-- language + level -->
    <text x="120" y="452" fill="#ffffff" fill-opacity="0.66" font-family="ui-sans-serif, system-ui, Segoe UI, sans-serif" font-size="38">${escapeXml(course.language)}</text>
    <g transform="translate(120 486)">
      ${Array.from({ length: 4 }, (_, index) => `<rect x="${index * 26}" y="0" width="18" height="8" rx="4" fill="${index < bars ? "#f97316" : "#ffffff"}" fill-opacity="${index < bars ? 0.9 : 0.14}"/>`).join("")}
    </g>

    <!-- code motif, right column, clipped to the glass panel -->
    <g clip-path="url(#clip${id})">
      <g transform="translate(${W - 560} 0) rotate(${variant.angle * 0.4} 280 470)">
        ${codeLines}
      </g>
    </g>
  </g>
</svg>
`;
}

function trackArtwork(track, index) {
  const variant = VARIANTS[index % VARIANTS.length];
  const id = `t${track.id.slice(0, 4)}`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 420" width="1600" height="420" role="img" aria-label="${escapeXml(`Generated artwork for the ${track.name} track`)}">
${defs(id, variant)}
  <rect width="1600" height="420" fill="url(#bg${id})"/>
  <rect width="1600" height="420" fill="url(#glow${id})"/>
  <rect x="48" y="40" width="${1600 - 96}" height="340" rx="30" fill="url(#panel${id})" stroke="#ffffff" stroke-opacity="0.12"/>
  <text x="110" y="230" fill="#ffffff" fill-opacity="0.92" font-family="ui-sans-serif, system-ui, Segoe UI, sans-serif" font-size="64" font-weight="600">${escapeXml(track.name)}</text>
  <rect x="112" y="262" width="240" height="8" rx="4" fill="url(#accent${id})"/>
  <text x="${1600 - 300}" y="230" fill="#ffffff" fill-opacity="0.24" font-family="ui-monospace, SFMono-Regular, Menlo, monospace" font-size="120" font-weight="700" text-anchor="end">${String(index + 1).padStart(2, "0")}</text>
</svg>
`;
}

async function main() {
  const { courses, courseTracks } = await import("../../client/src/content/courses.ts").catch(
    async () => await import(join(here, "..", "src", "content", "courses.ts")),
  );

  await mkdir(OUT_DIR, { recursive: true });
  await mkdir(join(OUT_DIR, "tracks"), { recursive: true });

  for (const [index, course] of courses.entries()) {
    const variant = VARIANTS[index % VARIANTS.length];
    await writeFile(join(OUT_DIR, `${course.slug}.svg`), courseArtwork(course, variant), "utf8");
  }
  for (const [index, track] of courseTracks.entries()) {
    await writeFile(
      join(OUT_DIR, "tracks", `${track.id}.svg`),
      trackArtwork(track, index),
      "utf8",
    );
  }

  console.info(
    `[artwork] wrote ${courses.length} course covers and ${courseTracks.length} track banners`,
  );
}

main().catch((error) => {
  console.error("[artwork] failed:", error);
  process.exitCode = 1;
});
