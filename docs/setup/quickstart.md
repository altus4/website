---
title: Quick Start Guide
description: Get Altus 4 running in 5 minutes with this step-by-step quick start guide.
---

# Quick Start Guide

Get Altus 4 running in 5 minutes

This guide will get you up and running with Altus 4 as quickly as possible. For detailed installation instructions, see the [complete setup guide](./index.md).

## Prerequisites

Before starting, ensure you have:

- __Node.js 18+__ installed
- __MySQL 8.0+__ running and accessible
- __Redis 6.0+__ running (optional but recommended)
- __OpenAI API key__ (optional, for AI features)

## Step 1: Clone and Install

```bash
# Clone the repository
git clone https://github.com/yourusername/altus4.git
cd altus4

# Install dependencies
npm install
```

## Step 2: Environment Configuration

```bash
# Copy environment template
cp .env.example .env

# Edit the .env file with your settings
nano .env
```

__Minimum required environment variables:__

```bash
# Database Configuration (Primary - for metadata storage)
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=altus4_user
DB_PASSWORD=your_secure_password
DB_DATABASE=altus4_meta

# Authentication
JWT_SECRET=your_very_long_and_secure_jwt_secret_key_here_at_least_32_characters

# Redis Configuration (optional but recommended)
REDIS_HOST=localhost
REDIS_PORT=6379

# OpenAI Integration (optional - for AI features)
OPENAI_API_KEY=sk-your_openai_api_key_here
```

## Step 3: Database Setup

Create the MySQL database and user:

```sql
-- Connect to MySQL as root
mysql -u root -p

-- Create database
CREATE DATABASE altus4_meta CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Create user
CREATE USER 'altus4_user'@'localhost' IDENTIFIED BY 'your_secure_password';

-- Grant permissions
GRANT ALL PRIVILEGES ON altus4_meta.* TO 'altus4_user'@'localhost';
FLUSH PRIVILEGES;
```

## Step 4: Run Migrations

```bash
# Apply database migrations
npm run migrate
```

Expected output:

```text
✅ Migration 001_create_users_table.up.sql applied
✅ Migration 002_create_searches_table.up.sql applied
✅ Migration 003_create_analytics_table.up.sql applied
✅ Migration 004_create_api_keys_table.up.sql applied
✅ Migration 005_update_users_table_for_api_keys.up.sql applied
```

## Step 5: Start the Server

```bash
# Start development server
npm run dev
```

Expected output:

```text
🚀 Altus 4 Server started on port 3000
🌍 Environment: development
📊 Health check: http://localhost:3000/health
```

## Step 6: Verify Installation

Test the health endpoint:

```bash
curl http://localhost:3000/health
```

Expected response:

```json
{
  "status": "healthy",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "version": "0.2.0",
  "uptime": 1.234
}
```

## Step 7: Create Your First API Key

### Register a User Account

```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "secure_password123",
    "name": "Admin User"
  }'
```

### Login and Get JWT Token

```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "secure_password123"
  }'
```

Save the JWT token from the response.

### Create Your First API Key

```bash
curl -X POST http://localhost:3000/api/v1/management/setup \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

__Save the API key from the response__ - you'll need it for all future requests!

## Step 8: Test Your First Search

### Add a Database Connection

```bash
curl -X POST http://localhost:3000/api/v1/databases \
  -H "Authorization: Bearer YOUR_API_KEY_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "My Test Database",
    "host": "localhost",
    "port": 3306,
    "database": "your_existing_db",
    "username": "db_user",
    "password": "db_password"
  }'
```

### Execute Your First Search

```bash
curl -X POST http://localhost:3000/api/v1/search \
  -H "Authorization: Bearer YOUR_API_KEY_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "test search",
    "databases": ["DATABASE_ID_FROM_PREVIOUS_STEP"],
    "searchMode": "natural",
    "limit": 10
  }'
```

## Success

You now have Altus 4 running locally! Here's what you can do next:

### Explore the API

- __[API Reference](../api/)__ - Complete API documentation
- __[Search Operations](../api/search.md)__ - Advanced search features
- __[Database Management](../api/database.md)__ - Managing connections

### Try Advanced Features

- __[AI-Enhanced Search](../examples/ai-integration.md)__ - Semantic search with OpenAI
- __[Multi-Database Search](../examples/multi-database.md)__ - Search across multiple databases
- __[Analytics & Insights](../api/analytics.md)__ - Search trends and performance

### Development

- __[Development Guide](../development/)__ - Contributing to Altus 4
- __[Testing Guide](../testing/)__ - Running and writing tests

## Troubleshooting

### Common Issues

__Database Connection Failed__

```bash
# Check MySQL is running
sudo systemctl status mysql

# Test connection manually
mysql -h localhost -u altus4_user -p altus4_meta
```

__Redis Connection Issues__

```bash
# Check Redis is running
redis-cli ping
# Should return: PONG

# Start Redis if not running
redis-server
```

__Port Already in Use__

```bash
# Change port in .env file
PORT=3001

# Or kill process using port 3000
lsof -ti:3000 | xargs kill -9
```

__Migration Errors__

```bash
# Check database exists and user has permissions
mysql -u altus4_user -p -e "SHOW DATABASES;"

# Reset migrations if needed
npm run migrate:down
npm run migrate:up
```

### Getting Help

- __[Complete Setup Guide](./index.md)__ - Detailed installation instructions
- __[Development Guide](../development/)__ - Development environment setup
- __[GitHub Issues](https://github.com/yourusername/altus4/issues)__ - Report bugs or get help
- __[GitHub Discussions](https://github.com/yourusername/altus4/discussions)__ - Community support

---

__Ready to build amazing search experiences?__ Check out the [examples section](../examples/) for practical implementations!
