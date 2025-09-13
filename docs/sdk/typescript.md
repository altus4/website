---
title: TypeScript SDK
description: Comprehensive guide to the Altus 4 TypeScript SDK with full API reference and examples
---

# TypeScript SDK

The official TypeScript SDK for Altus 4 provides comprehensive, type-safe access to the AI-Enhanced MySQL Full-Text Search Engine. Built with modern TypeScript practices, it offers seamless integration with both client-side and server-side applications.

::: tip Quick Navigation

- [Installation](#installation)
- [Quick Start](#quick-start)
- [Authentication](#authentication)
- [API Reference](#api-reference)
- [Error Handling](#error-handling)
- [Type Definitions](#type-definitions)
:::

## Installation

```bash
npm install @altus4/sdk
```

**Requirements:**

- Node.js 14.0+
- TypeScript 4.0+
- Modern browsers (Chrome 70+, Firefox 65+, Safari 12+, Edge 79+)

## Quick Start

```typescript
import { Altus4SDK } from '@altus4/sdk';

// Initialize the SDK
const altus4 = new Altus4SDK({
  baseURL: 'https://api.altus4.com/api/v1',
});

// Authenticate user
const loginResult = await altus4.login('user@example.com', 'password');

if (loginResult.success) {
  console.log('Welcome', loginResult.user?.name);

  // Create an API key for service-to-service authentication
  const apiKey = await altus4.apiKeys.createApiKey({
    name: 'Dashboard Integration',
    environment: 'test',
    permissions: ['search', 'analytics'],
    rateLimitTier: 'free',
  });

  // Get analytics dashboard data
  const dashboard = await altus4.analytics.getDashboardAnalytics({
    period: 'week',
  });
}
```

## Architecture

The SDK follows a modular service-oriented architecture:

```
@altus4/sdk
├── types/           # TypeScript type definitions and interfaces
├── client/          # Base HTTP client and configuration
├── services/        # Individual API service classes
│   ├── auth.service.ts
│   ├── api-keys.service.ts
│   ├── database.service.ts
│   ├── analytics.service.ts
│   └── management.service.ts
├── utils/           # Validation, formatting, and utility functions
└── index.ts         # Main SDK export and unified interface
```

### Service Classes

- **Altus4SDK**: Main unified interface orchestrating all services
- **BaseClient**: HTTP client foundation with authentication and error handling
- **Individual Services**: Specialized service classes for each API domain

## Authentication

The SDK supports multiple authentication strategies with automatic token management.

### Cookie-Based Authentication (Recommended)

Cookie-based refresh provides enhanced security for browser applications:

```typescript
const altus4 = new Altus4SDK({
  baseURL: 'https://api.altus4.com/api/v1'
});

// App startup - restore session from HttpOnly cookies
async function initializeApp() {
  const restored = await altus4.auth.restoreSession();

  if (restored && altus4.isAuthenticated()) {
    // User is authenticated
    router.push('/dashboard');
  } else {
    // Redirect to login
    router.push('/login');
  }
}

// Enhanced initialization with user profile
async function bootstrapApp() {
  const initialized = await altus4.auth.initializeAuthState();

  if (initialized && altus4.isAuthenticated()) {
    const user = await altus4.getCurrentUser();
    console.log('Welcome back,', user.data?.name);
  }
}
```

### Manual Authentication

```typescript
// Login with credentials
const result = await altus4.auth.handleLogin({
  email: 'user@example.com',
  password: 'password123',
});

if (result.success) {
  console.log('User authenticated:', result.user);
  console.log('Token expires in:', result.expiresIn, 'seconds');
}

// Register new user
const registerResult = await altus4.auth.handleRegister({
  name: 'John Doe',
  email: 'john@example.com',
  password: 'securePassword123',
  role: 'user',
});
```

### API Key Authentication

For service-to-service communication:

```typescript
const altus4 = new Altus4SDK({
  baseURL: 'https://api.altus4.com/api/v1',
  apiKey: 'your-api-key',
});

// API key is automatically included in requests
const analytics = await altus4.analytics.getDashboardAnalytics();
```

## API Reference

### Altus4SDK Class

Main SDK class providing unified access to all services.

#### Constructor

```typescript
new Altus4SDK(config?: ClientConfig)
```

**Configuration Options:**

```typescript
interface ClientConfig {
  baseURL?: string;           // API endpoint URL
  timeout?: number;           // Request timeout (default: 30s)
  headers?: Record<string, string>; // Custom headers
  apiKey?: string;           // API key for service auth
  debug?: boolean;           // Enable debug logging
}
```

#### Properties

- `auth: AuthService` - Authentication service
- `apiKeys: ApiKeysService` - API key management
- `database: DatabaseService` - Database connections
- `analytics: AnalyticsService` - Search analytics
- `management: ManagementService` - System management

#### Methods

**Authentication Methods:**

```typescript
// Check authentication status
isAuthenticated(): boolean

// Quick login helper
async login(email: string, password: string): Promise<AuthResult>

// Quick register helper
async register(name: string, email: string, password: string): Promise<AuthResult>

// Logout user
async logout(): Promise<{success: boolean}>

// Get current user profile
async getCurrentUser(): Promise<{success: boolean; user?: User}>

// Check if user is admin
async isAdmin(): Promise<boolean>

// Refresh token if needed
async refreshTokenIfNeeded(): Promise<boolean>
```

**Configuration Methods:**

```typescript
// Get/set base URL
getBaseURL(): string
setBaseURL(baseURL: string): void

// Token management
setToken(token: string, expiresIn?: number): void
clearToken(): void

// Test API connection
async testConnection(): Promise<{success: boolean; connected?: boolean}>
```

### AuthService

Handles user authentication, registration, and profile management.

#### Methods

**handleLogin(credentials: LoginRequest): Promise&lt;AuthResult&gt;**

Authenticate a user with email and password.

```typescript
const result = await altus4.auth.handleLogin({
  email: 'user@example.com',
  password: 'password123',
});

if (result.success) {
  console.log('User authenticated:', result.user);
  console.log('Token expires in:', result.expiresIn, 'seconds');
}
```

**handleRegister(userData: RegisterRequest): Promise&lt;AuthResult&gt;**

Register a new user account.

```typescript
const result = await altus4.auth.handleRegister({
  name: 'John Doe',
  email: 'john@example.com',
  password: 'securePassword123',
  role: 'user', // Optional: 'user' | 'admin'
});
```

**getCurrentUser(): Promise&lt;{success: boolean; user?: User}&gt;**

Get the current authenticated user's profile.

```typescript
const userResponse = await altus4.auth.getCurrentUser();
if (userResponse.success) {
  console.log('Current user:', userResponse.user);
}
```

**updateProfile(updates: UpdateProfileRequest): Promise&lt;{success: boolean; user?: User}&gt;**

Update the authenticated user's profile.

```typescript
await altus4.auth.updateProfile({
  name: 'John Smith',
  email: 'john.smith@example.com',
});
```

**Session Management:**

```typescript
// Check authentication status
isAuthenticated(): boolean

// Restore session from cookies
async restoreSession(): Promise<boolean>

// Initialize auth state with user profile
async initializeAuthState(): Promise<boolean>

// Refresh token if needed
async refreshTokenIfNeeded(): Promise<boolean>

// Handle logout
async handleLogout(): Promise<{success: boolean}>
```

### ApiKeysService

Manages API keys for service-to-service authentication.

#### Methods

**createApiKey(keyData: CreateApiKeyRequest): Promise&lt;ApiResponse&lt;ApiKey&gt;&gt;**

Create a new API key with specified permissions and rate limiting.

```typescript
const keyResponse = await altus4.apiKeys.createApiKey({
  name: 'Production API Key',
  environment: 'live',
  permissions: ['search', 'analytics'],
  rateLimitTier: 'pro',
  expiresAt: '2024-12-31',
  allowedIPs: ['192.168.1.0/24'], // Optional IP restrictions
});
```

**listApiKeys(): Promise&lt;ApiResponse&lt;ApiKey[]&gt;&gt;**

List all API keys for the authenticated user.

```typescript
const keys = await altus4.apiKeys.listApiKeys();
keys.data?.forEach(key => {
  console.log(`${key.name}: ${key.status}`);
});
```

**getApiKey(keyId: string): Promise&lt;ApiResponse&lt;ApiKey&gt;&gt;**

Get details for a specific API key.

```typescript
const key = await altus4.apiKeys.getApiKey('key-id-123');
```

**updateApiKey(keyId: string, updates: UpdateApiKeyRequest): Promise&lt;ApiResponse&lt;ApiKey&gt;&gt;**

Update an existing API key's settings.

```typescript
await altus4.apiKeys.updateApiKey('key-id-123', {
  name: 'Updated Key Name',
  permissions: ['search', 'analytics', 'admin'],
  rateLimitTier: 'enterprise',
});
```

**revokeApiKey(keyId: string): Promise&lt;ApiResponse&lt;{success: boolean}&gt;&gt;**

Revoke an API key, making it immediately invalid.

```typescript
await altus4.apiKeys.revokeApiKey('key-id-123');
```

**getApiKeyUsage(keyId: string): Promise&lt;ApiResponse&lt;ApiKeyUsage&gt;&gt;**

Get usage statistics for an API key.

```typescript
const usage = await altus4.apiKeys.getApiKeyUsage('key-id-123');
console.log('Requests today:', usage.data?.requestsToday);
console.log('Rate limit remaining:', usage.data?.rateLimitRemaining);
```

### DatabaseService

Manages MySQL database connections and schema discovery.

#### Methods

**addDatabaseConnection(connectionData: CreateDatabaseConnectionRequest): Promise&lt;ApiResponse&lt;DatabaseConnection&gt;&gt;**

Add a new database connection configuration.

```typescript
const connection = await altus4.database.addDatabaseConnection({
  name: 'Production Database',
  host: 'db.example.com',
  port: 3306,
  database: 'myapp_production',
  username: 'readonly_user',
  password: 'secure_password',
  ssl: true,
});
```

**listDatabaseConnections(): Promise&lt;ApiResponse&lt;DatabaseConnection[]&gt;&gt;**

List all configured database connections.

```typescript
const connections = await altus4.database.listDatabaseConnections();
```

**getDatabaseConnection(connectionId: string): Promise&lt;ApiResponse&lt;DatabaseConnection&gt;&gt;**

Get details for a specific database connection.

```typescript
const connection = await altus4.database.getDatabaseConnection('conn-123');
```

**updateDatabaseConnection(connectionId: string, updates: UpdateDatabaseConnectionRequest): Promise&lt;ApiResponse&lt;DatabaseConnection&gt;&gt;**

Update a database connection's configuration.

```typescript
await altus4.database.updateDatabaseConnection('conn-123', {
  name: 'Updated Connection Name',
  ssl: true,
});
```

**removeDatabaseConnection(connectionId: string): Promise&lt;ApiResponse&lt;{success: boolean}&gt;&gt;**

Remove a database connection configuration.

```typescript
await altus4.database.removeDatabaseConnection('conn-123');
```

**testDatabaseConnection(connectionId: string): Promise&lt;ApiResponse&lt;{connected: boolean; error?: string}&gt;&gt;**

Test connectivity to a configured database.

```typescript
const test = await altus4.database.testDatabaseConnection('conn-123');
if (test.data?.connected) {
  console.log('Database connection successful');
}
```

**getDatabaseSchema(connectionId: string): Promise&lt;ApiResponse&lt;TableSchema[]&gt;&gt;**

Discover the schema for a connected database.

```typescript
const schema = await altus4.database.getDatabaseSchema('conn-123');
schema.data?.forEach(table => {
  console.log(`Table: ${table.table} (${table.estimatedRows} rows)`);
});
```

### AnalyticsService

Provides access to search analytics and AI-powered insights.

#### Methods

**getDashboardAnalytics(params?: TimeRangeParams): Promise&lt;ApiResponse&lt;DashboardAnalytics&gt;&gt;**

Get comprehensive dashboard analytics data.

```typescript
const dashboard = await altus4.analytics.getDashboardAnalytics({
  period: 'month',
  startDate: '2024-01-01',
  endDate: '2024-01-31',
});

console.log('Total searches:', dashboard.data?.totalSearches);
console.log('Average response time:', dashboard.data?.averageResponseTime);
```

**getSearchTrends(params?: TimeRangeParams): Promise&lt;ApiResponse&lt;TrendInsight[]&gt;&gt;**

Get search trend analysis and patterns.

```typescript
const trends = await altus4.analytics.getSearchTrends({
  period: 'week',
});
```

**getPopularQueries(params?: TimeRangeParams): Promise&lt;ApiResponse&lt;PopularQuery[]&gt;&gt;**

Get the most popular search queries.

```typescript
const popular = await altus4.analytics.getPopularQueries({
  period: 'month',
});
```

**getSearchHistory(params?: SearchHistoryParams): Promise&lt;ApiResponse&lt;SearchAnalytics[]&gt;&gt;**

Get detailed search history with pagination.

```typescript
const history = await altus4.analytics.getSearchHistory({
  limit: 50,
  offset: 0,
  startDate: '2024-01-01',
  endDate: '2024-01-31',
});
```

**getInsights(params?: TimeRangeParams): Promise&lt;ApiResponse&lt;AIInsight[]&gt;&gt;**

Get AI-generated insights and recommendations.

```typescript
const insights = await altus4.analytics.getInsights({
  period: 'month',
});

insights.data?.forEach(insight => {
  if (insight.actionable) {
    console.log('Recommendation:', insight.description);
  }
});
```

### ManagementService

Provides system health checks and management operations.

#### Methods

**getSystemHealth(): Promise&lt;ApiResponse&lt;SystemHealth&gt;&gt;**

Check overall system health and status.

```typescript
const health = await altus4.management.getSystemHealth();
console.log('System status:', health.data?.status);
console.log('Uptime:', health.data?.uptime);
```

**testConnection(): Promise&lt;ApiResponse&lt;{connected: boolean}&gt;&gt;**

Test API connectivity and authentication.

```typescript
const test = await altus4.management.testConnection();
if (test.data?.connected) {
  console.log('API connection successful');
}
```

**getMigrationStatus(): Promise&lt;ApiResponse&lt;MigrationStatus&gt;&gt;**

Check migration status for new authentication system.

```typescript
const status = await altus4.management.getMigrationStatus();
if (!status.data?.hasMigrated) {
  console.log('Migration needed:', status.data?.recommendedAction);
}
```

**setupInitialApiKey(): Promise&lt;ApiResponse&lt;ApiKey&gt;&gt;**

Create initial API key for new users (requires JWT authentication).

```typescript
const initialKey = await altus4.management.setupInitialApiKey();
console.log('Initial API key created:', initialKey.data?.key);
```

## Utility Functions

The SDK includes comprehensive utility functions for common operations.

### Validation

```typescript
import { validateEmail, validatePassword, validateApiKeyCreation } from '@altus4/sdk';

// Email validation
const isValidEmail = validateEmail('user@example.com');

// Password strength validation
const passwordValidation = validatePassword('myPassword123!');
if (!passwordValidation.isValid) {
  console.log('Password errors:', passwordValidation.errors);
}

// API key creation validation
const keyValidation = validateApiKeyCreation({
  name: 'Test Key',
  environment: 'test',
  permissions: ['search'],
});
```

### Formatting

```typescript
import {
  formatNumber,
  formatResponseTime,
  formatRelativeTime,
  getRateLimitInfo,
} from '@altus4/sdk';

// Number formatting
console.log(formatNumber(1500)); // "1.5K"
console.log(formatNumber(2500000)); // "2.5M"

// Response time formatting
console.log(formatResponseTime(250)); // "250ms"
console.log(formatResponseTime(1500)); // "1.50s"

// Relative time formatting
const oneHourAgo = new Date(Date.now() - 3600000);
console.log(formatRelativeTime(oneHourAgo)); // "1 hour ago"

// Rate limit information
const rateLimitInfo = getRateLimitInfo('pro');
console.log(rateLimitInfo.description); // "10,000 requests per hour"
```

### Date Utilities

```typescript
import { getDateRangeForPeriod, formatDateForQuery } from '@altus4/sdk';

// Get date range for analytics periods
const monthRange = getDateRangeForPeriod('month');
console.log(monthRange); // { startDate: "2024-01-15", endDate: "2024-02-15" }

// Format dates for API queries
const queryDate = formatDateForQuery(new Date()); // "2024-02-15"
```

## Error Handling

The SDK provides consistent error handling patterns across all services.

### Response Pattern

All API responses follow the `ApiResponse<T>` pattern:

```typescript
interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  meta?: {
    timestamp: Date;
    requestId: string;
    version: string;
  };
}
```

### Error Handling Example

```typescript
try {
  const result = await altus4.auth.handleLogin({
    email: 'user@example.com',
    password: 'wrongpassword',
  });

  if (!result.success) {
    // Handle API errors
    console.error('Login failed:', result.error?.message);
    console.error('Error code:', result.error?.code);

    // Handle specific error codes
    switch (result.error?.code) {
      case 'AUTHENTICATION_FAILED':
        showErrorMessage('Invalid credentials');
        break;
      case 'RATE_LIMITED':
        showErrorMessage('Too many attempts, please try again later');
        break;
      default:
        showErrorMessage('Login failed, please try again');
    }
  } else {
    // Handle success
    console.log('Login successful:', result.user);
  }
} catch (error) {
  // Handle network or other errors
  console.error('Request failed:', error);
  showErrorMessage('Network error, please check your connection');
}
```

### Common Error Codes

- `AUTHENTICATION_FAILED` - Invalid credentials
- `TOKEN_EXPIRED` - JWT token has expired
- `INVALID_TOKEN` - Malformed or invalid token
- `FORBIDDEN` - Insufficient permissions
- `VALIDATION_ERROR` - Request validation failed
- `NETWORK_ERROR` - Network or connectivity issues
- `RATE_LIMITED` - Rate limit exceeded
- `DATABASE_CONNECTION_FAILED` - Database connectivity issues
- `INTERNAL_ERROR` - Server-side errors

### Automatic Error Handling

The SDK automatically handles certain error scenarios:

1. **Token Refresh**: Automatically refreshes expired tokens
2. **Retry Logic**: Retries failed requests with exponential backoff
3. **Network Errors**: Provides fallback behavior for connectivity issues
4. **Validation**: Client-side validation prevents invalid requests

## Type Definitions

The SDK is fully typed with comprehensive TypeScript definitions.

### Core Types

**User Interface**

```typescript
interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  connectedDatabases: string[];
  createdAt: Date;
  lastActive: Date;
}
```

**ApiKey Interface**

```typescript
interface ApiKey {
  id: string;
  name: string;
  key: string;
  environment: 'test' | 'live';
  permissions: Permission[];
  rateLimitTier: 'free' | 'pro' | 'enterprise';
  status: 'active' | 'revoked' | 'expired';
  expiresAt?: string;
  createdAt: Date;
  lastUsed?: Date;
}
```

**DatabaseConnection Interface**

```typescript
interface DatabaseConnection {
  id: string;
  name: string;
  host: string;
  port: number;
  database: string;
  username: string;
  ssl: boolean;
  status: 'active' | 'inactive' | 'error';
  createdAt: Date;
  lastTestedAt?: Date;
  error?: string;
}
```

### Request Types

**LoginRequest**

```typescript
interface LoginRequest {
  email: string;
  password: string;
}
```

**CreateApiKeyRequest**

```typescript
interface CreateApiKeyRequest {
  name: string;
  environment: 'test' | 'live';
  permissions: Permission[];
  rateLimitTier: 'free' | 'pro' | 'enterprise';
  expiresAt?: string;
  allowedIPs?: string[];
}
```

**TimeRangeParams**

```typescript
interface TimeRangeParams {
  period?: 'day' | 'week' | 'month' | 'year';
  startDate?: string;
  endDate?: string;
}
```

### Response Types

**AuthResult**

```typescript
interface AuthResult {
  success: boolean;
  user?: User;
  token?: string;
  expiresIn?: number;
  error?: {
    code: string;
    message: string;
  };
}
```

**DashboardAnalytics**

```typescript
interface DashboardAnalytics {
  totalSearches: number;
  totalUsers: number;
  totalDatabases: number;
  averageResponseTime: number;
  searchTrends: TrendData[];
  popularQueries: PopularQuery[];
  recentActivity: ActivityItem[];
}
```

## Advanced Usage

### Individual Service Usage

```typescript
import { AuthService, ApiKeysService } from '@altus4/sdk';

// Use services independently
const auth = new AuthService({
  baseURL: 'https://api.altus4.com/api/v1',
});

const apiKeys = new ApiKeysService({
  baseURL: 'https://api.altus4.com/api/v1',
});

const loginResult = await auth.handleLogin(credentials);
const keys = await apiKeys.listApiKeys();
```

### Custom Configuration

```typescript
const altus4 = new Altus4SDK({
  baseURL: 'https://custom-api.example.com/api/v1',
  timeout: 60000, // 60 seconds
  headers: {
    'X-Custom-Header': 'value',
  },
  debug: true, // Enable debug logging
});
```

### Token Management

```typescript
// Manual token management
altus4.setToken('your-jwt-token', 3600); // 1 hour expiry

// Check authentication status
if (altus4.isAuthenticated()) {
  console.log('User is authenticated');
}

// Automatic token refresh
const refreshed = await altus4.refreshTokenIfNeeded();
if (!refreshed) {
  // Redirect to login or handle re-authentication
  console.log('Token refresh failed, re-authentication required');
}

// Clear authentication
altus4.clearToken();
```

### Request Interceptors

The SDK automatically handles:

- **Authentication headers**: Bearer token injection
- **Request retries**: Failed requests with fresh tokens
- **Error responses**: 401/403 handling with automatic refresh
- **Request queuing**: Queued requests during token refresh

## Browser and Node.js Compatibility

The SDK is compatible with:

- **Browsers**: Chrome 70+, Firefox 65+, Safari 12+, Edge 79+
- **Node.js**: 14.0+
- **TypeScript**: 4.0+
- **Bundlers**: Webpack, Rollup, Vite, Parcel

### Environment Detection

- **Browser Storage**: localStorage, sessionStorage with fallbacks
- **Node.js**: Memory-only token storage
- **Cookie Handling**: Automatic with `withCredentials: true`
- **Network Timeouts**: Configurable per environment

## Configuration

### Environment Variables

For development, you can set default configuration:

```bash
ALTUS4_API_URL=https://api.altus4.com/api/v1
ALTUS4_TIMEOUT=30000
```

### Configuration File

Create a shared configuration file:

```typescript
// altus4.config.ts
export const altus4Config = {
  baseURL: process.env.ALTUS4_API_URL || 'http://localhost:3000/api/v1',
  timeout: 30000,
  retryAttempts: 3,
};

// Use in your application
const altus4 = new Altus4SDK(altus4Config);
```

## Best Practices

1. **Error Handling**: Always check the `success` property of API responses
2. **Token Management**: Use cookie-based authentication for browser apps
3. **Rate Limiting**: Respect rate limits and implement backoff strategies
4. **Security**: Never log or expose API keys or JWT tokens
5. **Validation**: Use built-in validation utilities before API calls
6. **Caching**: Cache frequently accessed data to reduce API calls
7. **Monitoring**: Track API usage and response times
8. **Type Safety**: Leverage TypeScript features for safer code

## Development

### Building the SDK

```bash
# Install dependencies
npm install

# Build TypeScript to JavaScript
npm run build

# Run type checking
npm run typecheck

# Development mode with watch
npm run build:watch
```

### Testing

```bash
# Run unit tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch

# Run integration tests
npm run test:integration
```

### Code Quality

```bash
# Lint TypeScript files
npm run lint

# Auto-fix linting issues
npm run lint:fix

# Format code with Prettier
npm run format

# Check code formatting
npm run format:check
```

---

The TypeScript SDK provides a comprehensive, type-safe interface to the Altus 4 API. With full TypeScript support, automatic error handling, and extensive utility functions, it's the recommended way to integrate Altus 4 into your applications.