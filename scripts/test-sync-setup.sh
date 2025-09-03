#!/bin/bash

# Test script to validate docs sync setup
# Usage: ./scripts/test-sync-setup.sh

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

log_check() {
    echo -e "${BLUE}[CHECK]${NC} $1"
}

echo "🧪 Testing Altus 4 Documentation Sync Setup"
echo "============================================="

# Check if we're in the right directory
log_check "Checking if we're in the repository root..."
if [ ! -d "docs" ]; then
    log_error "docs directory not found. Please run this script from the repository root."
    exit 1
fi
log_success "Repository root confirmed"

# Check if sync script exists and is executable
log_check "Checking sync script..."
if [ ! -f "scripts/sync-docs.sh" ]; then
    log_error "Sync script not found at scripts/sync-docs.sh"
    exit 1
fi

if [ ! -x "scripts/sync-docs.sh" ]; then
    log_error "Sync script is not executable. Run: chmod +x scripts/sync-docs.sh"
    exit 1
fi
log_success "Sync script found and executable"

# Check if GitHub Action workflow exists
log_check "Checking GitHub Action workflow..."
if [ ! -f ".github/workflows/sync-docs.yml" ]; then
    log_error "GitHub Action workflow not found at .github/workflows/sync-docs.yml"
    exit 1
fi
log_success "GitHub Action workflow found"

# Check package.json scripts
log_check "Checking package.json scripts..."
if ! grep -q '"docs:sync"' package.json; then
    log_error "docs:sync script not found in package.json"
    exit 1
fi
log_success "npm scripts configured"

# Check docs directory structure
log_check "Checking docs directory structure..."
required_files=(
    "docs/index.md"
    "docs/.vitepress/config.ts"
    "docs/api/index.md"
    "docs/architecture/index.md"
    "docs/services/index.md"
)

for file in "${required_files[@]}"; do
    if [ ! -f "$file" ]; then
        log_error "Required file not found: $file"
        exit 1
    fi
done
log_success "Documentation structure validated"

# Check VitePress configuration
log_check "Checking VitePress configuration..."
if ! grep -q "defineConfig" docs/.vitepress/config.ts; then
    log_error "VitePress config appears to be invalid"
    exit 1
fi
log_success "VitePress configuration validated"

# Test VitePress build
log_check "Testing VitePress build..."
if npm run docs:build > /dev/null 2>&1; then
    log_success "VitePress build successful"
else
    log_error "VitePress build failed. Run 'npm run docs:build' to see details."
    exit 1
fi

# Check git configuration
log_check "Checking git configuration..."
if ! git config user.name > /dev/null 2>&1; then
    log_warning "Git user.name not configured. This may cause issues with sync."
fi

if ! git config user.email > /dev/null 2>&1; then
    log_warning "Git user.email not configured. This may cause issues with sync."
fi

# Check for git changes in docs
log_check "Checking for uncommitted changes in docs..."
if ! git diff --quiet HEAD -- docs/; then
    log_warning "Uncommitted changes detected in docs directory"
    echo "  Consider committing these changes before testing sync"
fi

# Test script syntax
log_check "Validating sync script syntax..."
if bash -n scripts/sync-docs.sh; then
    log_success "Sync script syntax is valid"
else
    log_error "Sync script has syntax errors"
    exit 1
fi

echo ""
echo "🎉 All checks passed! Your documentation sync setup is ready."
echo ""
echo "📋 Next Steps:"
echo "1. Create the altus4/docs repository on GitHub"
echo "2. Set up the DOCS_SYNC_TOKEN secret in repository settings"
echo "3. Test the sync with: npm run docs:sync"
echo ""
echo "📚 For detailed setup instructions, see: DOCS_SYNC_SETUP.md"
