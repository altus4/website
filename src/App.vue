<template>
  <div class="min-h-screen bg-white">
    <AppNavigation
      :is-authenticated="isAuthenticated"
      :user="user"
      @logout="handleLogout"
    />

    <main>
      <HomePage v-if="currentPage === 'home'" />
      <PrivacyPolicy v-if="currentPage === 'privacy'" />
      <TermsOfUse v-if="currentPage === 'terms'" />
      <LoginPage v-if="currentPage === 'login'" />
      <RegisterPage v-if="currentPage === 'register'" />
      <ForgotPasswordPage v-if="currentPage === 'forgot-password'" />
      <DashboardPage
        v-if="currentPage === 'dashboard' && isAuthenticated"
        :user="user"
      />
      <LoginPage v-if="currentPage === 'dashboard' && !isAuthenticated" />
    </main>

    <FooterSection />
    <ScrollToTop :show-scroll-top="showScrollTop" />
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, watch } from 'vue';
import { useAuth } from '@/composables/useAuth';
import { useRouter } from '@/composables/useRouter';
import { useScroll } from '@/composables/useScroll';
import { useRedirect } from '@/composables/useRedirect';
import AppNavigation from '@/components/layout/AppNavigation.vue';
import ScrollToTop from '@/components/layout/ScrollToTop.vue';
import FooterSection from '@/components/FooterSection.vue';
import HomePage from '@/pages/HomePage.vue';
import PrivacyPolicy from '@/pages/PrivacyPolicy.vue';
import TermsOfUse from '@/pages/TermsOfUse.vue';
import LoginPage from '@/pages/auth/LoginPage.vue';
import RegisterPage from '@/pages/auth/RegisterPage.vue';
import ForgotPasswordPage from '@/pages/auth/ForgotPasswordPage.vue';
import DashboardPage from '@/pages/DashboardPage.vue';

const { isAuthenticated, user, logout } = useAuth();
const { currentPage, setupRouting, cleanupRouting, navigateTo } = useRouter();
const { showScrollTop, setupScrollListeners, cleanupScrollListeners } =
  useScroll();
const { setIntendedRoute } = useRedirect();

const handleLogout = async () => {
  await logout();
  navigateTo('/');
};

// Watch for unauthenticated dashboard access
watch(
  [currentPage, isAuthenticated],
  ([page, authenticated]) => {
    if (page === 'dashboard' && !authenticated) {
      setIntendedRoute('/dashboard');
    }
  },
  { immediate: true }
);

onMounted(() => {
  setupRouting();
  setupScrollListeners();
});

onUnmounted(() => {
  cleanupRouting();
  cleanupScrollListeners();
});
</script>
