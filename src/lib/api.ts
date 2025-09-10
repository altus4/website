import axios, { type AxiosInstance, type AxiosResponse } from 'axios';

// API Response Interface
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
  meta?: unknown;
}

// User Interface
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
  connectedDatabases: string[];
  createdAt: Date;
  lastActive: Date;
}

// Authentication Interfaces
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  role?: 'admin' | 'user';
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  expires_in: number;
}

// API Key Interfaces
export interface ApiKey {
  id: string;
  name: string;
  keyPrefix: string;
  environment: 'test' | 'live';
  permissions: string[];
  rateLimitTier: 'free' | 'pro' | 'enterprise';
  expiresAt?: string;
  lastUsed?: string;
  usageCount: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateApiKeyRequest {
  name: string;
  environment: 'test' | 'live';
  permissions?: string[];
  rateLimitTier?: 'free' | 'pro' | 'enterprise';
  expiresAt?: string;
}

export interface CreateApiKeyResponse {
  apiKey: ApiKey;
  secretKey: string;
  warning: string;
}

// Database Connection Interface
export interface DatabaseConnection {
  id: string;
  name: string;
  type: 'postgresql' | 'mysql' | 'mongodb' | 'sqlite';
  host: string;
  port: number;
  database: string;
  status: 'connected' | 'disconnected' | 'error';
  createdAt: string;
}

class ApiClient {
  private client: AxiosInstance;

  constructor(baseURL?: string) {
    const apiBaseURL =
      baseURL ||
      import.meta.env.VITE_API_BASE_URL ||
      'http://localhost:3000/api/v1';

    this.client = axios.create({
      baseURL: apiBaseURL,
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 10000,
    });

    // Request interceptor to add auth token
    this.client.interceptors.request.use(
      config => {
        const token = localStorage.getItem('auth_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      error => Promise.reject(error)
    );

    // Response interceptor to handle errors consistently
    this.client.interceptors.response.use(
      (response: AxiosResponse) => response,
      error => {
        // Handle network errors or server errors
        const apiError = {
          success: false,
          error: {
            code:
              error.response?.data?.error?.code ||
              error.code ||
              'REQUEST_FAILED',
            message:
              error.response?.data?.error?.message ||
              error.message ||
              'Request failed',
            details: error.response?.data?.error?.details,
          },
        };
        return Promise.reject(apiError);
      }
    );
  }

  private async request<T>(
    endpoint: string,
    options: {
      method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
      data?: unknown;
    } = {}
  ): Promise<ApiResponse<T>> {
    try {
      const response = await this.client.request<T>({
        url: endpoint,
        method: options.method || 'GET',
        data: options.data,
      });

      return {
        success: true,
        data: response.data,
      };
    } catch (error: unknown) {
      // Error is already formatted by the response interceptor
      return error as ApiResponse<T>;
    }
  }

  // Authentication Methods
  async login(credentials: LoginRequest): Promise<ApiResponse<AuthResponse>> {
    return this.request<AuthResponse>('/auth/login', {
      method: 'POST',
      data: credentials,
    });
  }

  async register(
    userData: RegisterRequest
  ): Promise<ApiResponse<AuthResponse>> {
    return this.request<AuthResponse>('/auth/register', {
      method: 'POST',
      data: userData,
    });
  }

  async forgotPassword(
    data: ForgotPasswordRequest
  ): Promise<ApiResponse<{ message: string }>> {
    return this.request<{ message: string }>('/auth/forgot-password', {
      method: 'POST',
      data,
    });
  }

  async refreshToken(): Promise<
    ApiResponse<{ token: string; expires_in: number }>
  > {
    return this.request<{ token: string; expires_in: number }>(
      '/auth/refresh',
      {
        method: 'POST',
      }
    );
  }

  async getProfile(): Promise<ApiResponse<User>> {
    return this.request<User>('/auth/profile');
  }

  async logout(): Promise<ApiResponse<{ message: string }>> {
    return this.request<{ message: string }>('/auth/logout', {
      method: 'POST',
    });
  }

  // API Key Management
  async createApiKey(
    keyData: CreateApiKeyRequest
  ): Promise<ApiResponse<CreateApiKeyResponse>> {
    return this.request<CreateApiKeyResponse>('/keys', {
      method: 'POST',
      data: keyData,
    });
  }

  async listApiKeys(): Promise<ApiResponse<ApiKey[]>> {
    return this.request<ApiKey[]>('/keys');
  }

  async revokeApiKey(
    keyId: string
  ): Promise<ApiResponse<{ revoked: boolean; message: string }>> {
    return this.request<{ revoked: boolean; message: string }>(
      `/keys/${keyId}`,
      {
        method: 'DELETE',
      }
    );
  }

  // Database Management
  async listDatabaseConnections(): Promise<ApiResponse<DatabaseConnection[]>> {
    return this.request<DatabaseConnection[]>('/databases');
  }

  async addDatabaseConnection(connectionData: {
    name: string;
    type: 'postgresql' | 'mysql' | 'mongodb' | 'sqlite';
    host: string;
    port: number;
    database: string;
    username: string;
    password: string;
  }): Promise<ApiResponse<DatabaseConnection>> {
    return this.request<DatabaseConnection>('/databases', {
      method: 'POST',
      data: connectionData,
    });
  }

  async testDatabaseConnection(
    connectionId: string
  ): Promise<ApiResponse<{ status: string; message: string }>> {
    return this.request<{ status: string; message: string }>(
      `/databases/${connectionId}/test`,
      {
        method: 'POST',
      }
    );
  }

  async removeDatabaseConnection(
    connectionId: string
  ): Promise<ApiResponse<{ message: string }>> {
    return this.request<{ message: string }>(`/databases/${connectionId}`, {
      method: 'DELETE',
    });
  }

  // Management
  async setupInitialApiKey(): Promise<ApiResponse<CreateApiKeyResponse>> {
    return this.request<CreateApiKeyResponse>('/management/setup', {
      method: 'POST',
    });
  }

  async getSystemHealth(): Promise<
    ApiResponse<{
      status: 'healthy' | 'degraded' | 'down';
      version: string;
      uptime: number;
      database: { status: string; connections: number };
      memory: { used: number; total: number };
    }>
  > {
    return this.request('/management/health');
  }

  // Analytics
  async getAnalytics(timeframe: '1h' | '24h' | '7d' | '30d' = '24h'): Promise<
    ApiResponse<{
      requests: { total: number; successful: number; failed: number };
      responseTime: { average: number; p95: number; p99: number };
      topEndpoints: Array<{ endpoint: string; count: number }>;
    }>
  > {
    return this.request(`/analytics?timeframe=${timeframe}`);
  }

  // Utilities
  isAuthenticated(): boolean {
    const token = localStorage.getItem('auth_token');
    const expiresAt = localStorage.getItem('token_expires_at');

    if (!token || !expiresAt) {
      return false;
    }

    return Date.now() < parseInt(expiresAt);
  }

  setToken(token: string, expiresIn: number): void {
    localStorage.setItem('auth_token', token);
    const expiresAt = Date.now() + expiresIn * 1000;
    localStorage.setItem('token_expires_at', expiresAt.toString());
  }

  clearToken(): void {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('token_expires_at');
  }
}

// Export singleton instance
export const apiClient = new ApiClient();
export default apiClient;
