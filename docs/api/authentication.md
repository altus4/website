---
title: API Authentication
description: Complete guide to authenticating with the Altus 4 API using API keys and JWT tokens with clear usage guidelines.
---

# API Authentication

Complete Authentication Guide for Altus 4 API

Altus 4 uses a dual authentication system optimized for different use cases: JWT tokens for user management and API keys for service operations.

## Authentication Overview

### Authentication Methods

**JWT Authentication**

- **Use Cases**: User management, profile operations, initial API key setup
- **Endpoints**: `/api/v1/auth/*`, `/api/v1/management/setup`, `/api/v1/management/migration-status`
- **Ideal For**: Web applications, user-facing operations, bootstrapping

**API Key Authentication**

- **Use Cases**: Search operations, database operations, analytics, AI services, API key management
- **Endpoints**: `/api/v1/search/*`, `/api/v1/databases/*`, `/api/v1/analytics/*`, `/api/v1/keys/*`
- **Ideal For**: B2B integrations, automated services, microservices

### Authentication Flow

1. **Register** a new user account with email/password
2. **Login** to receive a JWT token
3. **Create initial API key** using JWT token via `/api/v1/management/setup`
4. **Use API keys** for all service operations (search, database, analytics, AI)
5. **Use JWT tokens** only for user management and additional API key creation

```mermaid
graph TD
    A[User Registration] --> B[Login with Password]
    B --> C[Receive JWT Token]
    C --> D[Create Initial API Key<br/>via /management/setup]
    D --> E[Use API Key for Service Operations]
    E --> F{Operation Type}
    F -->|Search/DB/Analytics/AI| G[API Key Auth Required]
    F -->|User Management| H[JWT Auth Required]
    F -->|More API Keys| I[API Key Auth + Admin Permission]
```

### API Key Format

API keys follow a structured format for easy identification and security:

- **Live Environment**: `altus4_sk_live_abc123def456...`
- **Test Environment**: `altus4_sk_test_xyz789abc123...`

The format includes:

- `altus4` - Service identifier
- `sk` - Secret key type
- `live/test` - Environment indicator
- Random secure token - Actual authentication material

## Authentication Endpoints

### User Registration

Register a new user account to begin the authentication process.

**Endpoint**: `POST /api/v1/auth/register`

**Headers**:

```http
Content-Type: application/json
```

**Request Body**:

```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!",
  "name": "John Doe"
}
```

**Response**:

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "dc6e0cee-efe8-4134-be55-249d6a36ae19",
      "email": "user@example.com",
      "name": "John Doe",
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

**cURL Example**:

```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePassword123!",
    "name": "John Doe"
  }'
```

### User Login

Login to receive a JWT token for API key creation. This JWT token should only be used to create your initial API key.

**Endpoint**: `POST /api/v1/auth/login`

**Headers**:

```http
Content-Type: application/json
```

**Request Body**:

```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!"
}
```

**Response**:

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "dc6e0cee-efe8-4134-be55-249d6a36ae19",
      "email": "user@example.com",
      "name": "John Doe",
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

**cURL Example**:

```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePassword123!"
  }'
```

### Create Initial API Key

Create your first API key using the JWT token from login. This is a one-time setup process.

**Endpoint**: `POST /api/v1/management/setup`

**Headers**:

```http
Authorization: Bearer <JWT_TOKEN_FROM_LOGIN>
```

**Response**:

```json
{
  "success": true,
  "data": {
    "apiKey": {
      "id": "9c81d4cf-fff8-48d0-994a-adc07e56bff3",
      "name": "Initial API Key",
      "keyPrefix": "altus4_sk_test_8wEp0HQVYpT6POU",
      "environment": "test",
      "permissions": ["search", "analytics"],
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

**cURL Example**:

```bash
curl -X POST http://localhost:3000/api/v1/management/setup \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

## API Key Management

Once you have your initial API key, use it (with admin permissions) to manage additional keys and your account.

### Create New API Key

Create additional API keys for different environments or use cases. Requires admin permission on your current API key.

**Endpoint**: `POST /api/v1/keys`

**Headers**:

```http
Authorization: Bearer <YOUR_API_KEY_WITH_ADMIN_PERMISSION>
Content-Type: application/json
```

**Request Body**:

```json
{
  "name": "Production API Key",
  "environment": "live",
  "permissions": ["search", "analytics"],
  "rateLimitTier": "pro",
  "expiresAt": "2025-12-31"
}
```

**Response**:

```json
{
  "success": true,
  "data": {
    "apiKey": {
      "id": "key_def456",
      "name": "Production API Key",
      "keyPrefix": "altus4_sk_live_def456...",
      "environment": "live",
      "permissions": ["search", "analytics"],
      "rateLimitTier": "pro",
      "isActive": true,
      "expiresAt": "2025-12-31T00:00:00.000Z",
      "createdAt": "2024-01-15T10:30:00.000Z"
    },
    "secretKey": "altus4_sk_live_def456ghi789...",
    "warning": "This is the only time the full API key will be shown. Please store it securely."
  }
}
```

### List API Keys

Retrieve all API keys associated with your account. Requires admin permission on your current API key.

**Endpoint**: `GET /api/v1/keys`

**Headers**:

```http
Authorization: Bearer <YOUR_API_KEY_WITH_ADMIN_PERMISSION>
```

**Response**:

```json
{
  "success": true,
  "data": {
    "apiKeys": [
      {
        "id": "key_abc123",
        "name": "My First API Key",
        "keyPrefix": "altus4_sk_live_abc123...",
        "rateLimitTier": "free",
        "permissions": ["search"],
        "environment": "live",
        "lastUsed": "2024-01-15T09:30:00.000Z",
        "usageCount": 123,
        "isActive": true,
        "expiresAt": null,
        "createdAt": "2024-01-15T08:30:00.000Z",
        "updatedAt": "2024-01-15T10:00:00.000Z"
      }
    ],
    "total": 1
  }
}
```

### Update API Key

Update an existing API key's name, tier, or permissions. Requires admin permission on your current API key.

**Endpoint**: `PUT /api/v1/keys/:keyId`

**Headers**:

```http
Authorization: Bearer <YOUR_API_KEY_WITH_ADMIN_PERMISSION>
Content-Type: application/json
```

**Request Body**:

```json
{
  "name": "Updated Production Key",
  "rateLimitTier": "enterprise",
  "permissions": ["search", "analytics", "admin"],
  "expiresAt": null
}
```

### Revoke API Key

Permanently revoke an API key. This action cannot be undone. Requires admin permission on your current API key.

**Endpoint**: `DELETE /api/v1/keys/:keyId`

**Headers**:

```http
Authorization: Bearer <YOUR_API_KEY_WITH_ADMIN_PERMISSION>
```

**Response**:

```json
{
  "success": true,
  "data": {
    "keyId": "key_abc123",
    "message": "API key revoked successfully"
  }
}
```

### Regenerate API Key

Generate a new secret for an existing API key while maintaining the same ID and settings. Requires admin permission on your current API key.

**Endpoint**: `POST /api/v1/keys/:keyId/regenerate`

**Headers**:

```http
Authorization: Bearer <YOUR_API_KEY_WITH_ADMIN_PERMISSION>
```

**Response**:

```json
{
  "success": true,
  "data": {
    "apiKey": {
      "id": "key_new",
      "name": "My First API Key",
      "keyPrefix": "altus4_sk_live_newtoken...",
      "environment": "live",
      "permissions": ["search"],
      "rateLimitTier": "free",
      "expiresAt": null,
      "createdAt": "2024-01-15T10:30:00.000Z"
    },
    "secretKey": "altus4_sk_live_newtoken123...",
    "warning": "This is the only time the full API key will be shown. Please store it securely.",
    "oldKeyId": "key_abc123"
  }
}
```

### API Key Usage Statistics

Get detailed usage statistics for a specific API key.

**Endpoint**: `GET /api/v1/keys/:keyId/usage`

**Query Parameters**:

- `days` - Limit history window to last N days (1-365, optional)

**Headers**:

```http
Authorization: Bearer <YOUR_API_KEY>
```

**Response**:

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
          "endpoint": "/api/v1/search",
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
const apiKey = 'altus4_sk_live_abc123def456...';

const response = await fetch('http://localhost:3000/api/v1/search', {
  method: 'POST',
  headers: {
    Authorization: `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    query: 'database optimization',
    databases: ['db-uuid-1'],
    searchMode: 'semantic',
  }),
});

const data = await response.json();
```

### Python Example

```python
import requests

api_key = 'altus4_sk_live_abc123def456...'

response = requests.post(
    'http://localhost:3000/api/v1/search',
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

## Endpoints by Authentication Type

### JWT Authentication Required

These endpoints require a JWT token from login:

| Endpoint                              | Method  | Purpose                  |
| ------------------------------------- | ------- | ------------------------ |
| `/api/v1/auth/register`               | POST    | User registration        |
| `/api/v1/auth/login`                  | POST    | User login               |
| `/api/v1/auth/profile`                | GET/PUT | User profile management  |
| `/api/v1/auth/change-password`        | POST    | Password changes         |
| `/api/v1/auth/refresh`                | POST    | JWT token refresh        |
| `/api/v1/management/setup`            | POST    | Initial API key creation |
| `/api/v1/management/migration-status` | GET     | Check migration status   |

### API Key Authentication Required

These endpoints require an API key with appropriate permissions:

| Endpoint                     | Method              | Permissions | Purpose                |
| ---------------------------- | ------------------- | ----------- | ---------------------- |
| `/api/v1/search/*`           | POST/GET            | `search`    | Search operations      |
| `/api/v1/databases/*`        | GET/POST/PUT/DELETE | `admin`     | Database connections   |
| `/api/v1/analytics/*`        | GET                 | `analytics` | Analytics and insights |
| `/api/v1/analytics/insights` | GET                 | `analytics` | AI-powered insights    |
| `/api/v1/keys/*`             | GET/POST/PUT/DELETE | `admin`     | API key management     |

### Public Endpoints

These endpoints require no authentication:

| Endpoint                    | Method | Purpose                        |
| --------------------------- | ------ | ------------------------------ |
| `/health`                   | GET    | Health check                   |
| `/api/v1/management/health` | GET    | Detailed health with auth info |

## API Key Tiers and Permissions

### Tier Comparison

| Feature          | Free      | Pro      | Enterprise       |
| ---------------- | --------- | -------- | ---------------- |
| Requests/Hour    | 1,000     | 10,000   | 100,000          |
| Rate Limit Block | 5 min     | 5 min    | 1 min            |
| Databases        | 3         | 25       | Unlimited        |
| AI Features      | Limited   | Full     | Full + Custom    |
| Analytics        | Basic     | Advanced | Full + Exports   |
| Support          | Community | Email    | Priority + Phone |

### Permission Scopes

API keys can be scoped with specific permissions:

- **`search`** - Execute search operations and get suggestions
- **`analytics`** - Access analytics data, insights, and AI-powered features
- **`admin`** - Full API key management and database connections

Example permission combinations:

```json
{
  "permissions": ["search", "analytics"]
}
```

**Common Permission Sets:**

- **Service Integration**: `["search"]` - For basic search functionality
- **Analytics Dashboard**: `["search", "analytics"]` - For dashboards with insights
- **Full Management**: `["search", "analytics", "admin"]` - For complete account control

## Security Best Practices

### API Key Security

1. **Store Securely**: Never commit API keys to version control
2. **Use Environment Variables**: Store keys in environment variables
3. **Rotate Regularly**: Regenerate keys periodically
4. **Scope Appropriately**: Use minimal required permissions
5. **Monitor Usage**: Regularly review API key usage statistics

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
        Authorization: `Bearer ${process.env.ALTUS4_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (response.status === 401) {
      throw new Error('Invalid or expired API key');
    }

    if (response.status === 403) {
      throw new Error('Insufficient permissions for this operation');
    }

    return await response.json();
  } catch (error) {
    console.error('API request failed:', error.message);
    throw error;
  }
};
```

## Troubleshooting Authentication

### Common Issues

**Invalid API Key (401)**:

- Verify API key format and prefix
- Check if key has been revoked
- Ensure key is for the correct environment

**Insufficient Permissions (403)**:

- Review required permissions for the endpoint
- Update API key permissions if needed
- Check if tier supports the requested feature

**Rate Limit Exceeded (429)**:

- Review current tier limits
- Implement proper rate limiting in your application
- Consider upgrading to higher tier

### Testing Authentication

Test your API key with a simple health check:

```bash
curl -X GET http://localhost:3000/health
```

---

## Testing Authentication

For local development and testing, you can use these pre-configured credentials:

### Test User Credentials

```json
{
  "email": "postman@example.com",
  "password": "postman123"
}
```

### Complete Testing Flow

1. **Login to get JWT token**:

```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "postman@example.com",
    "password": "postman123"
  }'
```

2. **Create API key using JWT**:

```bash
curl -X POST http://localhost:3000/api/v1/management/setup \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "name": "Test API Key"
  }'
```

3. **Use API key for search**:

```bash
curl -X POST http://localhost:3000/api/v1/search \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -d '{
    "query": "test search",
    "databases": [],
    "limit": 5
  }'
```

### Postman Collection

A complete Postman collection with all authentication flows is available in the `/examples` directory.

---

**Next Steps**: [Search Operations](./search.md) | [Database Management](./database.md)
