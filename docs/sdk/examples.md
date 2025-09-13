---
title: SDK Integration Examples
description: Real-world examples and integration patterns for the Altus 4 TypeScript SDK
---

# SDK Integration Examples

This guide provides comprehensive, real-world examples of integrating the Altus 4 TypeScript SDK into various application types and frameworks. Each example includes complete code, error handling, and best practices.

::: tip Quick Navigation

- [React Application](#react-application)
- [Vue.js Application](#vuejs-application)
- [Node.js Express Server](#nodejs-express-server)
- [Next.js Full-Stack App](#nextjs-full-stack-app)
- [Microservices Architecture](#microservices-architecture)
- [Testing Examples](#testing-examples)
:::

## React Application

Complete React application with authentication, search functionality, and analytics dashboard.

### Setup and Configuration

```typescript
// src/lib/altus4.ts
import { Altus4SDK } from '@altus4/sdk';

export const altus4 = new Altus4SDK({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3000/api/v1',
  timeout: 30000,
  debug: process.env.NODE_ENV === 'development',
});
```

### Authentication Context

```typescript
// src/contexts/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { altus4 } from '../lib/altus4';
import type { User } from '@altus4/sdk';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      setLoading(true);

      // Try to restore session from cookies
      const restored = await altus4.auth.restoreSession();

      if (restored && altus4.isAuthenticated()) {
        // Fetch user profile
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

  const login = async (email: string, password: string) => {
    try {
      const result = await altus4.login(email, password);

      if (result.success) {
        setUser(result.user || null);
        return { success: true };
      }

      return {
        success: false,
        error: result.error?.message || 'Login failed',
      };
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        error: 'Network error. Please try again.',
      };
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      const result = await altus4.register(name, email, password);

      if (result.success) {
        setUser(result.user || null);
        return { success: true };
      }

      return {
        success: false,
        error: result.error?.message || 'Registration failed',
      };
    } catch (error) {
      console.error('Registration error:', error);
      return {
        success: false,
        error: 'Network error. Please try again.',
      };
    }
  };

  const logout = async () => {
    try {
      await altus4.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!user,
      }}
    >
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

### Login Component

```typescript
// src/components/Login.tsx
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await login(email, password);

      if (result.success) {
        navigate('/dashboard');
      } else {
        setError(result.error || 'Login failed');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form">
        <h2>Login to Altus 4</h2>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
};
```

### Dashboard Component

```typescript
// src/components/Dashboard.tsx
import React, { useEffect, useState } from 'react';
import { altus4 } from '../lib/altus4';
import { useAuth } from '../contexts/AuthContext';
import type { DashboardAnalytics, DatabaseConnection } from '@altus4/sdk';

export const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [analytics, setAnalytics] = useState<DashboardAnalytics | null>(null);
  const [databases, setDatabases] = useState<DatabaseConnection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError('');

      // Load analytics and databases in parallel
      const [analyticsResult, databasesResult] = await Promise.all([
        altus4.analytics.getDashboardAnalytics({ period: 'week' }),
        altus4.database.listDatabaseConnections(),
      ]);

      if (analyticsResult.success) {
        setAnalytics(analyticsResult.data || null);
      } else {
        console.error('Failed to load analytics:', analyticsResult.error);
      }

      if (databasesResult.success) {
        setDatabases(databasesResult.data || []);
      } else {
        console.error('Failed to load databases:', databasesResult.error);
      }
    } catch (error) {
      console.error('Dashboard load error:', error);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
  };

  if (loading) {
    return <div className="loading">Loading dashboard...</div>;
  }

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Welcome back, {user?.name}</h1>
        <button onClick={handleLogout} className="logout-button">
          Logout
        </button>
      </header>

      {error && (
        <div className="error-message">{error}</div>
      )}

      <div className="dashboard-content">
        {/* Analytics Overview */}
        {analytics && (
          <div className="analytics-section">
            <h2>Analytics Overview</h2>
            <div className="metrics-grid">
              <div className="metric-card">
                <h3>Total Searches</h3>
                <p className="metric-value">{analytics.totalSearches.toLocaleString()}</p>
              </div>
              <div className="metric-card">
                <h3>Connected Databases</h3>
                <p className="metric-value">{analytics.totalDatabases}</p>
              </div>
              <div className="metric-card">
                <h3>Active Users</h3>
                <p className="metric-value">{analytics.totalUsers}</p>
              </div>
              <div className="metric-card">
                <h3>Avg Response Time</h3>
                <p className="metric-value">{analytics.averageResponseTime}ms</p>
              </div>
            </div>
          </div>
        )}

        {/* Database Connections */}
        <div className="databases-section">
          <h2>Database Connections</h2>
          {databases.length === 0 ? (
            <p>No database connections configured.</p>
          ) : (
            <div className="databases-list">
              {databases.map((db) => (
                <div key={db.id} className="database-card">
                  <h3>{db.name}</h3>
                  <p>{db.host}:{db.port}/{db.database}</p>
                  <span className={`status ${db.status}`}>
                    {db.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
```

### Search Component

```typescript
// src/components/Search.tsx
import React, { useState } from 'react';
import { altus4 } from '../lib/altus4';

interface SearchResult {
  id: string;
  title: string;
  content: string;
  score: number;
  database: string;
  table: string;
}

export const Search: React.FC = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!query.trim()) return;

    try {
      setLoading(true);
      setError('');

      const searchResult = await altus4.database.searchDatabase({
        query: query.trim(),
        mode: 'semantic', // Use AI-enhanced semantic search
        limit: 20,
      });

      if (searchResult.success) {
        setResults(searchResult.data?.results || []);
      } else {
        setError(searchResult.error?.message || 'Search failed');
      }
    } catch (error) {
      console.error('Search error:', error);
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="search-container">
      <form onSubmit={handleSearch} className="search-form">
        <div className="search-input-group">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search across your databases..."
            disabled={loading}
            className="search-input"
          />
          <button type="submit" disabled={loading || !query.trim()}>
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>
      </form>

      {error && (
        <div className="error-message">{error}</div>
      )}

      <div className="search-results">
        {results.length === 0 && !loading && (
          <p>No results found. Try a different search term.</p>
        )}

        {results.map((result) => (
          <div key={result.id} className="search-result">
            <h3>{result.title}</h3>
            <p className="result-content">{result.content}</p>
            <div className="result-meta">
              <span className="result-source">
                {result.database}.{result.table}
              </span>
              <span className="result-score">
                Score: {result.score.toFixed(2)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
```

## Vue.js Application

Complete Vue 3 application with Composition API.

### Setup and Composables

```typescript
// src/composables/useAuth.ts
import { ref, computed } from 'vue';
import { altus4 } from '../lib/altus4';
import type { User } from '@altus4/sdk';

const user = ref<User | null>(null);
const loading = ref(false);

export const useAuth = () => {
  const isAuthenticated = computed(() => !!user.value);

  const initializeAuth = async () => {
    loading.value = true;

    try {
      const restored = await altus4.auth.restoreSession();

      if (restored && altus4.isAuthenticated()) {
        const userResult = await altus4.getCurrentUser();
        if (userResult.success) {
          user.value = userResult.data || null;
        }
      }
    } catch (error) {
      console.error('Auth initialization failed:', error);
    } finally {
      loading.value = false;
    }
  };

  const login = async (email: string, password: string) => {
    loading.value = true;

    try {
      const result = await altus4.login(email, password);

      if (result.success) {
        user.value = result.user || null;
        return { success: true };
      }

      return {
        success: false,
        error: result.error?.message || 'Login failed',
      };
    } catch (error) {
      return {
        success: false,
        error: 'Network error. Please try again.',
      };
    } finally {
      loading.value = false;
    }
  };

  const logout = async () => {
    try {
      await altus4.logout();
    } finally {
      user.value = null;
    }
  };

  return {
    user: computed(() => user.value),
    loading: computed(() => loading.value),
    isAuthenticated,
    initializeAuth,
    login,
    logout,
  };
};
```

### Vue Dashboard Component

```vue
<!-- src/components/Dashboard.vue -->
<template>
  <div class="dashboard">
    <header class="dashboard-header">
      <h1>Welcome back, {{ user?.name }}</h1>
      <button @click="handleLogout" class="logout-button">
        Logout
      </button>
    </header>

    <div v-if="loading" class="loading">
      Loading dashboard...
    </div>

    <div v-else-if="error" class="error-message">
      {{ error }}
    </div>

    <div v-else class="dashboard-content">
      <!-- Analytics Overview -->
      <section v-if="analytics" class="analytics-section">
        <h2>Analytics Overview</h2>
        <div class="metrics-grid">
          <div class="metric-card">
            <h3>Total Searches</h3>
            <p class="metric-value">{{ analytics.totalSearches.toLocaleString() }}</p>
          </div>
          <div class="metric-card">
            <h3>Connected Databases</h3>
            <p class="metric-value">{{ analytics.totalDatabases }}</p>
          </div>
          <div class="metric-card">
            <h3>Active Users</h3>
            <p class="metric-value">{{ analytics.totalUsers }}</p>
          </div>
          <div class="metric-card">
            <h3>Avg Response Time</h3>
            <p class="metric-value">{{ analytics.averageResponseTime }}ms</p>
          </div>
        </div>
      </section>

      <!-- Database Connections -->
      <section class="databases-section">
        <h2>Database Connections</h2>
        <div v-if="databases.length === 0">
          <p>No database connections configured.</p>
        </div>
        <div v-else class="databases-list">
          <div v-for="db in databases" :key="db.id" class="database-card">
            <h3>{{ db.name }}</h3>
            <p>{{ db.host }}:{{ db.port }}/{{ db.database }}</p>
            <span :class="`status ${db.status}`">
              {{ db.status }}
            </span>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '../composables/useAuth';
import { altus4 } from '../lib/altus4';
import type { DashboardAnalytics, DatabaseConnection } from '@altus4/sdk';

const router = useRouter();
const { user, logout } = useAuth();

const analytics = ref<DashboardAnalytics | null>(null);
const databases = ref<DatabaseConnection[]>([]);
const loading = ref(true);
const error = ref('');

onMounted(() => {
  loadDashboardData();
});

const loadDashboardData = async () => {
  try {
    loading.value = true;
    error.value = '';

    const [analyticsResult, databasesResult] = await Promise.all([
      altus4.analytics.getDashboardAnalytics({ period: 'week' }),
      altus4.database.listDatabaseConnections(),
    ]);

    if (analyticsResult.success) {
      analytics.value = analyticsResult.data || null;
    }

    if (databasesResult.success) {
      databases.value = databasesResult.data || [];
    }
  } catch (err) {
    console.error('Dashboard load error:', err);
    error.value = 'Failed to load dashboard data';
  } finally {
    loading.value = false;
  }
};

const handleLogout = async () => {
  await logout();
  router.push('/login');
};
</script>
```

## Node.js Express Server

Complete Express.js server with API key authentication and error handling.

### Server Setup

```typescript
// src/server.ts
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { Altus4SDK } from '@altus4/sdk';

const app = express();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
  credentials: true,
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // Limit each IP to 1000 requests per windowMs
});
app.use('/api', limiter);

app.use(express.json());

// Initialize Altus 4 SDK
const altus4 = new Altus4SDK({
  baseURL: process.env.ALTUS4_API_URL || 'http://localhost:3000/api/v1',
  apiKey: process.env.ALTUS4_API_KEY,
  timeout: 30000,
});

// Middleware to add SDK to request
app.use((req, res, next) => {
  req.altus4 = altus4;
  next();
});

// Health check
app.get('/health', async (req, res) => {
  try {
    const health = await altus4.management.getSystemHealth();
    res.json({ status: 'healthy', altus4: health.success });
  } catch (error) {
    res.status(503).json({ status: 'unhealthy', error: error.message });
  }
});

export default app;

// Type augmentation
declare global {
  namespace Express {
    interface Request {
      altus4: Altus4SDK;
    }
  }
}
```

### Search Routes

```typescript
// src/routes/search.ts
import { Router } from 'express';
import { body, query, validationResult } from 'express-validator';

const router = Router();

// Search endpoint with validation
router.post('/search',
  [
    body('query').isString().isLength({ min: 1, max: 500 }),
    body('databases').optional().isArray(),
    body('mode').optional().isIn(['natural', 'boolean', 'semantic']),
    body('limit').optional().isInt({ min: 1, max: 100 }),
  ],
  async (req, res) => {
    try {
      // Check validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          error: 'Validation failed',
          details: errors.array(),
        });
      }

      const { query, databases, mode = 'semantic', limit = 20 } = req.body;

      const searchResult = await req.altus4.database.searchDatabase({
        query,
        databases,
        mode,
        limit,
      });

      if (searchResult.success) {
        res.json({
          success: true,
          results: searchResult.data?.results || [],
          totalCount: searchResult.data?.totalCount || 0,
          searchTime: searchResult.data?.searchTime || 0,
        });
      } else {
        res.status(400).json({
          success: false,
          error: searchResult.error?.message || 'Search failed',
        });
      }
    } catch (error) {
      console.error('Search error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
      });
    }
  }
);

// Search suggestions endpoint
router.get('/suggestions',
  [
    query('q').isString().isLength({ min: 1, max: 100 }),
    query('limit').optional().isInt({ min: 1, max: 20 }),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          error: 'Validation failed',
          details: errors.array(),
        });
      }

      const { q: query, limit = 10 } = req.query;

      const suggestionsResult = await req.altus4.database.getSearchSuggestions({
        partial: query as string,
        limit: parseInt(limit as string),
      });

      if (suggestionsResult.success) {
        res.json({
          success: true,
          suggestions: suggestionsResult.data?.suggestions || [],
        });
      } else {
        res.status(400).json({
          success: false,
          error: suggestionsResult.error?.message || 'Failed to get suggestions',
        });
      }
    } catch (error) {
      console.error('Suggestions error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
      });
    }
  }
);

export default router;
```

### Analytics Routes

```typescript
// src/routes/analytics.ts
import { Router } from 'express';
import { query, validationResult } from 'express-validator';

const router = Router();

// Dashboard analytics
router.get('/dashboard',
  [
    query('period').optional().isIn(['day', 'week', 'month', 'year']),
    query('startDate').optional().isISO8601(),
    query('endDate').optional().isISO8601(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          error: 'Validation failed',
          details: errors.array(),
        });
      }

      const { period = 'week', startDate, endDate } = req.query;

      const analyticsResult = await req.altus4.analytics.getDashboardAnalytics({
        period: period as any,
        startDate: startDate as string,
        endDate: endDate as string,
      });

      if (analyticsResult.success) {
        res.json({
          success: true,
          data: analyticsResult.data,
        });
      } else {
        res.status(400).json({
          success: false,
          error: analyticsResult.error?.message || 'Failed to get analytics',
        });
      }
    } catch (error) {
      console.error('Analytics error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
      });
    }
  }
);

// Search trends
router.get('/trends',
  [
    query('period').optional().isIn(['day', 'week', 'month', 'year']),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          error: 'Validation failed',
          details: errors.array(),
        });
      }

      const { period = 'week' } = req.query;

      const trendsResult = await req.altus4.analytics.getSearchTrends({
        period: period as any,
      });

      if (trendsResult.success) {
        res.json({
          success: true,
          trends: trendsResult.data || [],
        });
      } else {
        res.status(400).json({
          success: false,
          error: trendsResult.error?.message || 'Failed to get trends',
        });
      }
    } catch (error) {
      console.error('Trends error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
      });
    }
  }
);

export default router;
```

## Next.js Full-Stack App

Complete Next.js application with API routes and client-side components.

### API Route Example

```typescript
// pages/api/search.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { Altus4SDK } from '@altus4/sdk';

const altus4 = new Altus4SDK({
  baseURL: process.env.ALTUS4_API_URL!,
  apiKey: process.env.ALTUS4_API_KEY!,
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { query, databases, mode = 'semantic', limit = 20 } = req.body;

    // Validate input
    if (!query || typeof query !== 'string') {
      return res.status(400).json({ error: 'Query is required' });
    }

    const searchResult = await altus4.database.searchDatabase({
      query,
      databases,
      mode,
      limit,
    });

    if (searchResult.success) {
      res.json({
        success: true,
        results: searchResult.data?.results || [],
        totalCount: searchResult.data?.totalCount || 0,
      });
    } else {
      res.status(400).json({
        success: false,
        error: searchResult.error?.message || 'Search failed',
      });
    }
  } catch (error) {
    console.error('API search error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
}
```

### Custom Hook for API Calls

```typescript
// hooks/useSearch.ts
import { useState, useCallback } from 'react';

interface SearchOptions {
  query: string;
  databases?: string[];
  mode?: 'natural' | 'boolean' | 'semantic';
  limit?: number;
}

export const useSearch = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const search = useCallback(async (options: SearchOptions) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(options),
      });

      const data = await response.json();

      if (data.success) {
        setResults(data.results);
      } else {
        setError(data.error || 'Search failed');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  return { results, loading, error, search };
};
```

## Microservices Architecture

Example microservice using the Altus 4 SDK with proper error handling and monitoring.

### Search Microservice

```typescript
// services/search-service.ts
import { Altus4SDK } from '@altus4/sdk';
import { Logger } from 'winston';

export class SearchMicroservice {
  private altus4: Altus4SDK;
  private logger: Logger;

  constructor(logger: Logger) {
    this.logger = logger;
    this.altus4 = new Altus4SDK({
      baseURL: process.env.ALTUS4_API_URL!,
      apiKey: process.env.ALTUS4_SEARCH_API_KEY!,
      timeout: 10000,
    });
  }

  async performSearch(options: {
    query: string;
    databases?: string[];
    mode?: string;
    limit?: number;
  }): Promise<SearchResult> {
    const startTime = Date.now();

    try {
      this.logger.info('Starting search operation', {
        query: options.query,
        databases: options.databases,
        mode: options.mode,
      });

      const result = await this.altus4.database.searchDatabase(options);

      const duration = Date.now() - startTime;

      if (result.success) {
        this.logger.info('Search completed successfully', {
          duration,
          resultCount: result.data?.results?.length || 0,
        });

        return {
          success: true,
          results: result.data?.results || [],
          totalCount: result.data?.totalCount || 0,
          searchTime: duration,
        };
      } else {
        this.logger.error('Search failed', {
          error: result.error?.message,
          code: result.error?.code,
          duration,
        });

        return {
          success: false,
          error: result.error?.message || 'Search failed',
        };
      }
    } catch (error) {
      const duration = Date.now() - startTime;

      this.logger.error('Search operation failed', {
        error: error.message,
        stack: error.stack,
        duration,
      });

      return {
        success: false,
        error: 'Internal search service error',
      };
    }
  }

  async getHealthStatus(): Promise<{ healthy: boolean; details: any }> {
    try {
      const testResult = await this.altus4.management.testConnection();

      return {
        healthy: testResult.success,
        details: {
          altus4Connection: testResult.success,
          timestamp: new Date().toISOString(),
        },
      };
    } catch (error) {
      return {
        healthy: false,
        details: {
          error: error.message,
          timestamp: new Date().toISOString(),
        },
      };
    }
  }
}

interface SearchResult {
  success: boolean;
  results?: any[];
  totalCount?: number;
  searchTime?: number;
  error?: string;
}
```

## Testing Examples

Comprehensive testing examples for SDK integration.

### Unit Tests

```typescript
// __tests__/auth.test.ts
import { Altus4SDK } from '@altus4/sdk';

// Mock the SDK
jest.mock('@altus4/sdk');

describe('Authentication', () => {
  let altus4: jest.Mocked<Altus4SDK>;

  beforeEach(() => {
    altus4 = new Altus4SDK() as jest.Mocked<Altus4SDK>;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should login successfully', async () => {
    const mockUser = {
      id: '1',
      name: 'Test User',
      email: 'test@example.com',
      role: 'user' as const,
      connectedDatabases: [],
      createdAt: new Date(),
      lastActive: new Date(),
    };

    altus4.login.mockResolvedValue({
      success: true,
      user: mockUser,
      token: 'mock-token',
      expiresIn: 3600,
    });

    const result = await altus4.login('test@example.com', 'password');

    expect(result.success).toBe(true);
    expect(result.user).toEqual(mockUser);
    expect(altus4.login).toHaveBeenCalledWith('test@example.com', 'password');
  });

  it('should handle login failure', async () => {
    altus4.login.mockResolvedValue({
      success: false,
      error: {
        code: 'AUTHENTICATION_FAILED',
        message: 'Invalid credentials',
      },
    });

    const result = await altus4.login('test@example.com', 'wrongpassword');

    expect(result.success).toBe(false);
    expect(result.error?.code).toBe('AUTHENTICATION_FAILED');
  });
});
```

### Integration Tests

```typescript
// __tests__/search.integration.test.ts
import { Altus4SDK } from '@altus4/sdk';

describe('Search Integration', () => {
  let altus4: Altus4SDK;

  beforeAll(() => {
    altus4 = new Altus4SDK({
      baseURL: process.env.TEST_API_URL,
      apiKey: process.env.TEST_API_KEY,
    });
  });

  it('should perform search with real API', async () => {
    const searchResult = await altus4.database.searchDatabase({
      query: 'test query',
      mode: 'semantic',
      limit: 10,
    });

    expect(searchResult.success).toBe(true);

    if (searchResult.success) {
      expect(Array.isArray(searchResult.data?.results)).toBe(true);
      expect(typeof searchResult.data?.totalCount).toBe('number');
    }
  }, 10000); // 10 second timeout

  it('should handle invalid query gracefully', async () => {
    const searchResult = await altus4.database.searchDatabase({
      query: '', // Invalid empty query
      limit: 10,
    });

    expect(searchResult.success).toBe(false);
    expect(searchResult.error?.code).toBe('VALIDATION_ERROR');
  });
});
```

### React Testing Library Examples

```typescript
// __tests__/components/Dashboard.test.tsx
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { Dashboard } from '../src/components/Dashboard';
import { AuthProvider } from '../src/contexts/AuthContext';

// Mock the SDK
jest.mock('../src/lib/altus4');

const renderWithAuth = (component: React.ReactElement) => {
  return render(
    <AuthProvider>
      {component}
    </AuthProvider>
  );
};

describe('Dashboard Component', () => {
  it('should render dashboard with analytics', async () => {
    const mockAnalytics = {
      totalSearches: 1000,
      totalUsers: 50,
      totalDatabases: 5,
      averageResponseTime: 150,
    };

    // Mock SDK responses
    require('../src/lib/altus4').altus4.analytics.getDashboardAnalytics.mockResolvedValue({
      success: true,
      data: mockAnalytics,
    });

    require('../src/lib/altus4').altus4.database.listDatabaseConnections.mockResolvedValue({
      success: true,
      data: [],
    });

    renderWithAuth(<Dashboard />);

    await waitFor(() => {
      expect(screen.getByText('1,000')).toBeInTheDocument(); // Total searches
      expect(screen.getByText('50')).toBeInTheDocument(); // Total users
      expect(screen.getByText('5')).toBeInTheDocument(); // Total databases
      expect(screen.getByText('150ms')).toBeInTheDocument(); // Response time
    });
  });

  it('should handle loading state', () => {
    renderWithAuth(<Dashboard />);

    expect(screen.getByText('Loading dashboard...')).toBeInTheDocument();
  });
});
```

---

These examples demonstrate real-world integration patterns for the Altus 4 TypeScript SDK across different frameworks and application types. Each example includes proper error handling, type safety, and best practices for production applications.