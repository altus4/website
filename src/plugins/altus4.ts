/**
 * @fileoverview Altus4 Vue Plugin - Direct SDK Implementation
 *
 * This implementation uses the @altus4/sdk directly without any adapter layer.
 * All the methods we need are now available in the latest SDK version.
 */

import { reactive } from 'vue';
import type { App } from 'vue';
import { Altus4SDK, TokenStorageManager } from '@altus4/sdk';
import type { User, AuthResult } from '@altus4/sdk';

// Import only the types we need, reusing the existing ones where possible
import type { AuthStateShape, Altus4PluginOptions } from '@/types/altus4';

/**
 * Helper function to extract error message from SDK's rich error object
 */
function extractErrorMessage(error?: {
  code: string;
  message: string;
  details?: unknown;
}): string {
  return error?.message || 'Operation failed';
}

/**
 * Interface for authentication helpers that matches what the website expects.
 * This provides the same interface as before but uses the SDK directly.
 */
export interface AuthHelpers {
  login: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; user?: User; error?: string }>;
  register: (
    name: string,
    email: string,
    password: string
  ) => Promise<{ success: boolean; user?: User; error?: string }>;
  logout: () => Promise<void>;
  refreshAuth: () => Promise<boolean | undefined>;
  reinitialize: () => Promise<void>;
}

/**
 * Global reactive authentication state.
 * This is the single source of truth for authentication state across the entire application.
 */
export const authState: AuthStateShape = reactive({
  isAuthenticated: false,
  user: null,
  isLoading: false,
  error: null,
});

/**
 * Vue plugin for integrating Altus4 SDK with Vue applications.
 * This version uses the SDK directly without any compatibility adapter.
 */
export default {
  /**
   * Vue plugin install method - called when app.use(altus4Plugin, options) is invoked.
   */
  install(app: App, options: Altus4PluginOptions) {
    // Initialize the Altus4 SDK with provided configuration
    const altus4 = new Altus4SDK({
      baseURL: options.baseURL,
      timeout: options.timeout || 30000,
    });

    // Set up debug tools in development mode
    if (options.debug && import.meta.env.DEV) {
      window.__altus4_debug__ = {
        sdk: altus4 as any,
        authState,
        TokenStorageManager: TokenStorageManager as any,
        getAuthStatus: () => altus4.auth.getAuthStatus(),
        debugToken: () => {
          altus4.auth.debugTokenState();
          return undefined;
        },
      };
      console.log('Altus4 debug tools available at window.__altus4_debug__');
    }

    /**
     * Initialize authentication state using the SDK's built-in methods.
     */
    const initializeAuth = async (): Promise<void> => {
      authState.isLoading = true;
      try {
        // Use the SDK's initializeAuthState method
        const initialized = await altus4.auth.initializeAuthState();

        if (initialized) {
          authState.isAuthenticated = true;

          // Get current user using the SDK's method
          const userResponse = await altus4.getCurrentUser();
          if (userResponse.success) {
            authState.user = userResponse.user || null;
          }
        } else {
          authState.isAuthenticated = false;
          authState.user = null;
        }
      } catch (error) {
        console.warn('Failed to initialize auth state:', error);
        authState.error = 'Failed to initialize authentication';
      } finally {
        authState.isLoading = false;
      }
    };

    // Start auth initialization immediately when plugin is installed
    void initializeAuth();

    /**
     * Create authentication helper methods using the SDK directly.
     */
    const authHelpers: AuthHelpers = {
      async login(email: string, password: string) {
        authState.isLoading = true;
        authState.error = null;

        try {
          // Use the SDK's direct login method
          const result: AuthResult = await altus4.login(email, password);

          if (result.success) {
            authState.isAuthenticated = true;
            authState.user = result.user || null;
            return { success: true, user: result.user };
          }

          const message = extractErrorMessage(result.error);
          authState.error = message;
          return { success: false, error: message };
        } catch (error) {
          const message =
            error instanceof Error ? error.message : 'Network error';
          authState.error = message;
          return { success: false, error: message };
        } finally {
          authState.isLoading = false;
        }
      },

      async register(name: string, email: string, password: string) {
        authState.isLoading = true;
        authState.error = null;

        try {
          // Use the SDK's direct register method
          const result: AuthResult = await altus4.register(
            name,
            email,
            password
          );

          if (result.success) {
            authState.isAuthenticated = true;
            authState.user = result.user || null;
            return { success: true, user: result.user };
          }

          const message = extractErrorMessage(result.error);
          authState.error = message;
          return { success: false, error: message };
        } catch (error) {
          const message =
            error instanceof Error ? error.message : 'Network error';
          authState.error = message;
          return { success: false, error: message };
        } finally {
          authState.isLoading = false;
        }
      },

      async logout() {
        authState.isLoading = true;
        try {
          // Use the SDK's direct logout method
          await altus4.logout();
        } catch (error) {
          console.error('Logout error:', error);
        } finally {
          // Always clear authentication state
          authState.isAuthenticated = false;
          authState.user = null;
          authState.error = null;
          authState.isLoading = false;
        }
      },

      async refreshAuth() {
        // Use the SDK's direct refresh method
        return await altus4.refreshTokenIfNeeded();
      },

      async reinitialize() {
        return initializeAuth();
      },
    };

    /**
     * Make SDK and auth helpers available throughout the Vue application.
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
    app.provide('altus4', altus4);
    app.provide('authHelpers', authHelpers);
    app.provide('authState', authState);
  },
};
