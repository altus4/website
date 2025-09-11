import { defineStore } from 'pinia';
import { Altus4SDK } from '@altus4/sdk';
import type { ApiKey, CreateApiKeyRequest } from '@altus4/sdk';

export type CreateApiKeyResponse = {
  secretKey: string;
  warning?: string;
};

function createSdk() {
  const baseURL =
    import.meta.env.VITE_ALTUS4_API_URL ||
    import.meta.env.VITE_API_BASE_URL ||
    'http://localhost:3000/api/v1';
  return new Altus4SDK({ baseURL });
}

export const useApiKeysStore = defineStore('apiKeys', {
  state: () => ({
    apiKeys: [] as ApiKey[],
    isLoading: false as boolean,
    error: null as string | null,
  }),
  actions: {
    async loadApiKeys() {
      this.isLoading = true;
      this.error = null;
      try {
        const sdk = createSdk();
        const res = await sdk.apiKeys.listApiKeys();
        if (res?.success) {
          const data = res.data as unknown;
          let list: ApiKey[] = [];
          if (Array.isArray(data)) {
            list = data as ApiKey[];
          } else if (data && typeof data === 'object') {
            const maybe = data as { items?: unknown; apiKeys?: unknown };
            if (Array.isArray(maybe.items)) list = maybe.items as ApiKey[];
            else if (Array.isArray(maybe.apiKeys))
              list = maybe.apiKeys as ApiKey[];
          }
          this.apiKeys = list;
        } else {
          this.error = res?.error?.message || 'Failed to load API keys';
        }
      } catch (e: unknown) {
        this.error = e instanceof Error ? e.message : 'Failed to load API keys';
      } finally {
        this.isLoading = false;
      }
    },

    async createApiKey(
      payload: CreateApiKeyRequest
    ): Promise<CreateApiKeyResponse> {
      this.error = null;
      try {
        const sdk = createSdk();
        const res = await sdk.apiKeys.createApiKey(payload);
        if (res?.success) {
          // Push the created key into local list if returned
          const d = res.data as unknown;
          const created =
            d && typeof d === 'object' && (d as { apiKey?: ApiKey }).apiKey
              ? (d as { apiKey?: ApiKey }).apiKey
              : undefined;
          if (created) {
            this.apiKeys = [created, ...this.apiKeys];
          } else {
            // Fallback to refresh list
            await this.loadApiKeys();
          }
          const secretKey =
            d &&
            typeof d === 'object' &&
            (d as { secretKey?: string }).secretKey
              ? (d as { secretKey?: string }).secretKey!
              : '';
          return { secretKey };
        }
        throw new Error(res?.error?.message || 'Failed to create API key');
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : 'Failed to create API key';
        this.error = msg;
        throw new Error(msg);
      }
    },

    async setupInitialApiKey(): Promise<CreateApiKeyResponse> {
      // avoid duplicate creation if already present
      if (this.apiKeys.some(k => k?.name === 'Initial API Key')) {
        return { secretKey: '', warning: 'Initial API Key already exists' };
      }
      return this.createApiKey({
        name: 'Initial API Key',
        environment: 'test',
        rateLimitTier: 'free',
      });
    },

    async revokeApiKey(id: string) {
      this.error = null;
      try {
        const sdk = createSdk();
        const res = await sdk.apiKeys.revokeApiKey(id);
        if (res?.success) {
          // Mark as inactive locally or refresh
          this.apiKeys = this.apiKeys.map(k =>
            k.id === id ? { ...k, isActive: false } : k
          );
          return true;
        }
        throw new Error(res?.error?.message || 'Failed to revoke API key');
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : 'Failed to revoke API key';
        this.error = msg;
        throw new Error(msg);
      }
    },
  },
});
