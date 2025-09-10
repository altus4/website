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
              <Button variant="outline" size="sm">
                <SettingsIcon class="mr-2 h-4 w-4" />
                Settings
              </Button>
              <Button size="sm">
                <PlusIcon class="mr-2 h-4 w-4" />
                New Project
              </Button>
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
            <ProjectsList />
          </div>

          <!-- Recent Activity -->
          <div class="lg:col-span-1">
            <RecentActivity />
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="bg-white rounded-lg shadow border p-6">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" class="h-auto p-4 flex-col space-y-2">
              <CodeIcon class="h-6 w-6 text-blue-600" />
              <span class="text-sm">Deploy Code</span>
            </Button>
            <Button variant="outline" class="h-auto p-4 flex-col space-y-2">
              <DatabaseIcon class="h-6 w-6 text-green-600" />
              <span class="text-sm">Backup DB</span>
            </Button>
            <Button variant="outline" class="h-auto p-4 flex-col space-y-2">
              <BarChartIcon class="h-6 w-6 text-purple-600" />
              <span class="text-sm">Analytics</span>
            </Button>
            <Button variant="outline" class="h-auto p-4 flex-col space-y-2">
              <UsersIcon class="h-6 w-6 text-orange-600" />
              <span class="text-sm">Team</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Button } from '@/components/ui/button';
import DashboardStats from '@/components/dashboard/DashboardStats.vue';
import ProjectsList from '@/components/dashboard/ProjectsList.vue';
import RecentActivity from '@/components/dashboard/RecentActivity.vue';
import {
  Plus as PlusIcon,
  Settings as SettingsIcon,
  Code as CodeIcon,
  Database as DatabaseIcon,
  BarChart3 as BarChartIcon,
  Users as UsersIcon,
} from 'lucide-vue-next';

interface Props {
  user?: { name: string } | null;
}

defineProps<Props>();
</script>
