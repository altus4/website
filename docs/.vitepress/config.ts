import { defineConfig } from 'vitepress';
import { fileURLToPath, URL } from 'node:url';
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'Altus 4',
  description: 'AI-Enhanced Search Engine',
  base: '/docs/',
  ignoreDeadLinks: false,

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
          { text: 'Setup', link: '/setup/' },
        ],
      },
      {
        text: 'API Reference',
        items: [{ text: 'API Overview', link: '/api/' }],
      },
      {
        text: 'Architecture',
        items: [{ text: 'System Architecture', link: '/architecture/' }],
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
      {
        text: 'Examples',
        items: [{ text: 'Examples Overview', link: '/examples/' }],
      },
      {
        text: 'Testing',
        items: [{ text: 'Testing Guide', link: '/testing/' }],
      },
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/altus4/core' },
      { icon: 'globe', link: 'https://altus4.thavarshan.com' },
    ],
  },
});
