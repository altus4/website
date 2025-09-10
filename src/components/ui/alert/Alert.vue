<template>
  <div :class="alertClasses" role="alert">
    <component :is="iconComponent" v-if="iconComponent" class="h-4 w-4" />
    <div class="flex-1">
      <h5 v-if="title" class="mb-1 font-medium leading-none tracking-tight">
        {{ title }}
      </h5>
      <div class="text-sm">
        <slot>{{ description }}</slot>
      </div>
    </div>
    <button
      v-if="dismissible"
      class="ml-auto opacity-70 hover:opacity-100 transition-opacity"
      @click="$emit('dismiss')"
    >
      <XIcon class="h-4 w-4" />
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { cn } from '@/lib/utils';
import { AlertCircle, CheckCircle, Info, X as XIcon } from 'lucide-vue-next';

interface Props {
  variant?: 'default' | 'destructive' | 'success' | 'warning';
  title?: string;
  description?: string;
  dismissible?: boolean;
  class?: string;
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
  dismissible: false,
});

defineEmits<{
  dismiss: [];
}>();

const alertClasses = computed(() =>
  cn(
    'relative w-full rounded-lg border p-4 flex items-start gap-3',
    {
      'bg-background text-foreground border-border':
        props.variant === 'default',
      'border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive bg-red-50':
        props.variant === 'destructive',
      'border-green-500/50 text-green-700 dark:border-green-500 [&>svg]:text-green-600 bg-green-50':
        props.variant === 'success',
      'border-yellow-500/50 text-yellow-700 dark:border-yellow-500 [&>svg]:text-yellow-600 bg-yellow-50':
        props.variant === 'warning',
    },
    props.class
  )
);

const iconComponent = computed(() => {
  switch (props.variant) {
    case 'destructive':
      return AlertCircle;
    case 'success':
      return CheckCircle;
    case 'warning':
      return AlertCircle;
    default:
      return Info;
  }
});
</script>
