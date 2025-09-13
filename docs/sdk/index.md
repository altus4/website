---
title: SDK Overview
description: Official SDKs for the Altus 4 AI-Enhanced MySQL Full-Text Search Engine
---

# SDK Overview

Welcome to the Altus 4 SDK documentation. The Altus 4 SDKs provide type-safe, developer-friendly interfaces to integrate AI-Enhanced MySQL Full-Text Search capabilities into your applications.

::: tip Quick Navigation

- [TypeScript SDK](/sdk/typescript) - Comprehensive TypeScript SDK with full type safety
- [Authentication Guide](/sdk/authentication) - Cookie-based authentication patterns
- [Integration Examples](/sdk/examples) - Real-world integration examples
- [Best Practices](/sdk/best-practices) - Recommended usage patterns
:::

## Available SDKs

### TypeScript SDK (`@altus4/sdk`)

The official TypeScript SDK provides comprehensive access to all Altus 4 features with full type safety and modern development practices.

**Features:**

- **Complete Authentication** - JWT with automatic refresh and cookie support
- **API Key Management** - Tiered permissions and usage tracking
- **Database Connections** - MySQL connection management with health monitoring
- **Analytics & Insights** - Search trends and AI-powered insights
- **System Management** - Health checks and monitoring
- **Full TypeScript Support** - Comprehensive type definitions
- **Modular Design** - Use individual services or unified interface
- **Utility Functions** - Built-in validation, formatting, and helpers

```bash
npm install @altus4/sdk
```

**Quick Start:**

```typescript
import { Altus4SDK } from '@altus4/sdk';

const altus4 = new Altus4SDK({
  baseURL: 'https://api.altus4.com/api/v1'
});

// Authenticate
const result = await altus4.login('user@example.com', 'password');
if (result.success) {
  // Start using the API
  const dashboard = await altus4.analytics.getDashboardAnalytics({
    period: 'week'
  });
}
```

### Future SDKs

**Python SDK** (Planned)

- Native Python integration with type hints
- AsyncIO support for high-performance applications
- Django and FastAPI integration helpers

**Go SDK** (Planned)

- Idiomatic Go interfaces with proper error handling
- Context support for cancellation and timeouts
- Goroutine-safe concurrent usage

**Java SDK** (Planned)

- Modern Java with records and sealed classes
- Spring Boot integration
- Reactive programming support

## SDK Architecture

All Altus 4 SDKs follow consistent architectural patterns:

### Service-Oriented Design

Each SDK is organized into specialized services:

- **AuthService** - User authentication and session management
- **ApiKeysService** - API key lifecycle and permissions
- **DatabaseService** - Database connection management
- **AnalyticsService** - Search analytics and insights
- **ManagementService** - System health and monitoring

### Unified Interface

While services can be used individually, each SDK provides a unified interface class (`Altus4SDK`, `Altus4Client`, etc.) that orchestrates all services with shared configuration.

### Consistent Error Handling

All SDKs use standardized error patterns:

```typescript
// TypeScript SDK
interface ApiResponse<T> {
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

### Authentication Management

All SDKs support multiple authentication strategies:

1. **JWT with Refresh** - Short-lived access tokens with secure refresh
2. **Cookie-based Refresh** - HttpOnly cookies for enhanced security
3. **API Key Authentication** - Service-to-service authentication
4. **Automatic Token Management** - Transparent token refresh and retry

## Common Usage Patterns

### Application Bootstrap

Most applications follow this initialization pattern:

```typescript
// Initialize SDK
const altus4 = new Altus4SDK({ baseURL: '/api/v1' });

// Restore session from cookies
const restored = await altus4.auth.restoreSession();

if (restored && altus4.isAuthenticated()) {
  // User is authenticated, proceed to app
  showDashboard();
} else {
  // Redirect to login
  showLoginForm();
}
```

### Error Handling

Consistent error handling across all operations:

```typescript
try {
  const result = await altus4.database.addDatabaseConnection(config);

  if (!result.success) {
    // Handle API errors
    handleError(result.error?.message);
    return;
  }

  // Process successful result
  processDatabase(result.data);
} catch (error) {
  // Handle network errors
  handleNetworkError(error);
}
```

### Service Usage

Services can be used independently or through the unified interface:

```typescript
// Via unified interface
const dashboard = await altus4.analytics.getDashboardAnalytics();

// Or independently
import { AnalyticsService } from '@altus4/sdk';
const analytics = new AnalyticsService({ baseURL: '/api/v1' });
const dashboard = await analytics.getDashboardAnalytics();
```

## Integration Approaches

### Single Page Applications (SPA)

For React, Vue, Angular, and similar frameworks:

```typescript
// App initialization
const altus4 = new Altus4SDK({
  baseURL: process.env.REACT_APP_API_URL
});

// Authentication context
const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    altus4.isAuthenticated()
  );

  const login = async (email: string, password: string) => {
    const result = await altus4.login(email, password);
    setIsAuthenticated(result.success);
    return result;
  };

  return { isAuthenticated, login };
};
```

### Server-Side Applications

For Node.js, Express, and server-side frameworks:

```typescript
// Middleware for API key authentication
const altus4 = new Altus4SDK({
  baseURL: process.env.ALTUS4_API_URL,
  apiKey: process.env.ALTUS4_API_KEY,
});

app.get('/search', async (req, res) => {
  try {
    const results = await altus4.database.searchDatabase(req.query);
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

### Microservices

For distributed architectures:

```typescript
// Service-specific configuration
class SearchMicroservice {
  private altus4 = new Altus4SDK({
    baseURL: process.env.ALTUS4_API_URL,
    apiKey: process.env.ALTUS4_SEARCH_API_KEY,
    timeout: 10000,
  });

  async performSearch(query: SearchRequest) {
    return await this.altus4.database.searchDatabase(query);
  }
}
```

## Performance Considerations

### Connection Pooling

SDKs automatically handle connection pooling and reuse:

```typescript
// Multiple requests reuse the same underlying connection
const [users, products, articles] = await Promise.all([
  altus4.database.searchDatabase({ query: 'users', table: 'users' }),
  altus4.database.searchDatabase({ query: 'products', table: 'products' }),
  altus4.database.searchDatabase({ query: 'articles', table: 'articles' }),
]);
```

### Caching

Results are cached appropriately based on content type:

- **User profiles**: Cached for 15 minutes
- **API key metadata**: Cached for 1 hour
- **Database schemas**: Cached for 24 hours
- **Search results**: Not cached (real-time data)

### Request Optimization

SDKs optimize requests automatically:

- **Batch operations** where supported
- **Compression** for large payloads
- **Connection reuse** for multiple requests
- **Automatic retries** with exponential backoff

## Security Best Practices

### Token Management

- Access tokens stored in memory only
- Refresh tokens stored as HttpOnly cookies
- Automatic token rotation and cleanup
- Secure storage fallbacks when needed

### API Key Security

- API keys never logged or exposed in client code
- Environment variable configuration
- Rotation and revocation capabilities
- IP-based access restrictions

### Request Security

- HTTPS enforcement for production
- Request signing for sensitive operations
- Input validation and sanitization
- CORS and CSP header compliance

## Migration Guide

### From Direct API Usage

If you're currently using the Altus 4 API directly:

```typescript
// Before: Direct API calls
const response = await fetch('/api/v1/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password })
});
const result = await response.json();

// After: SDK usage
const result = await altus4.login(email, password);
```

Benefits of migration:

- Automatic error handling and retry logic
- Type safety and IntelliSense support
- Consistent response formats
- Built-in authentication management
- Reduced boilerplate code

### From Other Search Solutions

If you're migrating from Elasticsearch, Solr, or other search engines:

```typescript
// Altus 4 leverages your existing MySQL data
const results = await altus4.database.searchDatabase({
  query: 'machine learning',
  databases: ['blog_posts'],
  mode: 'semantic', // AI-enhanced semantic search
  limit: 20
});

// No data migration needed - works with your existing MySQL tables
```

## Support and Resources

### Documentation

- [TypeScript SDK](/sdk/typescript) - Complete API reference
- [Integration Examples](/sdk/examples) - Real-world usage examples
- [Best Practices](/sdk/best-practices) - Recommended patterns
- [API Reference](/api/) - Underlying API documentation

### Community

- **GitHub Issues** - Bug reports and feature requests
- **API Documentation** - Complete endpoint reference
- **Code Examples** - Sample implementations
- **Best Practices Guide** - Production-ready patterns

### Getting Help

1. Check the SDK documentation and type definitions
2. Review integration examples for your use case
3. Consult the API documentation for endpoint details
4. Follow established patterns in the codebase
5. Ensure proper error handling and validation

---

Ready to get started? Choose your preferred SDK and follow the integration guide for your platform.