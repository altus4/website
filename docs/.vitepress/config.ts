import { defineConfig } from 'vitepress'
import { fileURLToPath, URL } from 'node:url'
import tailwindcss from 'tailwindcss'
import autoprefixer from 'autoprefixer'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'Altus 4',
  description: 'AI-Enhanced Search Engine',
  base: '/docs/',
  ignoreDeadLinks: true,

  // Configure Vite for VitePress
  vite: {
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('../../src', import.meta.url)),
      },
    },
    css: {
      postcss: {
        plugins: [tailwindcss, autoprefixer],
      },
    },
  },

  // Enable Vue support
  vue: {
    template: {
      compilerOptions: {
        isCustomElement: tag => tag.includes('-'),
      },
    },
  },

  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Setup', link: '/setup/' },
      { text: 'API Reference', link: '/api/' },
      { text: 'Examples', link: '/examples/' },
      { text: 'Architecture', link: '/architecture/' },
    ],

    sidebar: [
      {
        text: 'Getting Started',
        items: [
          { text: 'Introduction', link: '/' },
          { text: 'Quick Start', link: '/setup/' },
        ],
      },
      {
        text: 'Setup & Deployment',
        items: [
          { text: 'Installation Guide', link: '/setup/' },
          { text: 'Configuration', link: '/setup/configuration' },
          { text: 'Database Setup', link: '/setup/database-setup' },
          { text: 'Docker Deployment', link: '/setup/docker' },
          { text: 'Production', link: '/setup/production' },
        ],
      },
      {
        text: 'API Reference',
        items: [
          { text: 'API Overview', link: '/api/' },
          { text: 'Authentication', link: '/api/auth' },
          { text: 'Database Endpoints', link: '/api/database' },
          { text: 'Search Endpoints', link: '/api/search' },
          { text: 'Analytics', link: '/api/analytics' },
          { text: 'Error Handling', link: '/api/errors' },
        ],
      },
      {
        text: 'Architecture',
        items: [
          { text: 'System Overview', link: '/architecture/' },
          { text: 'Service Architecture', link: '/architecture/services' },
          { text: 'Database Design', link: '/architecture/database' },
          { text: 'Security', link: '/architecture/security' },
          { text: 'Performance', link: '/architecture/performance' },
          { text: 'AI Integration', link: '/architecture/ai-integration' },
        ],
      },
      {
        text: 'Services',
        items: [
          { text: 'Service Overview', link: '/services/' },
          { text: 'SearchService', link: '/services/search-service' },
          { text: 'DatabaseService', link: '/services/database-service' },
          { text: 'AIService', link: '/services/ai-service' },
          { text: 'CacheService', link: '/services/cache-service' },
          { text: 'UserService', link: '/services/user-service' },
          { text: 'ApiKeyService', link: '/services/api-key-service' },
        ],
      },
      {
        text: 'Development',
        items: [
          { text: 'Getting Started', link: '/development/' },
          { text: 'Project Structure', link: '/development/project-structure' },
          { text: 'Git Workflow', link: '/development/git-workflow' },
          { text: 'Code Style', link: '/development/code-style' },
          { text: 'Contributing', link: '/development/contributing' },
          { text: 'Release Process', link: '/development/releases' },
        ],
      },
      {
        text: 'Testing',
        items: [
          { text: 'Testing Overview', link: '/testing/' },
          { text: 'Unit Tests', link: '/testing/unit-tests' },
          { text: 'Integration Tests', link: '/testing/integration-tests' },
          { text: 'Performance Tests', link: '/testing/performance-tests' },
          { text: 'Running Tests', link: '/testing/running-tests' },
        ],
      },
      {
        text: 'Examples',
        items: [
          { text: 'Examples Overview', link: '/examples/' },
          { text: 'Basic Usage', link: '/examples/basic-usage' },
          { text: 'Advanced Search', link: '/examples/advanced-search' },
          { text: 'API Key Setup', link: '/examples/api-key-setup' },
          {
            text: 'Database Integration',
            link: '/examples/database-integration',
          },
          { text: 'AI Features', link: '/examples/ai-features' },
          { text: 'Performance', link: '/examples/performance' },
          { text: 'Monitoring', link: '/examples/monitoring' },
        ],
      },
    ],

    socialLinks: [{ icon: 'github', link: 'https://github.com/altus4/core' }],
  },
})
