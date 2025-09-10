import { defineStore } from 'pinia';
import { ref } from 'vue';
import {
  apiClient,
  type ApiKey,
  type CreateApiKeyRequest,
  type CreateApiKeyResponse,
  type ApiResponse,
} from '@/lib/api';

export const useApiKeysStore = defineStore('apiKeys', () => {
  const apiKeys = ref<ApiKey[]>([]);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  const loadApiKeys = async () => {
    try {
      isLoading.value = true;
      error.value = null;
      const resp = await apiClient.listApiKeys();
      console.debug('loadApiKeys raw response', resp);

      // If the client returned an ApiResponse with success=false, surface the error
      if (
        resp &&
        typeof resp === 'object' &&
        'success' in resp &&
        resp.success === false
      ) {
        error.value = resp.error?.message || 'Failed to load API keys';
        console.debug('apiClient.listApiKeys returned error response', resp);
        apiKeys.value = [];
        return;
      }

      if (Array.isArray(resp.data)) {
        apiKeys.value = resp.data as ApiKey[];
      } else if (
        resp.data &&
        typeof resp.data === 'object' &&
        'apiKeys' in resp.data
      ) {
        const dataObj = resp.data as { apiKeys?: ApiKey[] };
        apiKeys.value = dataObj.apiKeys ?? [];
      } else {
        apiKeys.value = [];
      }
    } catch (err) {
      error.value = 'Failed to load API keys';

      console.warn('loadApiKeys error', err);
    } finally {
      isLoading.value = false;
    }
  };

  const createApiKey = async (payload: CreateApiKeyRequest) => {
    try {
      isLoading.value = true;
      error.value = null;
      const resp = await apiClient.createApiKey(payload);
      console.debug('createApiKey response', resp);
      const data = resp.data as unknown as CreateApiKeyResponse;

      // Optimistic update: if server returned the created apiKey, add it locally
      try {
        const maybe = data as unknown as CreateApiKeyResponse | null;
        if (maybe && maybe.apiKey) {
          const created = maybe.apiKey as ApiKey;
          apiKeys.value = [
            created,
            ...apiKeys.value.filter(k => k.id !== created.id),
          ];
        }
      } catch (e) {
        console.debug('optimistic update failed', e);
      }

      // refresh list
      await loadApiKeys();
      return data;
    } catch (err) {
      error.value = 'Failed to create API key';

      console.warn('createApiKey error', err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const revokeApiKey = async (id: string) => {
    try {
      error.value = null;
      const resp = await apiClient.revokeApiKey(id);
      console.debug('revokeApiKey response', resp);
      await loadApiKeys();
    } catch (err) {
      error.value = 'Failed to revoke API key';

      console.warn('revokeApiKey error', err);
      throw err;
    }
  };

  const setupInitialApiKey = async () => {
    try {
      error.value = null;
      const resp = await apiClient.setupInitialApiKey();
      console.debug('setupInitialApiKey response', resp);
      const apiResp = resp as ApiResponse<CreateApiKeyResponse>;
      let data: CreateApiKeyResponse | null = null;

      if (apiResp && apiResp.success && apiResp.data) {
        data = apiResp.data as CreateApiKeyResponse;
      } else if (
        (resp as unknown) &&
        (resp as unknown as CreateApiKeyResponse).secretKey
      ) {
        data = resp as unknown as CreateApiKeyResponse;
      }

      if (data) {
        // refresh list
        await loadApiKeys();
        return data;
      }

      throw new Error('Unexpected response from setupInitialApiKey');
    } catch (err) {
      error.value = 'Failed to create initial API key';

      console.warn('setupInitialApiKey error', err);
      throw err;
    }
  };

  return {
    apiKeys,
    isLoading,
    error,
    loadApiKeys,
    createApiKey,
    revokeApiKey,
    setupInitialApiKey,
    // dev helper: call from console via the store instance to inspect current state
    debugState: () => {
      console.debug('apiKeys store state', {
        apiKeys: apiKeys.value,
        isLoading: isLoading.value,
        error: error.value,
      });
    },
  };
});
