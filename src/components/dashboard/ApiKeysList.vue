<template>
  <Card>
    <CardHeader class="px-4 py-3 border-b">
      <div class="flex items-center justify-between">
        <CardTitle>Your API Keys</CardTitle>

        <Dialog v-model:open="showCreateDialog">
          <DialogTrigger as-child>
            <Button size="sm">
              <PlusIcon class="mr-2 h-4 w-4" />
              New API Key
            </Button>
          </DialogTrigger>

          <DialogContent class="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create New API Key</DialogTitle>
              <DialogDescription>
                Generate a new API key to access Altus 4 services. Keep your
                secret key safe as it won't be shown again.
              </DialogDescription>
            </DialogHeader>

            <form class="space-y-4" @submit.prevent="createApiKey">
              <div>
                <Label for="name" class="block text-sm font-medium mb-1">
                  Name
                </Label>
                <Input
                  id="name"
                  v-model="newApiKey.name"
                  placeholder="e.g., Production API Key"
                  required
                />
              </div>

              <div>
                <Label for="environment" class="block text-sm font-medium mb-1">
                  Environment
                </Label>
                <UiSelect id="environment" v-model="newApiKey.environment">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="test">Test</SelectItem>
                    <SelectItem value="live">Live</SelectItem>
                  </SelectContent>
                </UiSelect>
              </div>

              <div>
                <Label
                  for="rateLimitTier"
                  class="block text-sm font-medium mb-1"
                >
                  Rate Limit Tier
                </Label>
                <UiSelect id="rateLimitTier" v-model="newApiKey.rateLimitTier">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="free">Free (100 req/min)</SelectItem>
                    <SelectItem value="pro">Pro (1000 req/min)</SelectItem>
                    <SelectItem value="enterprise">
                      Enterprise (10000 req/min)
                    </SelectItem>
                  </SelectContent>
                </UiSelect>
              </div>

              <div>
                <Label for="expiresAt" class="block text-sm font-medium mb-1">
                  Expiry Date (Optional)
                </Label>

                <Popover>
                  <PopoverTrigger as-child>
                    <Button
                      id="expiresAt"
                      variant="outline"
                      :class="[
                        'w-full justify-start text-left font-normal',
                        !newApiKey.expiresAt && 'text-muted-foreground',
                      ]"
                    >
                      <CalendarIcon class="mr-2 h-4 w-4" />
                      {{
                        newApiKey.expiresAt
                          ? new Date(newApiKey.expiresAt).toLocaleDateString(
                              'en-US',
                              {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                              }
                            )
                          : 'Pick a date'
                      }}
                    </Button>
                  </PopoverTrigger>

                  <PopoverContent class="w-auto p-0">
                    <Calendar
                      initial-focus
                      @update:model-value="
                        (d: any) => {
                          newApiKey.expiresAt = d
                            ? new Date(d.toString()).toISOString().split('T')[0]
                            : '';
                        }
                      "
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <DialogFooter>
                <Button type="button" variant="ghost" @click="resetForm">
                  Cancel
                </Button>
                <Button type="submit" :disabled="isCreating">
                  <Loader2Icon
                    v-if="isCreating"
                    class="mr-2 h-4 w-4 animate-spin"
                  />
                  {{ isCreating ? 'Creating...' : 'Create API Key' }}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </CardHeader>

    <CardContent class="p-0">
      <div v-if="isLoading" class="p-4">
        <div
          class="flex items-center justify-center gap-2 text-muted-foreground"
        >
          <Loader2Icon class="h-5 w-5 animate-spin" />
          <span>Loading API keys...</span>
        </div>
      </div>

      <div v-else-if="error" class="p-4">
        <Alert variant="destructive">
          <AlertCircleIcon class="h-4 w-4" />
          <div class="ml-2">
            <div class="font-medium">Error</div>
            <div class="text-sm text-muted-foreground">{{ error }}</div>
          </div>
        </Alert>
      </div>

      <div v-else-if="apiKeys.length === 0" class="p-6">
        <div class="text-center py-8">
          <KeyIcon class="mx-auto h-12 w-12 text-gray-400" />
          <h3 class="mt-2 text-sm font-medium text-gray-900">No API keys</h3>
          <p class="mt-1 text-sm text-gray-500">
            Get started by creating your first API key.
          </p>
        </div>
      </div>

      <div v-else class="divide-y">
        <div
          v-for="apiKey in apiKeys"
          :key="apiKey.id"
          class="px-6 py-4 hover:bg-gray-50"
        >
          <div class="flex items-center justify-between gap-4">
            <div class="flex-1 flex items-center gap-3">
              <KeyIcon class="h-5 w-5 text-muted-foreground" />
              <div class="min-w-0">
                <h3 class="text-sm font-medium truncate">{{ apiKey.name }}</h3>
                <p class="text-xs text-muted-foreground truncate">
                  {{ apiKey.keyPrefix }}••••••••
                </p>
                <div
                  class="flex items-center gap-2 mt-1 text-xs text-muted-foreground"
                >
                  <span
                    :class="
                      apiKey.environment === 'live'
                        ? 'text-destructive'
                        : 'text-muted-foreground'
                    "
                    class="capitalize font-medium"
                    >{{ apiKey.environment }}</span
                  >
                  <span class="opacity-40">•</span>
                  <span>{{ getRateLimitDisplay(apiKey.rateLimitTier) }}</span>
                  <span class="opacity-40">•</span>
                  <span>{{ apiKey.usageCount }} uses</span>
                </div>
              </div>
            </div>

            <div class="flex items-center gap-4">
              <div class="text-right">
                <div class="flex items-center justify-end gap-2">
                  <span
                    :class="apiKey.isActive ? 'text-green-500' : 'text-red-800'"
                    class="inline-flex items-center text-xs font-medium"
                    >{{ apiKey.isActive ? 'Active' : 'Inactive' }}</span
                  >
                  <span>&middot;</span>
                  <span
                    v-if="apiKey.expiresAt"
                    class="inline-flex items-center text-xs font-medium"
                    >Expires {{ formatDate(apiKey.expiresAt) }}</span
                  >
                  <span
                    v-else
                    class="inline-flex items-center text-xs font-medium text-muted-foreground"
                    >Does not expire</span
                  >
                </div>
                <p class="text-xs text-muted-foreground mt-1">
                  {{
                    apiKey.lastUsed
                      ? `Last used ${formatDate(apiKey.lastUsed)}`
                      : 'Never used'
                  }}
                </p>
              </div>

              <div class="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  title="View details"
                  @click="showApiKeyDetails(apiKey)"
                >
                  <EyeIcon class="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  :disabled="!apiKey.isActive"
                  title="Revoke key"
                  class="text-destructive"
                  @click="revokeApiKey(apiKey)"
                >
                  <TrashIcon class="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </CardContent>
  </Card>

  <!-- Secret Key Display Dialog -->
  <Dialog v-model:open="showSecretDialog">
    <DialogContent class="sm:max-w-[600px]">
      <DialogHeader>
        <DialogTitle>API Key Created Successfully</DialogTitle>
        <DialogDescription>
          Your API key has been created. Please copy the secret key below as it
          won't be shown again.
        </DialogDescription>
      </DialogHeader>

      <div class="space-y-4">
        <div>
          <Label class="block text-sm font-medium text-gray-700 mb-1"
            >Secret Key</Label
          >
          <div class="relative">
            <div class="p-3 pr-16 border border-gray-300 rounded-lg bg-gray-50">
              <code class="text-sm text-red-600 font-mono break-all">{{
                createdApiKey?.secretKey
              }}</code>
            </div>
            <Button
              variant="ghost"
              size="sm"
              class="absolute top-1 right-1 border border-transparent hover:border-gray-300"
              @click="copyToClipboard(createdApiKey?.secretKey || '')"
            >
              <CopyIcon v-if="!copied" class="h-4 w-4" />
              <CheckIcon v-else class="h-4 w-4 text-green-600" />
            </Button>
          </div>
        </div>

        <Alert v-if="createdApiKey?.warning">
          <AlertTriangleIcon class="h-4 w-4" />
          <AlertTitle>Heads up!</AlertTitle>
          <AlertDescription>{{ createdApiKey.warning }}</AlertDescription>
        </Alert>
      </div>

      <DialogFooter>
        <Button @click="closeSecretDialog">I've Saved the Secret Key</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>

  <!-- API Key Details Dialog -->
  <Dialog v-model:open="showDetailsDialog">
    <DialogContent class="sm:max-w-[500px]">
      <DialogHeader>
        <DialogTitle>API Key Details</DialogTitle>
      </DialogHeader>

      <div class="space-y-4">
        <div class="grid grid-cols-2 gap-4">
          <div>
            <Label class="block text-sm font-medium text-gray-700 mb-1"
              >Name</Label
            >
            <p class="text-sm text-gray-900">{{ selectedApiKey?.name }}</p>
          </div>

          <div>
            <Label class="block text-sm font-medium text-gray-700 mb-1"
              >Environment</Label
            >
            <p class="text-sm text-gray-900 capitalize">
              {{ selectedApiKey?.environment }}
            </p>
          </div>

          <div>
            <Label class="block text-sm font-medium text-gray-700 mb-1"
              >Rate Limit</Label
            >
            <p class="text-sm text-gray-900">
              {{ getRateLimitDisplay(selectedApiKey?.rateLimitTier || '') }}
            </p>
          </div>

          <div>
            <Label class="block text-sm font-medium text-gray-700 mb-1"
              >Status</Label
            >
            <span
              class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
              :class="
                selectedApiKey?.isActive
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              "
              >{{ selectedApiKey?.isActive ? 'Active' : 'Inactive' }}</span
            >
          </div>

          <div>
            <Label class="block text-sm font-medium text-gray-700 mb-1"
              >Usage Count</Label
            >
            <p class="text-sm text-gray-900">
              {{ selectedApiKey?.usageCount }} requests
            </p>
          </div>

          <div>
            <Label class="block text-sm font-medium text-gray-700 mb-1"
              >Created</Label
            >
            <p class="text-sm text-gray-900">
              {{ formatDate(selectedApiKey?.createdAt) }}
            </p>
          </div>

          <div v-if="selectedApiKey?.expiresAt">
            <Label class="block text-sm font-medium text-gray-700 mb-1"
              >Expires</Label
            >
            <p class="text-sm text-gray-900">
              {{ formatDate(selectedApiKey?.expiresAt) }}
            </p>
          </div>

          <div v-if="selectedApiKey?.lastUsed">
            <Label class="block text-sm font-medium text-gray-700 mb-1"
              >Last Used</Label
            >
            <p class="text-sm text-gray-900">
              {{ formatDate(selectedApiKey?.lastUsed) }}
            </p>
          </div>
        </div>
      </div>

      <DialogFooter>
        <Button @click="closeDetailsDialog">Close</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useClipboard } from '@vueuse/core';
import { useApiKeysStore } from '@/stores/apiKeys';
import type {
  ApiKey,
  CreateApiKeyRequest,
  CreateApiKeyResponse,
  RateLimitTier,
  Environment,
} from '@altus4/sdk';
import {
  AlertCircleIcon,
  AlertTriangleIcon,
  CheckIcon,
  CopyIcon,
  EyeIcon,
  KeyIcon,
  Loader2Icon,
  PlusIcon,
  TrashIcon,
  Calendar as CalendarIcon,
} from 'lucide-vue-next';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select as UiSelect,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@/components/ui/select';
import { formatDate } from '@/lib/utils';

// Store
const store = useApiKeysStore();
const { apiKeys, isLoading, error } = storeToRefs(store);

// Local UI state
const isCreating = ref(false);
const showSecretDialog = ref(false);
const showDetailsDialog = ref(false);
const showCreateDialog = ref(false);

// Form data
const newApiKey = reactive({
  name: '',
  environment: 'test',
  rateLimitTier: 'free',
  expiresAt: '' as string,
});

const createdApiKey = ref<{ secretKey: string; warning?: string } | null>(null);
const selectedApiKey = ref<ApiKey | null>(null);

// Clipboard
const { copy, copied } = useClipboard();

// Helpers
const copyToClipboard = async (text: string) => {
  await copy(text);
};

const getRateLimitDisplay = (tier: string) => {
  switch (tier) {
    case 'free':
      return 'Free (100 req/min)';
    case 'pro':
      return 'Pro (1000 req/min)';
    case 'enterprise':
      return 'Enterprise (10000 req/min)';
    default:
      return tier;
  }
};

// API
// API via store
const loadApiKeys = async () => {
  await store.loadApiKeys();
};

const createApiKey = async () => {
  try {
    isCreating.value = true;
    // clear any previous store error
    store.error = null;

    const payload: CreateApiKeyRequest = {
      name: newApiKey.name,
      environment: newApiKey.environment as Environment,
      rateLimitTier: newApiKey.rateLimitTier as RateLimitTier,
    };

    if (newApiKey.expiresAt) {
      payload.expiresAt = newApiKey.expiresAt;
    }

    const start = Date.now();
    const data = await store.createApiKey(payload);
    const duration = Date.now() - start;
    console.debug('store.createApiKey response (ms):', duration, data);

    try {
      createdApiKey.value = data as CreateApiKeyResponse;
    } catch (e) {
      console.warn('Failed to assign createdApiKey.value', e, createdApiKey);
    }

    showSecretDialog.value = true;
    resetForm();
  } catch {
    store.error = 'Failed to create API key';
  } finally {
    isCreating.value = false;
  }
};

const revokeApiKey = async (apiKey: ApiKey) => {
  try {
    await store.revokeApiKey(apiKey.id);
  } catch {
    // store.error will be set; keep UI stable
  }
};

const showApiKeyDetails = (apiKey: ApiKey) => {
  selectedApiKey.value = apiKey;
  showDetailsDialog.value = true;
};

const resetForm = () => {
  newApiKey.name = '';
  newApiKey.environment = 'test';
  newApiKey.rateLimitTier = 'free';
  newApiKey.expiresAt = '';

  showCreateDialog.value = false;
};

const closeSecretDialog = () => {
  showSecretDialog.value = false;
  createdApiKey.value = null;
};

const closeDetailsDialog = () => {
  showDetailsDialog.value = false;
  selectedApiKey.value = null;
};

// Lifecycle
onMounted(() => {
  loadApiKeys();
});

// Allow parent components to call loadApiKeys (e.g., after creating initial key)
defineExpose({ loadApiKeys });
</script>
