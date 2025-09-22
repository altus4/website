/**
 * @fileoverview Altus4 SDK Adapter
 *
 * This file provides a compatibility adapter for the @altus4/sdk package.
 *
 * WHY THIS ADAPTER EXISTS:
 * The @altus4/sdk has inconsistent API signatures across versions:
 * - Methods sometimes exist at `sdk.method()`, sometimes at `sdk.auth.handleMethod()`
 * - Parameter signatures vary (object vs positional arguments)
 * - Method availability changes between versions
 *
 * This adapter provides a stable, consistent interface by:
 * - Trying multiple API signatures for each operation
 * - Handling the dynamic type checking and fallbacks
 * - Isolating the "crude" compatibility code in one place
 *
 * IDEAL SOLUTION: Fix the @altus4/sdk to have consistent APIs
 * CURRENT SOLUTION: This adapter pattern until the SDK is fixed
 */

import type { Altus4SDK, User } from '@altus4/sdk';
import type {
  AuthStateShape,
  AuthResult,
  AuthResultLite,
  UserResponseLite,
  Altus4SDKExtended,
  SDKRootMethods,
} from '@/types/altus4';

/**
 * Utility class for handling SDK method resolution and execution.
 * This abstracts away the "crude" dynamic type checking patterns.
 */
export class SDKMethodResolver {
  private sdk: Altus4SDK;

  constructor(sdk: Altus4SDK) {
    this.sdk = sdk;
  }

  /**
   * Resolves and calls the appropriate login method from the SDK.
   * Handles multiple API signatures gracefully.
   */
  async login(
    email: string,
    password: string
  ): Promise<AuthResultLite | undefined> {
    const extendedSDK = this.sdk as unknown as Altus4SDKExtended;
    const rootMethods = extendedSDK as unknown as Partial<SDKRootMethods>;

    // Try root-level login method first (newer API)
    if (typeof rootMethods.login === 'function') {
      return await rootMethods.login(email, password);
    }

    // Fallback to auth namespace method (older API)
    if (extendedSDK.auth?.handleLogin) {
      return await extendedSDK.auth.handleLogin({ email, password });
    }

    throw new Error('No login method available in SDK');
  }

  /**
   * Resolves and calls the appropriate register method from the SDK.
   * Handles multiple API signatures gracefully.
   */
  async register(
    name: string,
    email: string,
    password: string
  ): Promise<AuthResultLite | undefined> {
    const extendedSDK = this.sdk as unknown as Altus4SDKExtended;
    const rootMethods = extendedSDK as unknown as Partial<SDKRootMethods>;

    // Try root-level register method first (newer API)
    if (typeof rootMethods.register === 'function') {
      return await rootMethods.register(name, email, password);
    }

    // Fallback to auth namespace method (older API)
    if (extendedSDK.auth?.handleRegister) {
      return await extendedSDK.auth.handleRegister({ name, email, password });
    }

    throw new Error('No register method available in SDK');
  }

  /**
   * Resolves and calls the appropriate logout method from the SDK.
   * Handles multiple API signatures gracefully.
   */
  async logout(): Promise<void> {
    const extendedSDK = this.sdk as unknown as Altus4SDKExtended;
    const rootMethods = extendedSDK as unknown as Partial<SDKRootMethods>;

    // Try root-level logout method first
    if (typeof rootMethods.logout === 'function') {
      await rootMethods.logout();
      return;
    }

    // Fallback to auth namespace method
    if (extendedSDK.auth?.handleLogout) {
      await extendedSDK.auth.handleLogout();
      return;
    }

    throw new Error('No logout method available in SDK');
  }

  /**
   * Resolves and calls the appropriate getCurrentUser method from the SDK.
   */
  async getCurrentUser(): Promise<UserResponseLite | undefined> {
    const extendedSDK = this.sdk as unknown as Altus4SDKExtended;
    const rootMethods = extendedSDK as unknown as Partial<SDKRootMethods>;

    // Try root-level method first
    if (typeof rootMethods.getCurrentUser === 'function') {
      return await rootMethods.getCurrentUser();
    }

    // Fallback to auth namespace method
    if (extendedSDK.auth?.getCurrentUser) {
      return await extendedSDK.auth.getCurrentUser();
    }

    return undefined;
  }

  /**
   * Attempts to initialize auth state using available SDK methods.
   */
  async initializeAuthState(): Promise<boolean> {
    const extendedSDK = this.sdk as unknown as Altus4SDKExtended;

    if (extendedSDK.auth?.initializeAuthState) {
      return await extendedSDK.auth.initializeAuthState();
    }

    if (extendedSDK.auth?.restoreSession) {
      return await extendedSDK.auth.restoreSession();
    }

    return false;
  }

  /**
   * Attempts to refresh the authentication token if needed.
   */
  async refreshTokenIfNeeded(): Promise<boolean | undefined> {
    const extendedSDK = this.sdk as unknown as Altus4SDKExtended;
    return await extendedSDK.auth?.refreshTokenIfNeeded?.();
  }
}

/**
 * Utility functions for authentication state management.
 */
export class AuthStateManager {
  /**
   * Updates authentication state after successful login/register.
   */
  static updateAuthSuccess(authState: AuthStateShape, user?: User): void {
    authState.isAuthenticated = true;
    authState.user = user || null;
    authState.error = null;
    authState.isLoading = false;
  }

  /**
   * Updates authentication state after failed operation.
   */
  static updateAuthFailure(authState: AuthStateShape, error: string): void {
    authState.isAuthenticated = false;
    authState.user = null;
    authState.error = error;
    authState.isLoading = false;
  }

  /**
   * Clears authentication state (for logout).
   */
  static clearAuthState(authState: AuthStateShape): void {
    authState.isAuthenticated = false;
    authState.user = null;
    authState.error = null;
    authState.isLoading = false;
  }

  /**
   * Sets loading state for authentication operations.
   */
  static setLoadingState(authState: AuthStateShape, isLoading: boolean): void {
    authState.isLoading = isLoading;
    if (isLoading) {
      authState.error = null;
    }
  }
}

/**
 * Utility functions for error handling and message extraction.
 */
export class ErrorHandler {
  /**
   * Extracts a user-friendly error message from various error sources.
   */
  static extractErrorMessage(
    error: unknown,
    defaultMessage: string = 'An error occurred'
  ): string {
    if (error instanceof Error) {
      return error.message;
    }

    if (typeof error === 'string') {
      return error;
    }

    if (error && typeof error === 'object' && 'message' in error) {
      return String((error as Record<string, unknown>).message);
    }

    return defaultMessage;
  }

  /**
   * Extracts error message from SDK authentication result.
   */
  static extractAuthError(
    result?: AuthResultLite,
    defaultMessage: string = 'Operation failed'
  ): string {
    return result?.error?.message || defaultMessage;
  }
}

/**
 * Factory function to create authentication helper methods.
 * This encapsulates all the authentication logic in a reusable way.
 */
export function createAuthHelpers(
  sdk: Altus4SDK,
  authState: AuthStateShape,
  initializeAuth: () => Promise<void>
) {
  const resolver = new SDKMethodResolver(sdk);

  return {
    async login(email: string, password: string): Promise<AuthResult> {
      AuthStateManager.setLoadingState(authState, true);

      try {
        const result = await resolver.login(email, password);

        if (result?.success) {
          AuthStateManager.updateAuthSuccess(authState, result.user);
          return { success: true, user: result.user };
        }

        const message = ErrorHandler.extractAuthError(result, 'Login failed');
        AuthStateManager.updateAuthFailure(authState, message);
        return { success: false, error: message };
      } catch (error) {
        const message = ErrorHandler.extractErrorMessage(
          error,
          'Network error'
        );
        AuthStateManager.updateAuthFailure(authState, message);
        return { success: false, error: message };
      }
    },

    async register(
      name: string,
      email: string,
      password: string
    ): Promise<AuthResult> {
      AuthStateManager.setLoadingState(authState, true);

      try {
        const result = await resolver.register(name, email, password);

        if (result?.success) {
          AuthStateManager.updateAuthSuccess(authState, result.user);
          return { success: true, user: result.user };
        }

        const message = ErrorHandler.extractAuthError(
          result,
          'Registration failed'
        );
        AuthStateManager.updateAuthFailure(authState, message);
        return { success: false, error: message };
      } catch (error) {
        const message = ErrorHandler.extractErrorMessage(
          error,
          'Network error'
        );
        AuthStateManager.updateAuthFailure(authState, message);
        return { success: false, error: message };
      }
    },

    async logout(): Promise<void> {
      AuthStateManager.setLoadingState(authState, true);

      try {
        await resolver.logout();
      } catch (error) {
        console.error('Logout error:', error);
      } finally {
        AuthStateManager.clearAuthState(authState);
      }
    },

    async refreshAuth(): Promise<boolean | undefined> {
      const refreshed = await resolver.refreshTokenIfNeeded();

      if (refreshed) {
        const userResponse = await resolver.getCurrentUser();
        if (userResponse?.success) {
          authState.user = userResponse.user || null;
        }
      }

      return refreshed;
    },

    async reinitialize(): Promise<void> {
      return initializeAuth();
    },
  };
}

/**
 * Initializes authentication state on application startup.
 * Extracted from the main plugin for better testability and reusability.
 */
export async function initializeAuthState(
  sdk: Altus4SDK,
  authState: AuthStateShape
): Promise<void> {
  AuthStateManager.setLoadingState(authState, true);

  try {
    const resolver = new SDKMethodResolver(sdk);
    const initialized = await resolver.initializeAuthState();

    if (initialized) {
      authState.isAuthenticated = true;

      const userResponse = await resolver.getCurrentUser();
      if (userResponse?.success) {
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
}

/**
 * Creates debug tools for development environment.
 * Extracted for better organization and type safety.
 */
export function createDebugTools(sdk: Altus4SDK, authState: AuthStateShape) {
  const extendedSDK = sdk as unknown as Altus4SDKExtended;

  return {
    sdk,
    authState,
    TokenStorageManager:
      (globalThis as { TokenStorageManager?: unknown }).TokenStorageManager ||
      {},
    getAuthStatus: () => extendedSDK.auth?.getAuthStatus?.(),
    debugToken: () => extendedSDK.auth?.debugTokenState?.(),
  };
}
