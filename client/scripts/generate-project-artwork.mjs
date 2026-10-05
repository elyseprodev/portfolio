#!/usr/bin/env node
/**
 * ELYSE DEV — project artwork generator.
 *
 *   node scripts/generate-project-artwork.mjs
 *
 * The portfolio ships no fabricated screenshots. Instead each project has a
 * generated glass "concept card" in the same visual language as the site, which
 * is honest about being artwork and looks deliberate in the grid.
 *
 * Replace these with real screenshots in `public/images/projects/` whenever you
 * have them — keep the same file name and nothing else needs to change.
 */
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const OUT_DIR = join(dirname(fileURLToPath(import.meta.url)), "..", "public", "images", "projects");

const W = 1280;
const H = 800;

const defs = (id, accentFrom, accentTo) => `
  <defs>
    <linearGradient id="bg${id}" x1="0" y1="0" x2="${W}" y2="${H}" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#111116"/>
      <stop offset="0.55" stop-color="#0b0b0f"/>
      <stop offset="1" stop-color="#08080b"/>
    </linearGradient>
    <linearGradient id="accent${id}" x1="0" y1="0" x2="${W}" y2="${H}" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="${accentFrom}"/>
      <stop offset="1" stop-color="${accentTo}"/>
    </linearGradient>
    <radialGradient id="glow${id}" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0" stop-color="#f97316" stop-opacity="0.30"/>
      <stop offset="1" stop-color="#f97316" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="panel${id}" x1="0" y1="0" x2="0" y2="${H}" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#ffffff" stop-opacity="0.09"/>
      <stop offset="1" stop-color="#ffffff" stop-opacity="0.02"/>
    </linearGradient>
  </defs>`;

const frame = (id, content) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img">
${defs(id, "#fdba74", "#ea580c")}
  <rect width="${W}" height="${H}" fill="url(#bg${id})"/>
  <circle cx="${W * 0.18}" cy="${H * 0.1}" r="${W * 0.42}" fill="url(#glow${id})"/>
  <g opacity="0.5" stroke="#ffffff" stroke-opacity="0.05">
    ${Array.from({ length: 15 }, (_, i) => `<path d="M${(i + 1) * 80} 0V${H}"/>`).join("")}
    ${Array.from({ length: 9 }, (_, i) => `<path d="M0 ${(i + 1) * 80}H${W}"/>`).join("")}
  </g>
${content}
</svg>
`;

const chromeDots = (x, y) =>
  [0, 1, 2]
    .map(
      (i) =>
        `<circle cx="${x + i * 22}" cy="${y}" r="5" fill="#ffffff" fill-opacity="${0.32 - i * 0.08}"/>`,
    )
    .join("");

const panel = (id, x, y, w, h, r = 22) =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="url(#panel${id})" stroke="#ffffff" stroke-opacity="0.12"/>`;

const bar = (x, y, w, h, opacity = 0.16, r = 8, fill = "#ffffff") =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${fill}" fill-opacity="${opacity}"/>`;

/** A browser/app window with a titled header. */
function window(id, title) {
  return `
  ${panel(id, 60, 70, W - 120, H - 150, 28)}
  ${chromeDots(100, 112)}
  ${bar(560, 104, 300, 16, 0.12)}
  <text x="100" y="176" fill="#ffffff" fill-opacity="0.62" font-family="ui-monospace, SFMono-Regular, Menlo, monospace" font-size="22" letter-spacing="4">${title.toUpperCase()}</text>
  <rect x="880" y="150" width="300" height="42" rx="21" fill="url(#accent${id})" fill-opacity="0.85"/>
  <rect x="910" y="165" width="240" height="12" rx="6" fill="#0b0b0f" fill-opacity="0.55"/>`;
}

const scenes = {
  /** Portfolio homepage: hero panel + cards. */
  portfolio: (id) => `
  ${window(id, "elyse dev")}
  ${panel(id, 100, 220, 560, 300)}
  ${bar(140, 262, 300, 26, 0.5)}
  ${bar(140, 306, 460, 26, 0.34)}
  ${bar(140, 356, 380, 14, 0.2)}
  ${bar(140, 382, 420, 14, 0.16)}
  <rect x="140" y="424" width="180" height="46" rx="23" fill="url(#accent${id})"/>
  <rect x="336" y="424" width="160" height="46" rx="23" fill="#ffffff" fill-opacity="0.1"/>
  ${panel(id, 700, 220, 480, 140)}
  ${bar(740, 258, 160, 14, 0.22)}
  ${bar(740, 288, 380, 20, 0.34)}
  ${bar(740, 322, 300, 14, 0.16)}
  ${panel(id, 700, 380, 480, 140)}
  ${bar(740, 418, 140, 14, 0.22)}
  ${bar(740, 448, 350, 20, 0.3)}
  ${bar(740, 482, 260, 14, 0.14)}`,

  /** Architecture: layered client / server / database blocks. */
  architecture: (id) => `
  ${window(id, "system architecture")}
  ${[
    { y: 240, label: "CLIENT", sub: "Next.js · React · Tailwind" },
    { y: 400, label: "SERVER", sub: "Express · Zod validation" },
    { y: 560, label: "DATABASE", sub: "MongoDB · Mongoose" },
  ]
    .map(
      (row) => `
  ${panel(id, 180, row.y, 920, 120)}
  <rect x="216" y="${row.y + 34}" width="52" height="52" rx="14" fill="url(#accent${id})" fill-opacity="0.9"/>
  <text x="300" y="${row.y + 56}" fill="#ffffff" fill-opacity="0.72" font-family="ui-monospace, Menlo, monospace" font-size="24" letter-spacing="3">${row.label}</text>
  <text x="300" y="${row.y + 90}" fill="#ffffff" fill-opacity="0.34" font-family="ui-sans-serif, system-ui" font-size="20">${row.sub}</text>`,
    )
    .join("")}
  <path d="M640 360V400" stroke="#f97316" stroke-opacity="0.7" stroke-width="3" stroke-dasharray="10 8"/>
  <path d="M640 520V560" stroke="#f97316" stroke-opacity="0.7" stroke-width="3" stroke-dasharray="10 8"/>`,

  /** Education dashboard: courses grid + progress. */
  dashboard: (id) => `
  ${window(id, "light education")}
  ${panel(id, 100, 220, 240, 460)}
  ${bar(130, 258, 120, 14, 0.3)}
  ${[0, 1, 2, 3, 4].map((i) => bar(130, 300 + i * 52, 180, 16, i === 1 ? 0.4 : 0.14)).join("")}
  ${panel(id, 380, 220, 800, 210)}
  <text x="420" y="286" fill="#ffffff" fill-opacity="0.62" font-family="ui-sans-serif, system-ui" font-size="30">Current term</text>
  <rect x="420" y="316" width="720" height="16" rx="8" fill="#ffffff" fill-opacity="0.1"/>
  <rect x="420" y="316" width="470" height="16" rx="8" fill="url(#accent${id})"/>
  <text x="420" y="392" fill="#ffffff" fill-opacity="0.34" font-family="ui-sans-serif, system-ui" font-size="20">8 modules in progress</text>
  ${[0, 1, 2]
    .map(
      (i) => `
  ${panel(id, 380 + i * 270, 460, 250, 220)}
  ${bar(410 + i * 270, 500, 120, 16, 0.3)}
  ${bar(410 + i * 270, 534, 190, 12, 0.16)}
  ${bar(410 + i * 270, 558, 160, 12, 0.12)}
  <rect x="${410 + i * 270}" y="620" width="180" height="12" rx="6" fill="url(#accent${id})" fill-opacity="0.7"/>`,
    )
    .join("")}`,

  /** Messaging: conversation list + thread. */
  messaging: (id) => `
  ${window(id, "campus connect")}
  ${panel(id, 100, 220, 380, 460)}
  ${[0, 1, 2, 3]
    .map(
      (i) => `
  ${panel(id, 130, 260 + i * 104, 320, 88, 18)}
  <circle cx="${176}" cy="${260 + i * 104 + 44}" r="20" fill="url(#accent${id})" fill-opacity="${0.85 - i * 0.15}"/>
  ${bar(212, 284 + i * 104, 130, 14, 0.3)}
  ${bar(212, 308 + i * 104, 200, 12, 0.16)}`,
    )
    .join("")}
  ${panel(id, 520, 220, 660, 460)}
  ${[
    { x: 560, w: 420 },
    { x: 720, w: 380 },
    { x: 560, w: 340 },
    { x: 760, w: 320 },
  ]
    .map(
      (bubble, i) => `
  <rect x="${bubble.x}" y="${268 + i * 96}" width="${bubble.w}" height="70" rx="20" fill="${
    i % 2 === 0 ? "#ffffff" : "url(#accent" + id + ")"
  }" fill-opacity="${i % 2 === 0 ? 0.08 : 0.5}"/>
  ${bar(bubble.x + 26, 292 + i * 96, bubble.w - 120, 12, 0.3)}
  ${bar(bubble.x + 26, 314 + i * 96, bubble.w - 200, 12, 0.16)}`,
    )
    .join("")}`,

  /** Video: player stage + row of media. */
  video: (id) => `
  ${window(id, "video web app")}
  ${panel(id, 100, 220, 1080, 340)}
  <rect x="140" y="260" width="1000" height="258" rx="18" fill="#000000" fill-opacity="0.45"/>
  <circle cx="640" cy="389" r="52" fill="url(#accent${id})" fill-opacity="0.9"/>
  <path d="M626 365 L672 389 L626 413 Z" fill="#0b0b0f"/>
  <rect x="140" y="470" width="1000" height="8" rx="4" fill="#ffffff" fill-opacity="0.14"/>
  <rect x="140" y="470" width="420" height="8" rx="4" fill="url(#accent${id})"/>
  ${[0, 1, 2, 3, 4]
    .map(
      (i) => `
  ${panel(id, 100 + i * 222, 600, 190, 130, 18)}
  <rect x="${132 + i * 222}" y="628" width="126" height="12" rx="6" fill="#ffffff" fill-opacity="0.22"/>
  <rect x="${132 + i * 222}" y="652" width="90" height="10" rx="5" fill="#ffffff" fill-opacity="0.12"/>`,
    )
    .join("")}`,

  /** Library: catalogue hero + shelf of collection cards. */
  library: (id) => `
  ${window(id, "book of family library")}
  ${panel(id, 100, 220, 1080, 150)}
  <rect x="140" y="264" width="540" height="52" rx="26" fill="#ffffff" fill-opacity="0.07" stroke="#ffffff" stroke-opacity="0.14"/>
  ${bar(176, 284, 250, 14, 0.24)}
  <rect x="700" y="264" width="200" height="52" rx="26" fill="url(#accent${id})" fill-opacity="0.9"/>
  ${[0, 1, 2]
    .map((i) => bar(140 + i * 340, 336, 110, 12, 0.22 - i * 0.04))
    .join("")}
  ${[0, 1, 2, 3, 4]
    .map(
      (i) => `
  ${panel(id, 100 + i * 218, 400, 196, 280, 18)}
  <rect x="${124 + i * 218}" y="428" width="64" height="92" rx="7" fill="url(#accent${id})" fill-opacity="${0.8 - i * 0.12}"/>
  ${bar(124 + i * 218, 542, 140, 14, 0.3)}
  ${bar(124 + i * 218, 568, 110, 12, 0.16)}
  ${bar(124 + i * 218, 592, 150, 12, 0.12)}`,
    )
    .join("")}`,

  /** Generic fallback artwork. */
  placeholder: (id) => `
  ${window(id, "project")}
  ${panel(id, 100, 240, 1080, 440)}
  <text x="640" y="440" fill="#ffffff" fill-opacity="0.5" font-family="ui-sans-serif, system-ui" font-size="34" text-anchor="middle">Add a real screenshot here</text>
  <text x="640" y="490" fill="#ffffff" fill-opacity="0.28" font-family="ui-sans-serif, system-ui" font-size="22" text-anchor="middle">public/images/projects/</text>
  <rect x="500" y="530" width="280" height="12" rx="6" fill="url(#accent${id})" fill-opacity="0.8"/>`,
};

const targets = [
  { file: "portfolio-home.svg", scene: "portfolio", id: "a" },
  { file: "portfolio-architecture.svg", scene: "architecture", id: "b" },
  { file: "light-education.svg", scene: "dashboard", id: "c" },
  { file: "campus-connect.svg", scene: "messaging", id: "d" },
  { file: "video-web-app.svg", scene: "video", id: "e" },
  { file: "book-of-family-library.svg", scene: "library", id: "g" },
  { file: "placeholder.svg", scene: "placeholder", id: "f" },
];

await mkdir(OUT_DIR, { recursive: true });

for (const target of targets) {
  const svg = frame(target.id, scenes[target.scene](target.id));
  await writeFile(join(OUT_DIR, target.file), `${svg}\n`, "utf8");
  console.info(`[artwork] wrote ${target.file}`);
}
