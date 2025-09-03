import { h } from 'vue'
import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'

export default {
  extends: DefaultTheme,
  Layout: () => {
    return h(DefaultTheme.Layout, null, {
      // Custom layout slots if needed
    })
  },
  enhanceApp() {
    // Register global components if needed
    // app.component('MyGlobalComponent', MyComponent)
  },
} satisfies Theme
