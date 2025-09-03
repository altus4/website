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
          { text: 'Setup Guide', link: '/setup/' },
        ],
      },
      {
        text: 'Documentation',
        items: [
          { text: 'API Reference', link: '/api/' },
          { text: 'Architecture', link: '/architecture/' },
          { text: 'Services', link: '/services/' },
          { text: 'Examples', link: '/examples/' },
          { text: 'Testing', link: '/testing/' },
        ],
      },
      {
        text: 'Services',
        items: [
          { text: 'Service Overview', link: '/services/' },
          { text: 'SearchService', link: '/services/search-service' },
        ],
      },
      {
        text: 'Development',
        items: [
          { text: 'Development Guide', link: '/development/' },
          { text: 'Git Workflow', link: '/development/git-workflow' },
        ],
      },
    ],

    socialLinks: [{ icon: 'github', link: 'https://github.com/altus4/core' }],
  },
})
