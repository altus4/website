import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'
import './custom.css'

export default {
  extends: DefaultTheme,
  enhanceApp({ router }) {
    if (typeof window !== 'undefined') {
      // Initialize Mermaid when the app starts
      const initMermaid = async () => {
        try {
          console.log('Initializing Mermaid...')
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
          
          console.log('Mermaid initialized successfully')

          // Function to render mermaid diagrams
          const renderMermaidDiagrams = async () => {
            const mermaidElements = document.querySelectorAll('pre code.language-mermaid')
            console.log(`Found ${mermaidElements.length} mermaid diagrams to render`)
            
            for (let i = 0; i < mermaidElements.length; i++) {
              const element = mermaidElements[i] as HTMLElement
              
              // Skip if already processed
              if (element.getAttribute('data-mermaid-processed')) {
                console.log(`Skipping already processed diagram ${i}`)
                continue
              }
              
              const graphDefinition = element.textContent || ''
              const graphId = `mermaid-diagram-${Date.now()}-${i}`
              
              console.log(`Processing mermaid diagram ${i}:`, graphDefinition.substring(0, 50) + '...')

              // Mark as being processed
              element.setAttribute('data-mermaid-processed', 'processing')

              // Create container for the diagram
              const container = document.createElement('div')
              container.className = 'mermaid-diagram'
              container.id = graphId

              try {
                // Render the mermaid diagram
                const { svg } = await mermaid.render(graphId, graphDefinition)
                container.innerHTML = svg
                
                // Replace the code block with the rendered diagram
                const preElement = element.parentElement
                if (preElement && preElement.parentElement) {
                  preElement.parentElement.replaceChild(container, preElement)
                  console.log(`Successfully rendered mermaid diagram ${i}`)
                }
              } catch (error) {
                console.error(`Mermaid rendering failed for diagram ${i}:`, error)
                // Keep the original code block on error
                element.setAttribute('data-mermaid-processed', 'error')
              }
            }
          }

          // Render diagrams on initial load
          renderMermaidDiagrams()

          // Re-render on route changes
          router.onAfterRouteChanged = () => {
            setTimeout(renderMermaidDiagrams, 100)
          }

        } catch (error) {
          console.error('Failed to initialize Mermaid:', error)
        }
      }

      // Initialize after DOM is ready
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initMermaid)
      } else {
        initMermaid()
      }
    }
  },
} satisfies Theme
