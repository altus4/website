import { h } from 'vue'
import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'
import { onMounted, watch, nextTick } from 'vue'
import { useRoute } from 'vitepress'
import './custom.css'

export default {
  extends: DefaultTheme,
  Layout: () => {
    return h(DefaultTheme.Layout, null, {
      // Custom layout slots if needed
    })
  },
  enhanceApp({ app, router }) {
    // Register global components if needed
    // app.component('MyGlobalComponent', MyComponent)
  },
  setup() {
    const route = useRoute()

    const initializeMermaid = async () => {
      // Only run on client side
      if (typeof window === 'undefined') return

      const { default: mermaid } = await import('mermaid')
      mermaid.initialize({
        startOnLoad: false,
        theme: 'default',
        themeVariables: {
          primaryColor: '#3b82f6',
          primaryTextColor: '#1f2937',
          primaryBorderColor: '#e5e7eb',
          lineColor: '#6b7280',
          secondaryColor: '#f3f4f6',
          tertiaryColor: '#ffffff',
        },
      })

      // Find all mermaid code blocks and render them
      const mermaidElements = document.querySelectorAll(
        'pre code.language-mermaid'
      )
      mermaidElements.forEach((element, index) => {
        const graphDefinition = element.textContent || ''
        const graphId = `mermaid-${Date.now()}-${index}`

        // Create a div to hold the rendered diagram
        const mermaidDiv = document.createElement('div')
        mermaidDiv.id = graphId
        mermaidDiv.className = 'mermaid-diagram'

        // Replace the code block with the diagram
        element.parentElement?.parentElement?.replaceChild(
          mermaidDiv,
          element.parentElement
        )

        // Render the diagram
        mermaid
          .render(graphId, graphDefinition)
          .then(({ svg }) => {
            mermaidDiv.innerHTML = svg
          })
          .catch(error => {
            console.error('Mermaid rendering error:', error)
            mermaidDiv.innerHTML = `<pre><code>${graphDefinition}</code></pre>`
          })
      })
    }

    onMounted(() => {
      initializeMermaid()
    })

    watch(
      () => route.path,
      () => nextTick(() => initializeMermaid()),
      { immediate: true }
    )
  },
} satisfies Theme
