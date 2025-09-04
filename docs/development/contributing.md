---
title: Contributing Guide
description: Complete guide for contributing to Altus 4 including development setup, workflow, and submission guidelines.
---

# Contributing Guide

Welcome to Altus 4 Development

Thank you for your interest in contributing to Altus 4! This guide will help you get started with contributing code, documentation, or other improvements to the project.

## Getting Started

### Prerequisites

Before contributing, ensure you have:

- __Node.js 18+__ with npm 8+
- __MySQL 8.0+__ for database operations
- __Redis 6.0+__ for caching
- __Git__ for version control
- __IDE__ with TypeScript support (VS Code recommended)

### Development Environment Setup

1. __Fork the Repository__

```bash
# Fork the repository on GitHub, then clone your fork
git clone https://github.com/YOUR_USERNAME/altus4.git
cd altus4

# Add upstream remote
git remote add upstream https://github.com/altus4/core.git
```

2. __Install Dependencies__

```bash
# Install project dependencies
npm install

# Install development tools globally (optional)
npm install -g typescript ts-node nodemon
```

3. __Environment Configuration__

```bash
# Copy environment template
cp .env.example .env.development

# Configure your development environment
# Edit .env.development with your local settings
```

4. __Database Setup__

```bash
# Create development database
mysql -u root -p -e "CREATE DATABASE altus4_dev;"
mysql -u root -p -e "CREATE USER 'altus4_dev'@'localhost' IDENTIFIED BY 'dev_password';"
mysql -u root -p -e "GRANT ALL PRIVILEGES ON altus4_dev.* TO 'altus4_dev'@'localhost';"

# Run migrations
npm run migrate:dev
```

5. __Verify Setup__

```bash
# Run tests to ensure everything is working
npm test

# Start development server
npm run dev

# Check health endpoint
curl http://localhost:3000/health
```

## Development Workflow

### Branch Strategy

We use __GitFlow__ with the following branch structure:

- __`main`__ - Production-ready code
- __`develop`__ - Integration branch for features
- __`feature/*`__ - Feature development branches
- __`hotfix/*`__ - Critical production fixes
- __`release/*`__ - Release preparation branches

### Creating a Feature Branch

```bash
# Ensure you're on develop and up to date
git checkout develop
git pull upstream develop

# Create and checkout feature branch
git checkout -b feature/your-feature-name

# Make your changes and commit
git add .
git commit -m "feat(search): add semantic search functionality"

# Push to your fork
git push origin feature/your-feature-name
```

### Commit Message Format

We follow __Conventional Commits__ specification:

```
type(scope): description

[optional body]

[optional footer]
```

__Types:__

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Build process or auxiliary tool changes
- `perf`: Performance improvements
- `ci`: CI/CD changes

__Examples:__

```bash
feat(search): add AI-powered semantic search mode
fix(auth): resolve API key validation issue
docs(api): update search endpoint documentation
test(services): add unit tests for SearchService
refactor(database): improve connection pool management
```

### Code Quality Standards

#### TypeScript Guidelines

```typescript
// Use explicit types for public APIs
interface SearchRequest {
  query: string
  databases: string[]
  searchMode?: 'natural' | 'boolean' | 'semantic'
  limit?: number
}

// Use proper error handling
export class SearchService {
  async search(request: SearchRequest): Promise<SearchResponse> {
    try {
      // Validate input
      this.validateRequest(request)

      // Execute search
      const results = await this.executeSearch(request)

      return { success: true, data: results }
    } catch (error) {
      this.logger.error('Search failed', { request, error })
      throw new AppError('Search operation failed', 500)
    }
  }
}

// Use descriptive naming
const isValidQuery = (query: string): boolean => {
  return query.trim().length > 0 && query.length <= 1000
}
```

#### Code Style

```typescript
// Use consistent formatting (Prettier handles this)
const searchResults = await searchService.search({
  query: 'mysql performance optimization',
  databases: ['tech-docs-db'],
  searchMode: 'semantic',
  limit: 20
})

// Use meaningful variable names
const authenticatedUser = await userService.getUserById(userId)
const searchExecutionTime = Date.now() - startTime

// Prefer async/await over Promises
// Good
async function fetchUserData(userId: string): Promise<User> {
  const user = await userRepository.findById(userId)
  const profile = await profileService.getProfile(userId)
  return { ...user, profile }
}

// Avoid
function fetchUserDataBad(userId: string): Promise<User> {
  return userRepository.findById(userId)
    .then(user => profileService.getProfile(userId)
      .then(profile => ({ ...user, profile })))
}
```

### Testing Requirements

All contributions must include appropriate tests:

#### Unit Tests

```typescript
// tests/unit/services/SearchService.test.ts
describe('SearchService', () => {
  let searchService: SearchService
  let mockDatabaseService: jest.Mocked<DatabaseService>

  beforeEach(() => {
    mockDatabaseService = createMockDatabaseService()
    searchService = new SearchService(mockDatabaseService)
  })

  it('should execute search with valid parameters', async () => {
    // Arrange
    const request = {
      query: 'test query',
      databases: ['db-1'],
      userId: 'user-1'
    }

    mockDatabaseService.executeFullTextSearch.mockResolvedValue([
      { id: 1, title: 'Test Result', content: 'Test content' }
    ])

    // Act
    const result = await searchService.search(request)

    // Assert
    expect(result.results).toHaveLength(1)
    expect(result.results[0].data.title).toBe('Test Result')
  })
})
```

#### Integration Tests

```typescript
// tests/integration/api/search.test.ts
describe('Search API', () => {
  it('should return search results', async () => {
    const response = await request(app)
      .post('/api/v1/search')
      .set('Authorization', `Bearer ${testApiKey}`)
      .send({
        query: 'mysql performance',
        databases: [testDatabaseId]
      })
      .expect(200)

    expect(response.body.success).toBe(true)
    expect(response.body.data.results).toBeInstanceOf(Array)
  })
})
```

### Documentation Requirements

#### Code Documentation

```typescript
/**
 * Execute a full-text search across specified databases with AI enhancements.
 *
 * @param request - The search request parameters
 * @param request.query - Search query string (1-1000 characters)
 * @param request.databases - Array of database IDs to search
 * @param request.searchMode - Search mode: 'natural', 'boolean', or 'semantic'
 * @param request.limit - Maximum results to return (1-100, default: 20)
 *
 * @returns Promise resolving to search results with metadata
 *
 * @throws {ValidationError} When request parameters are invalid
 * @throws {DatabaseError} When database operations fail
 *
 * @example
 * ```typescript
 * const results = await searchService.search({
 *   query: 'mysql optimization techniques',
 *   databases: ['tech-docs-db'],
 *   searchMode: 'semantic',
 *   limit: 25
 * })
 * ```
 */
async search(request: SearchRequest): Promise<SearchResponse> {
  // Implementation
}
```

#### API Documentation

Update API documentation when adding new endpoints:

```markdown
## Search Endpoint

Execute a search across connected databases.

**Endpoint**: `POST /api/v1/search`

**Request Body**:
```json
{
  "query": "mysql performance optimization",
  "databases": ["db-uuid-1"],
  "searchMode": "semantic",
  "limit": 20
}
```

__Response__:

```json
{
  "success": true,
  "data": {
    "results": [...],
    "totalCount": 42,
    "executionTime": 150
  }
}
```

```

## Pull Request Process

### Before Submitting

1. **Ensure Code Quality**

```bash
# Run linting
npm run lint

# Fix linting issues
npm run lint:fix

# Run all tests
npm test

# Check test coverage
npm run test:coverage
```

2. __Update Documentation__

- Update relevant documentation files
- Add JSDoc comments for new functions
- Update API documentation if applicable
- Add examples for new features

3. __Verify Changes__

```bash
# Build the project
npm run build

# Run integration tests
npm run test:integration

# Test manually if needed
npm run dev
```

### Submitting a Pull Request

1. __Create Pull Request__

- Go to your fork on GitHub
- Click "New Pull Request"
- Select `develop` as the base branch
- Provide a clear title and description

2. __Pull Request Template__

```markdown
## Description
Brief description of changes made.

## Type of Change
- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update

## Testing
- [ ] Unit tests added/updated
- [ ] Integration tests added/updated
- [ ] Manual testing completed

## Checklist
- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] Tests pass locally
- [ ] No new linting errors
```

3. __Review Process__

- Automated checks must pass (CI/CD)
- At least one maintainer review required
- Address review feedback promptly
- Keep PR up to date with develop branch

### Code Review Guidelines

#### For Contributors

- __Respond Promptly__: Address review feedback within 48 hours
- __Be Open to Feedback__: Consider suggestions constructively
- __Explain Decisions__: Provide context for implementation choices
- __Keep PRs Focused__: One feature/fix per PR
- __Update Documentation__: Ensure docs reflect changes

#### For Reviewers

- __Be Constructive__: Provide helpful, actionable feedback
- __Focus on Code Quality__: Check for bugs, performance, maintainability
- __Verify Tests__: Ensure adequate test coverage
- __Check Documentation__: Verify docs are updated
- __Consider Security__: Look for potential security issues

## Issue Reporting

### Bug Reports

Use the bug report template:

```markdown
**Bug Description**
Clear description of the bug.

**Steps to Reproduce**
1. Go to '...'
2. Click on '....'
3. Scroll down to '....'
4. See error

**Expected Behavior**
What you expected to happen.

**Actual Behavior**
What actually happened.

**Environment**
- OS: [e.g. macOS 12.0]
- Node.js version: [e.g. 18.17.0]
- Altus 4 version: [e.g. 0.2.0]

**Additional Context**
Any other context about the problem.
```

### Feature Requests

Use the feature request template:

```markdown
**Feature Description**
Clear description of the feature you'd like to see.

**Use Case**
Describe the problem this feature would solve.

**Proposed Solution**
Describe how you envision this feature working.

**Alternatives Considered**
Other solutions you've considered.

**Additional Context**
Any other context or screenshots.
```

## Development Guidelines

### Performance Considerations

```typescript
// Use efficient algorithms and data structures
const resultMap = new Map<string, SearchResult>()
for (const result of results) {
  resultMap.set(result.id, result)
}

// Avoid unnecessary database queries
const userIds = results.map(r => r.userId)
const users = await userService.getUsersByIds(userIds) // Batch query

// Use appropriate caching
const cacheKey = `search:${hash(request)}`
const cached = await cache.get(cacheKey)
if (cached) return cached
```

### Security Best Practices

```typescript
// Always validate input
const validateSearchRequest = (request: SearchRequest): void => {
  if (!request.query?.trim()) {
    throw new ValidationError('Query is required')
  }

  if (request.query.length > 1000) {
    throw new ValidationError('Query too long')
  }

  // Check for SQL injection patterns
  const dangerousPatterns = [/union\s+select/i, /drop\s+table/i]
  if (dangerousPatterns.some(pattern => pattern.test(request.query))) {
    throw new ValidationError('Invalid query format')
  }
}

// Use parameterized queries
const results = await connection.execute(
  'SELECT * FROM articles WHERE MATCH(title, content) AGAINST(? IN NATURAL LANGUAGE MODE)',
  [query]
)

// Sanitize output
const sanitizeHtml = (text: string): string => {
  return text
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}
```

### Error Handling

```typescript
// Use specific error types
export class ValidationError extends AppError {
  constructor(message: string, field?: string) {
    super(message, 400, 'VALIDATION_ERROR')
    this.field = field
  }
}

// Provide helpful error messages
if (!databases.length) {
  throw new ValidationError(
    'At least one database must be specified for search',
    'databases'
  )
}

// Log errors with context
this.logger.error('Search failed', {
  userId: request.userId,
  query: request.query,
  error: error.message,
  stack: error.stack
})
```

## Community Guidelines

### Code of Conduct

We are committed to providing a welcoming and inclusive environment:

- __Be Respectful__: Treat everyone with respect and kindness
- __Be Inclusive__: Welcome newcomers and help them learn
- __Be Constructive__: Provide helpful feedback and suggestions
- __Be Professional__: Maintain professional communication
- __Be Patient__: Remember that everyone is learning

### Communication Channels

- __GitHub Issues__: Bug reports and feature requests
- __GitHub Discussions__: General questions and discussions
- __Pull Requests__: Code review and collaboration
- __Documentation__: Contribute to docs and examples

### Recognition

Contributors are recognized through:

- __Contributors List__: Listed in README and documentation
- __Release Notes__: Contributions mentioned in release notes
- __Community Highlights__: Featured in community updates

## Getting Help

### Resources

- __[Development Guide](./index.md)__ - Complete development setup
- __[Testing Guide](./testing.md)__ - Testing strategies and examples
- __[Code Standards](./standards.md)__ - Coding standards and best practices
- __[API Documentation](../api/)__ - Complete API reference

### Support Channels

- __GitHub Issues__: Technical questions and bug reports
- __GitHub Discussions__: General questions and community support
- __Documentation__: Comprehensive guides and examples

### Mentorship

New contributors can:

- Look for "good first issue" labels
- Ask questions in GitHub Discussions
- Request code review feedback
- Participate in community discussions

---

__Thank you for contributing to Altus 4! Your contributions help make this project better for everyone. We appreciate your time and effort in improving the codebase, documentation, and community.__
