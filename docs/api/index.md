---
title: API Reference
description: Complete API documentation for Altus 4 including authentication, endpoints, and usage examples.
---

# API Reference

Complete API Documentation for Altus 4

Altus 4 provides a RESTful API for managing database connections, executing searches, and accessing analytics. All endpoints follow REST conventions and return JSON responses.

## Authentication

All API endpoints require API key authentication for B2B service integration.

### Authentication Flow

1. __Register__ a new user account
2. __Create__ your first API key using the management endpoint
3. __Include API key__ in `Authorization` header for all subsequent requests

```bash
# Include API key in all requests
Authorization: Bearer <your-api-key>
```

__API Key Format__: `altus4_sk_live_abc123def456...` (live) or `altus4_sk_test_xyz789abc123...` (test)

### Authentication Endpoints

| Method   | Endpoint                   | Description             | Auth Required |
| -------- | -------------------------- | ----------------------- | ------------- |
| `POST`   | `/api/auth/register`       | Register new user       | No            |
| `POST`   | `/api/auth/login`          | User login              | No            |
| `POST`   | `/api/management/setup`    | Create first API key    | JWT Token     |
| `POST`   | `/api/keys`                | Create new API key      | API Key       |
| `GET`    | `/api/keys`                | List API keys           | API Key       |
| `PUT`    | `/api/keys/:id`            | Update API key          | API Key       |
| `DELETE` | `/api/keys/:id`            | Revoke API key          | API Key       |
| `GET`    | `/api/keys/:id/usage`      | Get API key usage stats | API Key       |
| `POST`   | `/api/keys/:id/regenerate` | Regenerate API key      | API Key       |

[__→ Complete API Key Authentication Guide__](./authentication.md)

## Database Management

Manage MySQL database connections for searching.

### Database Endpoints

| Method   | Endpoint                    | Description                | Auth Required |
| -------- | --------------------------- | -------------------------- | ------------- |
| `GET`    | `/api/databases`            | List user databases        | API Key       |
| `POST`   | `/api/databases`            | Add database connection    | API Key       |
| `GET`    | `/api/databases/:id`        | Get database details       | API Key       |
| `PUT`    | `/api/databases/:id`        | Update database connection | API Key       |
| `DELETE` | `/api/databases/:id`        | Remove database connection | API Key       |
| `POST`   | `/api/databases/:id/test`   | Test database connection   | API Key       |
| `GET`    | `/api/databases/:id/schema` | Get database schema        | API Key       |
| `GET`    | `/api/databases/:id/status` | Get connection status      | API Key       |

[__Complete Database Documentation__](./database.md)

## Search Operations

Execute searches across connected databases with AI enhancements.

### Search Endpoints

| Method | Endpoint                  | Description               | Auth Required |
| ------ | ------------------------- | ------------------------- | ------------- |
| `POST` | `/api/search`             | Execute search            | API Key       |
| `GET`  | `/api/search/suggestions` | Get search suggestions    | API Key       |
| `POST` | `/api/search/analyze`     | Analyze query performance | API Key       |
| `GET`  | `/api/search/history`     | Get search history        | API Key       |
| `GET`  | `/api/search/trends`      | Get user search trends    | API Key       |

[__Complete Search Documentation__](./search.md)

## Analytics & Insights

Access search analytics, performance metrics, and trend data.

### Analytics Endpoints

| Method | Endpoint                         | Description               | Auth Required |
| ------ | -------------------------------- | ------------------------- | ------------- |
| `GET`  | `/api/analytics/dashboard`       | Get dashboard data        | API Key       |
| `GET`  | `/api/analytics/trends`          | Get search trends         | API Key       |
| `GET`  | `/api/analytics/performance`     | Get performance metrics   | API Key       |
| `GET`  | `/api/analytics/popular-queries` | Get popular queries       | API Key       |
| `GET`  | `/api/analytics/insights`        | Get AI-generated insights | API Key       |
| `GET`  | `/api/analytics/overview`        | Get system overview       | API Key       |
| `GET`  | `/api/analytics/user-activity`   | Get user activity metrics | API Key       |

[__Complete Analytics Documentation__](./analytics.md)

## System Endpoints

Health checks and system information.

| Method | Endpoint        | Description           | Auth Required |
| ------ | --------------- | --------------------- | ------------- |
| `GET`  | `/health`       | System health check   | No            |
| `GET`  | `/health/db`    | Database health check | No            |
| `GET`  | `/health/redis` | Redis health check    | No            |
| `GET`  | `/version`      | API version info      | No            |

## Request/Response Format

### Standard Response Format

All API responses follow this structure:

```typescript
interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: {
    code: string
    message: string
    details?: any
  }
  meta?: {
    timestamp: Date
    requestId: string
    version: string
    executionTime?: number
  }
}
```

### Success Response Example

```json
{
  "success": true,
  "data": {
    "results": [...],
    "totalCount": 42,
    "executionTime": 123
  },
  "meta": {
    "timestamp": "2024-01-15T10:30:00.000Z",
    "requestId": "req_abc123",
    "version": "0.1.0",
    "executionTime": 123
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
    "version": "0.1.0"
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

[__Complete Error Documentation__](./errors.md)

## Rate Limiting

API requests are rate-limited based on your API key tier for fair usage and system stability.

### Rate Limit Tiers

| Tier           | Requests/Hour | Use Case             | Block Duration |
| -------------- | ------------- | -------------------- | -------------- |
| __Free__       | 1,000         | Development, testing | 5 minutes      |
| __Pro__        | 10,000        | Small-medium prod    | 5 minutes      |
| __Enterprise__ | 100,000       | Large scale prod     | 1 minute       |

### Rate Limiting for Authentication

- __Registration/Login__: 10 requests per minute (IP-based)
- __API key management__: Based on your API key tier

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
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "secure_password",
    "name": "Test User"
  }'

# Login and get JWT token (for initial setup only)
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "secure_password"
  }'

# Create your first API key
curl -X POST http://localhost:3000/api/management/setup \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Execute search with API key (use for all subsequent requests)
curl -X POST http://localhost:3000/api/search \
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
const response = await fetch('http://localhost:3000/api/search', {
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
})

const result = await response.json()
console.log(result.data.results)
```

### Python Examples

```python
import requests

# Search request
response = requests.post(
    'http://localhost:3000/api/search',
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

- __[API Key Authentication Guide](./authentication.md)__ - Complete API key setup and usage
- __[Database Management](./database.md)__ - Managing database connections
- __[Search Operations](./search.md)__ - Search API and features
- __[Analytics API](./analytics.md)__ - Analytics and insights
- __[Request/Response Schemas](#request-response-examples)__ - Complete type definitions
- __[Error Handling](./errors.md)__ - Error codes and troubleshooting

## API Testing

### Testing Tools

- __[Postman Collection](./postman-collection.json)__ - Import ready-to-use requests
- __[OpenAPI Spec](./openapi.yaml)__ - Machine-readable API definition
- __[Insomnia Workspace](./insomnia-workspace.json)__ - Alternative REST client

### Testing Checklist

- [ ] Authentication flow (register, login, API key creation)
- [ ] API key management (create, list, update, revoke keys)
- [ ] Database management (add, test, remove connections)
- [ ] Search operations (natural, boolean, semantic modes)
- [ ] Error handling (invalid requests, authentication failures)
- [ ] Rate limiting (exceeding request limits by tier)
- [ ] Analytics access (trends, performance metrics)

---

__Need help?__ Check out the [examples section](../examples/) for practical implementations or [report issues](https://github.com/yourusername/altus4/issues) if you find any problems.
