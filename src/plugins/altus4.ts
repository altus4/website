import { reactive } from 'vue';
import type { App } from 'vue';
import type { User } from '@altus4/sdk';
import { Altus4SDK, TokenStorageManager } from '@altus4/sdk';

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

export interface AuthStateShape {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  error: string | null;
}

export interface Altus4PluginOptions {
  baseURL: string;
  timeout?: number;
  debug?: boolean;
}

// Global reactive auth state
export const authState: AuthStateShape = reactive({
  isAuthenticated: false,
  user: null as User | null,
  isLoading: false,
  error: null as string | null,
});

export default {
  install(app: App, options: Altus4PluginOptions) {
    const altus4 = new Altus4SDK({
      baseURL: options.baseURL,
      timeout: options.timeout || 30000,
    });

    if (options.debug && import.meta.env.DEV) {
      window.__altus4_debug__ = {
        sdk: altus4,
        authState,
        TokenStorageManager,
        getAuthStatus: () => altus4.auth?.getAuthStatus?.(),
        debugToken: () => altus4.auth?.debugTokenState?.(),
      };
      console.log('Altus4 debug tools available at window.__altus4_debug__');
    }

    const initializeAuth = async () => {
      authState.isLoading = true;
      try {
        let initialized = false;
        if (altus4.auth?.initializeAuthState) {
          initialized = await altus4.auth.initializeAuthState();
        } else if (altus4.auth?.restoreSession) {
          initialized = await altus4.auth.restoreSession();
        }

        if (initialized) {
          authState.isAuthenticated = true;
          type UserRespLite = { success?: boolean; user?: User };
          let userResponse: UserRespLite | undefined;
          const top = altus4 as unknown as Partial<{
            getCurrentUser: () => Promise<UserRespLite>;
          }>;
          if (typeof top.getCurrentUser === 'function') {
            userResponse = await top.getCurrentUser();
          } else if (altus4.auth?.getCurrentUser) {
            userResponse = await altus4.auth.getCurrentUser();
          }
          if (userResponse?.success) {
            authState.user = (userResponse.user as User) || null;
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

    // Fire and forget
    void initializeAuth();

    const authHelpers: AuthHelpers = {
      async login(email: string, password: string) {
        authState.isLoading = true;
        authState.error = null;
        try {
          type AuthResultLite = {
            success: boolean;
            user?: User;
            error?: { message?: string };
          };
          let result: AuthResultLite | undefined;
          const top = altus4 as unknown as Partial<{
            login: (e: string, p: string) => Promise<AuthResultLite>;
          }>;
          if (typeof top.login === 'function') {
            result = await top.login(email, password);
          } else if (altus4.auth?.handleLogin) {
            result = await altus4.auth.handleLogin({ email, password });
          }

          if (result?.success) {
            authState.isAuthenticated = true;
            authState.user = (result.user as User) || null;
            return { success: true, user: result.user };
          }
          const message = result?.error?.message || 'Login failed';
          authState.error = message;
          return { success: false, error: message };
        } catch (err: unknown) {
          const message = err instanceof Error ? err.message : 'Network error';
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
          type AuthResultLite = {
            success: boolean;
            user?: User;
            error?: { message?: string };
          };
          let result: AuthResultLite | undefined;
          const top = altus4 as unknown as Partial<{
            register: (
              n: string,
              e: string,
              p: string
            ) => Promise<AuthResultLite>;
          }>;
          if (typeof top.register === 'function') {
            result = await top.register(name, email, password);
          } else if (altus4.auth?.handleRegister) {
            result = await altus4.auth.handleRegister({
              name,
              email,
              password,
            });
          }
          if (result?.success) {
            authState.isAuthenticated = true;
            authState.user = (result.user as User) || null;
            return { success: true, user: result.user };
          }
          const message = result?.error?.message || 'Registration failed';
          authState.error = message;
          return { success: false, error: message };
        } catch (err: unknown) {
          const message = err instanceof Error ? err.message : 'Network error';
          authState.error = message;
          return { success: false, error: message };
        } finally {
          authState.isLoading = false;
        }
      },

      async logout() {
        authState.isLoading = true;
        try {
          if (typeof altus4.logout === 'function') {
            await altus4.logout();
          } else if (altus4.auth?.handleLogout) {
            await altus4.auth.handleLogout();
          }
        } catch (e) {
          console.error('Logout error:', e);
        } finally {
          authState.isAuthenticated = false;
          authState.user = null;
          authState.error = null;
          authState.isLoading = false;
        }
      },

      async refreshAuth() {
        const refreshed = await altus4.auth?.refreshTokenIfNeeded?.();
        if (refreshed) {
          const userResponse = await altus4.auth?.getCurrentUser?.();
          if (userResponse?.success) {
            authState.user = (userResponse.user as User) || null;
          }
        }
        return refreshed;
      },

      async reinitialize() {
        return initializeAuth();
      },
    };

    // Expose globally
    (
      app.config.globalProperties as unknown as {
        $altus4: Altus4SDK;
        $auth: AuthHelpers;
      }
    ).$altus4 = altus4;
    (
      app.config.globalProperties as unknown as {
        $altus4: Altus4SDK;
        $auth: AuthHelpers;
      }
    ).$auth = authHelpers;
    app.provide('altus4', altus4);
    app.provide('authHelpers', authHelpers);
    app.provide('authState', authState);
  },
};
