/**
 * Tiny in-memory rate limiter — sufficient for low-traffic forms on a single
 * Vercel function instance. For high-traffic prod, replace with Upstash Redis
 * or @vercel/kv. Key by IP + endpoint.
 */
type Bucket = { count: number; resetAt: number };
const store = new Map<string, Bucket>();

export function rateLimit(
  key: string,
  { max = 5, windowMs = 60_000 } = {}
): { ok: boolean; remaining: number } {
  const now = Date.now();
  const b = store.get(key);
  if (!b || b.resetAt < now) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, remaining: max - 1 };
  }
  if (b.count >= max) {
    return { ok: false, remaining: 0 };
  }
  b.count += 1;
  return { ok: true, remaining: max - b.count };
}

export function getClientIp(headers: Headers): string {
  return (
    headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    headers.get("x-real-ip") ??
    "unknown"
  );
}
