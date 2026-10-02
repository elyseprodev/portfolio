"use client";

/**
 * ELYSE DEV — custom cursor.
 *
 * • A small solid dot follows the pointer closely; a glass ring trails it with
 *   spring interpolation (no abrupt jumps).
 * • The ring grows and warms over interactive elements, driven by a
 *   `data-cursor` attribute rather than one listener per element.
 * • Touch devices, reduced-motion visitors and browsers without a fine pointer
 *   keep the native cursor untouched: `cursor: none` is only applied through
 *   `body[data-custom-cursor="on"]`, which this component sets after mount.
 * • The layer is `pointer-events: none` and `aria-hidden`, so it can never
 *   block clicks, selection, focus or screen readers.
 */
import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";

import { usePointerEffectsEnabled, usePointerSample } from "@/lib/hooks";

type CursorVariant = "default" | "link" | "button" | "card" | "text";

const RING_SIZE: Record<CursorVariant, number> = {
  default: 30,
  link: 46,
  button: 58,
  card: 68,
  text: 22,
};

export function CustomCursor() {
  const enabled = usePointerEffectsEnabled();
  const [variant, setVariant] = useState<CursorVariant>("default");
  const [pressed, setPressed] = useState(false);
  const [visible, setVisible] = useState(false);

  const dotX = useMotionValue(-100);
  const dotY = useMotionValue(-100);
  const ringX = useMotionValue(-100);
  const ringY = useMotionValue(-100);

  const dotSpringX = useSpring(dotX, { stiffness: 1100, damping: 60, mass: 0.3 });
  const dotSpringY = useSpring(dotY, { stiffness: 1100, damping: 60, mass: 0.3 });
  const ringSpringX = useSpring(ringX, { stiffness: 240, damping: 26, mass: 0.6 });
  const ringSpringY = useSpring(ringY, { stiffness: 240, damping: 26, mass: 0.6 });

  usePointerSample(
    ({ x, y }) => {
      dotX.set(x);
      dotY.set(y);
      ringX.set(x);
      ringY.set(y);
      setVisible((current) => (current ? current : true));
    },
    enabled,
  );

  /* Only hide the native cursor once this component is actually running. */
  useEffect(() => {
    if (!enabled) return;
    document.body.dataset.customCursor = "on";
    return () => {
      delete document.body.dataset.customCursor;
    };
  }, [enabled]);

  /* Variant detection through a single delegated listener. */
  useEffect(() => {
    if (!enabled) return;

    const resolve = (target: EventTarget | null): CursorVariant => {
      if (!(target instanceof Element)) return "default";
      const owner = target.closest<HTMLElement>("[data-cursor]");
      const value = owner?.dataset.cursor as CursorVariant | undefined;
      if (value) return value;
      if (target.closest("a[href]")) return "link";
      if (target.closest("button, [role='button'], input, select, textarea")) {
        return "button";
      }
      return "default";
    };

    const onOver = (event: PointerEvent) => setVariant(resolve(event.target));
    const onOut = (event: PointerEvent) => {
      if (!event.relatedTarget) setVisible(false);
    };
    const onDown = () => setPressed(true);
    const onUp = () => setPressed(false);

    document.addEventListener("pointerover", onOver, { passive: true });
    document.addEventListener("pointerout", onOut, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });

    return () => {
      document.removeEventListener("pointerover", onOver);
      document.removeEventListener("pointerout", onOut);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
    };
  }, [enabled]);

  if (!enabled) return null;

  const ringSize = RING_SIZE[variant] * (pressed ? 0.82 : 1);
  const ringOpacity = visible ? (pressed ? 0.95 : 0.7) : 0;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0"
      style={{ zIndex: "var(--z-cursor)" as unknown as number }}
    >
      {/* Outer glass ring */}
      <motion.div
        className="absolute top-0 left-0 rounded-full border backdrop-blur-[1px]"
        style={{
          x: ringSpringX,
          y: ringSpringY,
          width: ringSize,
          height: ringSize,
          marginLeft: -ringSize / 2,
          marginTop: -ringSize / 2,
          borderColor:
            variant === "default"
              ? "rgba(255,255,255,0.35)"
              : "rgba(249,115,22,0.75)",
          backgroundColor:
            variant === "default"
              ? "rgba(255,255,255,0.04)"
              : "rgba(249,115,22,0.10)",
          boxShadow:
            variant === "default"
              ? "0 0 0 1px rgba(255,255,255,0.05), 0 8px 30px -12px rgba(0,0,0,0.7)"
              : "0 0 0 1px rgba(249,115,22,0.18), 0 10px 34px -12px rgba(249,115,22,0.55)",
          opacity: ringOpacity,
          transitionProperty: "width, height, border-color, background-color, box-shadow, opacity",
          transitionDuration: "260ms",
          transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
        }}
      />

      {/* Inner dot */}
      <motion.div
        className="absolute top-0 left-0 rounded-full"
        style={{
          x: dotSpringX,
          y: dotSpringY,
          width: variant === "text" ? 4 : 6,
          height: variant === "text" ? 18 : 6,
          marginLeft: variant === "text" ? -2 : -3,
          marginTop: variant === "text" ? -9 : -3,
          backgroundColor:
            variant === "default" ? "rgba(255,255,255,0.92)" : "#fb923c",
          boxShadow: "0 0 12px 1px rgba(249,115,22,0.55)",
          opacity: visible ? 1 : 0,
          transition: "opacity 200ms linear, background-color 220ms linear",
        }}
      />
    </div>
  );
}
