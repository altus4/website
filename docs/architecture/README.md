# Architecture Documentation

**System Architecture and Design Patterns for Altus 4**

This section provides comprehensive documentation of Altus 4's system architecture, design decisions, and technical patterns.

## System Overview

Altus 4 follows a layered architecture pattern designed for scalability, maintainability, and testability:

```text
┌─────────────────────────────────────────────────────────┐
│                  Client Layer                           │
│  Web UI, Mobile Apps, Third-party Integrations         │
└─────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────┐
│                   API Layer                             │
│  REST Endpoints, Authentication, Validation, Rate       │
```

│ Client Layer │
│ Web UI, Mobile Apps, Third-party Integrations │
└─────────────────────────────────────────────────────────┘
│
▼
┌─────────────────────────────────────────────────────────┐
│ API Layer │
│ REST Endpoints, Authentication, Validation, Rate │
│ Limiting, Request/Response Transformation │
└─────────────────────────────────────────────────────────┘
│
▼
┌─────────────────────────────────────────────────────────┐
│ Service Layer │
│ Business Logic, Orchestration, Error Handling │
│ SearchService, UserService, AIService, etc. │
└─────────────────────────────────────────────────────────┘
│
▼
┌─────────────────────────────────────────────────────────┐
│ Data Layer │
│ MySQL Databases, Redis Cache, OpenAI API │
└─────────────────────────────────────────────────────────┘

```text
┌─────────────────────────────────────────────────────────┐
│                  Client Layer                           │
│  Web UI, Mobile Apps, Third-party Integrations         │
└─────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────┐
│                   API Layer                             │
│  REST Endpoints, Authentication, Validation, Rate       │
│  Limiting, Request/Response Transformation              │
└─────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────┐
│                 Service Layer                           │
│  Business Logic, Orchestration, Error Handling         │
│  SearchService, UserService, AIService, etc.           │
└─────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────┐
│                  Data Layer                             │
│  MySQL Databases, Redis Cache, OpenAI API              │
└─────────────────────────────────────────────────────────┘
```

## Core Components

### API Layer

- **Express.js Server**: RESTful API endpoints with middleware pipeline
- **Authentication**: API key-based authentication with tiered rate limiting
- **Validation**: Zod schema validation for all endpoints
- **Rate Limiting**: Redis-backed rate limiting per API key tier
- **Error Handling**: Centralized error handling with structured responses
- **Request Logging**: Comprehensive request/response logging with correlation IDs

### Service Layer

- **SearchService**: Core search orchestration and AI integration
- **DatabaseService**: MySQL connection management and query execution
- **AIService**: OpenAI API integration for semantic enhancements
- **CacheService**: Redis operations and analytics storage
- **UserService**: Authentication and user management

### Data Layer

- **MySQL Databases**: Primary data storage with full-text search capabilities
- **Redis Cache**: Search result caching and analytics data
- **OpenAI API**: External AI service for semantic processing

## Design Patterns

### 1. Dependency Injection

All services use constructor-based dependency injection for loose coupling:

```typescript
export class SearchService {
  constructor(
    private databaseService: DatabaseService,
    private aiService: AIService,
    private cacheService: CacheService
  ) {}
}
```

**Benefits:**

- Improved testability with easy mocking
- Flexible service composition
- Clear dependency relationships

### 2. Repository Pattern

Data access is abstracted through service interfaces:

```typescript
interface IUserService {
  getUserById(id: string): Promise<User>;
  createUser(userData: CreateUserRequest): Promise<User>;
}
```

### 3. Strategy Pattern

Different search modes implemented as strategies:

```typescript
type SearchMode = 'natural' | 'boolean' | 'semantic';

class SearchService {
  private getSearchStrategy(mode: SearchMode): SearchStrategy {
    switch (mode) {
      case 'natural':
        return new NaturalSearchStrategy();
      case 'boolean':
        return new BooleanSearchStrategy();
      case 'semantic':
        return new SemanticSearchStrategy();
    }
  }
}
```

### 4. Observer Pattern

Event-driven analytics and monitoring:

```typescript
class SearchService extends EventEmitter {
  async search(request: SearchRequest): Promise<SearchResponse> {
    this.emit('search:started', request);
    const result = await this.performSearch(request);
    this.emit('search:completed', { request, result });
    return result;
  }
}
```

## Data Flow

### Search Request Flow

```text
Client Request
      ↓
Authentication Middleware
      ↓
Rate Limiting Middleware
      ↓
Request Validation
      ↓
SearchController.executeSearch()
      ↓
SearchService.search()
      ↓
┌─────────────────┬─────────────────┬─────────────────┐
│   Cache Check   │  AI Processing  │ Database Query  │
│   (Redis)       │   (OpenAI)      │   (MySQL)       │
└─────────────────┴─────────────────┴─────────────────┘
      ↓
Result Processing & Enhancement
      ↓
Response Caching
      ↓
Analytics Logging
      ↓
JSON Response to Client
```

```text
Client Request
  ↓
Authentication Middleware
  ↓
Rate Limiting Middleware
  ↓
Request Validation
  ↓
SearchController.executeSearch()
  ↓
SearchService.search()
  ↓
┌─────────────────┬─────────────────┬─────────────────┐
│   Cache Check   │  AI Processing  │ Database Query  │
│   (Redis)       │   (OpenAI)      │   (MySQL)       │
└─────────────────┴─────────────────┴─────────────────┘
  ↓
Result Processing & Enhancement
  ↓
Response Caching
  ↓
Analytics Logging
  ↓
JSON Response to Client
```

### Authentication Flow

```text
Registration/Login
      ↓
Initial JWT Token (Bootstrap Only)
      ↓
API Key Creation
      ↓
Response with API Key
      ↓
Subsequent Requests with API Key
      ↓
API Key Verification Middleware
      ↓
Request Processing
```

#### Legacy JWT Flow (Bootstrap Only)

```text
Login Request (for API key creation only)
  ↓
UserService.loginUser()
  ↓
Password Verification (bcrypt)
  ↓
JWT Token Generation
  ↓
Response with JWT + Refresh Token
  ↓
Use JWT to Create API Key
  ↓
JWT Verification Middleware
  ↓
API Key Creation Endpoint
```

## Security Architecture

### Authentication & Authorization

- **API Keys**: Long-lived credentials for B2B service integration
- **Tiered Permissions**: Scoped permissions per API key (search, analytics, admin)
- **Environment Separation**: Test and live API key environments
- **Role-based Access**: User roles for administrative access control

### Data Protection

- **Credential Encryption**: Database credentials encrypted at rest
- **SQL Injection Prevention**: Parameterized queries throughout
- **Input Sanitization**: All user inputs validated and sanitized
- **HTTPS Only**: TLS encryption for all API communications

### Rate Limiting

- **Tiered Limits**: Rate limits based on API key tier (free/pro/enterprise)
- **Per-API Key**: Individual rate limiting per API key
- **Sliding Window**: Redis-based sliding window rate limiting
- **Graceful Degradation**: Informative error responses with upgrade suggestions

## Performance Architecture

### Caching Strategy

- **Multi-level Caching**: L1 (in-memory) and L2 (Redis) caching
- **Cache Keys**: Deterministic cache key generation based on request parameters
- **TTL Management**: Different TTL values based on data volatility
- **Cache Invalidation**: Event-driven cache invalidation on data updates

### Database Optimization

- **Connection Pooling**: Efficient MySQL connection management
- **Full-text Indexes**: Optimized MySQL FULLTEXT indexes for search
- **Query Optimization**: Analyzed and optimized search queries
- **Read Replicas**: Support for read replica databases (future enhancement)

### Parallel Processing

- **Concurrent Searches**: Multiple database searches executed in parallel
- **Promise.allSettled**: Graceful handling of partial failures
- **Worker Threads**: CPU-intensive operations (future enhancement)

## Scalability Considerations

### Horizontal Scaling

- **Stateless Design**: No server-side session state
- **Load Balancer Ready**: Compatible with standard load balancers
- **Database Sharding**: Support for multiple database connections

### Vertical Scaling

- **Resource Monitoring**: CPU and memory usage tracking
- **Connection Pool Tuning**: Configurable database connection limits
- **Cache Size Management**: Redis memory usage optimization

### Microservices Migration Path

Current monolithic structure can be decomposed into microservices:

```text
Current Monolith:
┌─────────────────────────────────────┐
│            Altus 4 API              │
│  ┌─────────┬─────────┬─────────┐   │
│  │ Search  │  User   │   AI    │   │
│  │ Service │ Service │ Service │   │
│  └─────────┴─────────┴─────────┘   │
└─────────────────────────────────────┘

Future Microservices:
┌─────────────┐  ┌─────────────┐  ┌─────────────┐
│   Search    │  │    User     │  │     AI      │
│  Service    │  │  Service    │  │  Service    │
└─────────────┘  └─────────────┘  └─────────────┘
```

```text
Current Monolith:
┌─────────────────────────────────────┐
│            Altus 4 API              │
│  ┌─────────┬─────────┬─────────┐   │
│  │ Search  │  User   │   AI    │   │
│  │ Service │ Service │ Service │   │
│  └─────────┴─────────┴─────────┘   │
└─────────────────────────────────────┘

Future Microservices:
┌─────────────┐  ┌─────────────┐  ┌─────────────┐
│   Search    │  │    User     │  │     AI      │
│  Service    │  │  Service    │  │  Service    │
└─────────────┘  └─────────────┘  └─────────────┘
```

## Error Handling Architecture

### Error Categories

1. **Validation Errors**: Invalid request data (400)
2. **Authentication Errors**: Invalid or missing tokens (401)
3. **Authorization Errors**: Insufficient permissions (403)
4. **Not Found Errors**: Resource doesn't exist (404)
5. **Rate Limit Errors**: Too many requests (429)
6. **Service Errors**: External service failures (502/503)
7. **Internal Errors**: Unexpected application errors (500)

### Error Handling Strategy

```typescript
// Custom error class
class AppError extends Error {
  constructor(
    public code: string,
    public message: string,
    public statusCode: number = 500,
    public details?: any
  ) {
    super(message);
    this.name = 'AppError';
}

// Centralized error handler
export const errorHandler = (
  error: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const statusCode = error instanceof AppError ? error.statusCode : 500;
  const code = error instanceof AppError ? error.code : 'INTERNAL_ERROR';

  logger.error('Request failed:', { error, request: req.body });

  res.status(statusCode).json({
    success: false,
    error: {
      code,
      message: error.message,
      details: error instanceof AppError ? error.details : undefined,
    },
    meta: {
      timestamp: new Date().toISOString(),
      requestId: req.headers['x-request-id'],
    },
  });
};
```

Response with JWT + Refresh Token
↓

```typescript
logger.error('Request failed:', { error, request: req.body });

res.status(statusCode).json({
  success: false,
  error: {
    code,
    message: error.message,
    details: error instanceof AppError ? error.details : undefined,
  },
  meta: {
    timestamp: new Date().toISOString(),
    requestId: req.headers['x-request-id'],
  },
});
};
```

```text
↓
Response with JWT + Refresh Token
  ↓
```

```typescript
logger.error('Request failed:', { error, request: req.body });

res.status(statusCode).json({
  success: false,
  error: {
    code,
    message: error.message,
    details: error instanceof AppError ? error.details : undefined,
  },
  meta: {
    timestamp: new Date().toISOString(),
    requestId: req.headers['x-request-id'],
  },
});
};
```

↓

```typescript
logger.error('Request failed:', { error, request: req.body });

res.status(statusCode).json({
  success: false,
  error: {
    code,
    message: error.message,
    details: error instanceof AppError ? error.details : undefined,
  },
  meta: {
    timestamp: new Date().toISOString(),
    requestId: req.headers['x-request-id'],
  },
});
};
```

```typescript
// Custom error class
class AppError extends Error {
  constructor(
    public code: string,
    public message: string,
    public statusCode: number = 500,
    public details?: any
  ) {
    super(message);
    this.name = 'AppError';
  }
}

// Centralized error handler
export const errorHandler = (
  error: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const statusCode = error instanceof AppError ? error.statusCode : 500;
  const code = error instanceof AppError ? error.code : 'INTERNAL_ERROR';

  logger.error('Request failed:', { error, request: req.body });

  res.status(statusCode).json({
    success: false,
    error: {
      code,
      message: error.message,
      details: error instanceof AppError ? error.details : undefined,
    },
    meta: {
      timestamp: new Date().toISOString(),
      requestId: req.headers['x-request-id'],
    },
  });
};
```

## Monitoring & Observability

### Logging Strategy

- **Structured Logging**: JSON-formatted logs with consistent fields
- **Log Levels**: Debug, info, warn, error with configurable levels
- **Correlation IDs**: Request tracing across service boundaries
- **Performance Metrics**: Response times and resource usage

### Health Checks

- **Liveness Probe**: `/health` - Basic application health
- **Readiness Probe**: `/health/ready` - Service dependencies health
- **Deep Health Checks**: Individual service component health

### Metrics Collection

```typescript
interface Metrics {
  requests: {
    total: number;
    successful: number;
    failed: number;
    averageResponseTime: number;
  };
  searches: {
    total: number;
    cacheHits: number;
    averageExecutionTime: number;
  };
  database: {
    activeConnections: number;
    queryCount: number;
    averageQueryTime: number;
  };
  cache: {
    hitRate: number;
    memoryUsage: number;
  };
}
```

## Configuration Management

### Environment-based Configuration

```typescript
interface Config {
  server: {
    port: number;
    environment: 'development' | 'production' | 'test';
  };
  database: {
    host: string;
    port: number;
    username: string;
    password: string;
    database: string;
    connectionLimit: number;
  };
  cache: {
    host: string;
    port: number;
    password?: string;
  };
  security: {
    jwtSecret: string;
    jwtExpiresIn: string;
    bcryptRounds: number;
  };
  ai: {
    openaiApiKey: string;
    model: string;
    maxTokens: number;
  };
}
```

### Configuration Validation

All configuration is validated at startup with detailed error messages for missing or invalid values.

## Future Architecture Enhancements

### Planned Improvements

1. **Event Sourcing**: Audit trail for all data changes
2. **CQRS**: Separate read/write models for better performance
3. **Message Queues**: Asynchronous processing for heavy operations
4. **Circuit Breakers**: Fault tolerance for external service calls
5. **GraphQL API**: Alternative API interface for flexible queries
6. **WebSocket Support**: Real-time search suggestions and results

### Technology Roadmap

- **Database**: Consider PostgreSQL for advanced full-text search features
- **Search Engine**: Evaluate Elasticsearch integration for complex queries
- **Containerization**: Docker and Kubernetes deployment
- **Monitoring**: Prometheus/Grafana observability stack

---

**This architecture provides a solid foundation for Altus 4's current needs while maintaining flexibility for future enhancements and scaling requirements.**
