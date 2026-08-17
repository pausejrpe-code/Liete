type RateLimitRecord = {
  count: number;
  resetTime: number;
};

const store = new Map<string, RateLimitRecord>();

export type RateLimitOptions = {
  intervalSeconds?: number;
  maxRequests?: number;
};

export function checkRateLimit(
  identifier: string,
  options: RateLimitOptions = {}
): {
  limit: number;
  remaining: number;
  reset: number;
  success: boolean;
} {
  const { maxRequests = 10, intervalSeconds = 60 } = options;
  const now = Date.now();
  const windowMs = intervalSeconds * 1000;

  const current = store.get(identifier);

  if (!current || now > current.resetTime) {
    store.set(identifier, {
      count: 1,
      resetTime: now + windowMs
    });

    return {
      limit: maxRequests,
      remaining: maxRequests - 1,
      reset: Math.ceil((now + windowMs) / 1000),
      success: true
    };
  }

  if (current.count >= maxRequests) {
    return {
      limit: maxRequests,
      remaining: 0,
      reset: Math.ceil(current.resetTime / 1000),
      success: false
    };
  }

  current.count += 1;
  return {
    limit: maxRequests,
    remaining: maxRequests - current.count,
    reset: Math.ceil(current.resetTime / 1000),
    success: true
  };
}

export function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  const realIp = request.headers.get("x-real-ip");
  if (realIp) {
    return realIp.trim();
  }
  return "127.0.0.1";
}
