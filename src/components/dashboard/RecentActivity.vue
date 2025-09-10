<template>
  <div class="bg-white rounded-lg shadow border">
    <div class="px-6 py-4 border-b border-gray-200">
      <h3 class="text-lg font-medium text-gray-900">Recent Activity</h3>
    </div>
    <div class="p-6">
      <div class="flow-root">
        <ul class="-mb-8">
          <li v-for="(activity, index) in activities" :key="index">
            <div
              class="relative pb-8"
              :class="{ 'pb-0': index === activities.length - 1 }"
            >
              <div
                v-if="index !== activities.length - 1"
                class="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                aria-hidden="true"
              ></div>
              <div class="relative flex space-x-3">
                <div>
                  <span
                    class="h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white bg-muted"
                  >
                    <component
                      :is="activity.icon"
                      class="h-5 w-5 text-muted-foreground"
                    />
                  </span>
                </div>
                <div
                  class="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4"
                >
                  <div>
                    <p class="text-sm text-gray-500">
                      {{ activity.content }}
                      <a
                        :href="activity.href"
                        class="font-medium text-gray-900"
                        >{{ activity.target }}</a
                      >
                    </p>
                  </div>
                  <div
                    class="text-right text-xs whitespace-nowrap text-gray-500"
                  >
                    <time :datetime="activity.datetime">{{
                      activity.date
                    }}</time>
                  </div>
                </div>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  CheckCircle as CheckCircleIcon,
  GitBranch as GitBranchIcon,
  MessageSquare as MessageSquareIcon,
  UserPlus as UserPlusIcon,
} from 'lucide-vue-next';

const activities = [
  {
    id: 1,
    content: 'Completed task in',
    target: 'Altus Core Development',
    href: '#',
    date: '2 hours ago',
    datetime: '2023-01-23T15:56',
    icon: CheckCircleIcon,
  },
  {
    id: 2,
    content: 'Created new branch for',
    target: 'Feature/Authentication',
    href: '#',
    date: '4 hours ago',
    datetime: '2023-01-23T13:34',
    icon: GitBranchIcon,
  },
  {
    id: 3,
    content: 'Commented on',
    target: 'API Documentation Review',
    href: '#',
    date: '1 day ago',
    datetime: '2023-01-22T12:32',
    icon: MessageSquareIcon,
  },
  {
    id: 4,
    content: 'Added team member',
    target: 'Sarah Johnson',
    href: '#',
    date: '2 days ago',
    datetime: '2023-01-21T09:15',
    icon: UserPlusIcon,
  },
];
</script>
