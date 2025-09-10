<template>
  <Dialog v-model:open="showInitDialog">
    <template v-if="!hasInitialKey">
      <DialogTrigger as-child>
        <Button size="sm">
          <PlusIcon class="mr-2 h-4 w-4" />
          Setup Initial API Key
        </Button>
      </DialogTrigger>
    </template>

    <DialogContent class="sm:max-w-[480px]">
      <DialogHeader>
        <DialogTitle>Setup Initial API Key</DialogTitle>
        <DialogDescription>
          Create the initial API key for your account. This key will grant
          access to Altus 4 services — keep the secret safe as it will only be
          shown once.
        </DialogDescription>
      </DialogHeader>

      <div class="space-y-4">
        <div v-if="error">
          <Alert variant="destructive">
            <AlertCircleIcon class="h-4 w-4" />
            <div class="ml-2">
              <div class="font-medium">Error</div>
              <div class="text-sm text-muted-foreground">{{ error }}</div>
            </div>
          </Alert>
        </div>

        <div v-if="createdApiKey">
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Secret Key
          </label>
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

          <Alert v-if="createdApiKey.warning" class="mt-2">
            <AlertTriangleIcon class="h-4 w-4" />
            <AlertTitle>Heads up!</AlertTitle>
            <AlertDescription>{{ createdApiKey.warning }}</AlertDescription>
          </Alert>
        </div>
      </div>

      <DialogFooter>
        <Button variant="ghost" :disabled="isCreating" @click="closeDialog">
          Close
        </Button>
        <Button
          v-if="!createdApiKey"
          :disabled="isCreating"
          @click="createInitialKey"
        >
          <Loader2Icon v-if="isCreating" class="mr-2 h-4 w-4 animate-spin" />
          {{ isCreating ? 'Creating...' : 'Create API Key' }}
        </Button>
        <Button v-else @click="closeDialog">I've Saved the Key</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useClipboard } from '@vueuse/core';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Loader2Icon,
  PlusIcon,
  CopyIcon,
  CheckIcon,
  AlertCircleIcon,
  AlertTriangleIcon,
} from 'lucide-vue-next';
import { useApiKeysStore } from '@/stores/apiKeys';
import type { CreateApiKeyResponse, ApiKey } from '@/lib/api';

const isCreating = ref(false);
const showInitDialog = ref(false);
const createdApiKey = ref<CreateApiKeyResponse | null>(null);
const error = ref<string | null>(null);
const { copy, copied } = useClipboard();

const store = useApiKeysStore();
const hasInitialKey = computed(() =>
  store.apiKeys.some((k: ApiKey) => k && k.name === 'Initial API Key')
);

const emit = defineEmits<{
  (e: 'created', payload: CreateApiKeyResponse): void;
}>();

const createInitialKey = async () => {
  try {
    isCreating.value = true;
    error.value = null;
    const data = await store.setupInitialApiKey();
    createdApiKey.value = data as CreateApiKeyResponse;
    // notify parent that a new key was created
    emit('created', data as CreateApiKeyResponse);
  } catch (err: unknown) {
    const e = err as Error | undefined;
    error.value = e?.message || 'Failed to create initial API key';
  } finally {
    isCreating.value = false;
  }
};

const copyToClipboard = async (text: string) => {
  await copy(text);
};

const closeDialog = () => {
  // Reset state when dialog closes so trigger can be used again
  showInitDialog.value = false;
  createdApiKey.value = null;
  error.value = null;
};

// No explicit check needed; store.loadApiKeys should be called elsewhere
// and hasInitialKey is computed from the store.
</script>
