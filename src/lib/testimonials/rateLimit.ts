import {IncomingHttpHeaders} from 'http';

interface Bucket {
  count: number;
  resetAt: number;
}

/**
 * Simple in-memory sliding-window limiter keyed by IP + action.
 * Note: on serverless platforms (Vercel) this is per-instance memory, which is
 * still an effective spam deterrent; for strict cross-instance limits pair it
 * with the optional webhook/DB layer.
 */
const buckets = new Map<string, Bucket>();

export function isRateLimited(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const entry = buckets.get(key);
  if (!entry || entry.resetAt <= now) {
    buckets.set(key, {count: 1, resetAt: now + windowMs});
    return false;
  }
  if (entry.count >= limit) return true;
  entry.count += 1;
  return false;
}

/** Best-effort client IP. Falls back to a shared bucket when unavailable. */
export function resolveIp(headers: IncomingHttpHeaders): string {
  const forwarded = headers['x-forwarded-for'];
  if (typeof forwarded === 'string' && forwarded.length > 0) {
    return forwarded.split(',')[0].trim();
  }
  const realIp = headers['x-real-ip'];
  if (typeof realIp === 'string' && realIp.length > 0) return realIp;
  return 'unknown';
}
