<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
    <div class="bg-white rounded-xl shadow p-6 border">
      <div class="flex items-center">
        <div class="flex-shrink-0">
          <div
            class="w-8 h-8 bg-primary rounded-xl flex items-center justify-center"
          >
            <ActivityIcon class="w-5 h-5 text-primary-foreground" />
          </div>
        </div>
        <div class="ml-4">
          <p class="text-sm font-medium text-gray-600">Total Queries</p>
          <p class="text-2xl font-semibold text-gray-900">{{ totalQueries }}</p>
        </div>
      </div>
    </div>

    <div class="bg-white rounded-xl shadow p-6 border">
      <div class="flex items-center">
        <div class="flex-shrink-0">
          <div
            class="w-8 h-8 bg-primary rounded-xl flex items-center justify-center"
          >
            <CheckCircleIcon class="w-5 h-5 text-primary-foreground" />
          </div>
        </div>
        <div class="ml-4">
          <p class="text-sm font-medium text-gray-600">Avg. Resp. Time (ms)</p>
          <p class="text-2xl font-semibold text-gray-900">{{ avgResponse }}</p>
        </div>
      </div>
    </div>

    <div class="bg-white rounded-xl shadow p-6 border">
      <div class="flex items-center">
        <div class="flex-shrink-0">
          <div
            class="w-8 h-8 bg-primary rounded-xl flex items-center justify-center"
          >
            <ClockIcon class="w-5 h-5 text-primary-foreground" />
          </div>
        </div>
        <div class="ml-4">
          <p class="text-sm font-medium text-gray-600">Top Query</p>
          <Badge variant="secondary">
            {{ topQuery }}
          </Badge>
        </div>
      </div>
    </div>

    <div class="bg-white rounded-xl shadow p-6 border">
      <div class="flex items-center">
        <div class="flex-shrink-0">
          <div
            class="w-8 h-8 bg-primary rounded-xl flex items-center justify-center"
          >
            <UsersIcon class="w-5 h-5 text-primary-foreground" />
          </div>
        </div>
        <div class="ml-4">
          <p class="text-sm font-medium text-gray-600">Popular Queries</p>
          <p class="text-2xl font-semibold text-gray-900">{{ popularCount }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Badge } from '@/components/ui/badge';
import { inject, ref, onMounted, computed } from 'vue';
import type { Altus4SDK, AnalyticsData } from '@altus4/sdk';
import {
  Activity as ActivityIcon,
  CheckCircle as CheckCircleIcon,
  Clock as ClockIcon,
  Users as UsersIcon,
} from 'lucide-vue-next';

const altus4 = inject<Altus4SDK>('altus4');

const analytics = ref<AnalyticsData | null>(null);
const loading = ref(false);
const error = ref<string | null>(null);

onMounted(async () => {
  loading.value = true;
  try {
    const resp = await altus4?.analytics?.getDashboardAnalytics({
      period: 'week',
      includeInsights: true,
      includeTrends: true,
    });
    if (resp?.success && resp.data) {
      analytics.value = resp.data as AnalyticsData;
    } else {
      error.value = resp?.error?.message || 'No analytics available';
    }
  } catch (e) {
    console.warn('Failed to fetch analytics dashboard', e);
    error.value = 'Failed to fetch analytics';
  } finally {
    loading.value = false;
  }
});

const totalQueries = computed(
  () => analytics.value?.summary?.totalQueries ?? 0
);

const avgResponse = computed(
  () => analytics.value?.summary?.averageResponseTime ?? 0
);

const topQuery = computed(() => analytics.value?.summary?.topQuery ?? '—');

const popularCount = computed(() => {
  // If SDK exposes search history or popular queries differently, adjust here
  const distribution = analytics.value?.summary?.queryDistribution;
  if (distribution && typeof distribution === 'object') {
    return Object.keys(distribution).length;
  }
  return 0;
});
</script>
