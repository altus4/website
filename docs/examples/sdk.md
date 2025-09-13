---
title: SDK Usage Examples
description: Learn how to use official Altus 4 SDKs with comprehensive examples and best practices
---

# SDK Usage Examples

::: tip Comprehensive SDK Documentation Available
This page has been superseded by our new comprehensive SDK documentation section. For complete guides, API references, and real-world examples, visit:

- **[SDK Overview](/sdk/)** - Complete introduction to all available SDKs
- **[TypeScript SDK](/sdk/typescript)** - Full API reference and examples for the TypeScript SDK
- **[Authentication Guide](/sdk/authentication)** - Cookie-based and API key authentication patterns
- **[Integration Examples](/sdk/examples)** - Real-world examples for React, Vue, Express, Next.js, and more
- **[Best Practices](/sdk/best-practices)** - Performance optimization and production guidelines
:::

## Quick Start - TypeScript SDK

The official TypeScript SDK provides type-safe access to the Altus 4 API with automatic authentication management and comprehensive error handling.

### Installation

```bash
npm install @altus4/sdk
```

### Basic Usage

```typescript
import { Altus4SDK } from '@altus4/sdk';

// Initialize the SDK
const altus4 = new Altus4SDK({
  baseURL: 'https://api.altus4.com/api/v1',
});

// Authenticate user (cookie-based authentication)
const loginResult = await altus4.login('user@example.com', 'password');

if (loginResult.success) {
  // Get analytics dashboard
  const dashboard = await altus4.analytics.getDashboardAnalytics({
    period: 'week',
  });

  // Add database connection
  const database = await altus4.database.addDatabaseConnection({
    name: 'Production Database',
    host: 'db.example.com',
    port: 3306,
    database: 'myapp_production',
    username: 'readonly_user',
    password: 'secure_password',
    ssl: true,
  });

  // Create API key for service-to-service auth
  const apiKey = await altus4.apiKeys.createApiKey({
    name: 'Dashboard Integration',
    environment: 'test',
    permissions: ['search', 'analytics'],
    rateLimitTier: 'free',
  });
}
```

## Available SDKs

### TypeScript SDK (Production Ready)

The **[@altus4/sdk](https://www.npmjs.com/package/@altus4/sdk)** package provides:

- **Complete TypeScript Support** - Full type definitions for all API endpoints
- **Authentication Management** - Cookie-based and API key authentication
- **Error Handling** - Comprehensive error classification and retry logic
- **Service Classes** - Modular design with specialized service classes
- **Utility Functions** - Built-in validation, formatting, and date helpers
- **Framework Integration** - Examples for React, Vue, Express, Next.js

**Installation:**

```bash
npm install @altus4/sdk
```

**Browser Support:** Chrome 70+, Firefox 65+, Safari 12+, Edge 79+
**Node.js Support:** 14.0+

### Future SDKs

Additional language SDKs are planned for future releases:

- **Python SDK** - Native Python integration with AsyncIO support
- **Go SDK** - Idiomatic Go interfaces with context support
- **Java SDK** - Modern Java with records and reactive programming
- **PHP SDK** - PSR-compliant with framework integrations

## Framework-Specific Examples

### React Application

Complete React setup with authentication and search:

```typescript
// hooks/useAltus4.ts
import { useMemo } from 'react';
import { Altus4SDK } from '@altus4/sdk';

export const useAltus4 = () => {
  return useMemo(() => new Altus4SDK({
    baseURL: process.env.REACT_APP_API_URL || '/api/v1',
  }), []);
};

// components/SearchResults.tsx
import React, { useState, useEffect } from 'react';
import { useAltus4 } from '../hooks/useAltus4';

export const SearchResults: React.FC<{ query: string }> = ({ query }) => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const altus4 = useAltus4();

  useEffect(() => {
    const performSearch = async () => {
      if (!query) return;

      setLoading(true);
      try {
        const searchResult = await altus4.database.searchDatabase({
          query,
          mode: 'semantic',
          limit: 20,
        });

        if (searchResult.success) {
          setResults(searchResult.data?.results || []);
        }
      } catch (error) {
        console.error('Search failed:', error);
      } finally {
        setLoading(false);
      }
    };

    performSearch();
  }, [query, altus4]);

  if (loading) return <div>Searching...</div>;

  return (
    <div>
      {results.map((result) => (
        <div key={result.id} className="search-result">
          <h3>{result.title}</h3>
          <p>{result.snippet}</p>
        </div>
      ))}
    </div>
  );
};
```

### Express.js Server

Server-side integration with API key authentication:

```typescript
import express from 'express';
import { Altus4SDK } from '@altus4/sdk';

const app = express();
app.use(express.json());

const altus4 = new Altus4SDK({
  baseURL: process.env.ALTUS4_API_URL,
  apiKey: process.env.ALTUS4_API_KEY,
});

app.post('/api/search', async (req, res) => {
  try {
    const { query, databases } = req.body;

    const searchResult = await altus4.database.searchDatabase({
      query,
      databases,
      mode: 'semantic',
      limit: 20,
    });

    if (searchResult.success) {
      res.json({
        success: true,
        results: searchResult.data?.results || [],
      });
    } else {
      res.status(400).json({
        success: false,
        error: searchResult.error?.message,
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
```

## Complete Documentation

For comprehensive guides, advanced examples, and production best practices, visit the dedicated SDK documentation:

**[Complete SDK Documentation →](/sdk/)**

This includes:

- Full API reference with all available methods
- Authentication patterns and session management
- Real-world integration examples for popular frameworks
- Performance optimization and caching strategies
- Error handling and retry mechanisms
- Testing patterns and mock strategies
- Security best practices and deployment guides

---

**Ready to get started? Install the SDK and check out the [TypeScript SDK guide](/sdk/typescript) for complete documentation.**