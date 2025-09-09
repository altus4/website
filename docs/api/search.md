---
title: Search Operations
description: Complete guide to using Altus 4's powerful search API with natural language, boolean, and AI-enhanced semantic search capabilities.
---

# Search Operations

Comprehensive Search API Documentation

Altus 4 provides powerful search capabilities that enhance MySQL's native full-text search with AI-powered optimizations, semantic understanding, and multi-database federation.

## Search Overview

### Search Modes

Altus 4 supports three distinct search modes:

- **Natural Language** - Human-readable queries with automatic optimization
- **Boolean** - Traditional boolean operators (AND, OR, NOT) with MySQL syntax
- **Semantic** - AI-powered semantic search using OpenAI embeddings

### Search Architecture

```mermaid
graph TD
    A[Search Request] --> B[Query Processing]
    B --> C{Search Mode}
    C -->|Natural| D[Natural Language Processing]
    C -->|Boolean| E[Boolean Query Parser]
    C -->|Semantic| F[AI Semantic Analysis]
    D --> G[Multi-Database Execution]
    E --> G
    F --> G
    G --> H[Result Aggregation]
    H --> I[AI Enhancement]
    I --> J[Cache Storage]
    J --> K[Formatted Response]
```

## Core Search Endpoint

### Execute Search

Perform a search across one or more connected databases with comprehensive options.

**Endpoint**: `POST /api/v1/search`

**Headers**:

```http
Authorization: Bearer <YOUR_API_KEY>
Content-Type: application/json
```

**Request Body**:

```json
{
  "query": "database performance optimization techniques",
  "databases": ["db_uuid_1", "db_uuid_2"],
  "searchMode": "natural",
  "limit": 20,
  "offset": 0,
  "includeAnalytics": true
}
```

**Request Parameters**:

| Parameter          | Type    | Required | Description                                           |
| ------------------ | ------- | -------- | ----------------------------------------------------- |
| `query`            | string  | Yes      | Search query (1-500 characters)                       |
| `databases`        | array   | No       | Array of database UUIDs to search (optional)          |
| `tables`           | array   | No       | Specific tables to search                             |
| `columns`          | array   | No       | Specific columns to search                            |
| `searchMode`       | enum    | No       | `natural`, `boolean`, `semantic` (default: `natural`) |
| `limit`            | number  | No       | Max results (1-100, default: 20)                      |
| `offset`           | number  | No       | Results offset for pagination (default: 0)            |
| `includeAnalytics` | boolean | No       | Include search analytics (default: false)             |

**Response**:

```json
{
  "success": true,
  "data": {
    "results": [
      {
        "id": "result_abc123",
        "table": "articles",
        "database": "production_db",
        "content": {
          "id": 1001,
          "title": "MySQL Performance Optimization Guide",
          "content": "Complete guide to optimizing MySQL database performance...",
          "created_at": "2024-01-15T10:30:00.000Z"
        },
        "relevanceScore": 0.95
      }
    ],
    "summary": {
      "totalResults": 1,
      "executionTime": 234,
      "searchMode": "natural"
    }
  },
  "meta": {
    "timestamp": "2024-01-15T10:30:00.000Z",
    "requestId": "req_abc123",
    "version": "0.3.0"
  }
}
```

## Search Modes

### Natural Language Search

Process human-readable queries with automatic optimization.

**Example Request**:

```json
{
  "query": "How to improve database query performance?",
  "databases": ["db_uuid_1"],
  "searchMode": "natural",
  "limit": 10
}
```

**Features**:

- Automatic query expansion and optimization
- Synonym detection and matching
- Natural language understanding
- Relevance-based ranking

### Boolean Search

Use traditional boolean operators for precise control.

**Example Request**:

```json
{
  "query": "(mysql OR postgresql) AND performance AND NOT deprecated",
  "databases": ["db_uuid_1"],
  "searchMode": "boolean",
  "limit": 15
}
```

**Supported Operators**:

- `AND` - Both terms must be present
- `OR` - Either term can be present
- `NOT` - Term must not be present
- `()` - Grouping for complex queries
- `""` - Exact phrase matching
- `*` - Wildcard matching

**Boolean Query Examples**:

```bash
# Exact phrase
"database optimization"

# Multiple terms (AND implied)
mysql performance tuning

# Explicit boolean operators
(mysql OR postgresql) AND (performance OR optimization)

# Exclude terms
database optimization NOT deprecated

# Wildcards
optim* AND databas*

# Complex grouping
(mysql AND performance) OR (postgresql AND "query optimization")
```

### Semantic Search

AI-powered search using embeddings for concept matching.

**Example Request**:

```json
{
  "query": "slow database queries",
  "databases": ["db_uuid_1"],
  "searchMode": "semantic",
  "options": {
    "enableAI": true
  }
}
```

**Features**:

- Concept-based matching beyond keywords
- Understanding of context and intent
- Cross-language semantic understanding
- Intelligent query expansion

## Search Suggestions

### Get Search Suggestions

Retrieve intelligent search suggestions based on query and context.

**Endpoint**: `GET /api/v1/search/suggestions`

**Query Parameters**:

- `query` - Partial query string (required, 1-100 characters)
- `databases` - Comma-separated database IDs (optional)
- `tables` - Comma-separated table names (optional)

**Headers**:

```http
Authorization: Bearer <YOUR_API_KEY>
```

**Response**:

```json
{
  "success": true,
  "data": {
    "suggestions": [
      "database performance optimization",
      "mysql indexing strategies",
      "query optimization techniques",
      "database tuning guide"
    ]
  },
  "meta": {
    "timestamp": "2024-01-15T10:30:00.000Z",
    "requestId": "req_abc123",
    "version": "0.3.0"
  }
}
```

**cURL Example**:

```bash
curl -X GET "http://localhost:3000/api/v1/search/suggestions?query=database%20perf&databases=db_uuid_1" \
  -H "Authorization: Bearer altus4_sk_live_abc123..."
```

## Search Analytics

### Analyze Query Performance

Get detailed performance analysis for a search query.

**Endpoint**: `POST /api/v1/search/analyze`

**Request Body**:

```json
{
  "query": "database optimization techniques",
  "databases": ["db_uuid_1", "db_uuid_2"],
  "searchMode": "natural"
}
```

**Response**:

```json
{
  "success": true,
  "data": {
    "analysis": {
      "queryComplexity": "medium",
      "estimatedResults": 150,
      "optimizationSuggestions": [
        {
          "type": "query_refinement",
          "suggestion": "Consider using 'mysql optimization' for more specific results",
          "impact": "high"
        }
      ],
      "indexRecommendations": [
        {
          "database": "db_uuid_1",
          "table": "articles",
          "column": "content",
          "reason": "Full-text search performance"
        }
      ],
      "performanceMetrics": {
        "estimatedExecutionTime": 180,
        "cacheHitProbability": 0.3,
        "aiProcessingRequired": true
      }
    }
  }
}
```

### Search History

Retrieve user's search history with analytics.

**Endpoint**: `GET /api/v1/search/history`

**Query Parameters**:

- `limit` - Number of history entries (default: 50, max: 500)
- `offset` - Pagination offset
- `from` - Start date (ISO string)
- `to` - End date (ISO string)
- `databases` - Filter by specific databases

**Response**:

```json
{
  "success": true,
  "data": {
    "history": [
      {
        "id": "search_abc123",
        "query": "database performance optimization",
        "searchMode": "semantic",
        "databases": ["db_uuid_1"],
        "resultCount": 89,
        "executionTime": 234,
        "timestamp": "2024-01-15T10:30:00.000Z"
      }
    ],
    "summary": {
      "totalSearches": 1250,
      "averageResultCount": 67,
      "averageExecutionTime": 198,
      "mostUsedMode": "natural",
      "topQueries": [
        "database optimization",
        "mysql performance",
        "query tuning"
      ]
    }
  }
}
```

### Search Trends

Get user's search trends and pattern insights.

**Endpoint**: `GET /api/v1/search/trends`

**Query Parameters**:

- `startDate` - Start date for trends (ISO string, optional)
- `endDate` - End date for trends (ISO string, optional)
- `period` - Aggregation period: `day`, `week`, `month` (default: `week`)

**Response**:

```json
{
  "success": true,
  "data": {
    "trends": [
      {
        "date": "2024-01-15",
        "searches": 45,
        "uniqueQueries": 23
      }
    ],
    "summary": {
      "totalSearches": 234,
      "period": "week",
      "topQuery": "database optimization"
    }
  },
  "meta": {
    "timestamp": "2024-01-15T10:30:00.000Z",
    "requestId": "req_abc123",
    "version": "0.3.0"
  }
}
```

## Code Examples

### JavaScript/Node.js

```javascript
const altus4 = {
  apiKey: 'altus4_sk_live_abc123...',
  baseUrl: 'http://localhost:3000',
};

// Basic search
const searchResults = async (query, databases) => {
  const response = await fetch(`${altus4.baseUrl}/api/v1/search`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${altus4.apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query,
      databases,
      searchMode: 'natural',
      limit: 20,
      options: {
        enableAI: true,
        highlightMatches: true,
      },
    }),
  });

  const data = await response.json();
  return data.data.results;
};

// Search with advanced options
const advancedSearch = async searchParams => {
  const response = await fetch(`${altus4.baseUrl}/api/v1/search`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${altus4.apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: searchParams.query,
      databases: searchParams.databases,
      searchMode: searchParams.mode || 'semantic',
      limit: searchParams.limit || 20,
      filters: {
        tables: searchParams.tables,
        dateRange: searchParams.dateRange,
        minScore: 0.7,
      },
      options: {
        enableAI: true,
        includeSchema: true,
        highlightMatches: true,
      },
    }),
  });

  return await response.json();
};

// Usage examples
const results = await searchResults('database performance optimization', [
  'db_uuid_1',
  'db_uuid_2',
]);

const advancedResults = await advancedSearch({
  query: 'mysql indexing strategies',
  databases: ['db_uuid_1'],
  mode: 'semantic',
  limit: 15,
  tables: ['articles', 'documentation'],
  dateRange: {
    from: '2024-01-01',
    to: '2024-12-31',
  },
});
```

### Python

```python
import requests
import json
from datetime import datetime, timedelta

class Altus4Search:
    def __init__(self, api_key):
        self.api_key = api_key
        self.base_url = 'http://localhost:3000'
        self.headers = {
            'Authorization': f'Bearer {api_key}',
            'Content-Type': 'application/json'
        }

    def search(self, query, databases, mode='natural', **kwargs):
        """Execute a search with flexible options"""
        payload = {
            'query': query,
            'databases': databases,
            'searchMode': mode,
            'limit': kwargs.get('limit', 20),
            'offset': kwargs.get('offset', 0)
        }

        # Add filters if provided
        if 'filters' in kwargs:
            payload['filters'] = kwargs['filters']

        # Add options if provided
        if 'options' in kwargs:
            payload['options'] = kwargs['options']

        response = requests.post(
            f'{self.base_url}/api/v1/search',
            headers=self.headers,
            json=payload
        )

        return response.json()

    def get_suggestions(self, query, databases, limit=5):
        """Get search suggestions"""
        params = {
            'q': query,
            'databases': ','.join(databases),
            'limit': limit
        }

        response = requests.get(
            f'{self.base_url}/api/v1/search/suggestions',
            headers=self.headers,
            params=params
        )

        return response.json()

    def search_history(self, limit=50, days_back=7):
        """Get search history"""
        from_date = (datetime.now() - timedelta(days=days_back)).isoformat()
        params = {
            'limit': limit,
            'from': from_date
        }

        response = requests.get(
            f'{self.base_url}/api/v1/search/history',
            headers=self.headers,
            params=params
        )

        return response.json()

# Usage
client = Altus4Search('altus4_sk_live_abc123...')

# Basic search
results = client.search(
    query='database optimization techniques',
    databases=['db_uuid_1'],
    mode='semantic'
)

# Advanced search with filters
filtered_results = client.search(
    query='mysql performance',
    databases=['db_uuid_1', 'db_uuid_2'],
    mode='natural',
    limit=25,
    filters={
        'tables': ['articles', 'documentation'],
        'dateRange': {
            'from': '2024-01-01',
            'to': '2024-12-31'
        },
        'minScore': 0.6
    },
    options={
        'enableAI': True,
        'highlightMatches': True,
        'includeSchema': True
    }
)

# Get suggestions
suggestions = client.get_suggestions(
    query='database perf',
    databases=['db_uuid_1'],
    limit=8
)

print(f"Found {results['data']['summary']['totalResults']} results")
for result in results['data']['results']:
    print(f"- {result['content']['title']} (Score: {result['score']})")
```

## Search Best Practices

### Query Optimization

1. **Use Specific Terms**: More specific queries yield better results
2. **Leverage Search Modes**: Choose the right mode for your use case
3. **Apply Filters**: Use filters to narrow down results effectively
4. **Cache Results**: Enable caching for frequently used queries

### Performance Tips

1. **Limit Results**: Use appropriate limits to improve response times
2. **Batch Databases**: Search multiple databases in a single request
3. **Use Pagination**: Implement pagination for large result sets
4. **Monitor Usage**: Track search performance and optimize accordingly

### Error Handling

```javascript
const safeSearch = async (query, databases) => {
  try {
    const response = await fetch('/api/v1/search', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query, databases }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Search failed: ${error.error.message}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Search error:', error.message);

    // Fallback to cached results or simplified search
    return await getFallbackResults(query);
  }
};
```

---

**Next Steps**: [Database Management](./database.md) | [Analytics & Insights](./analytics.md)
