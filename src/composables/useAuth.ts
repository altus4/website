import { inject, computed } from 'vue';
import type { Altus4SDK } from '@altus4/sdk';
import { TokenStorageManager } from '@altus4/sdk';
import type { AuthHelpers, AuthStateShape } from '@/plugins/altus4';

export function useAuth() {
  const altus4 = inject<Altus4SDK>('altus4');
  const authHelpers = inject<AuthHelpers>('authHelpers');
  const authState = inject<AuthStateShape>('authState');

  if (!altus4 || !authHelpers || !authState) {
    throw new Error('Altus4 plugin not properly installed');
  }

  const isAuthenticated = computed(() => authState.isAuthenticated);
  const user = computed(() => authState.user);
  const isLoading = computed(() => authState.isLoading);
  const error = computed(() => authState.error);

  // Optional utilities expected by some views
  const clearError = () => {
    authState.error = null;
  };

  // Forgot password (best-effort: call SDK if available)
  const forgotPassword = async (payload: { email: string }) => {
    try {
      type ResetCapable = {
        auth?: {
          requestPasswordReset?: (p: { email: string }) => Promise<{
            success: boolean;
            error?: { message?: string };
          }>;
        };
      };
      const sdk = altus4 as unknown as ResetCapable;
      if (sdk.auth?.requestPasswordReset) {
        const res = await sdk.auth.requestPasswordReset(payload);
        return res || { success: true };
      }
      return { success: false, error: { message: 'Not implemented' } };
    } catch (e: unknown) {
      return {
        success: false,
        error: {
          message: e instanceof Error ? e.message : 'Request failed',
        },
      };
    }
  };

  return {
    // state
    isAuthenticated,
    user,
    isLoading,
    error,

    // actions
    login: authHelpers.login,
    logout: authHelpers.logout,
    register: authHelpers.register,
    refreshAuth: authHelpers.refreshAuth,
    reinitialize: authHelpers.reinitialize,
    clearError,
    forgotPassword,

    // sdk + token helpers
    sdk: altus4,
    hasValidToken: () => {
      try {
        return !!TokenStorageManager.hasValidToken?.();
      } catch {
        type AuthLike = { auth?: { isAuthenticated?: () => boolean } };
        const sdk = altus4 as unknown as AuthLike;
        return !!sdk.auth?.isAuthenticated?.();
      }
    },
    isTokenExpiring: () => {
      try {
        return !!(
          TokenStorageManager as unknown as {
            isTokenExpiringSoon?: () => boolean;
          }
        ).isTokenExpiringSoon?.();
      } catch {
        return false;
      }
    },

    // debug helpers
    debugAuth: () => {
      if (import.meta.env.DEV) {
        console.log('Auth:', {
          isAuthenticated: isAuthenticated.value,
          hasValidToken: TokenStorageManager.hasValidToken?.(),
        });
        type DebugLike = { auth?: { debugTokenState?: () => void } };
        const sdk = altus4 as unknown as DebugLike;
        sdk.auth?.debugTokenState?.();
      }
    },
  };
}
