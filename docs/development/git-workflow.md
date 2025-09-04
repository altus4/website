---
title: Git Workflow & Commit Verification
description: Comprehensive commit verification system for Altus 4 to ensure code quality, security, and proper Git hygiene.
---

# Commit Verification Setup for Altus 4

This document outlines the comprehensive commit verification system implemented in Altus 4 to ensure code quality, security, and proper Git hygiene.

## GPG Commit Signing

### Setup GPG Signing

```bash
# Interactive GPG key setup
npm run commit:setup-signing

# Configure Git to use the generated key
npm run commit:configure-signing
```

### Manual GPG Setup

If you prefer manual setup:

1. __Generate GPG Key__ (choose option 9 - ECC sign and encrypt)

   ```bash
   gpg --full-generate-key
   ```

2. __Configure Git__

   ```bash
   # Get your key ID
   gpg --list-secret-keys --keyid-format LONG

   # Configure Git
   git config --global user.signingkey YOUR_KEY_ID
   git config --global commit.gpgsign true
   git config --global tag.gpgsign true
   ```

3. __Add to GitHub__

   ```bash
   # Export public key
   gpg --armor --export YOUR_KEY_ID
   # Copy output and add to GitHub Settings → SSH and GPG keys
   ```

### Why ECC (Option 9)?

- __Modern & Future-Proof__: Industry standard with better performance
- __Smaller Keys__: 256-bit ECC ≈ 3072-bit RSA security
- __GitHub Support__: Fully supported with efficient handling
- __NSA Suite B__: Approved security standard

## 🪝 __Git Hooks__

### Pre-Commit Hook

Runs comprehensive checks before allowing commits:

1. __Security Audit__: `npm audit --audit-level=high`
2. __Lint & Format__: `lint-staged` with ESLint and Prettier
3. __Type Checking__: TypeScript compilation check
4. __Build Verification__: Ensures project compiles
5. __Test Suite__: Full test suite execution
6. __Package Integrity__: Dependency consistency check
7. __Documentation__: Markdown linting
8. __GPG Configuration__: Verify signing setup

### Commit Message Hook

Validates commit messages for:

- __Conventional Commits__ format validation
- __GPG Signing__ status check
- __Sensitive Information__ detection
- __Format Examples__ and helpful error messages

### Post-Commit Hook

Verifies commit integrity:

- __GPG Signature__ verification
- __Commit Format__ validation
- __Branch Protection__ warnings
- __Commit Summary__ display

### Pre-Push Hook

Prevents pushing problematic commits:

- __GPG Signature__ verification for all commits being pushed
- __Security Audit__ final check
- __Interactive Prompts__ for unsigned commits or security issues
- __Protected Branch__ detection (main/master)

## Available Commands

### Verification Commands

```bash
# Test all Git hooks
npm run hooks:test

# Verify recent commits (default: last 10)
npm run commit:verify

# Verify specific number of commits
./bin/verify-commits.sh 20

# Security audit
npm run security:audit

# Fix security issues
npm run security:fix
```

### GPG Commands

```bash
# Set up GPG signing (interactive)
npm run commit:setup-signing

# Configure Git for GPG signing
npm run commit:configure-signing

# Manual script execution
./bin/setup-gpg.sh
./bin/setup-gpg.sh configure
```

## Commit Message Format

We use __Conventional Commits__ for consistency:

```text
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### Valid Types

- `feat`: New features
- `fix`: Bug fixes
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Adding or updating tests
- `build`: Build system changes
- `ci`: CI/CD changes
- `chore`: Other changes

### Examples

```bash
feat: add API key authentication system
fix(api): resolve database connection timeout
docs: update README with new authentication flow
test: add unit tests for ApiKeyService
```

## Verification Process

### Before Each Commit

1. __Automated Checks__: Pre-commit hook runs all quality checks
2. __Message Validation__: Commit message format verification
3. __GPG Signing__: Automatic signing if configured
4. __Post-Verification__: Immediate verification of commit integrity

### Before Each Push

1. __Commit Analysis__: All commits in push are analyzed
2. __GPG Verification__: Ensures all commits are signed
3. __Security Check__: Final security audit
4. __Interactive Prompts__: User confirmation for any issues

### Manual Verification

```bash
# Check recent commit history
npm run commit:verify

# Test hook configuration
npm run hooks:test

# Verify specific commit
git verify-commit <commit-hash>
```

## 🚨 __Troubleshooting__

### GPG Issues

```bash
# Restart GPG agent
gpgconf --kill gpg-agent
gpgconf --launch gpg-agent

# Check GPG keys
gpg --list-secret-keys

# Test GPG signing
git commit --allow-empty -m "test: verify GPG signing"
```

### Hook Issues

```bash
# Reinstall hooks
npm install

# Make hooks executable
chmod +x .husky/*

# Test individual hooks
./.husky/pre-commit
./.husky/commit-msg
```

### Performance Issues

If hooks are too slow:

1. __Skip Hooks__ (emergency only): `git commit --no-verify`
2. __Optimize Tests__: Use `--bail` for faster failure
3. __Cache Dependencies__: Ensure node_modules is cached

## Best Practices

### For Developers

1. __Set up GPG signing__ immediately after cloning
2. __Use conventional commits__ for all commits
3. __Run verification__ before important pushes
4. __Keep commits small__ for faster hook execution
5. __Fix issues promptly__ rather than skipping verification

### For Maintainers

1. __Enforce branch protection__ on main/master
2. __Require signed commits__ for sensitive operations
3. __Regular security audits__ using provided commands
4. __Monitor hook performance__ and optimize as needed
5. __Update verification tools__ regularly

## Security Features

- __GPG Commit Signing__: Cryptographic verification of commit authorship
- __Security Auditing__: Automatic vulnerability detection
- __Sensitive Data Detection__: Prevents secrets in commit messages
- __Interactive Prompts__: User confirmation for security issues
- __Branch Protection__: Warnings for direct commits to protected branches

## Metrics and Reporting

The verification system provides detailed reporting:

- __Commit Analysis__: Percentage of signed commits
- __Format Compliance__: Conventional commit adherence
- __Security Status__: Vulnerability counts and severity
- __Performance Metrics__: Hook execution times
- __Compliance Reports__: Detailed verification summaries

This comprehensive verification system ensures that all code committed to Altus 4 meets our high standards for quality, security, and maintainability.
