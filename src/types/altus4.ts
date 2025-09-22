/**
 * @fileoverview Altus4 SDK Type Definitions
 *
 * This file contains all TypeScript interfaces and types related to the Altus4 SDK integration.
 * Extracted from the main plugin file to improve maintainability and reusability.
 */

import type { User } from '@altus4/sdk';

/**
 * Configuration options for the Altus4 Vue plugin.
 */
export interface Altus4PluginOptions {
  /** Base URL for the Altus4 API */
  baseURL: string;
  /** Request timeout in milliseconds (default: 30000) */
  timeout?: number;
  /** Enable debug mode with additional logging and global debug tools */
  debug?: boolean;
}

/**
 * Shape of the global reactive authentication state object.
 * This state is shared across all components and automatically updates the UI.
 */
export interface AuthStateShape {
  /** Whether the user is currently authenticated */
  isAuthenticated: boolean;
  /** Current authenticated user object, null if not authenticated */
  user: User | null;
  /** Whether an authentication operation is currently in progress */
  isLoading: boolean;
  /** Current error message, null if no error */
  error: string | null;
}

/**
 * Standard result format for authentication operations.
 * Used to provide consistent response structure across different SDK API versions.
 */
export interface AuthResult {
  /** Whether the operation was successful */
  success: boolean;
  /** User data if operation was successful */
  user?: User;
  /** Error message if operation failed */
  error?: string;
}

/**
 * Interface defining authentication helper methods exposed to Vue components.
 * These methods provide a standardized way to handle authentication operations
 * while abstracting away the underlying SDK API variations.
 */
export interface AuthHelpers {
  /**
   * Authenticates a user with email and password credentials.
   * @param email - User's email address
   * @param password - User's password
   * @returns Promise resolving to authentication result
   */
  login: (email: string, password: string) => Promise<AuthResult>;

  /**
   * Registers a new user account with the provided credentials.
   * @param name - User's display name
   * @param email - User's email address
   * @param password - User's password
   * @returns Promise resolving to registration result
   */
  register: (
    name: string,
    email: string,
    password: string
  ) => Promise<AuthResult>;

  /**
   * Logs out the current user and clears authentication state.
   * @returns Promise that resolves when logout is complete
   */
  logout: () => Promise<void>;

  /**
   * Attempts to refresh the authentication token if needed.
   * @returns Promise resolving to boolean indicating if refresh was successful, or undefined if not applicable
   */
  refreshAuth: () => Promise<boolean | undefined>;

  /**
   * Reinitializes the authentication state from stored tokens.
   * Useful for recovering from auth state corruption or manual refresh.
   * @returns Promise that resolves when reinitialization is complete
   */
  reinitialize: () => Promise<void>;
}

/**
 * Minimal type definition for authentication results from SDK.
 * Used to handle API variations across different SDK versions.
 */
export interface AuthResultLite {
  success: boolean;
  user?: User;
  error?: { message?: string };
}

/**
 * Minimal type definition for user response from SDK.
 * Used to handle API variations when fetching current user data.
 */
export interface UserResponseLite {
  success?: boolean;
  user?: User;
}

/**
 * Type for authentication status information from SDK.
 * Used for debug methods that return auth status.
 */
export interface AuthStatus {
  isAuthenticated?: boolean;
  tokenValid?: boolean;
  expiresAt?: number;
  [key: string]: unknown; // Allow additional properties
}

/**
 * Type for token debug information from SDK.
 * Used for debug methods that return token state.
 */
export interface TokenDebugInfo {
  token?: string;
  decoded?: Record<string, unknown>;
  isValid?: boolean;
  expiresAt?: number;
  [key: string]: unknown; // Allow additional properties
}

/**
 * Type for TokenStorageManager from SDK.
 * Represents the token management utility.
 * Using a flexible type since the actual SDK implementation may vary.
 */
export type TokenStorageManagerType =
  | {
      hasValidToken?: () => boolean;
      isTokenExpiringSoon?: () => boolean;
      getToken?: () => string | null;
      clearToken?: () => void;
      [key: string]: unknown; // Allow additional properties
    }
  | typeof import('@altus4/sdk').TokenStorageManager;

/**
 * Type definitions for SDK methods that may exist at different locations.
 * These interfaces help with the dynamic type checking required due to SDK API inconsistencies.
 */

/** SDK methods that might exist at the root level */
export interface SDKRootMethods {
  login?: (email: string, password: string) => Promise<AuthResultLite>;
  register?: (
    name: string,
    email: string,
    password: string
  ) => Promise<AuthResultLite>;
  logout?: () => Promise<void>;
  getCurrentUser?: () => Promise<UserResponseLite>;
}

/** SDK methods that might exist under the auth namespace */
export interface SDKAuthMethods {
  initializeAuthState?: () => Promise<boolean>;
  restoreSession?: () => Promise<boolean>;
  handleLogin?: (credentials: {
    email: string;
    password: string;
  }) => Promise<AuthResultLite>;
  handleRegister?: (credentials: {
    name: string;
    email: string;
    password: string;
  }) => Promise<AuthResultLite>;
  handleLogout?: () => Promise<void>;
  getCurrentUser?: () => Promise<UserResponseLite>;
  refreshTokenIfNeeded?: () => Promise<boolean>;
  getAuthStatus?: () => AuthStatus;
  debugTokenState?: () => TokenDebugInfo;
}

/**
 * Combined type for the complete SDK instance with all possible methods.
 * This type accommodates the various API signatures found across different SDK versions.
 */
export interface Altus4SDKExtended extends Partial<SDKRootMethods> {
  auth?: Partial<SDKAuthMethods>;
}

/**
 * Debug tools interface for development environment.
 * Exposed on window object when debug mode is enabled.
 */
export interface Altus4DebugTools {
  sdk: Altus4SDKExtended;
  authState: AuthStateShape;
  TokenStorageManager: unknown; // SDK's TokenStorageManager - type varies
  getAuthStatus: () => AuthStatus | undefined;
  debugToken: () => TokenDebugInfo | undefined;
}

/**
 * Global type augmentation for window object to include debug tools.
 */
declare global {
  interface Window {
    __altus4_debug__?: Altus4DebugTools;
  }
}
