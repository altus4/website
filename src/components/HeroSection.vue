<template>
  <section
    class="relative overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-100 py-16 md:py-24"
  >
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="relative z-10 mx-auto max-w-4xl text-center">
        <!-- Badge -->
        <div
          class="mb-8 inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700"
        >
          <span class="mr-2 flex h-2 w-2 rounded-full bg-green-400"></span>
          Drop‑in for MySQL • No migrations • Docker quickstart
        </div>

        <!-- Main Heading -->
        <h1
          class="mb-6 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl"
        >
          AI-Enhanced Search Engine
          <span class="block text-blue-600">for Modern Applications</span>
        </h1>

        <!-- Subtitle -->
        <p class="mb-8 text-xl text-gray-600 sm:text-2xl">
          Production-ready AI-enhanced MySQL search platform that bridges
          traditional database search with modern AI capabilities. No migrations
          required - enhance your existing MySQL FULLTEXT indexes.
        </p>

        <!-- CTA Buttons -->
        <div
          class="flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <Button
            size="lg"
            class="min-w-40"
            as="a"
            href="/docs/setup/quickstart"
          >
            <DownloadIcon class="mr-2 h-5 w-5" />
            Get Started
          </Button>
          <Button
            variant="outline"
            size="lg"
            class="min-w-40"
            as="a"
            href="/docs/"
          >
            <BookOpenIcon class="mr-2 h-5 w-5" />
            Documentation
          </Button>
          <Button
            variant="outline"
            size="lg"
            class="min-w-40"
            as="a"
            href="https://github.com/altus4/core"
            target="_blank"
            rel="noopener noreferrer"
          >
            <GitHubIcon class="mr-2 h-5 w-5" />
            Star on GitHub
          </Button>
        </div>

        <!-- Tech Stack -->
        <div class="mt-12">
          <p
            class="mb-4 text-sm font-medium text-gray-500 uppercase tracking-wide"
          >
            Built with
          </p>
          <div
            class="flex flex-wrap items-center justify-center gap-6 text-gray-400"
          >
            <div class="flex items-center gap-2">
              <img
                src="https://raw.githubusercontent.com/devicons/devicon/master/icons/typescript/typescript-original.svg"
                alt="TypeScript"
                class="h-6 w-6"
              />
              <span class="text-sm font-medium">TypeScript</span>
            </div>
            <div class="flex items-center gap-2">
              <img
                src="https://raw.githubusercontent.com/devicons/devicon/master/icons/mysql/mysql-original.svg"
                alt="MySQL"
                class="h-6 w-6"
              />
              <span class="text-sm font-medium">MySQL</span>
            </div>
            <div class="flex items-center gap-2">
              <img
                src="https://raw.githubusercontent.com/devicons/devicon/master/icons/redis/redis-original.svg"
                alt="Redis"
                class="h-6 w-6"
              />
              <span class="text-sm font-medium">Redis</span>
            </div>
            <div class="flex items-center gap-2">
              <img
                src="https://raw.githubusercontent.com/devicons/devicon/master/icons/nodejs/nodejs-original.svg"
                alt="Node.js"
                class="h-6 w-6"
              />
              <span class="text-sm font-medium">Node.js</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Background decoration -->
    <div class="absolute inset-0 -z-10 overflow-hidden">
      <div
        class="absolute -top-40 -right-32 h-80 w-80 rounded-full bg-gradient-to-br from-blue-400 to-indigo-600 opacity-20 blur-3xl"
      ></div>
      <div
        class="absolute -bottom-40 -left-32 h-80 w-80 rounded-full bg-gradient-to-br from-indigo-400 to-purple-600 opacity-20 blur-3xl"
      ></div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { Button } from '@/components/ui/button';
import {
  BookOpen as BookOpenIcon,
  Download as DownloadIcon,
  Github as GitHubIcon,
} from 'lucide-vue-next';
</script>
