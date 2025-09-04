<template>
  <div class="min-h-screen bg-white">
    <!-- Navigation -->
    <nav
      class="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200"
    >
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <!-- Logo -->
          <a
            href="/"
            class="flex items-center hover:opacity-80 transition-opacity cursor-pointer"
          >
            <AltusLogo variant="dark" size="32" :animated="true" />
            <span class="text-xl font-bold text-gray-900 -ml-1.5">ltus 4</span>
          </a>

          <!-- Navigation Links -->
          <div class="hidden md:flex items-center space-x-8">
            <a
              href="/#features"
              class="text-gray-600 hover:text-gray-900 transition-colors"
              >Features</a
            >
            <a
              href="/#architecture"
              class="text-gray-600 hover:text-gray-900 transition-colors"
              >Architecture</a
            >
            <a
              href="/#status"
              class="text-gray-600 hover:text-gray-900 transition-colors"
              >Status</a
            >
            <a
              href="/docs/"
              class="text-gray-600 hover:text-gray-900 transition-colors"
              >Documentation</a
            >
            <Button
              variant="outline"
              size="sm"
              as="a"
              href="https://github.com/altus4/core"
              target="_blank"
              rel="noopener noreferrer"
            >
              <GitHubIcon class="mr-2 h-4 w-4" />
              GitHub
            </Button>
          </div>

          <!-- Mobile Menu Button -->
          <button
            class="md:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            @click="mobileMenuOpen = !mobileMenuOpen"
          >
            <MenuIcon v-if="!mobileMenuOpen" class="h-6 w-6" />
            <XIcon v-else class="h-6 w-6" />
          </button>
        </div>

        <!-- Mobile Menu -->
        <div
          v-if="mobileMenuOpen"
          class="md:hidden border-t border-gray-200 py-4"
        >
          <div class="flex flex-col space-y-4">
            <a
              href="/#features"
              class="text-gray-600 hover:text-gray-900 transition-colors"
              @click="mobileMenuOpen = false"
              >Features</a
            >
            <a
              href="/#architecture"
              class="text-gray-600 hover:text-gray-900 transition-colors"
              @click="mobileMenuOpen = false"
              >Architecture</a
            >
            <a
              href="/#status"
              class="text-gray-600 hover:text-gray-900 transition-colors"
              @click="mobileMenuOpen = false"
              >Status</a
            >
            <a
              href="/docs/"
              class="text-gray-600 hover:text-gray-900 transition-colors"
              @click="mobileMenuOpen = false"
              >Documentation</a
            >
            <Button
              variant="outline"
              size="sm"
              class="self-start"
              as="a"
              href="https://github.com/altus4/core"
              target="_blank"
              rel="noopener noreferrer"
            >
              <GitHubIcon class="mr-2 h-4 w-4" />
              GitHub
            </Button>
          </div>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <main>
      <!-- Home Page -->
      <template v-if="currentPage === 'home'">
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
      </template>

      <!-- Privacy Policy Page -->
      <PrivacyPolicy v-if="currentPage === 'privacy'" />

      <!-- Terms of Use Page -->
      <TermsOfUse v-if="currentPage === 'terms'" />
    </main>

    <!-- Footer -->
    <FooterSection />

    <!-- Scroll to Top Button -->
    <Button
      v-if="showScrollTop"
      size="icon"
      class="fixed bottom-8 right-8 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 z-40"
      @click="scrollToTop"
    >
      <ArrowUpIcon class="h-6 w-6" />
    </Button>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { Button } from '@/components/ui/button';
import AltusLogo from '@/components/ui/AltusLogo.vue';
import HeroSection from '@/components/HeroSection.vue';
import FeaturesSection from '@/components/FeaturesSection.vue';
import TechSpecsSection from '@/components/TechSpecsSection.vue';
import ProjectStatusSection from '@/components/ProjectStatusSection.vue';
import CallToActionSection from '@/components/CallToActionSection.vue';
import FooterSection from '@/components/FooterSection.vue';
import PrivacyPolicy from '@/components/PrivacyPolicy.vue';
import TermsOfUse from '@/components/TermsOfUse.vue';
import {
  Github as GitHubIcon,
  Menu as MenuIcon,
  X as XIcon,
  ArrowUp as ArrowUpIcon,
} from 'lucide-vue-next';

// Mobile menu state
const mobileMenuOpen = ref(false);

// Simple routing state
const currentRoute = ref(window.location.pathname);

// Scroll to top functionality
const showScrollTop = ref(false);

// Computed property to determine which page to show
const currentPage = computed(() => {
  switch (currentRoute.value) {
    case '/privacy':
      return 'privacy';
    case '/terms':
      return 'terms';
    default:
      return 'home';
  }
});

const handleScroll = () => {
  showScrollTop.value = window.scrollY > 400;
};

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
};

// Simple routing functions
const handlePopState = () => {
  currentRoute.value = window.location.pathname;
};

// Smooth scroll for anchor links
const handleAnchorClick = (event: Event) => {
  const target = event.target as HTMLAnchorElement;
  const href = target.getAttribute('href');

  if (href?.startsWith('/#')) {
    event.preventDefault();
    const hash = href.substring(1); // Remove the '/' to get just '#features'

    // If we're not on the home page, navigate to home first
    if (currentRoute.value !== '/') {
      window.history.pushState({}, '', '/');
      currentRoute.value = '/';

      // Wait for the next tick to ensure home page is rendered
      setTimeout(() => {
        const element = document.querySelector(hash);
        if (element) {
          const navHeight = 64;
          const elementTop =
            element.getBoundingClientRect().top + window.scrollY - navHeight;
          window.scrollTo({
            top: elementTop,
            behavior: 'smooth',
          });
        }
      }, 100);
    } else {
      // We're already on home page, just scroll to the element
      const element = document.querySelector(hash);
      if (element) {
        const navHeight = 64;
        const elementTop =
          element.getBoundingClientRect().top + window.scrollY - navHeight;
        window.scrollTo({
          top: elementTop,
          behavior: 'smooth',
        });
      }
    }
  } else if (href?.startsWith('#')) {
    // Regular anchor links on the same page
    event.preventDefault();
    const element = document.querySelector(href);
    if (element) {
      const navHeight = 64;
      const elementTop =
        element.getBoundingClientRect().top + window.scrollY - navHeight;
      window.scrollTo({
        top: elementTop,
        behavior: 'smooth',
      });
    }
  }
};

onMounted(() => {
  window.addEventListener('scroll', handleScroll);
  window.addEventListener('popstate', handlePopState);

  // Add smooth scroll to all anchor links and handle internal navigation
  document.addEventListener('click', event => {
    const target = event.target as HTMLElement;
    const anchor = target.closest('a') as HTMLAnchorElement;

    if (anchor) {
      const href = anchor.getAttribute('href');

      // Handle anchor links
      if (href?.startsWith('#') || href?.startsWith('/#')) {
        handleAnchorClick(event);
      }
      // Handle internal navigation (privacy, terms, home)
      else if (href === '/' || href === '/privacy' || href === '/terms') {
        event.preventDefault();
        window.history.pushState({}, '', href);
        currentRoute.value = href;
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  });
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
  window.removeEventListener('popstate', handlePopState);
});
</script>
