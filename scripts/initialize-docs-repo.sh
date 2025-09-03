#!/bin/bash

# Initialize the altus4/docs repository with proper structure
# Usage: GH_TOKEN=your_token ./scripts/initialize-docs-repo.sh

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Helper functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Configuration
DOCS_REPO_URL="https://github.com/altus4/docs.git"
TEMP_DIR="/tmp/altus4-docs-init"

echo -e "${BLUE}🚀 Initializing altus4/docs repository${NC}"
echo "============================================="

# Check if token is provided
if [ -z "$GH_TOKEN" ]; then
    log_error "GH_TOKEN environment variable is not set"
    echo -e "${YELLOW}Usage: GH_TOKEN=your_token ./scripts/initialize-docs-repo.sh${NC}"
    exit 1
fi

# Clean up any existing temp directory
if [ -d "$TEMP_DIR" ]; then
    log_info "Cleaning up existing temp directory..."
    rm -rf "$TEMP_DIR"
fi

# Create temp directory
log_info "Creating temporary directory..."
mkdir -p "$TEMP_DIR"
cd "$TEMP_DIR"

# Clone the empty repository
log_info "Cloning altus4/docs repository..."
DOCS_REPO_AUTH_URL="https://x-access-token:${GH_TOKEN}@github.com/altus4/docs.git"
git clone "$DOCS_REPO_AUTH_URL" .

# Configure git
log_info "Configuring git..."
git config user.name "docs-sync-bot"
git config user.email "bot@altus4.dev"

# Create initial structure
log_info "Creating initial repository structure..."

# Create README.md
cat > README.md << 'EOF'
# Altus 4 Documentation

[![Deploy Documentation](https://github.com/altus4/docs/actions/workflows/deploy.yml/badge.svg)](https://github.com/altus4/docs/actions/workflows/deploy.yml)
[![Sync Status](https://github.com/altus4/website/actions/workflows/sync-docs.yml/badge.svg)](https://github.com/altus4/website/actions/workflows/sync-docs.yml)

**Complete Documentation for Altus 4 - AI-Enhanced MySQL Full-Text Search Engine**

## 🌐 Live Documentation

Visit the live documentation site: **[https://altus4.github.io/docs](https://altus4.github.io/docs)**

## 📚 What's Inside

This repository contains the complete documentation for Altus 4, including:

- **🏗️ Architecture**: System design and component overview
- **🔧 API Reference**: Complete API documentation with examples
- **⚙️ Setup & Deployment**: Installation and configuration guides
- **💻 Development**: Contributing guidelines and development workflow
- **🧪 Testing**: Testing strategies and implementation guides
- **📖 Examples**: Practical usage examples and tutorials
- **🔍 Services**: Detailed service documentation

## 🔄 Auto-Sync

This repository is automatically synchronized from the main [altus4/website](https://github.com/altus4/website) repository.

- **Source**: `altus4/website/docs/` directory
- **Target**: This repository (`altus4/docs`)
- **Trigger**: Automatic on push to main/develop branches
- **Manual**: Available via GitHub Actions workflow

## 🚀 Local Development

To run the documentation locally:

```bash
# Clone this repository
git clone https://github.com/altus4/docs.git
cd docs

# Install dependencies
npm install

# Start development server
npm run docs:dev

# Build for production
npm run docs:build
```

## 📝 Contributing

Documentation changes should be made in the main repository:

1. **Main Repository**: [altus4/website](https://github.com/altus4/website)
2. **Edit Path**: `docs/` directory
3. **Auto-Sync**: Changes will be automatically synced to this repository

## 🔗 Links

- **Main Repository**: [altus4/website](https://github.com/altus4/website)
- **Live Documentation**: [altus4.github.io/docs](https://altus4.github.io/docs)
- **API Demo**: [altus4.dev](https://altus4.dev)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Built with ❤️ by the Altus 4 team**
EOF

# Create package.json
log_info "Creating package.json..."
cat > package.json << 'EOF'
{
  "name": "@altus4/docs",
  "version": "1.0.0",
  "description": "Documentation for Altus 4 - AI-Enhanced MySQL Full-Text Search Engine",
  "scripts": {
    "docs:dev": "vitepress dev . --port 5174",
    "docs:build": "vitepress build .",
    "docs:preview": "vitepress preview .",
    "docs:serve": "vitepress serve . --port 5174"
  },
  "keywords": [
    "altus4",
    "documentation",
    "mysql",
    "search",
    "ai",
    "full-text-search",
    "vitepress"
  ],
  "author": "Altus 4 Team",
  "license": "MIT",
  "repository": {
    "type": "git",
    "url": "https://github.com/altus4/docs.git"
  },
  "homepage": "https://altus4.github.io/docs",
  "bugs": {
    "url": "https://github.com/altus4/website/issues"
  },
  "devDependencies": {
    "vitepress": "^1.0.0"
  },
  "engines": {
    "node": ">=18.0.0"
  }
}
EOF

# Create .gitignore
log_info "Creating .gitignore..."
cat > .gitignore << 'EOF'
# Dependencies
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# VitePress
.vitepress/dist/
.vitepress/cache/

# Environment variables
.env
.env.local
.env.*.local

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Logs
logs
*.log

# Runtime data
pids
*.pid
*.seed
*.pid.lock

# Coverage directory used by tools like istanbul
coverage/
*.lcov

# Temporary folders
tmp/
temp/
EOF

# Create GitHub Actions workflow for deployment
log_info "Creating GitHub Pages deployment workflow..."
mkdir -p .github/workflows

cat > .github/workflows/deploy.yml << 'EOF'
name: Deploy Documentation

on:
  push:
    branches: [ main ]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 18
          cache: npm

      - name: Setup Pages
        uses: actions/configure-pages@v4

      - name: Install dependencies
        run: npm ci

      - name: Build with VitePress
        run: npm run docs:build

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: .vitepress/dist

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    needs: build
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
EOF

# Create initial placeholder content
log_info "Creating placeholder documentation..."
mkdir -p api architecture development examples services setup testing

# Create index.md
cat > index.md << 'EOF'
---
title: Altus 4 Documentation
description: Complete documentation hub for Altus 4 - AI-Enhanced MySQL Full-Text Search Engine with semantic search, multi-database support, and intelligent caching.
layout: home

hero:
  name: "Altus 4"
  text: "AI-Enhanced MySQL Search"
  tagline: "Complete documentation for the next-generation full-text search engine"
  actions:
    - theme: brand
      text: Get Started
      link: /setup/
    - theme: alt
      text: API Reference
      link: /api/
    - theme: alt
      text: View on GitHub
      link: https://github.com/altus4/website

features:
  - title: 🤖 AI-Powered Search
    details: Leverage OpenAI's advanced language models for intelligent query processing and semantic search capabilities.

  - title: ⚡ High Performance
    details: Optimized MySQL integration with intelligent caching, connection pooling, and query optimization.

  - title: 🔒 Enterprise Security
    details: Comprehensive security with API key authentication, rate limiting, and audit logging.

  - title: 📊 Real-time Analytics
    details: Built-in analytics and monitoring with detailed performance metrics and usage tracking.

  - title: 🔧 Easy Integration
    details: RESTful API with comprehensive documentation, SDKs, and examples for quick integration.

  - title: 🚀 Scalable Architecture
    details: Microservices-ready design with horizontal scaling capabilities and cloud deployment options.
---

## 🚀 Quick Start

Get up and running with Altus 4 in minutes:

```bash
# Clone the repository
git clone https://github.com/altus4/website.git
cd altus4-website

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your settings

# Start the development server
npm run dev
```

## 📚 Documentation Sections

- **[🏗️ Architecture](/architecture/)** - System design and component overview
- **[🔧 API Reference](/api/)** - Complete API documentation with examples
- **[⚙️ Setup & Deployment](/setup/)** - Installation and configuration guides
- **[💻 Development](/development/)** - Contributing guidelines and workflow
- **[🧪 Testing](/testing/)** - Testing strategies and implementation
- **[📖 Examples](/examples/)** - Practical usage examples and tutorials
- **[🔍 Services](/services/)** - Detailed service documentation

## 🌟 Key Features

Altus 4 combines the power of MySQL's full-text search with AI enhancement to deliver:

- **Semantic Search**: Understanding context and intent, not just keywords
- **Multi-Database Support**: Search across multiple databases and tables
- **Intelligent Caching**: Redis-powered caching with smart invalidation
- **Real-time Analytics**: Comprehensive usage and performance monitoring
- **Enterprise Security**: API key authentication with role-based access
- **Scalable Architecture**: Microservices-ready with horizontal scaling

---

**Need help?** Check out our [examples](/examples/) or [open an issue](https://github.com/altus4/website/issues) on GitHub.
EOF

# Add and commit everything
log_info "Adding files to git..."
git add .

log_info "Creating initial commit..."
git commit -m "Initial commit: Set up documentation repository

- Add comprehensive README with project overview
- Create package.json with VitePress configuration
- Set up GitHub Actions for automatic deployment
- Add proper .gitignore for Node.js/VitePress project
- Create initial documentation structure
- Set up GitHub Pages deployment workflow

This repository will be automatically synced from altus4/website/docs/"

# Push to remote
log_info "Pushing to remote repository..."
git push origin main

# Clean up
log_info "Cleaning up temporary directory..."
cd /
rm -rf "$TEMP_DIR"

log_success "✅ altus4/docs repository has been successfully initialized!"
echo ""
echo -e "${BLUE}📋 What was created:${NC}"
echo "  ✅ Initial README.md with project overview"
echo "  ✅ package.json with VitePress configuration"
echo "  ✅ .gitignore for Node.js/VitePress projects"
echo "  ✅ GitHub Actions workflow for deployment"
echo "  ✅ Initial documentation structure"
echo "  ✅ Homepage with hero section and features"
echo ""
echo -e "${BLUE}🔗 Next steps:${NC}"
echo "  1. Enable GitHub Pages in repository settings"
echo "  2. Set Pages source to 'GitHub Actions'"
echo "  3. Run the docs sync workflow to populate content"
echo "  4. Visit https://altus4.github.io/docs when deployed"
echo ""
echo -e "${GREEN}🎉 Repository is ready for documentation sync!${NC}"
