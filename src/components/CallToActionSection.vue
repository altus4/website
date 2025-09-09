<template>
  <section class="py-16 md:py-24 bg-gradient-to-br from-blue-600 to-indigo-700">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="mx-auto max-w-4xl text-center">
        <!-- Main CTA -->
        <h2 class="text-3xl font-bold text-white sm:text-4xl mb-6">
          Ship better search this week.
        </h2>
        <p class="text-xl text-blue-100 mb-8">
          Start with your current MySQL, add AI relevance when ready. No
          migrations, no new cluster, clear docs under /docs.
        </p>

        <!-- CTA Buttons -->
        <div
          class="flex flex-col items-center justify-center gap-4 sm:flex-row mb-12"
        >
          <Button
            variant="secondary"
            size="lg"
            class="min-w-48 bg-white text-blue-600 hover:bg-gray-50 hover:text-blue-800"
            as="a"
            href="/docs/setup/quickstart"
          >
            <DownloadIcon class="mr-2 h-5 w-5" />
            Quick Start Guide
          </Button>
          <Button
            variant="outline"
            size="lg"
            class="min-w-48 bg-white text-blue-600 hover:bg-gray-50 hover:text-blue-800"
            as="a"
            href="/docs/"
          >
            <BookOpenIcon class="mr-2 h-5 w-5" />
            Documentation
          </Button>
          <Button
            variant="outline"
            size="lg"
            class="min-w-48 bg-white text-blue-600 hover:bg-gray-50 hover:text-blue-800"
            as="a"
            href="https://github.com/altus4/core"
            target="_blank"
            rel="noopener noreferrer"
          >
            <GitHubIcon class="mr-2 h-5 w-5" />
            View on GitHub
          </Button>
        </div>

        <!-- Quick Stats -->
        <div class="grid grid-cols-1 gap-8 sm:grid-cols-3 mb-12">
          <div class="text-center">
            <div class="text-3xl font-bold text-white">Complete</div>
            <div class="text-blue-200">Documentation</div>
          </div>
          <div class="text-center">
            <div class="text-3xl font-bold text-white">TypeScript</div>
            <div class="text-blue-200">Type Safety</div>
          </div>
          <div class="text-center">
            <div class="text-3xl font-bold text-white">&lt;100ms</div>
            <div class="text-blue-200">Response Time</div>
          </div>
        </div>

        <!-- Community Links -->
        <div class="border-t border-blue-500/30 pt-8">
          <p class="text-blue-100 mb-6">
            Connect with the community and stay updated on development progress
          </p>
          <div class="flex flex-wrap items-center justify-center gap-6">
            <a
              href="https://github.com/altus4/core/issues"
              target="_blank"
              rel="noopener noreferrer"
              class="flex items-center space-x-2 text-blue-200 hover:text-white transition-colors"
            >
              <GitHubIcon class="h-5 w-5" />
              <span>GitHub Issues</span>
            </a>
            <a
              href="https://github.com/altus4/core/discussions"
              target="_blank"
              rel="noopener noreferrer"
              class="flex items-center space-x-2 text-blue-200 hover:text-white transition-colors"
            >
              <MessageCircleIcon class="h-5 w-5" />
              <span>Discussions</span>
            </a>
            <a
              href="/docs/development/contributing"
              class="flex items-center space-x-2 text-blue-200 hover:text-white transition-colors"
            >
              <BookOpenIcon class="h-5 w-5" />
              <span>Contributing Guide</span>
            </a>
            <a
              href="https://twitter.com/altus4dev"
              target="_blank"
              rel="noopener noreferrer"
              class="flex items-center space-x-2 text-blue-200 hover:text-white transition-colors"
            >
              <TwitterIcon class="h-5 w-5" />
              <span>Twitter Updates</span>
            </a>
            <a
              href="mailto:support@altus4.dev"
              class="flex items-center space-x-2 text-blue-200 hover:text-white transition-colors"
            >
              <MailIcon class="h-5 w-5" />
              <span>Newsletter</span>
            </a>
          </div>
        </div>
      </div>
    </div>

    <!-- Background decoration -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div
        class="absolute -top-40 -right-32 h-80 w-80 rounded-full bg-white/10 blur-3xl"
      ></div>
      <div
        class="absolute -bottom-40 -left-32 h-80 w-80 rounded-full bg-white/10 blur-3xl"
      ></div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { Button } from '@/components/ui/button';
import {
  Github as GitHubIcon,
  BookOpen as BookOpenIcon,
  Download as DownloadIcon,
  MessageCircle as MessageCircleIcon,
  Twitter as TwitterIcon,
  Mail as MailIcon,
} from 'lucide-vue-next';
</script>
