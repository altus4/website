---
title: API Authentication
description: Complete guide to authenticating with the Altus 4 API using API keys and managing authentication lifecycle.
---

# API Authentication

Complete Authentication Guide for Altus 4 API

Altus 4 uses API key-based authentication for all service integration. This provides secure, long-lived credentials perfect for B2B service integration with tiered permissions and rate limiting.

## Authentication Overview

### Authentication Flow

1. __Register__ a new user account
2. __Login__ to get a bootstrap JWT token (one-time use)
3. __Create__ your first API key using the JWT token
4. __Use API key__ for all subsequent requests

```mermaid
graph TD
    A[User Registration] --> B[Login with Password]
    B --> C[Receive JWT Token<br/>Bootstrap Only]
    C --> D[Create API Key<br/>Using JWT Token]
    D --> E[Use API Key for All Requests]
    E --> F[API Key Validation<br/>Every Request]
```

### API Key Format

API keys follow a structured format for easy identification:

- __Live Environment__: `altus4_sk_live_abc123def456...`
- __Test Environment__: `altus4_sk_test_xyz789abc123...`

The format includes:

- `altus4` - Service identifier
- `sk` - Secret key type
- `live/test` - Environment indicator
- Random secure token - Actual authentication material

## Authentication Endpoints

### User Registration

Register a new user account to begin the authentication process.

__Endpoint__: `POST /api/auth/register`

__Headers__:

```http
Content-Type: application/json
```

__Request Body__:

```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!",
  "name": "John Doe"
}
```

__Response__:

```json
{
  "success": true,
  "data": {
    "id": "user_abc123",
    "email": "user@example.com",
    "name": "John Doe",
    "createdAt": "2024-01-15T10:30:00.000Z"
  },
  "meta": {
    "timestamp": "2024-01-15T10:30:00.000Z",
    "requestId": "req_abc123"
  }
}
```

__cURL Example__:

```bash
curl -X POST https://api.altus4.dev/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePassword123!",
    "name": "John Doe"
  }'
```

### User Login

Login to receive a JWT token for API key creation. This JWT token should only be used to create your initial API key.

__Endpoint__: `POST /api/auth/login`

__Headers__:

```http
Content-Type: application/json
```

__Request Body__:

```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!"
}
```

__Response__:

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_abc123",
      "email": "user@example.com",
      "name": "John Doe"
    },
    "tokens": {
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "refreshToken": "rt_def456...",
      "expiresIn": 604800
    }
  }
}
```

__cURL Example__:

```bash
curl -X POST https://api.altus4.dev/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePassword123!"
  }'
```

### Create Initial API Key

Create your first API key using the JWT token from login. This is a one-time setup process.

__Endpoint__: `POST /api/management/setup`

__Headers__:

```http
Authorization: Bearer <JWT_TOKEN_FROM_LOGIN>
```

__Response__:

```json
{
  "success": true,
  "data": {
    "apiKey": {
      "id": "key_abc123",
      "key": "altus4_sk_live_abc123def456...",
      "name": "My First API Key",
      "tier": "free",
      "permissions": ["search", "database:read"],
      "environment": "live",
      "createdAt": "2024-01-15T10:30:00.000Z"
    }
  }
}
```

__cURL Example__:

```bash
curl -X POST https://api.altus4.dev/api/management/setup \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

## API Key Management

Once you have your initial API key, use it to manage additional keys and your account.

### Create New API Key

Create additional API keys for different environments or use cases.

__Endpoint__: `POST /api/keys`

__Headers__:

```http
Authorization: Bearer <YOUR_API_KEY>
Content-Type: application/json
```

__Request Body__:

```json
{
  "name": "Production API Key",
  "tier": "pro",
  "permissions": ["search", "analytics", "database:write"],
  "environment": "live"
}
```

__Response__:

```json
{
  "success": true,
  "data": {
    "apiKey": {
      "id": "key_def456",
      "key": "altus4_sk_live_def456ghi789...",
      "name": "Production API Key",
      "tier": "pro",
      "permissions": ["search", "analytics", "database:write"],
      "environment": "live",
      "rateLimit": {
        "requestsPerHour": 10000,
        "burstLimit": 100
      },
      "createdAt": "2024-01-15T10:30:00.000Z"
    }
  }
}
```

### List API Keys

Retrieve all API keys associated with your account.

__Endpoint__: `GET /api/keys`

__Headers__:

```http
Authorization: Bearer <YOUR_API_KEY>
```

__Response__:

```json
{
  "success": true,
  "data": {
    "apiKeys": [
      {
        "id": "key_abc123",
        "name": "My First API Key",
        "tier": "free",
        "permissions": ["search", "database:read"],
        "environment": "live",
        "lastUsed": "2024-01-15T09:30:00.000Z",
        "createdAt": "2024-01-15T08:30:00.000Z",
        "status": "active"
      }
    ],
    "total": 1
  }
}
```

### Update API Key

Update an existing API key's name, tier, or permissions.

__Endpoint__: `PUT /api/keys/:keyId`

__Headers__:

```http
Authorization: Bearer <YOUR_API_KEY>
Content-Type: application/json
```

__Request Body__:

```json
{
  "name": "Updated Production Key",
  "tier": "enterprise",
  "permissions": ["search", "analytics", "database:write", "admin"]
}
```

### Revoke API Key

Permanently revoke an API key. This action cannot be undone.

__Endpoint__: `DELETE /api/keys/:keyId`

__Headers__:

```http
Authorization: Bearer <YOUR_API_KEY>
```

__Response__:

```json
{
  "success": true,
  "data": {
    "message": "API key revoked successfully",
    "revokedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

### Regenerate API Key

Generate a new secret for an existing API key while maintaining the same ID and settings.

__Endpoint__: `POST /api/keys/:keyId/regenerate`

__Headers__:

```http
Authorization: Bearer <YOUR_API_KEY>
```

__Response__:

```json
{
  "success": true,
  "data": {
    "apiKey": {
      "id": "key_abc123",
      "key": "altus4_sk_live_newtoken123...",
      "name": "My First API Key",
      "regeneratedAt": "2024-01-15T10:30:00.000Z"
    },
    "warning": "The old API key is now invalid. Update your applications immediately."
  }
}
```

### API Key Usage Statistics

Get detailed usage statistics for a specific API key.

__Endpoint__: `GET /api/keys/:keyId/usage`

__Query Parameters__:

- `period` - `hour`, `day`, `week`, `month` (default: `day`)
- `limit` - Number of data points to return (default: 100)

__Headers__:

```http
Authorization: Bearer <YOUR_API_KEY>
```

__Response__:

```json
{
  "success": true,
  "data": {
    "usage": {
      "period": "day",
      "totalRequests": 1250,
      "successfulRequests": 1200,
      "failedRequests": 50,
      "averageResponseTime": 245,
      "topEndpoints": [
        {
          "endpoint": "/api/search",
          "requests": 800,
          "averageResponseTime": 280
        }
      ],
      "hourlyBreakdown": [
        {
          "hour": "2024-01-15T10:00:00.000Z",
          "requests": 120,
          "averageResponseTime": 230
        }
      ]
    }
  }
}
```

## Using API Keys

Once you have an API key, include it in the `Authorization` header for all API requests:

```http
Authorization: Bearer altus4_sk_live_abc123def456...
```

### JavaScript Example

```javascript
const apiKey = 'altus4_sk_live_abc123def456...'

const response = await fetch('https://api.altus4.dev/api/search', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${apiKey}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    query: 'database optimization',
    databases: ['db-uuid-1'],
    searchMode: 'semantic'
  })
})

const data = await response.json()
```

### Python Example

```python
import requests

api_key = 'altus4_sk_live_abc123def456...'

response = requests.post(
    'https://api.altus4.dev/api/search',
    headers={
        'Authorization': f'Bearer {api_key}',
        'Content-Type': 'application/json'
    },
    json={
        'query': 'performance tuning',
        'databases': ['db-uuid-1'],
        'searchMode': 'natural'
    }
)

data = response.json()
```

## API Key Tiers and Permissions

### Tier Comparison

| Feature | Free | Pro | Enterprise |
|---------|------|-----|------------|
| Requests/Hour | 1,000 | 10,000 | 100,000 |
| Rate Limit Block | 5 min | 5 min | 1 min |
| Databases | 3 | 25 | Unlimited |
| AI Features | Limited | Full | Full + Custom |
| Analytics | Basic | Advanced | Full + Exports |
| Support | Community | Email | Priority + Phone |

### Permission Scopes

API keys can be scoped with specific permissions:

- __`search`__ - Execute search operations
- __`database:read`__ - View database connections and schema
- __`database:write`__ - Add, update, remove database connections
- __`analytics`__ - Access analytics and insights data
- __`admin`__ - Full account management (user management, billing)

Example permission combinations:

```json
{
  "permissions": ["search", "database:read", "analytics"]
}
```

## Security Best Practices

### API Key Security

1. __Store Securely__: Never commit API keys to version control
2. __Use Environment Variables__: Store keys in environment variables
3. __Rotate Regularly__: Regenerate keys periodically
4. __Scope Appropriately__: Use minimal required permissions
5. __Monitor Usage__: Regularly review API key usage statistics

### Environment Separation

Use different API keys for different environments:

```bash
# Development
ALTUS4_API_KEY=altus4_sk_test_dev123...

# Production
ALTUS4_API_KEY=altus4_sk_live_prod456...
```

### Error Handling

Always handle authentication errors gracefully:

```javascript
const makeApiRequest = async (endpoint, data) => {
  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.ALTUS4_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })

    if (response.status === 401) {
      throw new Error('Invalid or expired API key')
    }

    if (response.status === 403) {
      throw new Error('Insufficient permissions for this operation')
    }

    return await response.json()
  } catch (error) {
    console.error('API request failed:', error.message)
    throw error
  }
}
```

## Troubleshooting Authentication

### Common Issues

__Invalid API Key (401)__:

- Verify API key format and prefix
- Check if key has been revoked
- Ensure key is for the correct environment

__Insufficient Permissions (403)__:

- Review required permissions for the endpoint
- Update API key permissions if needed
- Check if tier supports the requested feature

__Rate Limit Exceeded (429)__:

- Review current tier limits
- Implement proper rate limiting in your application
- Consider upgrading to higher tier

### Testing Authentication

Test your API key with a simple health check:

```bash
curl -X GET https://api.altus4.dev/health \
  -H "Authorization: Bearer altus4_sk_live_abc123..."
```

Expected response:

```json
{
  "status": "healthy",
  "authenticated": true,
  "keyInfo": {
    "tier": "pro",
    "permissions": ["search", "analytics"]
  }
}
```

---

__Next Steps__: [Search Operations](./search.md) | [Database Management](./database.md)
