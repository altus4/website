<template>
  <div class="bg-white rounded-lg shadow border">
    <div class="px-6 py-4 border-b border-gray-200">
      <div class="flex items-center justify-between">
        <h3 class="text-lg font-medium text-gray-900">Your Projects</h3>
        <Button size="sm">
          <PlusIcon class="mr-2 h-4 w-4" />
          New Project
        </Button>
      </div>
    </div>
    <div class="p-6">
      <div class="space-y-4">
        <div
          v-for="project in projects"
          :key="project.id"
          class="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
        >
          <div class="flex items-center space-x-4">
            <div
              class="w-10 h-10 rounded-lg flex items-center justify-center"
              :class="project.iconBg"
            >
              <component
                :is="project.icon"
                class="h-5 w-5"
                :class="project.iconColor"
              />
            </div>
            <div>
              <h4 class="text-sm font-medium text-gray-900">
                {{ project.name }}
              </h4>
              <p class="text-sm text-gray-500">{{ project.description }}</p>
            </div>
          </div>
          <div class="flex items-center space-x-4">
            <div class="text-right">
              <div class="flex items-center space-x-2">
                <span
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                  :class="project.statusClass"
                >
                  {{ project.status }}
                </span>
              </div>
              <p class="text-xs text-gray-500 mt-1">
                Updated {{ project.lastUpdated }}
              </p>
            </div>
            <Button variant="ghost" size="sm">
              <ExternalLinkIcon class="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Button } from '@/components/ui/button';
import {
  Plus as PlusIcon,
  ExternalLink as ExternalLinkIcon,
  Code as CodeIcon,
  Database as DatabaseIcon,
  Smartphone as SmartphoneIcon,
  Globe as GlobeIcon,
} from 'lucide-vue-next';

const projects = [
  {
    id: 1,
    name: 'Altus Core API',
    description: 'Main backend API service',
    status: 'Active',
    statusClass: 'bg-green-100 text-green-800',
    lastUpdated: '2 hours ago',
    icon: CodeIcon,
    iconColor: 'text-blue-600',
    iconBg: 'bg-blue-100',
  },
  {
    id: 2,
    name: 'Database Migration',
    description: 'PostgreSQL to MongoDB migration',
    status: 'In Progress',
    statusClass: 'bg-yellow-100 text-yellow-800',
    lastUpdated: '1 day ago',
    icon: DatabaseIcon,
    iconColor: 'text-green-600',
    iconBg: 'bg-green-100',
  },
  {
    id: 3,
    name: 'Mobile App',
    description: 'React Native application',
    status: 'Planning',
    statusClass: 'bg-gray-100 text-gray-800',
    lastUpdated: '3 days ago',
    icon: SmartphoneIcon,
    iconColor: 'text-purple-600',
    iconBg: 'bg-purple-100',
  },
  {
    id: 4,
    name: 'Marketing Website',
    description: 'Public facing website',
    status: 'Active',
    statusClass: 'bg-green-100 text-green-800',
    lastUpdated: '5 hours ago',
    icon: GlobeIcon,
    iconColor: 'text-orange-600',
    iconBg: 'bg-orange-100',
  },
];
</script>
