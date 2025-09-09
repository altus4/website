---
title: API Reference
description: Complete API documentation for Altus 4 including authentication, endpoints, and usage examples.
---

# API Reference

Complete API Documentation for Altus 4

Altus 4 provides a RESTful API for managing database connections, executing searches, and accessing analytics. All endpoints follow REST conventions and return JSON responses.

## Authentication

Altus 4 uses **dual authentication** depending on the endpoint type:

- **JWT Tokens**: For user management, API key management, database management, and analytics endpoints under `/api/v1/analytics/*`
- **API Keys**: For search routes under `/api/v1/search*` (service-to-service)

### Authentication Flow

1. **Register** a new user account
2. **Login** to receive a JWT token
3. **Create** your first API key using the JWT token
4. **Use JWT tokens** for account management (profile, API key management)
5. **Use API keys** for search operations and analytics

```bash
# Use JWT token for account management
Authorization: Bearer <jwt-token>

# Use API key for search operations
Authorization: Bearer <api-key>
```

**API Key Format**: `altus4_sk_live_abc123def456...` (live) or `altus4_sk_test_xyz789abc123...` (test)

### Authentication Endpoints

| Method   | Endpoint                              | Description             | Auth |
| -------- | ------------------------------------- | ----------------------- | ---- |
| `POST`   | `/api/v1/auth/register`               | Register new user       | None |
| `POST`   | `/api/v1/auth/login`                  | User login              | None |
| `GET`    | `/api/v1/auth/profile`                | Get user profile        | JWT  |
| `PUT`    | `/api/v1/auth/profile`                | Update user profile     | JWT  |
| `POST`   | `/api/v1/auth/change-password`        | Change user password    | JWT  |
| `POST`   | `/api/v1/auth/refresh`                | Refresh JWT token       | JWT  |
| `POST`   | `/api/v1/auth/logout`                 | Logout user             | JWT  |
| `DELETE` | `/api/v1/auth/account`                | Deactivate account      | JWT  |
| `POST`   | `/api/v1/management/setup`            | Create first API key    | JWT  |
| `GET`    | `/api/v1/management/migration-status` | Check migration status  | JWT  |
| `POST`   | `/api/v1/keys`                        | Create new API key      | JWT  |
| `GET`    | `/api/v1/keys`                        | List API keys           | JWT  |
| `PUT`    | `/api/v1/keys/:keyId`                 | Update API key          | JWT  |
| `DELETE` | `/api/v1/keys/:keyId`                 | Revoke API key          | JWT  |
| `GET`    | `/api/v1/keys/:keyId/usage`           | Get API key usage stats | JWT  |
| `POST`   | `/api/v1/keys/:keyId/regenerate`      | Regenerate API key      | JWT  |

[**→ Complete API Key Authentication Guide**](./authentication.md)

## Database Management

Manage MySQL database connections for searching.

### Database Endpoints

| Method   | Endpoint                                 | Description                | Auth |
| -------- | ---------------------------------------- | -------------------------- | ---- |
| `GET`    | `/api/v1/databases`                      | List user databases        | JWT  |
| `POST`   | `/api/v1/databases`                      | Add database connection    | JWT  |
| `GET`    | `/api/v1/databases/:connectionId`        | Get database details       | JWT  |
| `PUT`    | `/api/v1/databases/:connectionId`        | Update database connection | JWT  |
| `DELETE` | `/api/v1/databases/:connectionId`        | Remove database connection | JWT  |
| `POST`   | `/api/v1/databases/:connectionId/test`   | Test database connection   | JWT  |
| `GET`    | `/api/v1/databases/:connectionId/schema` | Get database schema        | JWT  |
| `GET`    | `/api/v1/databases/status`               | Get connection statuses    | JWT  |

[**Complete Database Documentation**](./database.md)

## Search Operations

Execute searches across connected databases with AI enhancements.

### Search Endpoints

| Method | Endpoint                     | Description               | Auth    |
| ------ | ---------------------------- | ------------------------- | ------- |
| `POST` | `/api/v1/search`             | Execute search            | API Key |
| `GET`  | `/api/v1/search/suggestions` | Get search suggestions    | API Key |
| `POST` | `/api/v1/search/analyze`     | Analyze query performance | API Key |
| `GET`  | `/api/v1/search/history`     | Get search history        | API Key |
| `GET`  | `/api/v1/search/trends`      | Get user search trends    | API Key |

Note: API keys must include `search` permission for search and suggestions; `analytics` permission is required for analyze and trends.

[**Complete Search Documentation**](./search.md)

## Analytics & Insights

Access search analytics, performance metrics, and trend data.

### Analytics Endpoints

| Method | Endpoint                                      | Description                    | Auth        |
| ------ | --------------------------------------------- | ------------------------------ | ----------- |
| `GET`  | `/api/v1/analytics/dashboard`                 | Get dashboard data             | JWT         |
| `GET`  | `/api/v1/analytics/search-trends`             | Get search trends              | JWT         |
| `GET`  | `/api/v1/analytics/performance`               | Get performance metrics        | JWT         |
| `GET`  | `/api/v1/analytics/popular-queries`           | Get popular queries            | JWT         |
| `GET`  | `/api/v1/analytics/search-history`            | Get search history             | JWT         |
| `GET`  | `/api/v1/analytics/insights`                  | Get AI-generated insights      | JWT         |
| `GET`  | `/api/v1/analytics/admin/system-overview`     | Get system overview (admin)    | JWT (admin) |
| `GET`  | `/api/v1/analytics/admin/user-activity`       | Get user activity (admin)      | JWT (admin) |
| `GET`  | `/api/v1/analytics/admin/performance-metrics` | Get system performance (admin) | JWT (admin) |

[**Complete Analytics Documentation**](./analytics.md)

## System Endpoints

Health checks and system information.

| Method | Endpoint                    | Description         | Auth |
| ------ | --------------------------- | ------------------- | ---- |
| `GET`  | `/health`                   | System health check | None |
| `GET`  | `/api/v1/management/health` | Management health   | None |

## Request/Response Format

### Standard Response Format

All API responses follow this structure:

```typescript
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
    executionTime?: number;
  };
}
```

### Success Response Examples

#### User Registration Response

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "dc6e0cee-efe8-4134-be55-249d6a36ae19",
      "email": "user@example.com",
      "name": "Test User",
      "role": "user",
      "connectedDatabases": [],
      "createdAt": "2025-09-06T16:19:56.195Z",
      "lastActive": "2025-09-06T16:19:56.195Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "meta": {
    "timestamp": "2025-09-06T16:19:56.197Z",
    "requestId": "1b53d9d6-ca2e-4b99-959b-8459820475b4",
    "version": "0.3.0"
  }
}
```

#### API Key Creation Response

```json
{
  "success": true,
  "data": {
    "apiKey": {
      "id": "9c81d4cf-fff8-48d0-994a-adc07e56bff3",
      "name": "Initial API Key",
      "keyPrefix": "altus4_sk_test_8wEp0HQVYpT6POU",
      "environment": "test",
      "permissions": ["search"],
      "rateLimitTier": "free",
      "createdAt": "2025-09-06T16:20:01.401Z"
    },
    "secretKey": "altus4_sk_test_8wEp0HQVYpT6POUumHNuFdvK9gMw3y2Wa9a_BjVoOJw",
    "warning": "This is the only time the full API key will be shown. Please store it securely."
  },
  "meta": {
    "timestamp": "2025-09-06T16:20:01.403Z",
    "requestId": "fb62455b-8ccd-4cbb-898a-606ba936e25c",
    "version": "0.3.0"
  }
}
```

### Error Response Example

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request parameters",
    "details": {
      "field": "query",
      "reason": "Query cannot be empty"
    }
  },
  "meta": {
    "timestamp": "2024-01-15T10:30:00.000Z",
    "requestId": "req_abc123",
    "version": "0.3.0"
  }
}
```

## Error Handling

### HTTP Status Codes

| Status | Code                  | Description              | Common Causes                      |
| ------ | --------------------- | ------------------------ | ---------------------------------- |
| 200    | OK                    | Request successful       | -                                  |
| 201    | Created               | Resource created         | Registration, database connection  |
| 400    | Bad Request           | Invalid request          | Missing/invalid parameters         |
| 401    | Unauthorized          | Authentication required  | Missing/invalid API key            |
| 403    | Forbidden             | Insufficient permissions | API key lacks required permissions |
| 404    | Not Found             | Resource not found       | Invalid database/search ID         |
| 429    | Too Many Requests     | Rate limit exceeded      | Too many API calls                 |
| 500    | Internal Server Error | Server error             | Database/Redis connectivity issues |

### Error Codes

| Error Code                 | HTTP Status | Description                           |
| -------------------------- | ----------- | ------------------------------------- |
| `INVALID_API_KEY`          | 401         | Missing or invalid API key            |
| `INSUFFICIENT_PERMISSIONS` | 403         | API key lacks required permissions    |
| `NOT_FOUND`                | 404         | Resource not found                    |
| `VALIDATION_ERROR`         | 400         | Invalid request data                  |
| `RATE_LIMIT_EXCEEDED`      | 429         | Too many requests (tiered by API key) |
| `DATABASE_ERROR`           | 500         | Database connectivity/query error     |
| `CACHE_ERROR`              | 500         | Redis connectivity error              |
| `AI_SERVICE_ERROR`         | 500         | OpenAI API error                      |
| `INTERNAL_ERROR`           | 500         | Unexpected server error               |

[**Complete Error Documentation**](./errors.md)

## Rate Limiting

API requests are rate-limited based on your API key tier for fair usage and system stability.

### Rate Limit Tiers

| Tier           | Requests/Hour | Use Case             | Block Duration |
| -------------- | ------------- | -------------------- | -------------- |
| **Free**       | 1,000         | Development, testing | 5 minutes      |
| **Pro**        | 10,000        | Small-medium prod    | 5 minutes      |
| **Enterprise** | 100,000       | Large scale prod     | 1 minute       |

### Rate Limiting for Authentication

- **Registration/Login**: 10 requests per minute (IP-based)
- **API key management**: Based on your API key tier

### Rate Limit Headers

```http
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 2024-01-15T12:00:00Z
X-RateLimit-Tier: Free
```

### Rate Limit Exceeded Response

```json
{
  "success": false,
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Rate limit exceeded. Try again in 45 seconds.",
    "details": {
      "limit": 1000,
      "remaining": 0,
      "resetTime": "2024-01-15T10:31:00.000Z",
      "tier": "Free",
      "upgradeMessage": "Upgrade to Pro or Enterprise for higher rate limits"
    }
  }
}
```

## Request Examples

### cURL Examples

```bash
# Register new user
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "secure_password",
    "name": "Test User"
  }'

# Login and get JWT token (for initial setup only)
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "secure_password"
  }'

# Create your first API key
curl -X POST http://localhost:3000/api/v1/management/setup \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Execute search with API key (use for all subsequent requests)
curl -X POST http://localhost:3000/api/v1/search \
  -H "Authorization: Bearer altus4_sk_test_abc123def456..." \
  -H "Content-Type: application/json" \
  -d '{
    "query": "mysql performance optimization",
    "databases": ["db-uuid-1", "db-uuid-2"],
    "searchMode": "semantic",
    "limit": 20
  }'
```

### JavaScript/Node.js Examples

```javascript
// Using fetch API
const response = await fetch('http://localhost:3000/api/v1/search', {
  method: 'POST',
  headers: {
    Authorization: `Bearer ${apiKey}`, // altus4_sk_live_abc123...
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    query: 'database optimization',
    databases: ['db-uuid-1'],
    searchMode: 'natural',
    limit: 10,
  }),
});

const result = await response.json();
console.log(result.data.results);
```

### Python Examples

```python
import requests

# Search request
response = requests.post(
    'http://localhost:3000/api/v1/search',
    headers={
        'Authorization': f'Bearer {api_key}',  # altus4_sk_live_abc123...
        'Content-Type': 'application/json'
    },
    json={
        'query': 'performance tuning',
        'databases': ['db-uuid-1'],
        'searchMode': 'boolean',
        'limit': 15
    }
)

data = response.json()
print(data['data']['results'])
```

## Related Documentation

- **[API Key Authentication Guide](./authentication.md)** - Complete API key setup and usage
- **[Database Management](./database.md)** - Managing database connections
- **[Search Operations](./search.md)** - Search API and features
- **[Analytics API](./analytics.md)** - Analytics and insights
- **[Request/Response Schemas](#request-response-examples)** - Complete type definitions
- **[Error Handling](./errors.md)** - Error codes and troubleshooting

## Need Help?

Check out:

- [API Key Authentication Guide](./authentication.md)
- [Search Operations](./search.md)
- [Database Management](./database.md)
- [Analytics API](./analytics.md)
  Or open an issue if you find problems.
