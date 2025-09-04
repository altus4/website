# Documentation Sync Setup Guide

This guide will help you set up automatic synchronization between your main repository's `docs/` directory and a separate `altus4/docs` repository.

## Overview

The setup creates:

- **Separate docs repository**: `altus4/docs` for documentation only
- **Automatic sync**: Changes in `docs/` directory trigger sync to docs repo
- **GitHub Pages**: Auto-deployment of documentation site with Mermaid diagram support
- **Manual sync**: Script for manual synchronization when needed

## Prerequisites

1. **GitHub Account** with permissions to create repositories in the `altus4` organization
2. **Git configured** with SSH keys or personal access token
3. **Repository access** to both main and docs repositories

## Step-by-Step Setup

### Step 1: Create the Documentation Repository

1. **Create the repository** on GitHub:

   ```text
   Repository name: altus4/docs
   Description: Documentation for Altus 4 - AI-Enhanced MySQL Full-Text Search Engine
   Visibility: Public (recommended for GitHub Pages)
   Initialize: Add a README file
   ```

2. **Enable GitHub Pages**:
   - Go to repository **Settings** → **Pages**
   - Source: **GitHub Actions**
   - This allows the workflow to deploy automatically

### Step 2: Create Personal Access Token

1. **Generate a token**:
   - Go to GitHub **Settings** → **Developer settings** → **Personal access tokens** → **Tokens (classic)**
   - Click **Generate new token (classic)**
   - Name: `docs-sync-token`
   - Expiration: **No expiration** (or set as needed)
   - Scopes:
     - `repo` (Full control of private repositories)
     - `workflow` (Update GitHub Action workflows)

2. **Copy the token** - you'll need it in the next step

### Step 3: Configure Repository Secrets

In your **main repository** (this one):

1. Go to **Settings** → **Secrets and variables** → **Actions**
2. Click **New repository secret**
3. Add the following secret:
   - **Name**: `DOCS_SYNC_TOKEN`
   - **Value**: The personal access token from Step 2

### Step 4: Test the Setup

1. **Make a change** to any file in the `docs/` directory
2. **Commit and push** to the `main` or `develop` branch:

   ```bash
   git add docs/
   git commit -m "docs: test sync setup"
   git push origin main
   ```

3. **Check the Actions tab** in your main repository to see the sync workflow running
4. **Verify the docs repository** receives the changes
5. **Check GitHub Pages** deployment (may take a few minutes)

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

1. Go to **Actions** tab in your main repository
2. Select **Sync Documentation** workflow
3. Click **Run workflow**
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

1. **Permission Denied**
   - Check that `DOCS_SYNC_TOKEN` secret is set correctly
   - Verify token has `repo` and `workflow` permissions
   - Ensure token hasn't expired

2. **Repository Not Found**
   - Verify `altus4/docs` repository exists
   - Check repository name in script matches exactly
   - Ensure you have access to the docs repository

3. **Sync Script Fails**
   - Run script manually to see detailed error messages:

     ```bash
     ./scripts/sync-docs.sh
     ```

   - Check git configuration and credentials

4. **GitHub Pages Not Deploying**
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

1. **Automatic Sync**: Changes to `docs/` trigger the sync workflow
2. **Docs Repository**: Updated within minutes of main repo changes
3. **GitHub Pages**: Documentation site updates automatically
4. **Manual Sync**: `npm run docs:sync` works without errors

## Next Steps

After setup is complete:

1. **Bookmark the docs site**: `https://altus4.github.io/docs`
2. **Update README**: Add link to documentation site
3. **Team notification**: Inform team about the new documentation workflow
4. **Monitor**: Check sync status after first few documentation changes

## Useful Links

- **Documentation Site**: <https://altus4.github.io/docs>
- **Docs Repository**: <https://github.com/altus4/docs>
- **VitePress Documentation**: <https://vitepress.dev/>
- **GitHub Actions Documentation**: <https://docs.github.com/en/actions>

---

**Need help?** Check the troubleshooting section above or create an issue in the main repository.
