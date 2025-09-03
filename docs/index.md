---
title: Altus 4 Documentation
description: Complete documentation hub for Altus 4 - AI-Enhanced MySQL Full-Text Search Engine with semantic search, multi-database support, and intelligent caching.
---

# Altus 4 Documentation

Complete Documentation Hub for Altus 4 - AI-Enhanced MySQL Full-Text Search Engine

Welcome to the comprehensive documentation for Altus 4. This documentation provides detailed information about every aspect of the system, from high-level architecture to low-level implementation details.

## What is Altus 4?

Altus 4 is an advanced AI-powered MySQL full-text search engine that enhances traditional database search capabilities with:

- **Semantic Search**: AI-powered understanding of query intent and context
- **Multi-Database Support**: Search across multiple MySQL databases simultaneously
- **Intelligent Caching**: Redis-backed performance optimization
- **API-First Design**: RESTful API with comprehensive authentication
- **Real-time Analytics**: Search trends and performance insights

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

1. **[Setup & Installation](setup/)** - Get Altus 4 running
2. **[API Overview](api/)** - Understanding the API
3. **[Examples](examples/)** - Practical code examples

### For Developers

1. **[Architecture](architecture/)** - System design and patterns
2. **[Services](services/)** - Core business logic documentation
3. **[Development Guide](development/)** - Contributing and development workflow

### For DevOps

1. **[Setup & Deployment](setup/)** - Production deployment guide
2. **[Testing](testing/)** - Testing strategies and examples

## Key Features

- **Advanced Search**: Natural language, boolean, and semantic search modes
- **AI Integration**: OpenAI-powered query optimization and result enhancement
- **High Performance**: Intelligent caching and parallel database queries
- **Enterprise Security**: API key authentication with tiered rate limiting
- **Rich Analytics**: Search trends, performance metrics, and insights
- **Developer Friendly**: Comprehensive API documentation and examples

## API Authentication

All API endpoints use API key authentication for B2B service integration:

```bash
# Include API key in all requests
Authorization: Bearer altus4_sk_live_abc123def456...
```

## Support

Need help with Altus 4?

- **Documentation**: You're in the right place!
- **Examples**: Check out the [examples section](examples/)
- **Issues**: [GitHub Issues](https://github.com/yourusername/altus4/issues)
- **Community**: [GitHub Discussions](https://github.com/yourusername/altus4/discussions)

## Sync Test Status

**Last Updated**: December 2024
**Test Status**: Documentation sync is working!

This section was added to test the automatic synchronization between the main repository (`altus4/website`) and the documentation repository (`altus4/docs`).

### How the Sync Works

1. **Source**: Changes made in `altus4/website/docs/`
2. **Trigger**: GitHub Actions workflow on push to main/develop
3. **Target**: Automatically synced to `altus4/docs`
4. **Deploy**: GitHub Pages automatically builds and deploys

If you can see this section in the `altus4/docs` repository, the sync is working perfectly!

---

**Ready to enhance your MySQL search capabilities with AI?** Start with the [Setup Guide](setup/) or explore our [API Reference](api/).
