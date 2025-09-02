<template>
  <svg
    :width="size"
    :height="size"
    viewBox="0 0 1024 1024"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    xmlns:xlink="http://www.w3.org/1999/xlink"
    :class="containerClass"
  >
    <title>Altus 4 Logo</title>
    <defs>
      <linearGradient :id="`logoGradient-${uniqueId}`" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" :style="`stop-color:${gradientStart};stop-opacity:1`" />
        <stop offset="100%" :style="`stop-color:${gradientEnd};stop-opacity:1`" />
      </linearGradient>
      <filter :id="`subtleGlow-${uniqueId}`" x="-20%" y="-20%" width="140%" height="140%" v-if="animated">
        <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
        <feMerge>
          <feMergeNode in="coloredBlur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>
    <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
      <g>
        <!-- Main logo shape -->
        <path
          d="M491.059122,511.88617 C525.210349,510.138787 612,502.827367 612,502.827367 L612,348 L481.952129,495.607914 C481.952129,495.653898 456.680221,513.58757 491.059122,511.88617 Z M774.84804,520.687873 C735.779422,525.669166 720.911389,530.604759 716.839835,529.73646 C716.839835,553.820326 718.623999,754.67154 718.623999,817.60035 C662.399958,879.249562 604.4375,817.60035 604.4375,817.60035 C604.4375,817.60035 600.91492,663.637269 602.699084,554.414425 C394.089134,578.589691 312.658057,689.046433 294.404686,705.36131 C272.674483,714.364197 247.284456,694.439026 247.284456,694.439026 C221.89443,687.264136 247.284456,649.19609 247.284456,649.19609 L629.827527,196.492535 C702.337784,143.98331 711.395847,219.982301 711.395847,219.982301 L711.395847,502.453599 C711.395847,502.453599 740.354202,502.453599 772.926633,500.717001 C805.682055,511.502186 774.84804,520.687873 774.84804,520.687873 Z"
          :fill="`url(#logoGradient-${uniqueId})`"
          :filter="animated ? `url(#subtleGlow-${uniqueId})` : undefined"
          fill-rule="nonzero"
        />

        <!-- Animated accent elements (only show if animated prop is true) -->
        <template v-if="animated">
          <circle cx="380" cy="280" r="6" :fill="accentColor" opacity="0.5">
            <animate attributeName="opacity" values="0.5;0.8;0.5" dur="3s" repeatCount="indefinite"/>
          </circle>
          <circle cx="720" cy="420" r="4" :fill="accentColor" opacity="0.6">
            <animate attributeName="opacity" values="0.6;0.3;0.6" dur="2.5s" repeatCount="indefinite"/>
          </circle>
          <circle cx="320" cy="650" r="3" :fill="accentColor" opacity="0.4">
            <animate attributeName="opacity" values="0.4;0.7;0.4" dur="2.8s" repeatCount="indefinite"/>
          </circle>

          <!-- Connection lines -->
          <path d="M350,200 Q400,250 450,200" :stroke="accentColor" stroke-width="2" fill="none" opacity="0.3"/>
          <path d="M750,600 Q700,650 650,600" :stroke="accentColor" stroke-width="1.5" fill="none" opacity="0.4"/>
        </template>
      </g>
    </g>
  </svg>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  variant?: 'dark' | 'light';
  size?: string | number;
  animated?: boolean;
  class?: string;
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'dark',
  size: '32',
  animated: true,
  class: ''
});

// Generate unique ID for gradients to avoid conflicts when multiple logos are on the same page
const uniqueId = Math.random().toString(36).substr(2, 9);

// Computed color schemes based on variant
const gradientStart = computed(() => {
  return props.variant === 'dark' ? '#1f2937' : '#f9fafb';
});

const gradientEnd = computed(() => {
  return props.variant === 'dark' ? '#111827' : '#e5e7eb';
});

const accentColor = computed(() => {
  return props.variant === 'dark' ? '#6b7280' : '#9ca3af';
});

const containerClass = computed(() => {
  return `altus-logo ${props.class}`;
});
</script>

<style scoped>
.altus-logo {
  transition: all 0.3s ease;
}

.altus-logo:hover {
  transform: scale(1.05);
}
</style>
