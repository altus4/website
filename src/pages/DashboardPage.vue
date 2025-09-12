<template>
  <div class="pt-16 min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white shadow-sm border-b">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="py-6">
          <div class="flex items-center justify-between">
            <div>
              <h1 class="text-2xl font-bold text-gray-900">Dashboard</h1>
              <p class="text-gray-600">Welcome back, {{ user?.name }}!</p>
            </div>
            <div class="flex space-x-3">
              <SetupInitialApiKey
                @created="() => apiKeysListRef?.loadApiKeys?.()"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="space-y-8">
        <!-- Stats Overview -->
        <div>
          <h2 class="text-lg font-medium text-gray-900 mb-4">Overview</h2>
          <DashboardStats />
        </div>

        <!-- Main Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <!-- Projects List -->
          <div class="lg:col-span-2">
            <ApiKeysList ref="apiKeysListRef" />
          </div>

          <!-- Recent Activity -->
          <div class="lg:col-span-1 space-y-4">
            <RecentActivity />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import SetupInitialApiKey from '@/components/dashboard/SetupInitialApiKey.vue';
import DashboardStats from '@/components/dashboard/DashboardStats.vue';
import ApiKeysList from '@/components/dashboard/ApiKeysList.vue';
import RecentActivity from '@/components/dashboard/RecentActivity.vue';
import { ref } from 'vue';

// ref to the ApiKeysList component so we can call its exposed loadApiKeys()
const apiKeysListRef = ref<{
  loadApiKeys?: () => Promise<void>;
} | null>(null);

interface Props {
  user?: { name: string } | null;
}

defineProps<Props>();
</script>
