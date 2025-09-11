/**
 * Altus 4 Dashboard API Client
 *
 * Complete TypeScript client for the Altus 4 API, designed specifically for dashboard applications.
 * This client supports JWT authentication for user management and provides methods for:
 *
 * - User authentication (login, register, profile management)
 * - API key management (create, list, update, revoke, regenerate)
 * - Database connection management (add, test, update, remove, schema discovery)
 * - Analytics and insights (search trends, performance metrics, dashboard data)
 * - System management and health monitoring
 *
 * Usage:
 * ```typescript
 * import { apiClient } from './api';
 *
 * // Login and automatic token management
 * const loginResult = await apiClient.handleLogin({ email, password });
 * if (loginResult.success) {
 *   console.log('Logged in user:', loginResult.user);
 * }
 *
 * // API key management
 * const apiKeys = await apiClient.listApiKeys();
 * const newKey = await apiClient.createApiKey({
 *   name: 'My API Key',
 *   environment: 'test',
 *   permissions: ['search', 'analytics']
 * });
 *
 * // Database management
 * const connections = await apiClient.listDatabaseConnections();
 * const newConnection = await apiClient.addDatabaseConnection({
 *   name: 'My Database',
 *   host: 'localhost',
 *   port: 3306,
 *   database: 'mydb',
 *   username: 'user',
 *   password: 'pass'
 * });
 *
 * // Analytics
 * const dashboard = await apiClient.getAnalyticsDashboard({ period: 'week' });
 * const trends = await apiClient.getSearchTrends({ period: 'month' });
 * ```
 *
 * The client automatically handles:
 * - JWT token storage and refresh
 * - Error formatting and CORS debugging
 * - Request/response type safety
 * - Authentication state management
 *
 * @version 1.0.0
 * @author Altus 4 Team
 */
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

export interface UpdateApiKeyRequest {
  name?: string;
  permissions?: string[];
  rateLimitTier?: RateLimitTier;
  expiresAt?: string;
}

export interface ApiKeyUsage {
  keyId: string;
  totalRequests: number;
  requestsThisMonth: number;
  lastUsed?: string;
  rateLimitTier: RateLimitTier;
  quotaUsed: number;
  quotaLimit: number;
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

// Dashboard analytics types (added to support GET /analytics/dashboard)
export interface DashboardTrends {
  period: Period;
  topQueries: string[];
  queryVolume: number;
  avgResponseTime: number;
  popularCategories: string[];
}

export interface DashboardPerformanceSummary {
  totalQueries: number;
  averageResponseTime: number;
  topQuery: string;
}

export interface DashboardPerformancePoint {
  date: string; // YYYY-MM-DD
  query_count: number;
  avg_response_time: number;
}

export interface DashboardPerformance {
  summary: DashboardPerformanceSummary;
  timeSeriesData: DashboardPerformancePoint[];
}

export interface PopularQuery {
  query_text: string;
  frequency: number;
  avg_time: number;
}

export interface Insight {
  type: string;
  confidence: number;
  description: string;
  actionable: boolean;
  data: Record<string, unknown>;
}

export interface DashboardAnalytics {
  trends?: DashboardTrends;
  performance?: DashboardPerformance;
  popularQueries?: PopularQuery[];
  insights?: Insight[];
  summary?: DashboardPerformanceSummary;
}

// Analytics interfaces
export interface SearchAnalyticsItem {
  id: string;
  query: string;
  searchMode?: SearchMode;
  resultCount: number;
  executionTime: number;
  database: string;
  timestamp: Date;
}

export interface SearchHistoryResponse {
  items: SearchAnalyticsItem[];
  total: number;
}

export interface PerformanceMetrics {
  timeSeriesData: DashboardPerformancePoint[];
  searchModeDistribution: Array<{
    search_mode: string;
    count: number;
    avg_time: number;
  }>;
  summary: {
    totalQueries: number;
    averageResponseTime: number;
    averageResults: number;
  };
}

// Management interfaces
export interface MigrationStatus {
  userId: string;
  hasMigrated: boolean;
  recommendedAction: string;
  documentation: string;
}

// Admin analytics interfaces
export interface SystemOverview {
  summary: {
    active_users: number;
    total_queries: number;
    avg_response_time: number;
    avg_results: number;
  };
  userGrowth: Array<{
    date: string;
    new_users: number;
  }>;
  queryVolume: Array<{
    date: string;
    query_count: number;
    active_users: number;
  }>;
  period: Period;
}

export interface UserActivity {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  query_count: number;
  avg_response_time: number;
  last_query?: string;
  last_active?: string;
}

export interface SystemPerformanceMetrics {
  timeSeriesData: Array<{
    date: string;
    query_count: number;
    avg_response_time: number;
    max_response_time: number;
    active_users: number;
  }>;
  slowestQueries: Array<{
    query_text: string;
    execution_time_ms: number;
    result_count: number;
    created_at: string;
    user_email: string;
  }>;
  summary: {
    totalQueries: number;
    averageResponseTime: number;
    peakResponseTime: number;
  };
}

// Profile update interfaces
export interface UpdateProfileRequest {
  name?: string;
  email?: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
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

    // Request interceptor to add auth token (JWT for dashboard)
    this.client.interceptors.request.use(
      config => {
        // Use JWT token (primary authentication method for dashboard)
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

  async logout(): Promise<ApiResponse<{ success: boolean }>> {
    const response = await this.request<{ success: boolean }>('/auth/logout', {
      method: 'POST',
    });
    // Clear token on successful logout
    if (response.success) {
      this.clearToken();
    }
    return response;
  }

  async updateProfile(
    profileData: UpdateProfileRequest
  ): Promise<ApiResponse<User>> {
    return this.request<User>('/auth/profile', {
      method: 'PUT',
      data: profileData,
    });
  }

  async changePassword(
    passwordData: ChangePasswordRequest
  ): Promise<ApiResponse<{ success: boolean }>> {
    return this.request<{ success: boolean }>('/auth/change-password', {
      method: 'POST',
      data: passwordData,
    });
  }

  async deactivateAccount(): Promise<ApiResponse<{ success: boolean }>> {
    const response = await this.request<{ success: boolean }>('/auth/account', {
      method: 'DELETE',
    });
    // Clear token on successful account deactivation
    if (response.success) {
      this.clearToken();
    }
    return response;
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
  ): Promise<ApiResponse<{ keyId: string; message: string }>> {
    return this.request<{ keyId: string; message: string }>(`/keys/${keyId}`, {
      method: 'DELETE',
    });
  }

  async updateApiKey(
    keyId: string,
    updateData: UpdateApiKeyRequest
  ): Promise<ApiResponse<{ apiKey: ApiKey }>> {
    return this.request<{ apiKey: ApiKey }>(`/keys/${keyId}`, {
      method: 'PUT',
      data: updateData,
    });
  }

  async getApiKeyUsage(
    keyId: string,
    days?: number
  ): Promise<ApiResponse<{ usage: ApiKeyUsage }>> {
    const params: Record<string, unknown> = {};
    if (days !== undefined) {
      params.days = days;
    }
    return this.request<{ usage: ApiKeyUsage }>(`/keys/${keyId}/usage`, {
      params,
    });
  }

  async regenerateApiKey(
    keyId: string
  ): Promise<ApiResponse<CreateApiKeyResponse & { oldKeyId: string }>> {
    return this.request<CreateApiKeyResponse & { oldKeyId: string }>(
      `/keys/${keyId}/regenerate`,
      {
        method: 'POST',
      }
    );
  }

  // Database Management
  async listDatabaseConnections(): Promise<ApiResponse<DatabaseConnection[]>> {
    return this.request<DatabaseConnection[]>('/databases');
  }

  async addDatabaseConnection(connectionData: {
    name: string;
    host: string;
    port: number;
    database: string;
    username: string;
    password: string;
    ssl?: boolean;
  }): Promise<ApiResponse<DatabaseConnection>> {
    return this.request<DatabaseConnection>('/databases', {
      method: 'POST',
      data: connectionData,
    });
  }

  async testDatabaseConnection(
    connectionId: string
  ): Promise<ApiResponse<{ connected: boolean; message?: string }>> {
    return this.request<{ connected: boolean; message?: string }>(
      `/databases/${connectionId}/test`,
      {
        method: 'POST',
      }
    );
  }

  async removeDatabaseConnection(
    connectionId: string
  ): Promise<ApiResponse<{ success: boolean }>> {
    return this.request<{ success: boolean }>(`/databases/${connectionId}`, {
      method: 'DELETE',
    });
  }

  async getDatabaseConnectionStatuses(): Promise<
    ApiResponse<Record<string, boolean>>
  > {
    return this.request<Record<string, boolean>>('/databases/status');
  }

  async getDatabaseConnection(
    connectionId: string
  ): Promise<ApiResponse<DatabaseConnection>> {
    return this.request<DatabaseConnection>(`/databases/${connectionId}`);
  }

  async updateDatabaseConnection(
    connectionId: string,
    updateData: {
      name?: string;
      host?: string;
      port?: number;
      database?: string;
      username?: string;
      password?: string;
      ssl?: boolean;
    }
  ): Promise<ApiResponse<DatabaseConnection>> {
    return this.request<DatabaseConnection>(`/databases/${connectionId}`, {
      method: 'PUT',
      data: updateData,
    });
  }

  async getDatabaseSchema(
    connectionId: string
  ): Promise<ApiResponse<TableSchema[]>> {
    return this.request<TableSchema[]>(`/databases/${connectionId}/schema`);
  }

  // Management
  async setupInitialApiKey(): Promise<ApiResponse<CreateApiKeyResponse>> {
    return this.request<CreateApiKeyResponse>('/management/setup', {
      method: 'POST',
    });
  }

  async getSystemHealth(): Promise<
    ApiResponse<{
      status: string;
      timestamp: string;
      version: string;
      uptime: number;
      authenticationMethods: string[];
    }>
  > {
    return this.request('/management/health');
  }

  async getMigrationStatus(): Promise<ApiResponse<MigrationStatus>> {
    return this.request<MigrationStatus>('/management/migration-status');
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

  // Get a comprehensive dashboard view of search analytics
  async getAnalyticsDashboard(params?: {
    startDate?: string;
    endDate?: string;
    period?: Period;
  }): Promise<ApiResponse<DashboardAnalytics>> {
    const query: Record<string, unknown> = {};
    if (params?.startDate) {
      query.startDate = params.startDate;
    }
    if (params?.endDate) {
      query.endDate = params.endDate;
    }
    if (params?.period) {
      query.period = params.period;
    }

    return this.request<DashboardAnalytics>('/analytics/dashboard', {
      method: 'GET',
      params: query,
    });
  }

  async getSearchTrends(params?: {
    startDate?: string;
    endDate?: string;
    period?: Period;
  }): Promise<ApiResponse<TrendInsight[]>> {
    const query: Record<string, unknown> = {};
    if (params?.startDate) {
      query.startDate = params.startDate;
    }
    if (params?.endDate) {
      query.endDate = params.endDate;
    }
    if (params?.period) {
      query.period = params.period;
    }

    return this.request<TrendInsight[]>('/analytics/search-trends', {
      params: query,
    });
  }

  async getPerformanceMetrics(params?: {
    startDate?: string;
    endDate?: string;
    period?: Period;
  }): Promise<ApiResponse<PerformanceMetrics>> {
    const query: Record<string, unknown> = {};
    if (params?.startDate) {
      query.startDate = params.startDate;
    }
    if (params?.endDate) {
      query.endDate = params.endDate;
    }
    if (params?.period) {
      query.period = params.period;
    }

    return this.request<PerformanceMetrics>('/analytics/performance', {
      params: query,
    });
  }

  async getPopularQueries(params?: {
    startDate?: string;
    endDate?: string;
    period?: Period;
  }): Promise<ApiResponse<PopularQuery[]>> {
    const query: Record<string, unknown> = {};
    if (params?.startDate) {
      query.startDate = params.startDate;
    }
    if (params?.endDate) {
      query.endDate = params.endDate;
    }
    if (params?.period) {
      query.period = params.period;
    }

    return this.request<PopularQuery[]>('/analytics/popular-queries', {
      params: query,
    });
  }

  async getSearchHistory(params?: {
    startDate?: string;
    endDate?: string;
    period?: Period;
    limit?: number;
    offset?: number;
  }): Promise<ApiResponse<SearchHistoryResponse>> {
    const query: Record<string, unknown> = {};
    if (params?.startDate) {
      query.startDate = params.startDate;
    }
    if (params?.endDate) {
      query.endDate = params.endDate;
    }
    if (params?.period) {
      query.period = params.period;
    }
    if (params?.limit) {
      query.limit = params.limit;
    }
    if (params?.offset) {
      query.offset = params.offset;
    }

    return this.request<SearchHistoryResponse>('/analytics/search-history', {
      params: query,
    });
  }

  async getInsights(params?: {
    startDate?: string;
    endDate?: string;
    period?: Period;
  }): Promise<ApiResponse<Insight[]>> {
    const query: Record<string, unknown> = {};
    if (params?.startDate) {
      query.startDate = params.startDate;
    }
    if (params?.endDate) {
      query.endDate = params.endDate;
    }
    if (params?.period) {
      query.period = params.period;
    }

    return this.request<Insight[]>('/analytics/insights', {
      params: query,
    });
  }

  // Admin Analytics Methods
  async getSystemOverview(params?: {
    startDate?: string;
    endDate?: string;
    period?: Period;
  }): Promise<ApiResponse<SystemOverview>> {
    const query: Record<string, unknown> = {};
    if (params?.startDate) {
      query.startDate = params.startDate;
    }
    if (params?.endDate) {
      query.endDate = params.endDate;
    }
    if (params?.period) {
      query.period = params.period;
    }

    return this.request<SystemOverview>('/analytics/admin/system-overview', {
      params: query,
    });
  }

  async getUserActivity(params?: {
    startDate?: string;
    endDate?: string;
    period?: Period;
    limit?: number;
    offset?: number;
  }): Promise<ApiResponse<UserActivity[]>> {
    const query: Record<string, unknown> = {};
    if (params?.startDate) {
      query.startDate = params.startDate;
    }
    if (params?.endDate) {
      query.endDate = params.endDate;
    }
    if (params?.period) {
      query.period = params.period;
    }
    if (params?.limit) {
      query.limit = params.limit;
    }
    if (params?.offset) {
      query.offset = params.offset;
    }

    return this.request<UserActivity[]>('/analytics/admin/user-activity', {
      params: query,
    });
  }

  async getSystemPerformanceMetrics(params?: {
    startDate?: string;
    endDate?: string;
    period?: Period;
  }): Promise<ApiResponse<SystemPerformanceMetrics>> {
    const query: Record<string, unknown> = {};
    if (params?.startDate) {
      query.startDate = params.startDate;
    }
    if (params?.endDate) {
      query.endDate = params.endDate;
    }
    if (params?.period) {
      query.period = params.period;
    }

    return this.request<SystemPerformanceMetrics>(
      '/analytics/admin/performance-metrics',
      {
        params: query,
      }
    );
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

  // Enhanced authentication helpers
  async handleLogin(credentials: LoginRequest): Promise<{
    success: boolean;
    user?: User;
    error?: string;
  }> {
    try {
      const response = await this.login(credentials);
      if (response.success && response.data) {
        const authData = response.data as AuthResponse;
        this.setToken(authData.token, authData.expires_in);
        return {
          success: true,
          user: authData.user,
        };
      } else {
        return {
          success: false,
          error: response.error?.message || 'Login failed',
        };
      }
    } catch (error) {
      const apiError = error as ApiResponse;
      return {
        success: false,
        error: apiError.error?.message || 'Login failed',
      };
    }
  }

  async handleRegister(userData: RegisterRequest): Promise<{
    success: boolean;
    user?: User;
    error?: string;
  }> {
    try {
      const response = await this.register(userData);
      if (response.success && response.data) {
        const authData = response.data as AuthResponse;
        this.setToken(authData.token, authData.expires_in);
        return {
          success: true,
          user: authData.user,
        };
      } else {
        return {
          success: false,
          error: response.error?.message || 'Registration failed',
        };
      }
    } catch (error) {
      const apiError = error as ApiResponse;
      return {
        success: false,
        error: apiError.error?.message || 'Registration failed',
      };
    }
  }

  async handleLogout(): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await this.logout();
      return {
        success: response.success,
        error: response.success ? undefined : response.error?.message,
      };
    } catch {
      // Even if the API call fails, clear the local token
      this.clearToken();
      return {
        success: true, // Consider logout successful even if API call fails
      };
    }
  }

  // Token management helpers
  async refreshTokenIfNeeded(): Promise<boolean> {
    const token = this.getStoredItem('auth_token');
    const expiresAt = this.getStoredItem('token_expires_at');

    if (!token || !expiresAt) {
      return false;
    }

    const expirationTime = parseInt(expiresAt, 10);
    const currentTime = Date.now();
    const timeUntilExpiry = expirationTime - currentTime;

    // Refresh if token expires in less than 5 minutes
    if (timeUntilExpiry < 5 * 60 * 1000) {
      try {
        const response = await this.refreshToken();
        if (response.success && response.data) {
          const tokenData = response.data as {
            token: string;
            expires_in: number;
          };
          this.setToken(tokenData.token, tokenData.expires_in);
          return true;
        }
      } catch (error) {
        console.error('Token refresh failed:', error);
        this.clearToken();
        return false;
      }
    }

    return true;
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

  // Dashboard utility methods

  /**
   * Check if the current user has admin privileges
   */
  async isAdmin(): Promise<boolean> {
    try {
      const response = await this.getProfile();
      return response.success && response.data?.role === 'admin';
    } catch {
      return false;
    }
  }

  /**
   * Get the current user's profile with error handling
   */
  async getCurrentUser(): Promise<User | null> {
    try {
      const response = await this.getProfile();
      return response.success && response.data ? (response.data as User) : null;
    } catch {
      return null;
    }
  }

  /**
   * Helper method to check if API key has specific permission
   */
  static hasPermission(apiKey: ApiKey, permission: string): boolean {
    return (
      apiKey.permissions.includes(permission) ||
      apiKey.permissions.includes('admin')
    );
  }

  /**
   * Helper method to format API key for display (shows only prefix)
   */
  static formatApiKeyForDisplay(apiKey: ApiKey): string {
    return `${apiKey.keyPrefix}...`;
  }

  /**
   * Helper method to get rate limit info for display
   */
  static getRateLimitInfo(tier: RateLimitTier): {
    limit: number;
    name: string;
    description: string;
  } {
    switch (tier) {
      case 'free':
        return {
          limit: 1000,
          name: 'Free',
          description: '1,000 requests per hour',
        };
      case 'pro':
        return {
          limit: 10000,
          name: 'Pro',
          description: '10,000 requests per hour',
        };
      case 'enterprise':
        return {
          limit: 100000,
          name: 'Enterprise',
          description: '100,000 requests per hour',
        };
      default:
        return {
          limit: 1000,
          name: 'Unknown',
          description: 'Unknown rate limit',
        };
    }
  }

  /**
   * Helper method to format usage percentage
   */
  static formatUsagePercentage(usage: ApiKeyUsage): number {
    if (usage.quotaLimit === 0) {
      return 0;
    }
    return Math.round((usage.quotaUsed / usage.quotaLimit) * 100);
  }

  /**
   * Helper method to determine if usage is approaching limit
   */
  static isUsageHigh(usage: ApiKeyUsage, threshold: number = 80): boolean {
    const percentage = this.formatUsagePercentage(usage);
    return percentage >= threshold;
  }

  /**
   * Helper method to format date for analytics queries
   */
  static formatDateForQuery(date: Date): string {
    return date.toISOString().split('T')[0]; // YYYY-MM-DD format
  }

  /**
   * Helper method to get date range for periods
   */
  static getDateRangeForPeriod(period: Period): {
    startDate: string;
    endDate: string;
  } {
    const end = new Date();
    const start = new Date();

    switch (period) {
      case 'day':
        start.setDate(start.getDate() - 1);
        break;
      case 'week':
        start.setDate(start.getDate() - 7);
        break;
      case 'month':
        start.setMonth(start.getMonth() - 1);
        break;
      case '3months':
        start.setMonth(start.getMonth() - 3);
        break;
      case '6months':
        start.setMonth(start.getMonth() - 6);
        break;
      case 'year':
        start.setFullYear(start.getFullYear() - 1);
        break;
    }

    return {
      startDate: this.formatDateForQuery(start),
      endDate: this.formatDateForQuery(end),
    };
  }

  /**
   * Helper method to validate database connection parameters
   */
  static validateDatabaseConnection(connection: {
    name: string;
    host: string;
    port: number;
    database: string;
    username: string;
    password: string;
  }): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!connection.name || connection.name.trim().length < 1) {
      errors.push('Connection name is required');
    }
    if (!connection.host || connection.host.trim().length < 1) {
      errors.push('Host is required');
    }
    if (!connection.port || connection.port < 1 || connection.port > 65535) {
      errors.push('Port must be between 1 and 65535');
    }
    if (!connection.database || connection.database.trim().length < 1) {
      errors.push('Database name is required');
    }
    if (!connection.username || connection.username.trim().length < 1) {
      errors.push('Username is required');
    }
    // Password can be empty for local development

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Helper method to validate API key creation parameters
   */
  static validateApiKeyCreation(keyData: CreateApiKeyRequest): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    if (!keyData.name || keyData.name.trim().length < 3) {
      errors.push('API key name must be at least 3 characters long');
    }
    if (!['test', 'live'].includes(keyData.environment)) {
      errors.push('Environment must be either "test" or "live"');
    }
    if (keyData.permissions && keyData.permissions.length > 0) {
      const validPermissions = ['search', 'analytics', 'admin'];
      const invalidPerms = keyData.permissions.filter(
        p => !validPermissions.includes(p)
      );
      if (invalidPerms.length > 0) {
        errors.push(`Invalid permissions: ${invalidPerms.join(', ')}`);
      }
    }
    if (
      keyData.rateLimitTier &&
      !['free', 'pro', 'enterprise'].includes(keyData.rateLimitTier)
    ) {
      errors.push('Rate limit tier must be "free", "pro", or "enterprise"');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}

// Export singleton instance
export const apiClient = new ApiClient();
export default apiClient;
