<template>
  <div class="min-h-screen bg-white">
    <!-- Navigation -->
    <nav class="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <!-- Logo -->
          <div class="flex items-center space-x-3">
            <AltusLogo variant="dark" size="32" :animated="true" />
            <span class="text-xl font-bold text-gray-900">Altus 4</span>
          </div>

          <!-- Navigation Links -->
          <div class="hidden md:flex items-center space-x-8">
            <a href="#features" class="text-gray-600 hover:text-gray-900 transition-colors">Features</a>
            <a href="#architecture" class="text-gray-600 hover:text-gray-900 transition-colors">Architecture</a>
            <a href="#status" class="text-gray-600 hover:text-gray-900 transition-colors">Status</a>
            <Button variant="outline" size="sm" as="a" href="https://github.com/altus4/core" target="_blank" rel="noopener noreferrer">
              <GitHubIcon class="mr-2 h-4 w-4" />
              GitHub
            </Button>
          </div>

          <!-- Mobile Menu Button -->
          <button
            @click="mobileMenuOpen = !mobileMenuOpen"
            class="md:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          >
            <MenuIcon v-if="!mobileMenuOpen" class="h-6 w-6" />
            <XIcon v-else class="h-6 w-6" />
          </button>
        </div>

        <!-- Mobile Menu -->
        <div v-if="mobileMenuOpen" class="md:hidden border-t border-gray-200 py-4">
          <div class="flex flex-col space-y-4">
            <a href="#features" @click="mobileMenuOpen = false" class="text-gray-600 hover:text-gray-900 transition-colors">Features</a>
            <a href="#architecture" @click="mobileMenuOpen = false" class="text-gray-600 hover:text-gray-900 transition-colors">Architecture</a>
            <a href="#status" @click="mobileMenuOpen = false" class="text-gray-600 hover:text-gray-900 transition-colors">Status</a>
            <Button variant="outline" size="sm" class="self-start" as="a" href="https://github.com/altus4/core" target="_blank" rel="noopener noreferrer">
              <GitHubIcon class="mr-2 h-4 w-4" />
              GitHub
            </Button>
          </div>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <main>
      <!-- Hero Section -->
      <HeroSection />

      <!-- Features Section -->
      <section id="features">
        <FeaturesSection />
      </section>

      <!-- Technical Specifications -->
      <section id="architecture">
        <TechSpecsSection />
      </section>

      <!-- Project Status -->
      <section id="status">
        <ProjectStatusSection />
      </section>

      <!-- Call to Action -->
      <CallToActionSection />
    </main>

    <!-- Footer -->
    <FooterSection />

    <!-- Scroll to Top Button -->
    <Button
      v-if="showScrollTop"
      @click="scrollToTop"
      size="icon"
      class="fixed bottom-8 right-8 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 z-40"
    >
      <ArrowUpIcon class="h-6 w-6" />
    </Button>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { Button } from '@/components/ui/button';
import AltusLogo from '@/components/ui/AltusLogo.vue';
import HeroSection from '@/components/HeroSection.vue';
import FeaturesSection from '@/components/FeaturesSection.vue';
import TechSpecsSection from '@/components/TechSpecsSection.vue';
import ProjectStatusSection from '@/components/ProjectStatusSection.vue';
import CallToActionSection from '@/components/CallToActionSection.vue';
import FooterSection from '@/components/FooterSection.vue';
import {
  Github as GitHubIcon,
  Menu as MenuIcon,
  X as XIcon,
  ArrowUp as ArrowUpIcon
} from 'lucide-vue-next';

// Mobile menu state
const mobileMenuOpen = ref(false);

// Scroll to top functionality
const showScrollTop = ref(false);

const handleScroll = () => {
  showScrollTop.value = window.scrollY > 400;
};

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
};

// Smooth scroll for anchor links
const handleAnchorClick = (event: Event) => {
  const target = event.target as HTMLAnchorElement;
  if (target.hash) {
    event.preventDefault();
    const element = document.querySelector(target.hash);
    if (element) {
      const navHeight = 64; // Height of fixed navigation
      const elementTop = element.getBoundingClientRect().top + window.scrollY - navHeight;
      window.scrollTo({
        top: elementTop,
        behavior: 'smooth'
      });
    }
  }
};

onMounted(() => {
  window.addEventListener('scroll', handleScroll);

  // Add smooth scroll to all anchor links
  document.addEventListener('click', (event) => {
    const target = event.target as HTMLElement;
    const anchor = target.closest('a[href^="#"]') as HTMLAnchorElement;
    if (anchor) {
      handleAnchorClick(event);
    }
  });
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>
