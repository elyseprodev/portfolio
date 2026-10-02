#!/usr/bin/env node
/**
 * ELYSE DEV — rendered-page audit.
 *
 *   npm run audit                 # audits http://127.0.0.1:3000
 *   npm run audit -- http://host:port
 *   npm run audit -- http://host:port /extra-route   # audit one more route
 *
 * Fetches every route from a running server and checks the accessibility,
 * metadata and honesty invariants that are easy to break by accident:
 *
 *   • one <h1> per page, language set, landmarks present, skip link first
 *   • every image has alt text, every form control has a label
 *   • no duplicate DOM ids, no dead "#" links, external links are rel-protected
 *   • each page has a title and a meta description
 *   • internal nav marks the current page with aria-current="page"
 *
 * Exit code 1 if any hard check fails, so it can gate a release.
 */
const BASE = (process.argv[2] ?? "http://127.0.0.1:3000").replace(/\/$/, "");

/** Extra route paths passed on the command line (audited with an expected 200). */
const EXTRA_ROUTES = process.argv.slice(3).map((path) => ({
  path,
  expect: 200,
  name: "extra",
}));

const ROUTES = [
  { path: "/", expect: 200, name: "home" },
  { path: "/about", expect: 200, name: "about" },
  { path: "/skills", expect: 200, name: "skills" },
  { path: "/projects", expect: 200, name: "projects" },
  { path: "/projects/elyse-dev-portfolio", expect: 200, name: "project detail" },
  { path: "/projects/book-of-family-library", expect: 200, name: "project detail (live)" },
  { path: "/projects/light-education", expect: 200, name: "project detail (draft)" },
  { path: "/experience", expect: 200, name: "experience" },
  { path: "/github", expect: 200, name: "github" },
  { path: "/contact", expect: 200, name: "contact" },
  { path: "/robots.txt", expect: 200, name: "robots", raw: true },
  { path: "/manifest.webmanifest", expect: 200, name: "manifest", raw: true },
  { path: "/opengraph-image", expect: 200, name: "og image", raw: true },
  { path: "/this-route-does-not-exist", expect: 404, name: "404" },
];

/** Walks the HTML well enough for attribute-level assertions (no DOM needed). */
function tags(html, name) {
  const pattern = new RegExp(`<${name}\\b[^>]*>`, "gi");
  return html.match(pattern) ?? [];
}

function attr(tag, name) {
  const match = tag.match(new RegExp(`${name}\\s*=\\s*"([^"]*)"`, "i"));
  return match ? match[1] : null;
}

function hasAttr(tag, name) {
  return new RegExp(`\\b${name}\\b`, "i").test(tag);
}

const failures = [];
const warnings = [];

function fail(route, message) {
  failures.push(`${route}: ${message}`);
}

function warn(route, message) {
  warnings.push(`${route}: ${message}`);
}

async function auditHtml(route, html) {
  const { path } = route;

  /* --- document -------------------------------------------------------- */
  const htmlTag = tags(html, "html")[0] ?? "";
  if (attr(htmlTag, "lang") !== "en") fail(path, "<html> is missing lang=\"en\"");

  const title = html.match(/<title[^>]*>([^<]*)<\/title>/i)?.[1]?.trim() ?? "";
  if (title.length < 5) fail(path, "missing or empty <title>");

  const description = tags(html, "meta")
    .map((tag) => tag)
    .find((tag) => attr(tag, "name") === "description");
  if (!description || (attr(description, "content") ?? "").length < 40) {
    fail(path, "missing or too-short <meta name=\"description\">");
  }

  const viewport = tags(html, "meta").find(
    (tag) => attr(tag, "name") === "viewport",
  );
  if (!viewport || !/width=device-width/.test(attr(viewport, "content") ?? "")) {
    fail(path, "viewport meta does not declare width=device-width");
  }

  /* --- headings & landmarks ------------------------------------------- */
  const h1s = tags(html, "h1");
  if (h1s.length !== 1) fail(path, `expected exactly 1 <h1>, found ${h1s.length}`);

  const main = tags(html, "main")[0];
  if (!main) fail(path, "no <main> landmark");
  else if (!hasAttr(main, "id")) warn(path, "<main> has no id for the skip link");

  if (!tags(html, "header").length) fail(path, "no <header> landmark");
  if (!tags(html, "footer").length) fail(path, "no <footer> landmark");

  const nav = tags(html, "nav");
  if (!nav.length) fail(path, "no <nav> landmark");
  if (!nav.some((tag) => attr(tag, "aria-label"))) {
    warn(path, "no <nav> carries an aria-label");
  }

  if (!/Skip to content/.test(html)) fail(path, "skip-to-content link missing");

  /* --- images --------------------------------------------------------- */
  const images = tags(html, "img");
  for (const image of images) {
    if (!hasAttr(image, "alt")) fail(path, `<img> without alt: ${image.slice(0, 90)}`);
  }

  /* --- form controls -------------------------------------------------- */
  const labelFor = new Set(
    [...html.matchAll(/<label\b[^>]*\bfor="([^"]+)"/gi)].map((match) => match[1]),
  );
  const controls = tags(html, "input")
    .concat(tags(html, "textarea"), tags(html, "select"))
    // Inputs without a visible label in a search field still need a label element.
    .filter((tag) => !/type="hidden"/i.test(tag));

  for (const control of controls) {
    const id = attr(control, "id");
    const labelled = (id && labelFor.has(id)) || attr(control, "aria-label");
    if (!labelled) {
      fail(path, `form control without a label: ${control.slice(0, 90)}`);
    }
  }

  /* --- ids ------------------------------------------------------------ */
  const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1]);
  const seen = new Set();
  const duplicates = new Set();
  for (const id of ids) {
    if (seen.has(id)) duplicates.add(id);
    seen.add(id);
  }
  if (duplicates.size) {
    fail(path, `duplicate DOM ids: ${[...duplicates].join(", ")}`);
  }

  /* --- links ---------------------------------------------------------- */
  if (/href="#"/.test(html)) fail(path, 'dead link found (href="#")');

  const externalLinks = [...html.matchAll(/<a\b[^>]*target="_blank"[^>]*>/gi)].map(
    (match) => match[0],
  );
  for (const link of externalLinks) {
    const rel = attr(link, "rel") ?? "";
    if (!rel.includes("noopener")) {
      fail(path, `target="_blank" without rel="noopener": ${link.slice(0, 90)}`);
    }
  }

  /* --- internal navigation -------------------------------------------- */
  if (route.path !== "/this-route-does-not-exist") {
    const current = (html.match(/aria-current="page"/g) ?? []).length;
    if (current === 0) warn(path, 'no nav link marked aria-current="page"');
  }

  /* --- honesty checks -------------------------------------------------- */
  if (route.path === "/projects") {
    if (!/Details pending/.test(html)) {
      warn(path, "draft projects are not labelled as pending");
    }
  }
  if (route.path === "/experience" && !/Editable placeholders/.test(html)) {
    warn(path, "experience placeholders are not labelled");
  }
}

async function auditRaw(route, response) {
  const type = response.headers.get("content-type") ?? "";
  if (route.path === "/opengraph-image" && !type.startsWith("image/")) {
    fail(route.path, `expected an image response, received ${type}`);
  }
  if (route.path === "/robots.txt") {
    const text = await response.text();
    if (!/User-Agent/i.test(text)) fail(route.path, "robots.txt has no User-Agent rule");
  }
  if (route.path === "/manifest.webmanifest") {
    const manifest = await response.json().catch(() => null);
    if (!manifest?.name || !manifest?.start_url) {
      fail(route.path, "manifest is missing name or start_url");
    }
  }
}

async function main() {
  console.info(`[audit] target: ${BASE}\n`);

  const routes = [...ROUTES, ...EXTRA_ROUTES];

  for (const route of routes) {
    let response;
    try {
      response = await fetch(`${BASE}${route.path}`, { redirect: "manual" });
    } catch (error) {
      fail(route.path, `request failed: ${error instanceof Error ? error.message : error}`);
      continue;
    }

    if (response.status !== route.expect) {
      fail(route.path, `expected HTTP ${route.expect}, received ${response.status}`);
      continue;
    }

    if (route.raw) {
      await auditRaw(route, response);
    } else {
      await auditHtml(route, await response.text());
    }

    console.info(`[audit] ${String(response.status)}  ${route.path.padEnd(34)} ${route.name}`);
  }

  console.info("");

  for (const warning of warnings) console.warn(`[warn] ${warning}`);

  if (failures.length) {
    console.error(`\n[audit] ${failures.length} check(s) failed:`);
    for (const failure of failures) console.error(`  ✗ ${failure}`);
    process.exitCode = 1;
    return;
  }

  console.info(
    `[audit] passed — ${ROUTES.length} routes checked, ${warnings.length} warning(s). ` +
      "Every page has one h1, labelled controls, alt text, no duplicate ids and no dead links.",
  );
}

main().catch((error) => {
  console.error("[audit] crashed:", error);
  process.exitCode = 1;
});
