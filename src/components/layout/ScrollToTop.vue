<template>
  <Button
    v-if="showScrollTop"
    size="icon"
    class="fixed bottom-8 right-8 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 z-40"
    @click="scrollToTop"
  >
    <ArrowUpIcon class="h-6 w-6" />
  </Button>
</template>

<script setup lang="ts">
import { Button } from '@/components/ui/button';
import { ArrowUp as ArrowUpIcon } from 'lucide-vue-next';

interface Props {
  showScrollTop: boolean;
}

defineProps<Props>();

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
};
</script>
