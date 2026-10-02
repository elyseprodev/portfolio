/**
 * ELYSE DEV — shared pointer infrastructure.
 *
 * A single set of global listeners is shared by every pointer effect (custom
 * cursor, ambient glow, magnetic buttons, card reflections). Listeners are
 * reference-counted, so nothing is left attached after a component unmounts and
 * no effect adds its own duplicate `pointermove` handler.
 */

export interface PointerSample {
  x: number;
  y: number;
  /** Movement since the previous sample, in pixels. */
  dx: number;
  dy: number;
}

type PointerListener = (sample: PointerSample) => void;

const listeners = new Set<PointerListener>();
let attached = false;
let lastX = Number.NaN;
let lastY = Number.NaN;

function emit(event: PointerEvent): void {
  const x = event.clientX;
  const y = event.clientY;
  const dx = Number.isNaN(lastX) ? 0 : x - lastX;
  const dy = Number.isNaN(lastY) ? 0 : y - lastY;
  lastX = x;
  lastY = y;

  for (const listener of listeners) listener({ x, y, dx, dy });
}

function handlePointerLeave(): void {
  lastX = Number.NaN;
  lastY = Number.NaN;
}

function attach(): void {
  if (attached || typeof window === "undefined") return;
  window.addEventListener("pointermove", emit, { passive: true });
  window.addEventListener("pointerdown", emit, { passive: true });
  document.addEventListener("mouseleave", handlePointerLeave);
  attached = true;
}

function detach(): void {
  if (!attached) return;
  window.removeEventListener("pointermove", emit);
  window.removeEventListener("pointerdown", emit);
  document.removeEventListener("mouseleave", handlePointerLeave);
  attached = false;
  lastX = Number.NaN;
  lastY = Number.NaN;
}

/** Subscribes to pointer movement. Returns an unsubscribe function. */
export function subscribePointer(listener: PointerListener): () => void {
  listeners.add(listener);
  attach();
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0) detach();
  };
}

/** Media queries are cached — reading them on every frame would be wasteful. */
const queryCache = new Map<string, MediaQueryList>();

function query(key: string): MediaQueryList | null {
  if (typeof window === "undefined" || !window.matchMedia) return null;
  let cached = queryCache.get(key);
  if (!cached) {
    cached = window.matchMedia(key);
    queryCache.set(key, cached);
  }
  return cached;
}

/** True on devices with a precise pointer, e.g. a mouse or trackpad. */
export function hasFinePointer(): boolean {
  return query("(pointer: fine)")?.matches ?? false;
}

/** True when hovering is meaningful (excludes most touch devices). */
export function canHover(): boolean {
  return query("(hover: hover)")?.matches ?? false;
}

/** True when the visitor asked for reduced motion. */
export function prefersReducedMotion(): boolean {
  return query("(prefers-reduced-motion: reduce)")?.matches ?? false;
}

/** Convenience flag: run decorative pointer effects at all? */
export function shouldRunPointerEffects(): boolean {
  return hasFinePointer() && canHover() && !prefersReducedMotion();
}
