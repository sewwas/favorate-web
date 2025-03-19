interface RateLimiterOptions {
  maxAttempts: number;
  windowMs: number;
  minWaitMs?: number; // Minimum wait time between requests
  maxBackoffMs?: number; // Maximum backoff time
}

export class RateLimitError extends Error {
  constructor(message: string, public timeToWait: number) {
    super(message);
    this.name = 'RateLimitError';
  }
}

class RateLimiter {
  private attempts: Map<string, number[]>;
  private lastAttempt: Map<string, number>;
  private backoffUntil: Map<string, number>; // Track backoff periods
  private failedAttempts: Map<string, number>;
  private options: RateLimiterOptions;

  constructor(options: RateLimiterOptions) {
    this.attempts = new Map();
    this.lastAttempt = new Map();
    this.backoffUntil = new Map();
    this.failedAttempts = new Map();
    this.options = {
      minWaitMs: 5000, // Increased to 5 seconds minimum
      maxBackoffMs: 300000,
      ...options
    };
  }

  private incrementFailedAttempts(key: string): void {
    const fails = (this.failedAttempts.get(key) || 0) + 1;
    this.failedAttempts.set(key, fails);
    
    // Exponential backoff based on number of failures
    if (fails > 1) {
      const backoffTime = Math.min(
        this.options.maxBackoffMs || 300000,
        Math.pow(2, fails - 1) * (this.options.minWaitMs || 5000)
      );
      this.setBackoff(key, backoffTime);
    }
  }

  async attempt(key: string): Promise<boolean> {
    const now = Date.now();
    
    // Check if we're in a backoff period
    const backoffTime = this.backoffUntil.get(key) || 0;
    if (now < backoffTime) {
      const timeToWait = backoffTime - now;
      throw new RateLimitError(
        `Too many attempts. Please wait ${Math.ceil(timeToWait / 1000)} seconds.`,
        timeToWait
      );
    }

    // Check minimum wait time between requests
    const lastAttemptTime = this.lastAttempt.get(key) || 0;
    const timeSinceLastAttempt = now - lastAttemptTime;
    if (timeSinceLastAttempt < (this.options.minWaitMs || 0)) {
      const timeToWait = (this.options.minWaitMs || 0) - timeSinceLastAttempt;
      throw new RateLimitError(
        `Please wait ${Math.ceil(timeToWait / 1000)} seconds between attempts.`,
        timeToWait
      );
    }
    
    const windowStart = now - this.options.windowMs;
    let keyAttempts = this.attempts.get(key) || [];
    keyAttempts = keyAttempts.filter(timestamp => timestamp > windowStart);
    
    // Check if we're over the limit
    if (keyAttempts.length >= this.options.maxAttempts) {
      this.incrementFailedAttempts(key);
      const timeToWait = this.options.maxBackoffMs || 300000;
      throw new RateLimitError(
        `Too many attempts. Please wait ${Math.ceil(timeToWait / 1000)} seconds.`,
        timeToWait
      );
    }
    
    // Add new attempt
    keyAttempts.push(now);
    this.attempts.set(key, keyAttempts);
    this.lastAttempt.set(key, now);
    
    return true;
  }

  reset(key: string): void {
    this.attempts.delete(key);
    this.lastAttempt.delete(key);
    this.backoffUntil.delete(key);
    this.failedAttempts.delete(key);
  }

  recordFailure(key: string): void {
    this.incrementFailedAttempts(key);
  }

  getRemainingAttempts(key: string): number {
    if (this.isRateLimited(key)) return 0;
    
    const windowStart = Date.now() - this.options.windowMs;
    const keyAttempts = this.attempts.get(key) || [];
    const validAttempts = keyAttempts.filter(timestamp => timestamp > windowStart);
    return Math.max(0, this.options.maxAttempts - validAttempts.length);
  }

  getTimeToNextAttempt(key: string): number {
    const now = Date.now();
    
    // Check backoff period first
    const backoffTime = this.backoffUntil.get(key) || 0;
    if (now < backoffTime) {
      return backoffTime - now;
    }
    
    const lastAttemptTime = this.lastAttempt.get(key) || 0;
    const timeSinceLastAttempt = now - lastAttemptTime;
    return Math.max(0, (this.options.minWaitMs || 0) - timeSinceLastAttempt);
  }

  setBackoff(key: string, durationMs: number): void {
    const now = Date.now();
    const backoffTime = now + Math.min(durationMs, this.options.maxBackoffMs || 300000);
    this.backoffUntil.set(key, backoffTime);
  }

  isRateLimited(key: string): boolean {
    return this.getTimeToNextAttempt(key) > 0;
  }
}

// Create a singleton instance for auth rate limiting
export const authRateLimiter = new RateLimiter({
  maxAttempts: 1,
  windowMs: 60000,
  minWaitMs: 15000, // 15 seconds minimum between attempts
  maxBackoffMs: 300000
}); 