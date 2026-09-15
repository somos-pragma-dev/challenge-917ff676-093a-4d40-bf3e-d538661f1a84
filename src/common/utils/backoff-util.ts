export interface BackoffOptions {
  baseDelay: number;
  maxDelay: number;
  maxRetries: number;
  jitterFactor: number;
  multiplier: number;
}

export interface BackoffResult {
  delay: number;
  attempt: number;
  shouldRetry: boolean;
  nextBackoff: number | null;
}

export const DEFAULT_BACKOFF_OPTIONS: BackoffOptions = {
  baseDelay: 1000,
  maxDelay: 30000,
  maxRetries: 5,
  jitterFactor: 0.3,
  multiplier: 2,
};

export class BackoffUtil {
  private readonly options: BackoffOptions;

  constructor(options: Partial<BackoffOptions> = {}) {
    this.options = { ...DEFAULT_BACKOFF_OPTIONS, ...options };
    this.validateOptions();
  }

  private validateOptions(): void {
    if (this.options.baseDelay <= 0) {
      throw new Error('baseDelay debe ser mayor que 0');
    }
    if (this.options.maxDelay <= 0) {
      throw new Error('maxDelay debe ser mayor que 0');
    }
    if (this.options.maxRetries < 0) {
      throw new Error('maxRetries no puede ser negativo');
    }
    if (this.options.jitterFactor < 0 || this.options.jitterFactor > 1) {
      throw new Error('jitterFactor debe estar entre 0 y 1');
    }
    if (this.options.multiplier < 1) {
      throw new Error('multiplier debe ser mayor o igual a 1');
    }
  }

  calculate(attempt: number): BackoffResult {
    if (attempt < 0) {
      throw new Error('El número de intento no puede ser negativo');
    }

    const shouldRetry = attempt < this.options.maxRetries;

    if (!shouldRetry) {
      return {
        delay: 0,
        attempt,
        shouldRetry: false,
        nextBackoff: null,
      };
    }

    const exponentialDelay = this.options.baseDelay * Math.pow(this.options.multiplier, attempt);
    const cappedDelay = Math.min(exponentialDelay, this.options.maxDelay);
    const jitter = this.calculateJitter(cappedDelay);
    const finalDelay = Math.floor(cappedDelay + jitter);

    const nextBackoff =
      attempt + 1 < this.options.maxRetries
        ? this.options.baseDelay * Math.pow(this.options.multiplier, attempt + 1)
        : null;

    return {
      delay: finalDelay,
      attempt,
      shouldRetry: true,
      nextBackoff: nextBackoff ? Math.min(nextBackoff, this.options.maxDelay) : null,
    };
  }

  private calculateJitter(delay: number): number {
    const jitterRange = delay * this.options.jitterFactor;
    const randomFactor = Math.random() * 2 - 1;
    return Math.floor(jitterRange * randomFactor);
  }

  getOptions(): Readonly<BackoffOptions> {
    return { ...this.options };
  }

  async wait(delayMs: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, delayMs));
  }

  async executeWithBackoff<T>(
    operation: (attempt: number) => Promise<T>,
    onRetry?: (attempt: number, error: Error, delay: number) => Promise<void>,
  ): Promise<T> {
    let lastError: Error;

    for (let attempt = 0; attempt <= this.options.maxRetries; attempt++) {
      try {
        const result = await operation(attempt);
        return result;
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));

        if (attempt >= this.options.maxRetries) {
          break;
        }

        const backoffResult = this.calculate(attempt);

        if (onRetry) {
          await onRetry(attempt, lastError, backoffResult.delay);
        }

        await this.wait(backoffResult.delay);
      }
    }

    throw lastError || new Error('Operation failed after max retries');
  }

  static createDefault(): BackoffUtil {
    return new BackoffUtil();
  }

  static createForPayment(): BackoffUtil {
    return new BackoffUtil({
      baseDelay: 2000,
      maxDelay: 60000,
      maxRetries: 4,
      jitterFactor: 0.25,
      multiplier: 2,
    });
  }

  static createForAntifraud(): BackoffUtil {
    return new BackoffUtil({
      baseDelay: 1000,
      maxDelay: 30000,
      maxRetries: 3,
      jitterFactor: 0.2,
      multiplier: 2,
    });
  }

  static createForRisk(): BackoffUtil {
    return new BackoffUtil({
      baseDelay: 1500,
      maxDelay: 45000,
      maxRetries: 4,
      jitterFactor: 0.25,
      multiplier: 2,
    });
  }
}