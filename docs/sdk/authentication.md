---
title: SDK Authentication Guide
description: Comprehensive guide to authentication patterns and best practices with the Altus 4 SDK
---

# SDK Authentication Guide

The Altus 4 SDK provides sophisticated authentication management with multiple strategies, automatic token refresh, and enhanced security features. This guide covers all authentication patterns and best practices for different application types.

::: tip Quick Navigation

- [Authentication Strategies](#authentication-strategies)
- [Cookie-Based Authentication](#cookie-based-authentication-recommended)
- [JWT Token Management](#jwt-token-management)
- [API Key Authentication](#api-key-authentication)
- [Application Patterns](#application-patterns)
- [Security Best Practices](#security-best-practices)
:::

## Authentication Strategies

The SDK supports multiple authentication approaches to fit different application architectures:

1. **Cookie-Based Refresh** (Recommended for web apps)
2. **JWT with Manual Management** (Traditional approach)
3. **API Key Authentication** (Service-to-service)
4. **Hybrid Approaches** (Multiple strategies combined)

## Cookie-Based Authentication (Recommended)

Cookie-based refresh provides the highest security for browser-based applications by storing refresh tokens as HttpOnly cookies.

### Why Cookie-Based Authentication?

- **Enhanced Security**: Refresh tokens stored as HttpOnly cookies are immune to XSS attacks
- **Automatic Management**: SDK handles token refresh transparently
- **Persistent Sessions**: Users stay logged in across browser sessions
- **No Local Storage**: Sensitive tokens never stored in localStorage

### Backend Requirements

Your API backend must support:

1. **Refresh Token Cookies**: Set HttpOnly cookies on successful login
2. **Refresh Endpoint**: `POST /auth/refresh` that validates cookies
3. **Logout Endpoint**: `POST /auth/logout` that clears cookies

```javascript
// Example backend login endpoint
app.post('/auth/login', async (req, res) => {
  const { email, password } = req.body;

  // Validate credentials
  const user = await authenticateUser(email, password);
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  // Generate tokens
  const accessToken = generateAccessToken(user.id);
  const refreshToken = generateRefreshToken(user.id);

  // Set HttpOnly refresh cookie
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    path: '/'
  });

  res.json({
    success: true,
    user,
    token: accessToken,
    expiresIn: 3600 // 1 hour
  });
});

// Example refresh endpoint
app.post('/auth/refresh', async (req, res) => {
  const { refreshToken } = req.cookies;

  if (!refreshToken || !isValidRefreshToken(refreshToken)) {
    return res.status(401).json({ error: 'Invalid refresh token' });
  }

  const userId = extractUserIdFromToken(refreshToken);
  const newAccessToken = generateAccessToken(userId);

  res.json({
    token: newAccessToken,
    expiresIn: 3600
  });
});
```

### Client Implementation

#### Application Bootstrap

Restore user sessions on application startup:

```typescript
import { Altus4SDK } from '@altus4/sdk';

const altus4 = new Altus4SDK({
  baseURL: '/api/v1', // Use relative URL for same-origin requests
});

async function initializeApp() {
  try {
    // Try to restore session from HttpOnly cookie
    const restored = await altus4.auth.restoreSession();

    if (restored && altus4.isAuthenticated()) {
      // User is authenticated, redirect to app
      console.log('Session restored successfully');
      showDashboard();
    } else {
      // No valid session, show login
      console.log('No session found, redirecting to login');
      showLoginForm();
    }
  } catch (error) {
    console.error('Failed to initialize auth:', error);
    showLoginForm();
  }
}

// Enhanced bootstrap with user profile
async function bootstrapApp() {
  try {
    // Initialize auth state and fetch user profile
    const initialized = await altus4.auth.initializeAuthState();

    if (initialized && altus4.isAuthenticated()) {
      const user = await altus4.getCurrentUser();
      if (user.success) {
        console.log('Welcome back,', user.data?.name);
        setCurrentUser(user.data);
      }
      showDashboard();
    } else {
      showLoginForm();
    }
  } catch (error) {
    console.error('App initialization failed:', error);
    showLoginForm();
  }
}

// Start app
bootstrapApp();
```

#### Login Flow

```typescript
async function handleLogin(email: string, password: string) {
  try {
    const result = await altus4.login(email, password);

    if (result.success) {
      // Login successful, refresh cookie is automatically set by backend
      console.log('Login successful:', result.user);

      // Redirect to dashboard
      window.location.href = '/dashboard';
    } else {
      // Handle login errors
      showError(result.error?.message || 'Login failed');
    }
  } catch (error) {
    console.error('Login error:', error);
    showError('Network error, please try again');
  }
}

// React example
const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await altus4.login(email, password);

      if (result.success) {
        // Redirect handled by route guard
        history.push('/dashboard');
      } else {
        setError(result.error?.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
    </form>
  );
};
```

#### Logout Flow

```typescript
async function handleLogout() {
  try {
    const result = await altus4.logout();

    if (result.success) {
      // Refresh cookie cleared by backend
      console.log('Logout successful');

      // Redirect to login
      window.location.href = '/login';
    } else {
      console.error('Logout failed:', result.error);
      // Force redirect anyway for security
      window.location.href = '/login';
    }
  } catch (error) {
    console.error('Logout error:', error);
    // Force redirect for security
    window.location.href = '/login';
  }
}
```

#### Automatic Token Refresh

The SDK automatically handles token refresh on API requests:

```typescript
// This request will automatically refresh the token if needed
try {
  const dashboard = await altus4.analytics.getDashboardAnalytics();
  // Token was valid or automatically refreshed
  displayDashboard(dashboard.data);
} catch (error) {
  if (error.response?.status === 401) {
    // Refresh failed, redirect to login
    window.location.href = '/login';
  } else {
    // Handle other errors
    showError('Failed to load dashboard');
  }
}
```

## JWT Token Management

For applications that need manual token management or don't support cookies.

### Manual Token Storage

```typescript
// Store tokens manually
class TokenManager {
  private accessToken: string | null = null;
  private refreshToken: string | null = null;
  private expiryTime: number | null = null;

  setTokens(accessToken: string, refreshToken: string, expiresIn: number) {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
    this.expiryTime = Date.now() + (expiresIn * 1000);

    // Store in secure storage
    this.saveToStorage();
  }

  isTokenExpired(): boolean {
    return this.expiryTime ? Date.now() >= this.expiryTime : true;
  }

  private saveToStorage() {
    // Use sessionStorage for enhanced security
    sessionStorage.setItem('accessToken', this.accessToken || '');
    sessionStorage.setItem('refreshToken', this.refreshToken || '');
    sessionStorage.setItem('expiryTime', this.expiryTime?.toString() || '');
  }

  private loadFromStorage() {
    this.accessToken = sessionStorage.getItem('accessToken');
    this.refreshToken = sessionStorage.getItem('refreshToken');
    const expiry = sessionStorage.getItem('expiryTime');
    this.expiryTime = expiry ? parseInt(expiry) : null;
  }
}

// Initialize SDK with manual token management
const tokenManager = new TokenManager();
const altus4 = new Altus4SDK({
  baseURL: '/api/v1',
});

// Login and store tokens
const result = await altus4.login(email, password);
if (result.success && result.token) {
  tokenManager.setTokens(result.token, result.refreshToken, result.expiresIn);
  altus4.setToken(result.token, result.expiresIn);
}
```

### Token Refresh Implementation

```typescript
class AuthManager {
  constructor(private sdk: Altus4SDK) {}

  async ensureValidToken(): Promise<boolean> {
    if (!this.sdk.isAuthenticated()) {
      return false;
    }

    try {
      // Try to refresh token if needed
      const refreshed = await this.sdk.refreshTokenIfNeeded();
      return refreshed;
    } catch (error) {
      console.error('Token refresh failed:', error);
      return false;
    }
  }

  async makeAuthenticatedRequest<T>(
    requestFn: () => Promise<T>
  ): Promise<T> {
    // Ensure token is valid before request
    const tokenValid = await this.ensureValidToken();

    if (!tokenValid) {
      throw new Error('Authentication required');
    }

    try {
      return await requestFn();
    } catch (error) {
      // Handle 401 responses
      if (error.response?.status === 401) {
        // Try one more time with fresh token
        const refreshed = await this.ensureValidToken();
        if (refreshed) {
          return await requestFn();
        }
        throw new Error('Authentication expired');
      }
      throw error;
    }
  }
}

// Usage
const authManager = new AuthManager(altus4);

const dashboard = await authManager.makeAuthenticatedRequest(
  () => altus4.analytics.getDashboardAnalytics()
);
```

## API Key Authentication

For server-side applications and service-to-service communication.

### Basic API Key Usage

```typescript
// Initialize with API key
const altus4 = new Altus4SDK({
  baseURL: 'https://api.altus4.com/api/v1',
  apiKey: process.env.ALTUS4_API_KEY,
});

// All requests automatically include the API key
const results = await altus4.analytics.getDashboardAnalytics();
```

### API Key Management

```typescript
// Create initial API key after user authentication
async function setupAPIKey() {
  // First, authenticate with user credentials
  const loginResult = await altus4.login(email, password);

  if (loginResult.success) {
    // Create API key for service usage
    const apiKeyResult = await altus4.apiKeys.createApiKey({
      name: 'Production Service Key',
      environment: 'live',
      permissions: ['search', 'analytics'],
      rateLimitTier: 'pro',
    });

    if (apiKeyResult.success) {
      // Store API key securely
      process.env.ALTUS4_API_KEY = apiKeyResult.data?.key;

      // Reinitialize SDK with API key
      const serviceSDK = new Altus4SDK({
        baseURL: '/api/v1',
        apiKey: apiKeyResult.data?.key,
      });

      return serviceSDK;
    }
  }
}
```

### Environment-Based Configuration

```typescript
// Different API keys for different environments
class APIKeyManager {
  private getApiKey(): string {
    switch (process.env.NODE_ENV) {
      case 'development':
        return process.env.ALTUS4_DEV_API_KEY || '';
      case 'staging':
        return process.env.ALTUS4_STAGING_API_KEY || '';
      case 'production':
        return process.env.ALTUS4_PROD_API_KEY || '';
      default:
        return process.env.ALTUS4_API_KEY || '';
    }
  }

  createSDK(): Altus4SDK {
    return new Altus4SDK({
      baseURL: process.env.ALTUS4_API_URL,
      apiKey: this.getApiKey(),
      timeout: 30000,
    });
  }
}

// Usage
const keyManager = new APIKeyManager();
const altus4 = keyManager.createSDK();
```

## Application Patterns

### Single Page Application (SPA)

React/Vue/Angular applications with cookie-based authentication:

```typescript
// App.tsx
import { Altus4SDK } from '@altus4/sdk';
import { createContext, useContext, useEffect, useState } from 'react';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const altus4 = useMemo(() => new Altus4SDK({
    baseURL: '/api/v1',
  }), []);

  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      setLoading(true);

      // Try to restore session
      const restored = await altus4.auth.restoreSession();

      if (restored && altus4.isAuthenticated()) {
        const userResult = await altus4.getCurrentUser();
        if (userResult.success) {
          setUser(userResult.data || null);
        }
      }
    } catch (error) {
      console.error('Auth initialization failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const result = await altus4.login(email, password);

      if (result.success) {
        setUser(result.user || null);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  };

  const logout = async () => {
    try {
      await altus4.logout();
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
```

### Server-Side Application

Express.js server with API key authentication:

```typescript
// server.ts
import express from 'express';
import { Altus4SDK } from '@altus4/sdk';

const app = express();

// Initialize SDK with API key
const altus4 = new Altus4SDK({
  baseURL: process.env.ALTUS4_API_URL,
  apiKey: process.env.ALTUS4_API_KEY,
});

// Middleware to provide SDK to routes
app.use((req, res, next) => {
  req.altus4 = altus4;
  next();
});

// Search endpoint
app.get('/api/search', async (req, res) => {
  try {
    const { query, databases } = req.query;

    const searchResult = await req.altus4.database.searchDatabase({
      query: query as string,
      databases: databases as string[],
      limit: 20,
    });

    if (searchResult.success) {
      res.json(searchResult.data);
    } else {
      res.status(400).json({ error: searchResult.error?.message });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Analytics endpoint
app.get('/api/analytics/dashboard', async (req, res) => {
  try {
    const { period } = req.query;

    const analytics = await req.altus4.analytics.getDashboardAnalytics({
      period: period as 'day' | 'week' | 'month' | 'year',
    });

    if (analytics.success) {
      res.json(analytics.data);
    } else {
      res.status(400).json({ error: analytics.error?.message });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
```

### Microservices Architecture

Service-specific SDK instances with different API keys:

```typescript
// services/search-service.ts
import { Altus4SDK } from '@altus4/sdk';

export class SearchService {
  private altus4: Altus4SDK;

  constructor() {
    this.altus4 = new Altus4SDK({
      baseURL: process.env.ALTUS4_API_URL,
      apiKey: process.env.ALTUS4_SEARCH_API_KEY, // Search-specific key
      timeout: 10000,
    });
  }

  async searchAllDatabases(query: string): Promise<SearchResult[]> {
    const result = await this.altus4.database.searchDatabase({
      query,
      mode: 'semantic',
      limit: 50,
    });

    if (!result.success) {
      throw new Error(`Search failed: ${result.error?.message}`);
    }

    return result.data?.results || [];
  }

  async getSearchSuggestions(partial: string): Promise<string[]> {
    const result = await this.altus4.database.getSearchSuggestions({
      partial,
      limit: 10,
    });

    return result.success ? result.data?.suggestions || [] : [];
  }
}

// services/analytics-service.ts
export class AnalyticsService {
  private altus4: Altus4SDK;

  constructor() {
    this.altus4 = new Altus4SDK({
      baseURL: process.env.ALTUS4_API_URL,
      apiKey: process.env.ALTUS4_ANALYTICS_API_KEY, // Analytics-specific key
      timeout: 30000,
    });
  }

  async getDashboardData(period: string): Promise<DashboardData> {
    const result = await this.altus4.analytics.getDashboardAnalytics({
      period: period as any,
    });

    if (!result.success) {
      throw new Error(`Analytics failed: ${result.error?.message}`);
    }

    return result.data || {};
  }
}
```

## Security Best Practices

### Token Security

1. **Never Log Tokens**: Ensure tokens never appear in logs or error messages
2. **Secure Storage**: Use sessionStorage over localStorage, HttpOnly cookies when possible
3. **Token Rotation**: Implement regular token refresh and rotation
4. **Scope Limitation**: Use minimum required permissions for API keys

```typescript
// Secure logging that filters sensitive data
class SecureLogger {
  static log(message: string, data?: any) {
    const sanitizedData = this.sanitizeData(data);
    console.log(message, sanitizedData);
  }

  private static sanitizeData(data: any): any {
    if (!data) return data;

    const sensitive = ['token', 'password', 'apiKey', 'refreshToken'];
    const sanitized = { ...data };

    sensitive.forEach(key => {
      if (sanitized[key]) {
        sanitized[key] = '[REDACTED]';
      }
    });

    return sanitized;
  }
}

// Usage
SecureLogger.log('Login attempt', { email: user.email, token: 'abc123' });
// Output: Login attempt { email: "user@example.com", token: "[REDACTED]" }
```

### API Key Management

```typescript
class SecureAPIKeyManager {
  private apiKey: string;

  constructor() {
    this.apiKey = this.loadAPIKey();
  }

  private loadAPIKey(): string {
    const key = process.env.ALTUS4_API_KEY;

    if (!key) {
      throw new Error('ALTUS4_API_KEY environment variable is required');
    }

    // Validate key format
    if (!key.startsWith('altus4_sk_')) {
      throw new Error('Invalid API key format');
    }

    return key;
  }

  getAPIKey(): string {
    return this.apiKey;
  }

  // Rotate API key
  async rotateAPIKey(): Promise<string> {
    const altus4 = new Altus4SDK({
      baseURL: process.env.ALTUS4_API_URL,
      apiKey: this.apiKey,
    });

    // Create new key
    const newKeyResult = await altus4.apiKeys.createApiKey({
      name: 'Rotated Production Key',
      environment: 'live',
      permissions: ['search', 'analytics'],
      rateLimitTier: 'pro',
    });

    if (newKeyResult.success) {
      // Revoke old key
      const oldKeyId = this.extractKeyId(this.apiKey);
      await altus4.apiKeys.revokeApiKey(oldKeyId);

      // Update stored key
      this.apiKey = newKeyResult.data?.key || '';
      return this.apiKey;
    }

    throw new Error('Key rotation failed');
  }

  private extractKeyId(key: string): string {
    // Extract key ID from API key for revocation
    return key.substring(10); // Remove 'altus4_sk_' prefix
  }
}
```

### Request Security

```typescript
// Request interceptor for security headers
class SecureClient extends Altus4SDK {
  constructor(config: ClientConfig) {
    super({
      ...config,
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'X-Client-Version': '1.0.0',
        ...config.headers,
      },
    });
  }

  // Override to add request logging
  async makeRequest<T>(requestFn: () => Promise<T>): Promise<T> {
    const startTime = Date.now();

    try {
      const result = await requestFn();

      // Log successful requests (without sensitive data)
      SecureLogger.log('Request completed', {
        duration: Date.now() - startTime,
        timestamp: new Date().toISOString(),
      });

      return result;
    } catch (error) {
      // Log errors (without sensitive data)
      SecureLogger.log('Request failed', {
        error: error.message,
        duration: Date.now() - startTime,
      });

      throw error;
    }
  }
}
```

### Environment-Specific Security

```typescript
class EnvironmentConfig {
  static getSecurityConfig() {
    const isProduction = process.env.NODE_ENV === 'production';

    return {
      // HTTPS enforcement
      enforceHTTPS: isProduction,

      // Token settings
      tokenStorage: isProduction ? 'cookie' : 'sessionStorage',
      tokenExpiry: isProduction ? 3600 : 86400, // 1 hour vs 24 hours

      // Request settings
      timeout: isProduction ? 30000 : 60000,
      retryAttempts: isProduction ? 3 : 1,

      // Logging
      debugMode: !isProduction,
      logLevel: isProduction ? 'error' : 'debug',
    };
  }

  static createSDK(): Altus4SDK {
    const config = this.getSecurityConfig();

    return new Altus4SDK({
      baseURL: process.env.ALTUS4_API_URL,
      timeout: config.timeout,
      debug: config.debugMode,
      headers: {
        'X-Environment': process.env.NODE_ENV || 'development',
      },
    });
  }
}
```

## Migration Guide

### From Local Storage to Cookie Authentication

```typescript
// OLD: Local storage authentication
class OldAuthManager {
  login(email: string, password: string) {
    // ... authenticate
    localStorage.setItem('token', token);
    localStorage.setItem('refreshToken', refreshToken);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }
}

// NEW: Cookie-based authentication
class NewAuthManager {
  constructor(private sdk: Altus4SDK) {}

  async login(email: string, password: string) {
    const result = await this.sdk.login(email, password);
    // Tokens are automatically managed by SDK + cookies
    return result;
  }

  async initializeAuth() {
    // Restore session from cookies
    return await this.sdk.auth.restoreSession();
  }
}
```

### Migration Steps

1. **Update Backend**: Add cookie support to login/refresh endpoints
2. **Update Client**: Replace manual token storage with SDK session management
3. **Test Migration**: Ensure existing sessions continue to work
4. **Deploy Gradually**: Use feature flags for gradual rollout

```typescript
// Migration-safe authentication
class MigrationAuthManager {
  constructor(private sdk: Altus4SDK) {}

  async initializeAuth(): Promise<boolean> {
    try {
      // Try new cookie-based auth first
      const restored = await this.sdk.auth.restoreSession();
      if (restored) return true;

      // Fallback to localStorage token
      const oldToken = localStorage.getItem('token');
      if (oldToken) {
        this.sdk.setToken(oldToken);

        // Clear old storage
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');

        return true;
      }

      return false;
    } catch (error) {
      console.error('Auth migration failed:', error);
      return false;
    }
  }
}
```

---

The Altus 4 SDK's authentication system provides enterprise-grade security with developer-friendly APIs. Choose the authentication strategy that best fits your application architecture, and leverage the SDK's automatic token management for secure, seamless user experiences.