import "server-only";

/**
 * Simple in-memory sliding-window rate limiter.
 * Suitable for a single-instance MVP. For multi-instance production deployments,
 * replace the store with Redis or an edge rate-limiting service behind the same API.
 */
type Bucket = { timestamps: number[] };

const store = new Map<string, Bucket>();
const MAX_KEYS = 10_000;

export type RateLimitOptions = { limit: number; windowMs: number };

export type RateLimitResult = { ok: boolean; remaining: number; retryAfterSeconds: number };

export function rateLimit(key: string, { limit, windowMs }: RateLimitOptions): RateLimitResult {
  const now = Date.now();
  const bucket = store.get(key) ?? { timestamps: [] };
  bucket.timestamps = bucket.timestamps.filter((t) => now - t < windowMs);

  if (bucket.timestamps.length >= limit) {
    const oldest = bucket.timestamps[0];
    const retryAfterSeconds = Math.max(1, Math.ceil((windowMs - (now - oldest)) / 1000));
    store.set(key, bucket);
    return { ok: false, remaining: 0, retryAfterSeconds };
  }

  bucket.timestamps.push(now);
  store.set(key, bucket);

  // Opportunistic cleanup to bound memory.
  if (store.size > MAX_KEYS) {
    for (const [k, b] of store) {
      if (b.timestamps.every((t) => now - t >= windowMs)) store.delete(k);
      if (store.size <= MAX_KEYS / 2) break;
    }
  }

  return { ok: true, remaining: limit - bucket.timestamps.length, retryAfterSeconds: 0 };
}
