"use client";

/**
 * ELYSE DEV — global effects host.
 *
 * Mounted once in the root layout so every route shares the same pointer
 * effects. The children never re-render because of pointer movement: each
 * effect owns its own motion values and the shared pointer stream is a module
 * level subscription (see `lib/pointer.ts`).
 */
import { CustomCursor } from "./CustomCursor";
import { MouseGlow } from "./MouseGlow";

export function EffectsRoot() {
  return (
    <>
      <MouseGlow />
      <CustomCursor />
    </>
  );
}
