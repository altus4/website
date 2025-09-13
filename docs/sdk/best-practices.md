---
title: SDK Best Practices
description: Best practices, performance optimization, and production guidelines for the Altus 4 TypeScript SDK
---

# SDK Best Practices

This guide covers best practices, performance optimization techniques, security considerations, and production guidelines for using the Altus 4 TypeScript SDK effectively in real-world applications.

::: tip Quick Navigation

- [Authentication Best Practices](#authentication-best-practices)
- [Performance Optimization](#performance-optimization)
- [Error Handling Strategies](#error-handling-strategies)
- [Security Guidelines](#security-guidelines)
- [Production Deployment](#production-deployment)
- [Monitoring and Observability](#monitoring-and-observability)
:::

## Authentication Best Practices

### Cookie-Based Authentication for Web Apps

Always prefer cookie-based authentication for browser applications:

```typescript
// Recommended: Cookie-based authentication
const altus4 = new Altus4SDK({
  baseURL: '/api/v1',
  // No API key needed - uses cookies automatically
});

// App initialization
async function initializeApp() {
  try {
    // Restore session from HttpOnly cookies
    const restored = await altus4.auth.restoreSession();

    if (restored && altus4.isAuthenticated()) {
      // User is authenticated
      return true;
    }

    return false;
  } catch (error) {
    console.error('Auth initialization failed:', error);
    return false;
  }
}
```

**Why Cookie-Based Authentication:**

- HttpOnly cookies prevent XSS attacks
- Automatic browser handling of cookies
- No localStorage security concerns
- Better mobile app support

### API Key Management for Services

For server-side applications, use environment-specific API keys:

```typescript
// Environment-based API key configuration
class APIKeyManager {
  private static getAPIKey(): string {
    const env = process.env.NODE_ENV || 'development';
    const keyMap = {
      development: process.env.ALTUS4_DEV_API_KEY,
      staging: process.env.ALTUS4_STAGING_API_KEY,
      production: process.env.ALTUS4_PROD_API_KEY,
    };

    const apiKey = keyMap[env] || process.env.ALTUS4_API_KEY;

    if (!apiKey) {
      throw new Error(`ALTUS4_API_KEY not configured for environment: ${env}`);
    }

    return apiKey;
  }

  static createSDK(): Altus4SDK {
    return new Altus4SDK({
      baseURL: process.env.ALTUS4_API_URL,
      apiKey: this.getAPIKey(),
      timeout: 30000,
    });
  }
}

// Usage
const altus4 = APIKeyManager.createSDK();
```

### Token Storage Security

Implement secure token storage patterns:

```typescript
// Secure token storage with fallbacks
class SecureTokenStorage {
  private static readonly TOKEN_KEY = 'altus4_token';
  private static readonly EXPIRY_KEY = 'altus4_expiry';

  static storeToken(token: string, expiresIn: number): void {
    const expiryTime = Date.now() + (expiresIn * 1000);

    try {
      // Prefer sessionStorage over localStorage
      if (typeof sessionStorage !== 'undefined') {
        sessionStorage.setItem(this.TOKEN_KEY, token);
        sessionStorage.setItem(this.EXPIRY_KEY, expiryTime.toString());
      } else if (typeof localStorage !== 'undefined') {
        localStorage.setItem(this.TOKEN_KEY, token);
        localStorage.setItem(this.EXPIRY_KEY, expiryTime.toString());
      }
    } catch (error) {
      console.warn('Token storage failed:', error);
      // Fallback to memory storage
      this.memoryStorage = { token, expiryTime };
    }
  }

  static getToken(): string | null {
    try {
      // Check sessionStorage first
      if (typeof sessionStorage !== 'undefined') {
        const token = sessionStorage.getItem(this.TOKEN_KEY);
        const expiry = sessionStorage.getItem(this.EXPIRY_KEY);

        if (token && expiry && Date.now() < parseInt(expiry)) {
          return token;
        }
      }

      // Fallback to localStorage
      if (typeof localStorage !== 'undefined') {
        const token = localStorage.getItem(this.TOKEN_KEY);
        const expiry = localStorage.getItem(this.EXPIRY_KEY);

        if (token && expiry && Date.now() < parseInt(expiry)) {
          return token;
        }
      }

      // Check memory storage
      if (this.memoryStorage && Date.now() < this.memoryStorage.expiryTime) {
        return this.memoryStorage.token;
      }

      return null;
    } catch (error) {
      console.warn('Token retrieval failed:', error);
      return null;
    }
  }

  static clearToken(): void {
    try {
      sessionStorage?.removeItem(this.TOKEN_KEY);
      sessionStorage?.removeItem(this.EXPIRY_KEY);
      localStorage?.removeItem(this.TOKEN_KEY);
      localStorage?.removeItem(this.EXPIRY_KEY);
      this.memoryStorage = null;
    } catch (error) {
      console.warn('Token clearing failed:', error);
    }
  }

  private static memoryStorage: { token: string; expiryTime: number } | null = null;
}
```

## Performance Optimization

### Request Batching and Parallel Execution

Optimize API calls with batching and parallel execution:

```typescript
// Batch multiple requests for better performance
class OptimizedDataLoader {
  constructor(private altus4: Altus4SDK) {}

  async loadDashboardData() {
    // Execute multiple requests in parallel
    const [
      analyticsResult,
      databasesResult,
      trendsResult,
      insightsResult,
    ] = await Promise.allSettled([
      this.altus4.analytics.getDashboardAnalytics({ period: 'week' }),
      this.altus4.database.listDatabaseConnections(),
      this.altus4.analytics.getSearchTrends({ period: 'week' }),
      this.altus4.analytics.getInsights({ period: 'month' }),
    ]);

    return {
      analytics: this.extractResult(analyticsResult),
      databases: this.extractResult(databasesResult),
      trends: this.extractResult(trendsResult),
      insights: this.extractResult(insightsResult),
    };
  }

  private extractResult(result: PromiseSettledResult<any>) {
    if (result.status === 'fulfilled' && result.value.success) {
      return result.value.data;
    }
    return null;
  }
}
```

### Response Caching

Implement intelligent caching for frequently accessed data:

```typescript
// Intelligent response caching
class CachedSDKWrapper {
  private cache = new Map<string, { data: any; expiry: number }>();

  constructor(private altus4: Altus4SDK) {}

  async getCachedAnalytics(params: any): Promise<any> {
    const cacheKey = `analytics:${JSON.stringify(params)}`;
    const cached = this.cache.get(cacheKey);

    // Return cached data if still valid
    if (cached && Date.now() < cached.expiry) {
      return cached.data;
    }

    // Fetch fresh data
    const result = await this.altus4.analytics.getDashboardAnalytics(params);

    if (result.success) {
      // Cache for 5 minutes
      this.cache.set(cacheKey, {
        data: result.data,
        expiry: Date.now() + (5 * 60 * 1000),
      });

      return result.data;
    }

    // Return cached data on error if available
    if (cached) {
      console.warn('Using stale cached data due to API error');
      return cached.data;
    }

    throw new Error('Failed to load analytics data');
  }

  // Clean expired cache entries
  cleanCache(): void {
    const now = Date.now();
    for (const [key, value] of this.cache.entries()) {
      if (now >= value.expiry) {
        this.cache.delete(key);
      }
    }
  }
}
```

### Connection Pooling and Reuse

Optimize HTTP connections:

```typescript
// Optimized SDK configuration for performance
const createOptimizedSDK = (): Altus4SDK => {
  return new Altus4SDK({
    baseURL: process.env.ALTUS4_API_URL,
    apiKey: process.env.ALTUS4_API_KEY,
    timeout: 30000,
    headers: {
      // Enable HTTP/2 and connection reuse
      'Connection': 'keep-alive',
      'Keep-Alive': 'timeout=5, max=1000',
    },
  });
};

// Reuse SDK instance across your application
export const sharedAltus4 = createOptimizedSDK();
```

### Pagination and Data Streaming

Handle large datasets efficiently:

```typescript
// Efficient pagination handling
class PaginatedDataLoader {
  constructor(private altus4: Altus4SDK) {}

  async *loadAllSearchHistory(batchSize = 100): AsyncGenerator<any[], void, unknown> {
    let offset = 0;
    let hasMore = true;

    while (hasMore) {
      try {
        const result = await this.altus4.analytics.getSearchHistory({
          limit: batchSize,
          offset,
        });

        if (result.success && result.data) {
          const batch = result.data;

          if (batch.length === 0) {
            hasMore = false;
          } else {
            yield batch;
            offset += batchSize;

            // Rate limiting: small delay between requests
            if (hasMore) {
              await new Promise(resolve => setTimeout(resolve, 100));
            }
          }
        } else {
          hasMore = false;
        }
      } catch (error) {
        console.error('Pagination error:', error);
        hasMore = false;
      }
    }
  }

  // Usage example
  async processAllSearchHistory() {
    const processor = this.loadAllSearchHistory(100);

    for await (const batch of processor) {
      // Process each batch
      console.log(`Processing ${batch.length} records`);
      await this.processBatch(batch);
    }
  }

  private async processBatch(batch: any[]): Promise<void> {
    // Process batch of records
    for (const record of batch) {
      // Handle individual record
    }
  }
}
```

## Error Handling Strategies

### Comprehensive Error Classification

Implement structured error handling:

```typescript
// Comprehensive error handling
enum ErrorCategory {
  AUTHENTICATION = 'authentication',
  AUTHORIZATION = 'authorization',
  VALIDATION = 'validation',
  NETWORK = 'network',
  RATE_LIMIT = 'rate_limit',
  SERVER = 'server',
  UNKNOWN = 'unknown',
}

interface ClassifiedError {
  category: ErrorCategory;
  code: string;
  message: string;
  recoverable: boolean;
  retryable: boolean;
  details?: any;
}

class ErrorClassifier {
  static classify(error: any): ClassifiedError {
    // API response errors
    if (error.response) {
      const status = error.response.status;
      const errorData = error.response.data?.error;

      switch (status) {
        case 401:
          return {
            category: ErrorCategory.AUTHENTICATION,
            code: errorData?.code || 'AUTHENTICATION_FAILED',
            message: errorData?.message || 'Authentication failed',
            recoverable: true,
            retryable: true,
          };

        case 403:
          return {
            category: ErrorCategory.AUTHORIZATION,
            code: errorData?.code || 'FORBIDDEN',
            message: errorData?.message || 'Access denied',
            recoverable: false,
            retryable: false,
          };

        case 400:
          return {
            category: ErrorCategory.VALIDATION,
            code: errorData?.code || 'VALIDATION_ERROR',
            message: errorData?.message || 'Invalid request',
            recoverable: true,
            retryable: false,
          };

        case 429:
          return {
            category: ErrorCategory.RATE_LIMIT,
            code: 'RATE_LIMITED',
            message: 'Rate limit exceeded',
            recoverable: true,
            retryable: true,
          };

        case 500:
        case 502:
        case 503:
        case 504:
          return {
            category: ErrorCategory.SERVER,
            code: 'SERVER_ERROR',
            message: 'Server error',
            recoverable: true,
            retryable: true,
          };
      }
    }

    // Network errors
    if (error.code === 'NETWORK_ERROR' || error.message?.includes('timeout')) {
      return {
        category: ErrorCategory.NETWORK,
        code: 'NETWORK_ERROR',
        message: 'Network connection failed',
        recoverable: true,
        retryable: true,
      };
    }

    // Unknown errors
    return {
      category: ErrorCategory.UNKNOWN,
      code: 'UNKNOWN_ERROR',
      message: error.message || 'An unknown error occurred',
      recoverable: false,
      retryable: false,
    };
  }
}
```

### Retry Mechanism with Exponential Backoff

Implement intelligent retry logic:

```typescript
// Smart retry mechanism
class RetryableSDKWrapper {
  constructor(
    private altus4: Altus4SDK,
    private maxRetries = 3,
    private baseDelay = 1000
  ) {}

  async executeWithRetry<T>(
    operation: () => Promise<T>,
    operationName = 'API call'
  ): Promise<T> {
    let lastError: any;

    for (let attempt = 0; attempt <= this.maxRetries; attempt++) {
      try {
        const result = await operation();

        if (attempt > 0) {
          console.log(`${operationName} succeeded after ${attempt} retries`);
        }

        return result;
      } catch (error) {
        lastError = error;
        const classifiedError = ErrorClassifier.classify(error);

        // Don't retry non-retryable errors
        if (!classifiedError.retryable || attempt === this.maxRetries) {
          console.error(`${operationName} failed after ${attempt + 1} attempts:`, classifiedError);
          throw error;
        }

        // Calculate delay with exponential backoff and jitter
        const delay = this.calculateDelay(attempt);
        console.warn(`${operationName} failed (attempt ${attempt + 1}), retrying in ${delay}ms:`, classifiedError.message);

        await this.sleep(delay);
      }
    }

    throw lastError;
  }

  private calculateDelay(attempt: number): number {
    // Exponential backoff with jitter
    const exponentialDelay = this.baseDelay * Math.pow(2, attempt);
    const jitter = Math.random() * 0.1 * exponentialDelay;
    return Math.min(exponentialDelay + jitter, 30000); // Cap at 30 seconds
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Example usage methods
  async getDashboardAnalytics(params: any) {
    return this.executeWithRetry(
      () => this.altus4.analytics.getDashboardAnalytics(params),
      'Get dashboard analytics'
    );
  }

  async searchDatabase(params: any) {
    return this.executeWithRetry(
      () => this.altus4.database.searchDatabase(params),
      'Search database'
    );
  }
}
```

### Circuit Breaker Pattern

Implement circuit breaker for external dependencies:

```typescript
// Circuit breaker implementation
enum CircuitState {
  CLOSED = 'closed',
  OPEN = 'open',
  HALF_OPEN = 'half_open',
}

class CircuitBreaker {
  private state = CircuitState.CLOSED;
  private failureCount = 0;
  private nextAttempt = 0;

  constructor(
    private failureThreshold = 5,
    private recoveryTimeout = 60000, // 1 minute
    private monitoringPeriod = 30000 // 30 seconds
  ) {}

  async execute<T>(operation: () => Promise<T>): Promise<T> {
    if (this.state === CircuitState.OPEN) {
      if (Date.now() < this.nextAttempt) {
        throw new Error('Circuit breaker is OPEN');
      }
      this.state = CircuitState.HALF_OPEN;
    }

    try {
      const result = await operation();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }

  private onSuccess(): void {
    this.failureCount = 0;
    this.state = CircuitState.CLOSED;
  }

  private onFailure(): void {
    this.failureCount++;

    if (this.failureCount >= this.failureThreshold) {
      this.state = CircuitState.OPEN;
      this.nextAttempt = Date.now() + this.recoveryTimeout;
    }
  }

  getState(): CircuitState {
    return this.state;
  }
}

// Usage with SDK
class ResilientSDKWrapper {
  private circuitBreaker = new CircuitBreaker();

  constructor(private altus4: Altus4SDK) {}

  async searchWithCircuitBreaker(params: any) {
    return this.circuitBreaker.execute(async () => {
      const result = await this.altus4.database.searchDatabase(params);

      if (!result.success) {
        throw new Error(result.error?.message || 'Search failed');
      }

      return result.data;
    });
  }
}
```

## Security Guidelines

### API Key Security

Secure API key management practices:

```typescript
// Secure API key management
class SecureAPIKeyManager {
  private static validateAPIKey(apiKey: string): boolean {
    // Validate key format
    if (!apiKey.startsWith('altus4_sk_')) {
      return false;
    }

    // Validate key length
    if (apiKey.length < 32) {
      return false;
    }

    return true;
  }

  static loadAPIKey(): string {
    const apiKey = process.env.ALTUS4_API_KEY;

    if (!apiKey) {
      throw new Error('ALTUS4_API_KEY environment variable is required');
    }

    if (!this.validateAPIKey(apiKey)) {
      throw new Error('Invalid ALTUS4_API_KEY format');
    }

    return apiKey;
  }

  // Rotate API key periodically
  static async rotateAPIKey(altus4: Altus4SDK): Promise<string> {
    try {
      // Create new API key
      const newKeyResult = await altus4.apiKeys.createApiKey({
        name: `Rotated Key ${new Date().toISOString()}`,
        environment: 'live',
        permissions: ['search', 'analytics'],
        rateLimitTier: 'pro',
      });

      if (!newKeyResult.success) {
        throw new Error('Failed to create new API key');
      }

      const newKey = newKeyResult.data?.key;
      if (!newKey) {
        throw new Error('New API key not returned');
      }

      // Test new key
      const testSDK = new Altus4SDK({
        baseURL: process.env.ALTUS4_API_URL,
        apiKey: newKey,
      });

      const testResult = await testSDK.management.testConnection();
      if (!testResult.success) {
        throw new Error('New API key failed connection test');
      }

      return newKey;
    } catch (error) {
      console.error('API key rotation failed:', error);
      throw error;
    }
  }
}
```

### Request Validation and Sanitization

Validate and sanitize all inputs:

```typescript
// Input validation and sanitization
import { z } from 'zod';

const SearchRequestSchema = z.object({
  query: z.string().min(1).max(500).trim(),
  databases: z.array(z.string()).optional(),
  mode: z.enum(['natural', 'boolean', 'semantic']).optional(),
  limit: z.number().int().min(1).max(100).optional(),
});

const TimeRangeSchema = z.object({
  period: z.enum(['day', 'week', 'month', 'year']).optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
});

class ValidatedSDKWrapper {
  constructor(private altus4: Altus4SDK) {}

  async searchDatabase(params: unknown) {
    // Validate and sanitize input
    const validatedParams = SearchRequestSchema.parse(params);

    // Additional sanitization
    const sanitizedQuery = this.sanitizeSearchQuery(validatedParams.query);

    return this.altus4.database.searchDatabase({
      ...validatedParams,
      query: sanitizedQuery,
    });
  }

  async getDashboardAnalytics(params: unknown) {
    const validatedParams = TimeRangeSchema.parse(params);
    return this.altus4.analytics.getDashboardAnalytics(validatedParams);
  }

  private sanitizeSearchQuery(query: string): string {
    // Remove potentially harmful characters
    return query
      .replace(/[<>\"']/g, '') // Remove HTML/script chars
      .replace(/\0/g, '') // Remove null bytes
      .trim();
  }
}
```

### Logging and Audit Trail

Implement secure logging practices:

```typescript
// Secure logging with sensitive data filtering
class SecureLogger {
  private static sensitiveKeys = [
    'password',
    'token',
    'apiKey',
    'refreshToken',
    'authorization',
    'cookie',
  ];

  static log(level: 'info' | 'warn' | 'error', message: string, data?: any): void {
    const sanitizedData = data ? this.sanitizeData(data) : undefined;

    const logEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      data: sanitizedData,
      requestId: this.getRequestId(),
    };

    console[level](JSON.stringify(logEntry));
  }

  private static sanitizeData(data: any): any {
    if (typeof data !== 'object' || data === null) {
      return data;
    }

    if (Array.isArray(data)) {
      return data.map(item => this.sanitizeData(item));
    }

    const sanitized: any = {};
    for (const [key, value] of Object.entries(data)) {
      if (this.isSensitiveKey(key)) {
        sanitized[key] = '[REDACTED]';
      } else if (typeof value === 'object') {
        sanitized[key] = this.sanitizeData(value);
      } else {
        sanitized[key] = value;
      }
    }

    return sanitized;
  }

  private static isSensitiveKey(key: string): boolean {
    return this.sensitiveKeys.some(sensitive =>
      key.toLowerCase().includes(sensitive.toLowerCase())
    );
  }

  private static getRequestId(): string {
    // Implementation depends on your framework
    return Math.random().toString(36).substring(2, 15);
  }
}

// Usage in SDK wrapper
class AuditedSDKWrapper {
  constructor(private altus4: Altus4SDK) {}

  async searchDatabase(params: any) {
    const startTime = Date.now();

    SecureLogger.log('info', 'Search operation started', {
      operation: 'searchDatabase',
      params: { query: params.query, mode: params.mode }, // Only log safe params
    });

    try {
      const result = await this.altus4.database.searchDatabase(params);

      SecureLogger.log('info', 'Search operation completed', {
        operation: 'searchDatabase',
        success: result.success,
        duration: Date.now() - startTime,
        resultCount: result.data?.results?.length || 0,
      });

      return result;
    } catch (error) {
      SecureLogger.log('error', 'Search operation failed', {
        operation: 'searchDatabase',
        error: error.message,
        duration: Date.now() - startTime,
      });

      throw error;
    }
  }
}
```

## Production Deployment

### Environment Configuration

Set up proper environment configuration:

```typescript
// Production environment configuration
interface EnvironmentConfig {
  apiUrl: string;
  apiKey: string;
  timeout: number;
  retryAttempts: number;
  logLevel: 'debug' | 'info' | 'warn' | 'error';
  enableMetrics: boolean;
  enableCaching: boolean;
  cacheTimeout: number;
}

class ConfigManager {
  private static config: EnvironmentConfig | null = null;

  static getConfig(): EnvironmentConfig {
    if (!this.config) {
      this.config = this.loadConfig();
    }
    return this.config;
  }

  private static loadConfig(): EnvironmentConfig {
    const env = process.env.NODE_ENV || 'development';

    // Validate required environment variables
    const requiredVars = ['ALTUS4_API_URL', 'ALTUS4_API_KEY'];
    for (const varName of requiredVars) {
      if (!process.env[varName]) {
        throw new Error(`Required environment variable ${varName} is not set`);
      }
    }

    const baseConfig = {
      apiUrl: process.env.ALTUS4_API_URL!,
      apiKey: process.env.ALTUS4_API_KEY!,
    };

    // Environment-specific configurations
    switch (env) {
      case 'production':
        return {
          ...baseConfig,
          timeout: 30000,
          retryAttempts: 3,
          logLevel: 'warn',
          enableMetrics: true,
          enableCaching: true,
          cacheTimeout: 300000, // 5 minutes
        };

      case 'staging':
        return {
          ...baseConfig,
          timeout: 45000,
          retryAttempts: 2,
          logLevel: 'info',
          enableMetrics: true,
          enableCaching: true,
          cacheTimeout: 60000, // 1 minute
        };

      default: // development
        return {
          ...baseConfig,
          timeout: 60000,
          retryAttempts: 1,
          logLevel: 'debug',
          enableMetrics: false,
          enableCaching: false,
          cacheTimeout: 0,
        };
    }
  }
}

// Create production-ready SDK instance
export const createProductionSDK = (): Altus4SDK => {
  const config = ConfigManager.getConfig();

  return new Altus4SDK({
    baseURL: config.apiUrl,
    apiKey: config.apiKey,
    timeout: config.timeout,
    debug: config.logLevel === 'debug',
  });
};
```

### Health Checks and Monitoring

Implement comprehensive health monitoring:

```typescript
// Health check implementation
interface HealthStatus {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: string;
  uptime: number;
  version: string;
  dependencies: Record<string, DependencyHealth>;
}

interface DependencyHealth {
  status: 'healthy' | 'unhealthy';
  responseTime?: number;
  error?: string;
}

class HealthMonitor {
  private startTime = Date.now();

  constructor(private altus4: Altus4SDK) {}

  async getHealthStatus(): Promise<HealthStatus> {
    const timestamp = new Date().toISOString();
    const uptime = Date.now() - this.startTime;

    try {
      const dependencies = await this.checkDependencies();
      const overallStatus = this.determineOverallStatus(dependencies);

      return {
        status: overallStatus,
        timestamp,
        uptime,
        version: process.env.npm_package_version || '1.0.0',
        dependencies,
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        timestamp,
        uptime,
        version: process.env.npm_package_version || '1.0.0',
        dependencies: {
          altus4: {
            status: 'unhealthy',
            error: error.message,
          },
        },
      };
    }
  }

  private async checkDependencies(): Promise<Record<string, DependencyHealth>> {
    const checks = [
      this.checkAltus4Connection(),
      this.checkDatabaseConnection(),
    ];

    const results = await Promise.allSettled(checks);

    return {
      altus4: this.extractHealthResult(results[0]),
      database: this.extractHealthResult(results[1]),
    };
  }

  private async checkAltus4Connection(): Promise<DependencyHealth> {
    const startTime = Date.now();

    try {
      const result = await this.altus4.management.testConnection();
      const responseTime = Date.now() - startTime;

      return {
        status: result.success ? 'healthy' : 'unhealthy',
        responseTime,
        error: result.success ? undefined : 'Connection test failed',
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        responseTime: Date.now() - startTime,
        error: error.message,
      };
    }
  }

  private async checkDatabaseConnection(): Promise<DependencyHealth> {
    const startTime = Date.now();

    try {
      // Test with a simple analytics call
      const result = await this.altus4.analytics.getDashboardAnalytics({
        period: 'day',
      });
      const responseTime = Date.now() - startTime;

      return {
        status: result.success ? 'healthy' : 'unhealthy',
        responseTime,
        error: result.success ? undefined : 'Analytics call failed',
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        responseTime: Date.now() - startTime,
        error: error.message,
      };
    }
  }

  private extractHealthResult(result: PromiseSettledResult<DependencyHealth>): DependencyHealth {
    if (result.status === 'fulfilled') {
      return result.value;
    }
    return {
      status: 'unhealthy',
      error: result.reason?.message || 'Unknown error',
    };
  }

  private determineOverallStatus(dependencies: Record<string, DependencyHealth>): 'healthy' | 'degraded' | 'unhealthy' {
    const statuses = Object.values(dependencies).map(dep => dep.status);

    if (statuses.every(status => status === 'healthy')) {
      return 'healthy';
    }

    if (statuses.some(status => status === 'healthy')) {
      return 'degraded';
    }

    return 'unhealthy';
  }
}
```

## Monitoring and Observability

### Metrics Collection

Implement comprehensive metrics collection:

```typescript
// Metrics collection for production monitoring
interface Metrics {
  requestCount: number;
  successCount: number;
  errorCount: number;
  totalResponseTime: number;
  averageResponseTime: number;
  errorsByType: Record<string, number>;
  endpoints: Record<string, EndpointMetrics>;
}

interface EndpointMetrics {
  count: number;
  successCount: number;
  errorCount: number;
  totalResponseTime: number;
  averageResponseTime: number;
}

class MetricsCollector {
  private metrics: Metrics = {
    requestCount: 0,
    successCount: 0,
    errorCount: 0,
    totalResponseTime: 0,
    averageResponseTime: 0,
    errorsByType: {},
    endpoints: {},
  };

  recordRequest(endpoint: string, success: boolean, responseTime: number, errorType?: string): void {
    // Update global metrics
    this.metrics.requestCount++;
    this.metrics.totalResponseTime += responseTime;
    this.metrics.averageResponseTime = this.metrics.totalResponseTime / this.metrics.requestCount;

    if (success) {
      this.metrics.successCount++;
    } else {
      this.metrics.errorCount++;
      if (errorType) {
        this.metrics.errorsByType[errorType] = (this.metrics.errorsByType[errorType] || 0) + 1;
      }
    }

    // Update endpoint-specific metrics
    if (!this.metrics.endpoints[endpoint]) {
      this.metrics.endpoints[endpoint] = {
        count: 0,
        successCount: 0,
        errorCount: 0,
        totalResponseTime: 0,
        averageResponseTime: 0,
      };
    }

    const endpointMetrics = this.metrics.endpoints[endpoint];
    endpointMetrics.count++;
    endpointMetrics.totalResponseTime += responseTime;
    endpointMetrics.averageResponseTime = endpointMetrics.totalResponseTime / endpointMetrics.count;

    if (success) {
      endpointMetrics.successCount++;
    } else {
      endpointMetrics.errorCount++;
    }
  }

  getMetrics(): Metrics {
    return { ...this.metrics };
  }

  reset(): void {
    this.metrics = {
      requestCount: 0,
      successCount: 0,
      errorCount: 0,
      totalResponseTime: 0,
      averageResponseTime: 0,
      errorsByType: {},
      endpoints: {},
    };
  }
}

// Instrumented SDK wrapper
class InstrumentedSDKWrapper {
  private metricsCollector = new MetricsCollector();

  constructor(private altus4: Altus4SDK) {}

  async instrumentedCall<T>(
    operation: () => Promise<T>,
    operationName: string
  ): Promise<T> {
    const startTime = Date.now();

    try {
      const result = await operation();
      const responseTime = Date.now() - startTime;

      this.metricsCollector.recordRequest(operationName, true, responseTime);

      return result;
    } catch (error) {
      const responseTime = Date.now() - startTime;
      const errorType = ErrorClassifier.classify(error).category;

      this.metricsCollector.recordRequest(operationName, false, responseTime, errorType);

      throw error;
    }
  }

  async searchDatabase(params: any) {
    return this.instrumentedCall(
      () => this.altus4.database.searchDatabase(params),
      'searchDatabase'
    );
  }

  async getDashboardAnalytics(params: any) {
    return this.instrumentedCall(
      () => this.altus4.analytics.getDashboardAnalytics(params),
      'getDashboardAnalytics'
    );
  }

  getMetrics(): Metrics {
    return this.metricsCollector.getMetrics();
  }
}
```

### Performance Monitoring

Monitor performance characteristics:

```typescript
// Performance monitoring
class PerformanceMonitor {
  private performanceData: Array<{
    timestamp: number;
    operation: string;
    duration: number;
    success: boolean;
  }> = [];

  private readonly MAX_ENTRIES = 1000;

  recordOperation(operation: string, duration: number, success: boolean): void {
    this.performanceData.push({
      timestamp: Date.now(),
      operation,
      duration,
      success,
    });

    // Keep only recent entries
    if (this.performanceData.length > this.MAX_ENTRIES) {
      this.performanceData = this.performanceData.slice(-this.MAX_ENTRIES);
    }
  }

  getPerformanceReport(windowMs = 300000): { // 5 minutes default
    p50: number;
    p95: number;
    p99: number;
    averageResponseTime: number;
    successRate: number;
    totalRequests: number;
  } {
    const cutoff = Date.now() - windowMs;
    const recentData = this.performanceData.filter(entry => entry.timestamp >= cutoff);

    if (recentData.length === 0) {
      return {
        p50: 0,
        p95: 0,
        p99: 0,
        averageResponseTime: 0,
        successRate: 0,
        totalRequests: 0,
      };
    }

    const durations = recentData.map(entry => entry.duration).sort((a, b) => a - b);
    const successCount = recentData.filter(entry => entry.success).length;

    return {
      p50: this.percentile(durations, 50),
      p95: this.percentile(durations, 95),
      p99: this.percentile(durations, 99),
      averageResponseTime: durations.reduce((sum, duration) => sum + duration, 0) / durations.length,
      successRate: successCount / recentData.length,
      totalRequests: recentData.length,
    };
  }

  private percentile(sortedArray: number[], percentile: number): number {
    const index = Math.ceil((sortedArray.length * percentile) / 100) - 1;
    return sortedArray[Math.max(0, index)] || 0;
  }
}
```

---

These best practices provide a comprehensive foundation for building production-ready applications with the Altus 4 TypeScript SDK. Follow these guidelines to ensure your integration is secure, performant, and maintainable.