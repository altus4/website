import { ref } from 'vue';

export function useScroll() {
  const showScrollTop = ref(false);

  const handleScroll = () => {
    showScrollTop.value = window.scrollY > 400;
  };

  const setupScrollListeners = () => {
    window.addEventListener('scroll', handleScroll);
  };

  const cleanupScrollListeners = () => {
    window.removeEventListener('scroll', handleScroll);
  };

  return {
    showScrollTop,
    setupScrollListeners,
    cleanupScrollListeners,
  };
}
