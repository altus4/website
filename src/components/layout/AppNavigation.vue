<template>
  <nav
    class="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200"
  >
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <!-- Logo -->
        <a
          href="/"
          class="flex items-center hover:opacity-80 space-x-2 transition-opacity cursor-pointer"
        >
          <AltusLogo variant="dark" size="32" :animated="true" />
          <span class="text-xl font-bold text-gray-900">Altus 4</span>
        </a>

        <!-- Desktop Navigation -->
        <div class="hidden md:flex items-center space-x-1">
          <!-- Main Navigation Links -->
          <div class="flex items-center space-x-2 mr-6">
            <Button variant="ghost" as="a" href="/#features"> Benefits </Button>
            <Button variant="ghost" as="a" href="/#architecture">
              Architecture
            </Button>
            <Button variant="ghost" as="a" href="/#status"> Status </Button>
            <Button variant="ghost" as="a" href="/docs/">
              Documentation
            </Button>
          </div>

          <!-- Secondary Actions -->
          <div
            class="flex items-center space-x-3 border-l border-gray-200 pl-6"
          >
            <Button
              variant="ghost"
              as="a"
              href="https://github.com/altus4/core"
              target="_blank"
              rel="noopener noreferrer"
            >
              <GitHubIcon class="mr-2 h-4 w-4" />
              GitHub
            </Button>

            <!-- Authentication -->
            <template v-if="isAuthenticated">
              <div
                class="flex items-center space-x-3 border-l border-gray-200 pl-3"
              >
                <Button variant="ghost" as="a" href="/dashboard">
                  <LayoutDashboardIcon class="mr-2 h-4 w-4" />
                  Dashboard
                </Button>
                <div class="flex items-center space-x-2">
                  <UserIcon class="h-4 w-4 text-gray-600" />
                  <span class="text-sm text-gray-600">{{ user?.name }}</span>
                </div>
                <Button variant="ghost" @click="$emit('logout')">
                  <LogOutIcon class="mr-2 h-4 w-4" />
                  Logout
                </Button>
              </div>
            </template>
            <template v-else>
              <div
                class="flex items-center space-x-2 border-l border-gray-200 pl-3"
              >
                <Button variant="ghost" as="a" href="/login"> Sign in </Button>
                <Button as="a" href="/register">Get started</Button>
              </div>
            </template>
          </div>
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
        class="md:hidden border-t border-gray-200 py-4 space-y-6"
      >
        <!-- Main Navigation Links -->
        <div class="flex flex-col space-y-2">
          <Button
            variant="ghost"
            class="w-full justify-start"
            as="a"
            href="/#features"
            @click="mobileMenuOpen = false"
          >
            Benefits
          </Button>
          <Button
            variant="ghost"
            class="w-full justify-start"
            as="a"
            href="/#architecture"
            @click="mobileMenuOpen = false"
          >
            Architecture
          </Button>
          <Button
            variant="ghost"
            class="w-full justify-start"
            as="a"
            href="/#status"
            @click="mobileMenuOpen = false"
          >
            Status
          </Button>
          <Button
            variant="ghost"
            class="w-full justify-start"
            as="a"
            href="/docs/"
            @click="mobileMenuOpen = false"
          >
            Documentation
          </Button>
        </div>

        <!-- Secondary Actions -->
        <div class="border-t border-gray-100 pt-4 space-y-3">
          <Button
            variant="outline"
            class="w-full justify-center"
            as="a"
            href="https://github.com/altus4/core"
            target="_blank"
            rel="noopener noreferrer"
            @click="mobileMenuOpen = false"
          >
            <GitHubIcon class="mr-2 h-4 w-4" />
            GitHub
          </Button>

          <!-- Authentication -->
          <template v-if="isAuthenticated">
            <div class="border-t border-gray-100 pt-4 space-y-3">
              <Button
                variant="ghost"
                class="w-full justify-start"
                as="a"
                href="/dashboard"
                @click="mobileMenuOpen = false"
              >
                <LayoutDashboardIcon class="mr-2 h-4 w-4" />
                Dashboard
              </Button>
              <div class="flex items-center space-x-2 px-3">
                <UserIcon class="h-4 w-4 text-gray-600" />
                <span class="text-sm text-gray-600">{{ user?.name }}</span>
              </div>
              <Button
                variant="ghost"
                class="w-full justify-center"
                @click="
                  $emit('logout');
                  mobileMenuOpen = false;
                "
              >
                <LogOutIcon class="mr-2 h-4 w-4" />
                Logout
              </Button>
            </div>
          </template>
          <template v-else>
            <div class="border-t border-gray-100 pt-4 space-y-2">
              <Button
                variant="ghost"
                class="w-full justify-center"
                as="a"
                href="/login"
                @click="mobileMenuOpen = false"
              >
                Sign in
              </Button>
              <Button
                class="w-full justify-center"
                as="a"
                href="/register"
                @click="mobileMenuOpen = false"
              >
                Get started
              </Button>
            </div>
          </template>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Button } from '@/components/ui/button';
import AltusLogo from '@/components/ui/AltusLogo.vue';
import {
  Github as GitHubIcon,
  Menu as MenuIcon,
  X as XIcon,
  User as UserIcon,
  LogOut as LogOutIcon,
  LayoutDashboard as LayoutDashboardIcon,
} from 'lucide-vue-next';

interface Props {
  isAuthenticated: boolean;
  user?: { name: string } | null;
}

defineProps<Props>();
defineEmits<{
  logout: [];
}>();

const mobileMenuOpen = ref(false);
</script>
