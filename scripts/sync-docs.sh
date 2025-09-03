#!/bin/bash

# Sync docs directory to altus4/docs repository
# Usage: ./scripts/sync-docs.sh [commit-message]

set -e

# Configuration
DOCS_REPO_URL="https://github.com/altus4/docs.git"
DOCS_REPO_SSH="git@github.com:altus4/docs.git"
DOCS_DIR="docs"
TEMP_DIR="/tmp/altus4-docs-sync"
COMMIT_MESSAGE="${1:-"docs: sync from main repository $(date '+%Y-%m-%d %H:%M:%S')"}"

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

# Check if we're in the right directory
if [ ! -d "$DOCS_DIR" ]; then
    log_error "docs directory not found. Please run this script from the repository root."
    exit 1
fi

# Check if git is available
if ! command -v git &> /dev/null; then
    log_error "git is not installed or not in PATH"
    exit 1
fi

# Check if we have changes in docs directory
if git diff --quiet HEAD -- "$DOCS_DIR" && git diff --cached --quiet -- "$DOCS_DIR"; then
    log_warning "No changes detected in docs directory"
    read -p "Continue anyway? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        log_info "Sync cancelled"
        exit 0
    fi
fi

log_info "Starting docs synchronization..."
log_info "Commit message: $COMMIT_MESSAGE"

# Clean up any existing temp directory
if [ -d "$TEMP_DIR" ]; then
    log_info "Cleaning up existing temp directory..."
    rm -rf "$TEMP_DIR"
fi

# Create temp directory
mkdir -p "$TEMP_DIR"
cd "$TEMP_DIR"

# Clone the docs repository
log_info "Cloning altus4/docs repository..."
if git clone "$DOCS_REPO_URL" . 2>/dev/null; then
    log_success "Successfully cloned docs repository"
else
    log_error "Failed to clone docs repository. Please check:"
    log_error "1. Repository exists: https://github.com/altus4/docs"
    log_error "2. You have access to the repository"
    log_error "3. Your git credentials are configured"
    exit 1
fi

# Get the original repository path
ORIGINAL_REPO=$(cd - > /dev/null && pwd)

# Remove all existing files except .git
log_info "Clearing existing docs content..."
find . -mindepth 1 -maxdepth 1 ! -name '.git' -exec rm -rf {} +

# Copy docs directory contents
log_info "Copying docs directory contents..."
cp -r "$ORIGINAL_REPO/$DOCS_DIR/"* .

# Copy additional files that should be in the docs repo
if [ -f "$ORIGINAL_REPO/README.md" ]; then
    log_info "Copying README.md..."
    cp "$ORIGINAL_REPO/README.md" ./README.md
fi

# Create a docs-specific README if it doesn't exist
if [ ! -f "./README.md" ]; then
    log_info "Creating docs-specific README..."
    cat > README.md << 'EOF'
# Altus 4 Documentation

This repository contains the documentation for Altus 4 - AI-Enhanced MySQL Full-Text Search Engine.

## Documentation

Visit our documentation site: [https://altus4.github.io/docs](https://altus4.github.io/docs)

## Synchronization

This repository is automatically synchronized from the main [altus4/core](https://github.com/altus4/core) repository's `docs/` directory.

**Do not make direct changes to this repository** - all changes should be made in the main repository and will be automatically synced.

## Building Documentation

The documentation is built using [VitePress](https://vitepress.dev/).

```bash
# Install dependencies
npm install

# Start development server
npm run docs:dev

# Build for production
npm run docs:build
```

## Contributing

To contribute to the documentation:

1. Fork the [main repository](https://github.com/altus4/core)
2. Make changes to the `docs/` directory
3. Submit a pull request
4. Changes will be automatically synced to this repository upon merge

## License

This documentation is part of the Altus 4 project and follows the same license terms.
EOF
fi

# Create package.json for the docs repository if it doesn't exist
if [ ! -f "./package.json" ]; then
    log_info "Creating package.json for docs repository..."
    cat > package.json << 'EOF'
{
  "name": "@altus4/docs",
  "version": "1.0.0",
  "description": "Documentation for Altus 4 - AI-Enhanced MySQL Full-Text Search Engine",
  "scripts": {
    "docs:dev": "vitepress dev . --port 5174",
    "docs:build": "vitepress build .",
    "docs:preview": "vitepress preview ."
  },
  "keywords": [
    "altus4",
    "documentation",
    "mysql",
    "search",
    "ai",
    "vitepress"
  ],
  "repository": {
    "type": "git",
    "url": "https://github.com/altus4/docs.git"
  },
  "homepage": "https://altus4.github.io/docs",
  "devDependencies": {
    "vitepress": "^2.0.0-alpha.12"
  }
}
EOF
fi

# Create .gitignore if it doesn't exist
if [ ! -f "./.gitignore" ]; then
    log_info "Creating .gitignore for docs repository..."
    cat > .gitignore << 'EOF'
# Dependencies
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# VitePress
.vitepress/cache/
.vitepress/dist/

# OS generated files
.DS_Store
.DS_Store?
._*
.Spotlight-V100
.Trashes
ehthumbs.db
Thumbs.db

# IDE files
.vscode/
.idea/
*.swp
*.swo
*~

# Logs
logs/
*.log

# Runtime data
pids/
*.pid
*.seed
*.pid.lock

# Coverage directory used by tools like istanbul
coverage/

# Temporary folders
tmp/
temp/
EOF
fi

# Add GitHub Pages workflow if .github directory doesn't exist
if [ ! -d ".github/workflows" ]; then
    log_info "Creating GitHub Pages workflow..."
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
          node-version: 20
          cache: npm

      - name: Install dependencies
        run: npm ci

      - name: Build documentation
        run: npm run docs:build

      - name: Setup Pages
        uses: actions/configure-pages@v4

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
fi

# Check if there are any changes
if git diff --quiet && git diff --cached --quiet; then
    log_warning "No changes to sync"
else
    log_info "Changes detected, committing and pushing..."

    # Stage all changes
    git add .

    # Commit changes
    git commit -m "$COMMIT_MESSAGE"

    # Push to remote
    log_info "Pushing changes to altus4/docs repository..."
    if git push origin main; then
        log_success "Successfully pushed changes to altus4/docs repository"
    else
        log_error "Failed to push changes. Please check your git credentials and repository access."
        exit 1
    fi
fi

# Clean up
cd "$ORIGINAL_REPO"
rm -rf "$TEMP_DIR"

log_success "Documentation sync completed successfully!"
log_info "View the documentation at: https://altus4.github.io/docs"
