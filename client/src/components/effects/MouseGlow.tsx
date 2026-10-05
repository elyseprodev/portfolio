"use client";

/**
 * ELYSE DEV — ambient pointer glow.
 *
 * A restrained orange light that trails the pointer behind the content. It is
 * transform-only (GPU friendly), never intercepts events and is disabled on
 * touch devices and when reduced motion is requested.
 */
import { motion, useMotionValue, useSpring } from "motion/react";

import { usePointerEffectsEnabled, usePointerSample } from "@/lib/hooks";

export function MouseGlow() {
  const enabled = usePointerEffectsEnabled();

  const x = useMotionValue(-500);
  const y = useMotionValue(-500);
  const opacity = useMotionValue(0);

  const springX = useSpring(x, { stiffness: 90, damping: 22, mass: 0.9 });
  const springY = useSpring(y, { stiffness: 90, damping: 22, mass: 0.9 });
  const springOpacity = useSpring(opacity, { stiffness: 120, damping: 30 });

  usePointerSample(
    ({ x: clientX, y: clientY }) => {
      x.set(clientX);
      y.set(clientY);
      opacity.set(0.55);
    },
    enabled,
  );

  if (!enabled) return null;

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed top-0 left-0 hidden md:block"
      style={{
        x: springX,
        y: springY,
        opacity: springOpacity,
        width: "34rem",
        height: "34rem",
        marginLeft: "-17rem",
        marginTop: "-17rem",
        zIndex: "var(--z-background)" as unknown as number,
        background:
          "radial-gradient(circle at center, rgba(249,115,22,0.14) 0%, rgba(249,115,22,0.06) 38%, transparent 68%)",
      }}
    />
  );
}
