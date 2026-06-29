/**
 * Best-effort in-memory sliding-window rate limiter, keyed by client IP.
 *
 * Note: serverless instances don't share memory, so this caps abuse per warm
 * instance rather than globally. It's a cheap first line of defence against
 * runaway cost. For hard global limits, swap in Upstash Redis (@upstash/ratelimit).
 */

const hits = new Map<string, number[]>();
let lastSweep = 0;

export type RateResult = { ok: true } | { ok: false; retryAfter: number };

export function rateLimit(key: string, limit = 15, windowMs = 60_000): RateResult {
  const now = Date.now();

  // occasional sweep so the map can't grow unbounded
  if (now - lastSweep > windowMs) {
    for (const [k, times] of hits) {
      if (times.every((t) => now - t >= windowMs)) hits.delete(k);
    }
    lastSweep = now;
  }

  const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);

  if (recent.length >= limit) {
    const retryAfter = Math.ceil((windowMs - (now - recent[0])) / 1000);
    return { ok: false, retryAfter: Math.max(1, retryAfter) };
  }

  recent.push(now);
  hits.set(key, recent);
  return { ok: true };
}
