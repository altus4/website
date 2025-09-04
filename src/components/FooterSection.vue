<template>
  <footer class="bg-gray-900 text-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Main Footer -->
      <div class="py-12 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
        <!-- Brand -->
        <div class="lg:col-span-2">
          <a
            href="/"
            class="items-center space-x-3 mb-4 hover:opacity-80 transition-opacity cursor-pointer inline-flex"
          >
            <AltusLogo variant="light" size="40" :animated="false" />
            <h3 class="text-2xl font-bold">Altus 4</h3>
          </a>
          <p class="text-gray-300 mb-6 max-w-md">
            Production-ready AI-enhanced MySQL search platform trusted by
            enterprises. 87% test coverage, comprehensive security, and
            zero-migration deployment.
          </p>
          <div class="flex space-x-4">
            <a
              href="https://github.com/altus4/core"
              target="_blank"
              rel="noopener noreferrer"
              class="text-gray-400 hover:text-white transition-colors"
            >
              <GitHubIcon class="h-6 w-6" />
            </a>
            <a
              href="https://www.linkedin.com/in/thavarshan"
              target="_blank"
              rel="noopener noreferrer"
              class="text-gray-400 hover:text-white transition-colors"
            >
              <LinkedinIcon class="h-6 w-6" />
            </a>
            <a
              href="mailto:altus4@thavarshan.com"
              class="text-gray-400 hover:text-white transition-colors"
            >
              <MailIcon class="h-6 w-6" />
            </a>
          </div>
        </div>

        <!-- Product -->
        <div>
          <h4 class="text-lg font-semibold mb-4">Product</h4>
          <div class="space-y-3">
            <a
              href="/#features"
              class="block text-gray-300 hover:text-white transition-colors"
              >Features</a
            >
            <a
              href="/#architecture"
              class="block text-gray-300 hover:text-white transition-colors"
              >Architecture</a
            >
            <a
              href="/#status"
              class="block text-gray-300 hover:text-white transition-colors"
              >Project Status</a
            >
            <a
              href="https://github.com/altus4/core/discussions/12"
              target="_blank"
              rel="noopener noreferrer"
              class="block text-gray-300 hover:text-white transition-colors"
              >Roadmap</a
            >
            <a
              href="https://github.com/altus4/core/releases"
              target="_blank"
              rel="noopener noreferrer"
              class="block text-gray-300 hover:text-white transition-colors"
              >Changelog</a
            >
          </div>
        </div>

        <!-- Resources -->
        <div>
          <h4 class="text-lg font-semibold mb-4">Resources</h4>
          <div class="space-y-3">
            <a
              href="https://github.com/altus4/core#readme"
              target="_blank"
              rel="noopener noreferrer"
              class="block text-gray-300 hover:text-white transition-colors"
              >Documentation</a
            >
            <a
              href="https://github.com/altus4/core/tree/main/docs/api"
              target="_blank"
              rel="noopener noreferrer"
              class="block text-gray-300 hover:text-white transition-colors"
              >API Reference</a
            >
            <a
              href="https://github.com/altus4/core/tree/main/docs/setup"
              target="_blank"
              rel="noopener noreferrer"
              class="block text-gray-300 hover:text-white transition-colors"
              >Quick Start</a
            >
            <a
              href="https://github.com/altus4/core/tree/main/docs/examples"
              target="_blank"
              rel="noopener noreferrer"
              class="block text-gray-300 hover:text-white transition-colors"
              >Examples & Tutorials</a
            >
          </div>
        </div>
      </div>

      <!-- Tech Stack -->
      <div class="py-8 border-t border-gray-800">
        <div class="text-center mb-6">
          <h4 class="text-lg font-semibold mb-4">Built With</h4>
          <div class="flex flex-wrap items-center justify-center gap-8">
            <div class="flex items-center space-x-2 text-gray-300">
              <img
                src="https://raw.githubusercontent.com/devicons/devicon/master/icons/typescript/typescript-original.svg"
                alt="TypeScript"
                class="h-6 w-6"
              />
              <span>TypeScript</span>
            </div>
            <div class="flex items-center space-x-2 text-gray-300">
              <img
                src="https://raw.githubusercontent.com/devicons/devicon/master/icons/nodejs/nodejs-original.svg"
                alt="Node.js"
                class="h-6 w-6"
              />
              <span>Node.js</span>
            </div>
            <div class="flex items-center space-x-2 text-gray-300">
              <img
                src="https://raw.githubusercontent.com/devicons/devicon/master/icons/express/express-original.svg"
                alt="Express.js"
                class="h-6 w-6 filter invert"
              />
              <span>Express.js</span>
            </div>
            <div class="flex items-center space-x-2 text-gray-300">
              <img
                src="https://raw.githubusercontent.com/devicons/devicon/master/icons/mysql/mysql-original.svg"
                alt="MySQL"
                class="h-6 w-6"
              />
              <span>MySQL</span>
            </div>
            <div class="flex items-center space-x-2 text-gray-300">
              <img
                src="https://raw.githubusercontent.com/devicons/devicon/master/icons/redis/redis-original.svg"
                alt="Redis"
                class="h-6 w-6"
              />
              <span>Redis</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Bottom Footer -->
      <div
        class="py-6 border-t border-gray-800 flex flex-col md:flex-row items-center justify-between"
      >
        <div class="text-gray-400 text-sm mb-4 md:mb-0">
          © 2024 Altus 4. Open source project by
          <a
            href="https://thavarshan.com"
            target="_blank"
            rel="noopener noreferrer"
            class="text-white hover:text-blue-400 transition-colors"
            >Thavarshan</a
          >.
        </div>
        <div class="flex items-center space-x-6 text-sm text-gray-400">
          <a
            href="https://github.com/altus4/core/blob/main/LICENSE"
            target="_blank"
            rel="noopener noreferrer"
            class="hover:text-white transition-colors"
            >Apache 2.0 License</a
          >
          <a href="/privacy" class="hover:text-white transition-colors"
            >Privacy Policy</a
          >
          <a href="/terms" class="hover:text-white transition-colors"
            >Terms of Use</a
          >
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import AltusLogo from '@/components/ui/AltusLogo.vue';
import {
  Github as GitHubIcon,
  Linkedin as LinkedinIcon,
  Mail as MailIcon,
} from 'lucide-vue-next';
</script>
