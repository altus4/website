# Documentation Sync Setup Guide

This guide will help you set up automatic synchronization between your main repository's `docs/` directory and a separate `altus4/docs` repository.

## Overview

The setup creates:

- __Separate docs repository__: `altus4/docs` for documentation only
- __Automatic sync__: Changes in `docs/` directory trigger sync to docs repo
- __GitHub Pages__: Auto-deployment of documentation site with Mermaid diagram support
- __Manual sync__: Script for manual synchronization when needed

## Prerequisites

1. __GitHub Account__ with permissions to create repositories in the `altus4` organization
2. __Git configured__ with SSH keys or personal access token
3. __Repository access__ to both main and docs repositories

## Step-by-Step Setup

### Step 1: Create the Documentation Repository

1. __Create the repository__ on GitHub:

   ```text
   Repository name: altus4/docs
   Description: Documentation for Altus 4 - AI-Enhanced MySQL Full-Text Search Engine
   Visibility: Public (recommended for GitHub Pages)
   Initialize: Add a README file
   ```

2. __Enable GitHub Pages__:
   - Go to repository __Settings__ → __Pages__
   - Source: __GitHub Actions__
   - This allows the workflow to deploy automatically

### Step 2: Create Personal Access Token

1. __Generate a token__:
   - Go to GitHub __Settings__ → __Developer settings__ → __Personal access tokens__ → __Tokens (classic)__
   - Click __Generate new token (classic)__
   - Name: `docs-sync-token`
   - Expiration: __No expiration__ (or set as needed)
   - Scopes:
     - `repo` (Full control of private repositories)
     - `workflow` (Update GitHub Action workflows)

2. __Copy the token__ - you'll need it in the next step

### Step 3: Configure Repository Secrets

In your __main repository__ (this one):

1. Go to __Settings__ → __Secrets and variables__ → __Actions__
2. Click __New repository secret__
3. Add the following secret:
   - __Name__: `DOCS_SYNC_TOKEN`
   - __Value__: The personal access token from Step 2

### Step 4: Test the Setup

1. __Make a change__ to any file in the `docs/` directory
2. __Commit and push__ to the `main` or `develop` branch:

   ```bash
   git add docs/
   git commit -m "docs: test sync setup"
   git push origin main
   ```

3. __Check the Actions tab__ in your main repository to see the sync workflow running
4. __Verify the docs repository__ receives the changes
5. __Check GitHub Pages__ deployment (may take a few minutes)

## Manual Sync Options

### Using npm Scripts

```bash
# Sync docs with auto-generated commit message
npm run docs:sync

# Sync docs with custom commit message
npm run docs:sync:force
```

### Using the Script Directly

```bash
# Basic sync
./scripts/sync-docs.sh

# Sync with custom message
./scripts/sync-docs.sh "docs: update API documentation"
```

### Using GitHub Actions (Manual Trigger)

1. Go to __Actions__ tab in your main repository
2. Select __Sync Documentation__ workflow
3. Click __Run workflow__
4. Choose branch and optionally force sync

## Repository Structure

After setup, your repositories will look like:

### Main Repository (`altus4/core`)

```text
├── docs/                          # Source documentation
│   ├── .vitepress/
│   ├── api/
│   ├── architecture/
│   └── ...
├── scripts/
│   └── sync-docs.sh              # Manual sync script
├── .github/workflows/
│   └── sync-docs.yml             # Auto-sync workflow
└── package.json                   # Includes docs:sync scripts
```

### Docs Repository (`altus4/docs`)

```text
├── .vitepress/                    # VitePress config (synced)
├── api/                          # API docs (synced)
├── architecture/                 # Architecture docs (synced)
├── .github/workflows/
│   └── deploy.yml               # GitHub Pages deployment
├── package.json                 # VitePress dependencies
├── README.md                    # Docs-specific README
└── .gitignore                   # Docs-specific gitignore
```

## Configuration Options

### Sync Script Configuration

Edit `scripts/sync-docs.sh` to customize:

```bash
# Repository URLs
DOCS_REPO_URL="https://github.com/altus4/docs.git"
DOCS_REPO_SSH="git@github.com:altus4/docs.git"

# Directories
DOCS_DIR="docs"
TEMP_DIR="/tmp/altus4-docs-sync"
```

### GitHub Action Configuration

Edit `.github/workflows/sync-docs.yml` to customize:

```yaml
# Trigger branches
on:
  push:
    branches: [main, develop] # Add/remove branches as needed
    paths:
      - 'docs/**' # Only sync on docs changes
      - 'README.md' # Also sync README changes
```

## Troubleshooting

### Common Issues

1. __Permission Denied__
   - Check that `DOCS_SYNC_TOKEN` secret is set correctly
   - Verify token has `repo` and `workflow` permissions
   - Ensure token hasn't expired

2. __Repository Not Found__
   - Verify `altus4/docs` repository exists
   - Check repository name in script matches exactly
   - Ensure you have access to the docs repository

3. __Sync Script Fails__
   - Run script manually to see detailed error messages:

     ```bash
     ./scripts/sync-docs.sh
     ```

   - Check git configuration and credentials

4. __GitHub Pages Not Deploying__
   - Verify GitHub Pages is enabled in docs repository settings
   - Check that Pages source is set to "GitHub Actions"
   - Review the deploy workflow in the docs repository

### Debug Commands

```bash
# Test script without pushing
cd /tmp/altus4-docs-sync
git status
git diff

# Check GitHub Action logs
# Go to Actions tab → Sync Documentation → View logs

# Test manual sync with verbose output
bash -x scripts/sync-docs.sh
```

## Success Indicators

When everything is working correctly:

1. __Automatic Sync__: Changes to `docs/` trigger the sync workflow
2. __Docs Repository__: Updated within minutes of main repo changes
3. __GitHub Pages__: Documentation site updates automatically
4. __Manual Sync__: `npm run docs:sync` works without errors

## Next Steps

After setup is complete:

1. __Bookmark the docs site__: `https://altus4.github.io/docs`
2. __Update README__: Add link to documentation site
3. __Team notification__: Inform team about the new documentation workflow
4. __Monitor__: Check sync status after first few documentation changes

## Useful Links

- __Documentation Site__: <https://altus4.github.io/docs>
- __Docs Repository__: <https://github.com/altus4/docs>
- __VitePress Documentation__: <https://vitepress.dev/>
- __GitHub Actions Documentation__: <https://docs.github.com/en/actions>

---

__Need help?__ Check the troubleshooting section above or create an issue in the main repository.
