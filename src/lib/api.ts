import axios, { type AxiosInstance, type AxiosResponse } from 'axios';

// Window type extension for runtime environment variables
declare global {
  interface Window {
    VITE_API_BASE_URL?: string;
  }
}

// Database types
export type DatabaseType = 'postgresql' | 'mysql' | 'mongodb' | 'sqlite';
export type UserRole = 'admin' | 'user';
export type Environment = 'test' | 'live';
export type RateLimitTier = 'free' | 'pro' | 'enterprise';
export type SearchMode = 'natural' | 'boolean' | 'semantic';
export type SuggestionType = 'spelling' | 'semantic' | 'popular';
export type OptimizationType = 'index' | 'query' | 'schema';
export type Impact = 'low' | 'medium' | 'high';
export type Period = 'day' | 'week' | 'month' | '3months' | '6months' | 'year';
export type HealthStatus = 'healthy' | 'degraded' | 'down';
export type Timeframe = '1h' | '24h' | '7d' | '30d';

// API Response Interface - matches server-side ApiResponse
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: { [key: string]: T } | T;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
  meta?: {
    timestamp: Date;
    requestId: string;
    version: string;
    apiKeyTier?: string;
  };
}

// User Interface - matches server-side User type
export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
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
  role?: UserRole;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  expires_in?: number;
}

// API Key Interfaces
export interface ApiKey {
  id: string;
  name: string;
  keyPrefix: string;
  environment: Environment;
  permissions: string[];
  rateLimitTier: RateLimitTier;
  expiresAt?: string;
  lastUsed?: string;
  usageCount: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateApiKeyRequest {
  name: string;
  environment: Environment;
  permissions?: string[];
  rateLimitTier?: RateLimitTier;
  expiresAt?: string;
}

export interface CreateApiKeyResponse {
  apiKey: ApiKey;
  secretKey: string;
  warning: string;
}

// Database Connection Interface - matches server-side DatabaseConnectionResponse
export interface DatabaseConnection {
  id: string;
  name: string;
  host: string;
  port: number;
  database: string;
  username: string;
  ssl?: boolean;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
}

// Search-related interfaces
export interface SearchRequest {
  query: string;
  databases?: string[];
  tables?: string[];
  columns?: string[];
  filters?: Record<string, unknown>;
  searchMode?: SearchMode;
  limit?: number;
  offset?: number;
  includeAnalytics?: boolean;
  userId: string;
}

export interface SearchResult {
  id: string;
  table: string;
  database: string;
  relevanceScore: number;
  matchedColumns: string[];
  data: Record<string, unknown>;
  snippet?: string;
  categories?: string[];
}

export interface SearchResponse {
  results: SearchResult[];
  categories: Category[];
  suggestions: QuerySuggestion[];
  trends?: TrendInsight[];
  queryOptimization?: OptimizationSuggestion[];
  totalCount: number;
  executionTime: number;
  page: number;
  limit: number;
}

export interface Category {
  name: string;
  count: number;
  confidence: number;
}

export interface QuerySuggestion {
  text: string;
  score: number;
  type: SuggestionType;
}

export interface TrendInsight {
  period: Period;
  topQueries: string[];
  queryVolume: number;
  avgResponseTime: number;
  popularCategories: string[];
}

export interface OptimizationSuggestion {
  type: OptimizationType;
  description: string;
  impact: Impact;
  sqlSuggestion?: string;
}

export interface TableSchema {
  database: string;
  table: string;
  columns: ColumnInfo[];
  fullTextIndexes: FullTextIndex[];
  estimatedRows: number;
  lastAnalyzed: Date;
}

export interface ColumnInfo {
  name: string;
  type: string;
  isFullTextIndexed: boolean;
  isSearchable: boolean;
  dataPreview?: string[];
}

export interface FullTextIndex {
  name: string;
  columns: string[];
  type: 'FULLTEXT';
  cardinality?: number;
}

class ApiClient {
  private client: AxiosInstance;

  constructor(baseURL?: string) {
    const apiBaseURL =
      baseURL ||
      (typeof window !== 'undefined' && window.VITE_API_BASE_URL) ||
      'http://localhost:3000/api/v1';

    this.client = axios.create({
      baseURL: apiBaseURL,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      timeout: 30000,
      // Enable credentials for CORS requests (cookies, auth headers)
      withCredentials: false, // Set to true if your API uses cookies
    });

    // Request interceptor to add auth token (JWT or API key)
    this.client.interceptors.request.use(
      config => {
        // First try API key (primary authentication method)
        const apiKey = this.getStoredItem('api_key');
        if (apiKey) {
          config.headers.Authorization = `Bearer ${apiKey}`;
          return config;
        }

        // Fallback to JWT token (for initial setup only)
        const token = this.getStoredItem('auth_token');
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
        // Handle CORS errors specifically
        if (error.code === 'ERR_NETWORK' || !error.response) {
          const apiError: ApiResponse = {
            success: false,
            error: {
              code: 'NETWORK_ERROR',
              message:
                'Network error - this might be a CORS issue. Check if the API server is running and CORS is properly configured.',
              details: {
                originalError: error.message,
                suggestion:
                  'Ensure your API server allows requests from this origin and has CORS enabled.',
              },
            },
          };
          return Promise.reject(apiError);
        }

        // Handle other errors
        const apiError: ApiResponse = {
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
          meta: error.response?.data?.meta,
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
      params?: Record<string, unknown>;
    } = {}
  ): Promise<ApiResponse<T>> {
    try {
      const response = await this.client.request<ApiResponse<T>>({
        url: endpoint,
        method: options.method || 'GET',
        data: options.data,
        params: options.params,
      });

      // Server returns the full ApiResponse structure
      return response.data;
    } catch (error: unknown) {
      // Error is already formatted by the response interceptor
      return error as ApiResponse<T>;
    }
  }

  // Utility method for storage that works in both Node.js and browser
  private getStoredItem(key: string): string | null {
    if (typeof window !== 'undefined' && window.localStorage) {
      return localStorage.getItem(key);
    }
    return null;
  }

  private setStoredItem(key: string, value: string): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem(key, value);
    }
  }

  private removeStoredItem(key: string): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem(key);
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
    type: DatabaseType;
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
      status: HealthStatus;
      version: string;
      uptime: number;
      database: { status: string; connections: number };
      memory: { used: number; total: number };
    }>
  > {
    return this.request('/management/health');
  }

  // Analytics
  async getAnalytics(timeframe: Timeframe = '24h'): Promise<
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
    const token = this.getStoredItem('auth_token');
    const expiresAt = this.getStoredItem('token_expires_at');

    if (!token || !expiresAt) {
      return false;
    }

    return Date.now() < parseInt(expiresAt, 10);
  }

  setToken(token: string, expiresIn?: number | undefined): void {
    if (expiresIn === undefined) {
      expiresIn = 3600; // Default to 1 hour if not provided
    }
    this.setStoredItem('auth_token', token);
    const expiresAt = Date.now() + expiresIn * 1000;
    this.setStoredItem('token_expires_at', expiresAt.toString());
  }

  clearToken(): void {
    this.removeStoredItem('auth_token');
    this.removeStoredItem('token_expires_at');
  }

  // CORS debugging utility
  async testConnection(): Promise<{
    success: boolean;
    baseURL: string;
    error?: string;
  }> {
    try {
      const response = await this.getSystemHealth();
      return {
        success: response.success,
        baseURL: this.client.defaults.baseURL || 'unknown',
      };
    } catch (error: unknown) {
      const apiError = error as ApiResponse;
      return {
        success: false,
        baseURL: this.client.defaults.baseURL || 'unknown',
        error: apiError.error?.message || 'Connection failed',
      };
    }
  }
}

// Export singleton instance
export const apiClient = new ApiClient();
export default apiClient;
