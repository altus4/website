<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
    <div class="bg-white rounded-lg shadow p-6 border">
      <div class="flex items-center">
        <div class="flex-shrink-0">
          <div
            class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center"
          >
            <ActivityIcon class="w-5 h-5 text-blue-600" />
          </div>
        </div>
        <div class="ml-4">
          <p class="text-sm font-medium text-gray-600">Total Projects</p>
          <p class="text-2xl font-semibold text-gray-900">12</p>
        </div>
      </div>
    </div>

    <div class="bg-white rounded-lg shadow p-6 border">
      <div class="flex items-center">
        <div class="flex-shrink-0">
          <div
            class="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center"
          >
            <CheckCircleIcon class="w-5 h-5 text-green-600" />
          </div>
        </div>
        <div class="ml-4">
          <p class="text-sm font-medium text-gray-600">Completed Tasks</p>
          <p class="text-2xl font-semibold text-gray-900">48</p>
        </div>
      </div>
    </div>

    <div class="bg-white rounded-lg shadow p-6 border">
      <div class="flex items-center">
        <div class="flex-shrink-0">
          <div
            class="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center"
          >
            <ClockIcon class="w-5 h-5 text-yellow-600" />
          </div>
        </div>
        <div class="ml-4">
          <p class="text-sm font-medium text-gray-600">In Progress</p>
          <p class="text-2xl font-semibold text-gray-900">7</p>
        </div>
      </div>
    </div>

    <div class="bg-white rounded-lg shadow p-6 border">
      <div class="flex items-center">
        <div class="flex-shrink-0">
          <div
            class="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center"
          >
            <UsersIcon class="w-5 h-5 text-purple-600" />
          </div>
        </div>
        <div class="ml-4">
          <p class="text-sm font-medium text-gray-600">Team Members</p>
          <p class="text-2xl font-semibold text-gray-900">5</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  Activity as ActivityIcon,
  CheckCircle as CheckCircleIcon,
  Clock as ClockIcon,
  Users as UsersIcon,
} from 'lucide-vue-next';
</script>
