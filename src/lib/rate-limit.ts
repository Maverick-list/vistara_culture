interface RateLimitStore {
  [key: string]: {
    count: number;
    resetAt: number;
  };
}

const store: RateLimitStore = {};

/**
 * Simple in-memory rate limiter for server-side API routes.
 * resets every `windowMs`.
 */
export function isRateLimited(
  identifier: string,
  limit: number = 10,
  windowMs: number = 60000
): boolean {
  const now = Date.now();
  
  if (!store[identifier]) {
    store[identifier] = { count: 1, resetAt: now + windowMs };
    return false;
  }

  const record = store[identifier];
  
  if (now > record.resetAt) {
    record.count = 1;
    record.resetAt = now + windowMs;
    return false;
  }

  record.count += 1;
  return record.count > limit;
}
