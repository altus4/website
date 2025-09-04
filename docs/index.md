---
title: Altus 4 Documentation
description: Complete documentation hub for Altus 4 - AI-Enhanced MySQL Full-Text Search Engine with semantic search, multi-database support, and intelligent caching.
---

# Altus 4 Documentation

Complete Documentation Hub for Altus 4 - AI-Enhanced MySQL Full-Text Search Engine

Welcome to the comprehensive documentation for Altus 4. This documentation provides detailed information about every aspect of the system, from high-level architecture to low-level implementation details.

## What is Altus 4?

Altus 4 is an advanced AI-powered MySQL full-text search engine that enhances traditional database search capabilities with:

- __Semantic Search__: AI-powered understanding of query intent and context
- __Multi-Database Support__: Search across multiple MySQL databases simultaneously
- __Intelligent Caching__: Redis-backed performance optimization
- __API-First Design__: RESTful API with comprehensive authentication
- __Real-time Analytics__: Search trends and performance insights

## Quick Start

Get Altus 4 running locally in under 5 minutes:

```bash
# Prerequisites: Node.js 18+, MySQL 8.0+, Redis 6.0+

# Clone and install
git clone https://github.com/yourusername/altus4.git
cd altus4
npm install

# Setup environment
cp .env.example .env
# Edit .env with your database credentials

# Run database migrations
npm run migrate

# Start development server
npm run dev
```

Visit `http://localhost:3000/health` to verify the installation.

## Documentation Sections

### For New Users

1. __[Setup & Installation](setup/)__ - Get Altus 4 running
2. __[API Overview](api/)__ - Understanding the API
3. __[Examples](examples/)__ - Practical code examples

### For Developers

1. __[Architecture](architecture/)__ - System design and patterns
2. __[Services](services/)__ - Core business logic documentation
3. __[Development Guide](development/)__ - Contributing and development workflow

### For DevOps

1. __[Setup & Deployment](setup/)__ - Production deployment guide
2. __[Testing](testing/)__ - Testing strategies and examples

## Key Features

- __Advanced Search__: Natural language, boolean, and semantic search modes
- __AI Integration__: OpenAI-powered query optimization and result enhancement
- __High Performance__: Intelligent caching and parallel database queries
- __Enterprise Security__: API key authentication with tiered rate limiting
- __Rich Analytics__: Search trends, performance metrics, and insights
- __Developer Friendly__: Comprehensive API documentation and examples

## API Authentication

All API endpoints use API key authentication for B2B service integration:

```bash
# Include API key in all requests
Authorization: Bearer altus4_sk_live_abc123def456...
```

## Support

Need help with Altus 4?

- __Documentation__: You're in the right place!
- __Examples__: Check out the [examples section](examples/)
- __Issues__: [GitHub Issues](https://github.com/yourusername/altus4/issues)
- __Community__: [GitHub Discussions](https://github.com/yourusername/altus4/discussions)

## Sync Test Status

__Last Updated__: December 2024
__Test Status__: Documentation sync is working!

This section was added to test the automatic synchronization between the main repository (`altus4/website`) and the documentation repository (`altus4/docs`).

### How the Sync Works

1. __Source__: Changes made in `altus4/website/docs/`
2. __Trigger__: GitHub Actions workflow on push to main/develop
3. __Target__: Automatically synced to `altus4/docs`
4. __Deploy__: GitHub Pages automatically builds and deploys

If you can see this section in the `altus4/docs` repository, the sync is working perfectly!

### Mermaid Diagram Test

```mermaid
graph TD
    A[Documentation Source] --> B[GitHub Actions]
    B --> C[Sync Process]
    C --> D[Target Repository]
    D --> E[GitHub Pages]
    E --> F[Live Documentation]

    style A fill:#e8f5e8
    style F fill:#fff3e0
```

---

__Ready to enhance your MySQL search capabilities with AI?__ Start with the [Setup Guide](setup/) or explore our [API Reference](api/).
