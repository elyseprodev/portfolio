# Accessibility — what was measured, not just intended

Two scripts produce the numbers in this document. Both are runnable, and both fail the build
if the guarantees regress:

```bash
npm run check:contrast     # WCAG 2.1 contrast maths for every text/surface pairing
npm run audit              # audits 13 rendered routes over HTTP
```

---

## 1. Contrast (measured: `npm run check:contrast`)

Text sits on translucent glass, so the checker blends the real colour stack — page background
`#08080B`, panel colour `#0C0C0F` at 55 % (or 82 % for dense panels), plus the white gradient
overlay — and measures the **effective** surface. The sampled surfaces are:

| Surface                       | Effective colour |
| ----------------------------- | ---------------- |
| Glass panel over the page     | `#141417`        |
| Dense glass panel             | `#131316`        |
| Brand-tinted pill             | `#25150C`        |

Results (all pairs must clear WCAG AA; the script exits non-zero otherwise):

| Pairing                                          | Ratio    | Required | Result |
| ------------------------------------------------ | -------- | -------- | ------ |
| White text on page background                    | 20.00:1  | 4.5:1    | PASS   |
| White text on glass / dense panel                | 18.39:1 / 18.61:1 | 4.5:1 | PASS |
| Secondary text (`#D1D5DB`) — page / glass / panel | 13.57 / 12.48 / 12.63:1 | 4.5:1 | PASS |
| Muted text (`#9CA3AF`) — page / glass / panel     | 7.88 / 7.24 / 7.33:1 | 4.5:1 | PASS |
| Orange overline (small caps) — page / glass       | 8.84 / 8.12:1 | 4.5:1 | PASS |
| Amber accent text (`brand-300`) on page           | 11.86:1  | 4.5:1    | PASS   |
| Brand-200 label on a brand pill                   | 13.04:1  | 4.5:1    | PASS   |
| Dark button label on the orange fill (and hover)  | 7.01:1 / 8.68:1 | 4.5:1 | PASS |
| Primary button fill vs page (control boundary)    | 7.14:1   | 3:1      | PASS   |
| Focus ring vs page / vs glass (focus indicator)   | 8.84 / 8.12:1 | 3:1 | PASS   |
| Glass button hairline vs page                     | 2.31:1   | —        | INFO   |
| Decorative panel hairline vs page                 | 1.53:1   | —        | INFO   |

**A real defect this found and fixed:** white text on `#F97316` measured **2.80:1** — below AA
for button labels. The primary CTA now uses a near-black label (`#0B0B0F`) on the *unchanged*
vivid orange fill, which measures **7.01:1** (8.68:1 on hover). The brand colour is preserved;
only the label direction changed. The icon badge inside buttons now tints with `currentColor`
so it stays correct on both variants.

**The two INFO rows are deliberate.** WCAG 1.4.11 requires 3:1 for boundaries *needed to
identify a control*. Structural glass hairlines here are decorative: panels group content, and
every interactive element is identified by its own shape, fill, label text, hover feedback and
a focus ring that measures 8.84:1. Raising every hairline to 3:1 would require near-white
borders on a dark glass UI, which contradicts the approved visual identity. Rather than claim a
pass that is not real, the script measures and reports these rows without enforcing them — and
control boundaries that *do* carry meaning (the primary button fill, the focus ring, form
control borders) are enforced. Form input borders were strengthened (12 % → 20 % white) and
glass button borders to 22 % white during this work to improve real-world legibility.

Text over the animated background is safe for the same reason: panels sit at ≥ 55 % opacity and
the orbs are radial gradients capped at 16 % orange, so the sampled `#141417` surface is
representative of the lightest case.

---

## 2. Rendered-page audit (measured: `npm run audit`)

Fetches all 13 routes from a running server (9 pages, 4 project detail routes, robots,
manifest, Open Graph image, plus the 404) and asserts:

| Check                                                  | Result |
| ------------------------------------------------------ | ------ |
| Exactly one `<h1>` per page                            | 13/13  |
| `<html lang="en">`, `<title>`, meta description, viewport | 13/13 |
| `header`, `nav`, `main`, `footer` landmarks            | 13/13  |
| Skip-to-content link                                   | 13/13  |
| Every `<img>` has an `alt` attribute                   | 13/13  |
| Every form control has a `<label for>` or `aria-label` | 13/13  |
| No duplicate DOM ids                                   | 13/13  |
| No dead `href="#"` links                               | 13/13  |
| `target="_blank"` links carry `rel="noopener"`         | 13/13  |
| Internal nav marks the current page (`aria-current`)   | 13/13  |
| Draft projects visibly labelled "Details pending"       | 13/13  |
| Unknown route returns 404 with the branded page        | PASS   |

The audit was validated with a **negative control**: a temporary page containing five
deliberate violations (no `h1`, an `<img>` without `alt`, an unlabelled `<input>`, duplicate
ids, `href="#"`) was audited and every violation was caught, then the page was removed. The
checker is not passing vacuously.

```
$ npm run audit
[audit] passed — 13 routes checked, 0 warning(s).
```

---

## 3. Interaction & motion

* **Reduced motion:** `prefers-reduced-motion` neutralises page transitions, scroll reveals,
  background drift, the float animation, smooth scrolling and every pointer effect. A
  `<noscript>` block cancels reveal animations, so content is visible without JavaScript.
* **Custom cursor:** the native cursor is only hidden after the effect mounts
  (`body[data-custom-cursor="on"]`) and only on devices with a fine pointer and hover support.
  Touch devices keep their native cursor, and the effect never replaces interaction feedback —
  it is `pointer-events: none`, `aria-hidden`, and lives above decoration but below browser UI.
* **Focus visibility:** a 2 px `brand-400` outline with 3 px offset (`:focus-visible`) is
  applied globally; on-glass contrast for that ring is 8.12:1.
* **Keyboard:** the mobile menu is a labelled dialog that traps nothing (it is a single panel),
  autofocuses its first link, closes on <kbd>Esc</kbd> and returns focus to the trigger. The
  project filter chips are real buttons with `aria-pressed`, and filter results are announced
  through an `aria-live="polite"` count. The contact form moves focus to the first invalid
  field and announces the error summary.
* **Status is never colour-only:** badges carry text labels ("Details pending", "Curated list",
  "Live GitHub data"), and API state is spelled out in the footer instead of relying on a dot.

---

## 4. Deliberate decisions

| Decision | Reason |
| --- | --- |
| No light theme | Requested identity is dark liquid glass; a light variant would need a second full palette to stay AA, and the brief says to keep dark as the approved design. `color-scheme: dark` is declared so form controls and scrollbars match. |
| Decorative hairlines below 3:1 | Documented above — measured and reported, but enforced only where WCAG actually requires it. |
| `next/font` (Geist) instead of a font CDN | Self-hosted fonts avoid a third-party request, layout shift and a privacy question. |
| Rate limiting by salted fingerprint, not IP | The throttle works without storing personal data; verified by `server/tests/rate-limit.test.ts`. |
| No animation library for reveals | IntersectionObserver + CSS keeps the effect cheap and works with JS-disabled reveal fallbacks; Motion is used only for spring-based pointer interpolation. |

## 5. Known gaps

* **No automated screen-reader pass.** The audit checks structure (landmarks, labels, heading
  order, alt text) but cannot judge reading order or announcement quality. A manual pass with
  NVDA/VoiceOver is the remaining step, and is listed in `CONTENT-CHECKLIST.md`.
* **No real-browser test run.** The build environment has no Chromium and blocks browser CDNs,
  so checks are HTML/CSS-level rather than visual. Lighthouse should be run against the
  deployed site as a final step.
