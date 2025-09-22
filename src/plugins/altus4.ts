/**
 * @fileoverview Altus4 Vue Plugin - Clean Implementation
 *
 * This is the refactored version of the Altus4 Vue plugin that uses extracted
 * types and utilities to provide a clean, maintainable interface for authentication
 * in Vue applications.
 *
 * The previous "crude" implementation has been cleaned up by:
 * - Extracting all types to a separate file
 * - Moving SDK interaction logic to utility functions
 * - Simplifying the plugin to focus only on Vue integration
 * - Improving error handling and type safety
 */

import { reactive } from 'vue';
import type { App } from 'vue';
import { Altus4SDK, TokenStorageManager } from '@altus4/sdk';

// Import extracted types and utilities
import type {
  AuthHelpers,
  AuthStateShape,
  Altus4PluginOptions,
  Altus4DebugTools,
  Altus4SDKExtended,
} from '@/types/altus4';
import { createAuthHelpers, initializeAuthState } from '@/lib/sdk-adapter';

/**
 * Global reactive authentication state.
 * This is the single source of truth for authentication state across the entire application.
 * Vue's reactive() makes this object automatically trigger re-renders when updated.
 */
export const authState: AuthStateShape = reactive({
  isAuthenticated: false,
  user: null,
  isLoading: false,
  error: null,
});

/**
 * Vue plugin for integrating Altus4 SDK with Vue applications.
 *
 * This clean implementation focuses solely on Vue integration concerns:
 * - Installing the plugin with configuration
 * - Setting up authentication state
 * - Exposing SDK and helpers to components
 * - Providing debug tools in development
 *
 * All the complex SDK interaction logic has been moved to utility functions.
 */
export default {
  /**
   * Vue plugin install method - called when app.use(altus4Plugin, options) is invoked.
   * @param app - Vue application instance
   * @param options - Plugin configuration options
   */
  install(app: App, options: Altus4PluginOptions) {
    // Initialize the Altus4 SDK with provided configuration
    const altus4 = new Altus4SDK({
      baseURL: options.baseURL,
      timeout: options.timeout || 30000, // Default 30 second timeout
    });

    // Set up debug tools in development mode
    if (options.debug && import.meta.env.DEV) {
      const debugTools: Altus4DebugTools = {
        sdk: altus4 as unknown as Altus4SDKExtended,
        authState,
        TokenStorageManager,
        getAuthStatus: () =>
          (altus4 as unknown as Altus4SDKExtended).auth?.getAuthStatus?.(),
        debugToken: () =>
          (altus4 as unknown as Altus4SDKExtended).auth?.debugTokenState?.(),
      };

      window.__altus4_debug__ = debugTools;
      console.log('Altus4 debug tools available at window.__altus4_debug__');
    }

    /**
     * Initialize authentication state on application startup.
     * Uses the extracted utility function for cleaner separation of concerns.
     */
    const initializeAuth = async (): Promise<void> => {
      await initializeAuthState(altus4, authState);
    };

    // Start auth initialization immediately when plugin is installed
    // Using void to explicitly ignore the promise (fire-and-forget pattern)
    void initializeAuth();

    /**
     * Create authentication helper methods using the utility factory.
     * This provides a clean, consistent interface for authentication operations.
     */
    const authHelpers: AuthHelpers = createAuthHelpers(
      altus4,
      authState,
      initializeAuth
    );

    /**
     * Make SDK and auth helpers available throughout the Vue application.
     * Uses both global properties (for Options API) and provide/inject (for Composition API).
     */

    // Global properties for Options API compatibility
    interface GlobalProperties {
      $altus4: Altus4SDK;
      $auth: AuthHelpers;
    }

    const globalProps = app.config
      .globalProperties as unknown as GlobalProperties;
    globalProps.$altus4 = altus4;
    globalProps.$auth = authHelpers;

    // Provide dependencies for Composition API (modern Vue 3 approach)
    app.provide('altus4', altus4); // SDK instance
    app.provide('authHelpers', authHelpers); // Authentication methods
    app.provide('authState', authState); // Reactive authentication state
  },
};
