/**
 * ELYSE DEV — small in-memory rate limiter.
 *
 * Used for actions that are cheap for a human and expensive for a script, such
 * as issuing academy certificates. State lives in this process, which is the
 * right trade-off for a single-instance API: no extra dependency, no Redis, and
 * a limiter that fails open rather than blocking real users if it is full.
 *
 * When the API runs on more than one instance, move the counter into the
 * database (the contact endpoint already does exactly that).
 */

export interface RateLimitOptions {
  /** Window length in milliseconds. */
  windowMs: number;
  /** How many actions are allowed per key inside the window. */
  max: number;
  /** Injectable clock so tests do not need to sleep. */
  now?: () => number;
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  /** Milliseconds until the caller may try again. */
  retryAfterMs: number;
}

export interface RateLimiter {
  check(key: string): RateLimitResult;
  reset(key?: string): void;
  /** Number of keys currently tracked (used by tests and diagnostics). */
  size(): number;
}

export function createRateLimiter(options: RateLimitOptions): RateLimiter {
  const { windowMs, max } = options;
  const now = options.now ?? (() => Date.now());
  const hits = new Map<string, number[]>();

  function prune(timestamps: number[], current: number): number[] {
    const cutoff = current - windowMs;
    return timestamps.filter((timestamp) => timestamp > cutoff);
  }

  return {
    check(key: string): RateLimitResult {
      const current = now();
      const recent = prune(hits.get(key) ?? [], current);

      if (recent.length >= max) {
        const oldest = recent[0] ?? current;
        hits.set(key, recent);
        return {
          allowed: false,
          remaining: 0,
          retryAfterMs: Math.max(0, oldest + windowMs - current),
        };
      }

      recent.push(current);
      hits.set(key, recent);
      return {
        allowed: true,
        remaining: Math.max(0, max - recent.length),
        retryAfterMs: 0,
      };
    },

    reset(key?: string): void {
      if (key === undefined) hits.clear();
      else hits.delete(key);
    },

    size(): number {
      return hits.size;
    },
  };
}
