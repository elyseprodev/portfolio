/**
 * ELYSE DEV — animated global background.
 *
 * Layers (all CSS only, no JavaScript, no scroll listeners):
 *   1. deep charcoal → black gradient
 *   2. two slow-drifting ambient orange orbs (radial gradients, no blur filter)
 *   3. a masked technical grid
 *   4. a static vignette to protect text contrast
 *
 * Animations are transform-only and stop entirely under
 * `prefers-reduced-motion` (see globals.css).
 */
export function AnimatedBackground() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      {/* base gradient */}
      <div className="absolute inset-0 bg-[linear-gradient(170deg,#0c0c11_0%,#08080b_38%,#0a0a0e_72%,#06060a_100%)]" />

      {/* ambient orbs — radial gradients instead of blur() to stay cheap */}
      <div
        className="orb animate-drift-slow"
        style={{
          top: "-14%",
          left: "-8%",
          width: "min(58rem, 92vw)",
          height: "min(58rem, 92vw)",
          background:
            "radial-gradient(circle at center, rgba(249,115,22,0.16) 0%, rgba(249,115,22,0.06) 42%, transparent 70%)",
        }}
      />
      <div
        className="orb animate-drift-slower"
        style={{
          bottom: "-22%",
          right: "-12%",
          width: "min(52rem, 88vw)",
          height: "min(52rem, 88vw)",
          background:
            "radial-gradient(circle at center, rgba(251,146,60,0.12) 0%, rgba(234,88,12,0.05) 45%, transparent 72%)",
        }}
      />
      <div
        className="orb animate-pulse-soft"
        style={{
          top: "38%",
          left: "52%",
          width: "min(38rem, 70vw)",
          height: "min(38rem, 70vw)",
          background:
            "radial-gradient(circle at center, rgba(255,255,255,0.05) 0%, transparent 68%)",
        }}
      />

      {/* technical grid */}
      <div className="grid-veil absolute inset-0 opacity-70" />

      {/* readability vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_115%_85%_at_50%_-10%,transparent_35%,rgba(6,6,10,0.72)_100%)]" />
    </div>
  );
}
