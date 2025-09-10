import { computed, reactive } from 'vue';
import {
  apiClient,
  type LoginRequest,
  type RegisterRequest,
  type ForgotPasswordRequest,
  type User,
  type AuthResponse,
} from '@/lib/api';

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
}

const state = reactive<AuthState>({
  user: null,
  token: localStorage.getItem('auth_token'),
  isLoading: false,
  error: null,
});

export function useAuth() {
  const isAuthenticated = computed(() => !!state.token && !!state.user);

  const setAuthData = (authData: AuthResponse) => {
    state.user = authData.user;
    state.token = authData.token;
    apiClient.setToken(authData.token, authData.expires_in);
  };

  const clearAuthData = () => {
    state.user = null;
    state.token = null;
    apiClient.clearToken();
  };

  const checkTokenExpiration = () => {
    return apiClient.isAuthenticated();
  };

  const login = async (credentials: LoginRequest) => {
    state.isLoading = true;
    state.error = null;

    try {
      const result = await apiClient.login(credentials);

      if (result.success && result.data) {
        setAuthData(result.data);
        return {
          success: true,
          data: result.data,
        };
      } else {
        state.error = result.error?.message || 'Login failed';
        return {
          success: false,
          message: result.error?.message || 'Login failed',
          errors: result.error?.details,
        };
      }
    } catch {
      state.error = 'Network error occurred';
      return { success: false, message: 'Network error occurred' };
    } finally {
      state.isLoading = false;
    }
  };

  const register = async (userData: RegisterRequest) => {
    state.isLoading = true;
    state.error = null;

    try {
      const result = await apiClient.register(userData);

      if (result.success && result.data) {
        setAuthData(result.data);
        return {
          success: true,
          data: result.data,
        };
      } else {
        state.error = result.error?.message || 'Registration failed';
        return {
          success: false,
          message: result.error?.message || 'Registration failed',
          errors: result.error?.details,
        };
      }
    } catch {
      state.error = 'Network error occurred';
      return { success: false, message: 'Network error occurred' };
    } finally {
      state.isLoading = false;
    }
  };

  const forgotPassword = async (data: ForgotPasswordRequest) => {
    state.isLoading = true;
    state.error = null;

    try {
      const result = await apiClient.forgotPassword(data);

      if (result.success) {
        return {
          success: true,
          message: result.data?.message || 'Password reset email sent',
        };
      } else {
        state.error = result.error?.message || 'Failed to send reset email';
        return {
          success: false,
          message: result.error?.message || 'Failed to send reset email',
          errors: result.error?.details,
        };
      }
    } catch {
      state.error = 'Network error occurred';
      return { success: false, message: 'Network error occurred' };
    } finally {
      state.isLoading = false;
    }
  };

  const logout = async () => {
    state.isLoading = true;

    try {
      await apiClient.logout();
    } catch {
      console.error('Logout error occurred');
    } finally {
      clearAuthData();
      state.isLoading = false;
    }
  };

  const refreshToken = async () => {
    try {
      const response = await apiClient.refreshToken();

      if (response.success && response.data) {
        state.token = response.data.token;
        apiClient.setToken(response.data.token, response.data.expires_in);
        return true;
      } else {
        clearAuthData();
        return false;
      }
    } catch {
      clearAuthData();
      return false;
    }
  };

  const loadUserFromToken = async () => {
    if (!state.token || !checkTokenExpiration()) {
      clearAuthData();
      return;
    }

    try {
      const response = await apiClient.getProfile();
      if (response.success && response.data) {
        state.user = response.data;
      } else {
        clearAuthData();
      }
    } catch {
      clearAuthData();
    }
  };

  const clearError = () => {
    state.error = null;
  };

  // Auto-load user on initialization
  if (state.token && !state.user) {
    loadUserFromToken();
  }

  return {
    // State
    isAuthenticated,
    user: computed(() => state.user),
    isLoading: computed(() => state.isLoading),
    error: computed(() => state.error),

    // Actions
    login,
    register,
    forgotPassword,
    logout,
    refreshToken,
    clearError,
    loadUserFromToken,
  };
}
