<template>
  <section class="py-16 md:py-24 bg-gray-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Section Header -->
      <div class="mx-auto max-w-3xl text-center mb-16">
        <h2 class="text-3xl font-bold text-gray-900 sm:text-4xl mb-4">
          Technical Architecture
        </h2>
        <p class="text-xl text-gray-600">
          Built with modern technologies and best practices for scalability and maintainability.
        </p>
      </div>

      <div class="grid gap-12 lg:grid-cols-2">
        <!-- Architecture Diagram -->
        <div class="order-2 lg:order-1">
          <Card>
            <CardHeader>
              <h3 class="text-2xl font-semibold text-gray-900">System Architecture</h3>
            </CardHeader>
            <CardContent>
              <!-- Architecture Flow -->
              <div class="space-y-6">
                <!-- Client Layer -->
                <div class="flex items-center space-x-4">
                  <div class="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
                    <MonitorIcon class="h-6 w-6 text-blue-600" />
                  </div>
                  <div class="flex-1">
                    <h4 class="font-semibold text-gray-900">Client Applications</h4>
                    <p class="text-sm text-gray-600">Web, mobile, and API clients</p>
                  </div>
                </div>

                <!-- Arrow -->
                <div class="flex justify-center">
                  <ArrowDownIcon class="h-6 w-6 text-gray-400" />
                </div>

                <!-- API Layer -->
                <div class="flex items-center space-x-4">
                  <div class="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100">
                    <ServerIcon class="h-6 w-6 text-green-600" />
                  </div>
                  <div class="flex-1">
                    <h4 class="font-semibold text-gray-900">Express.js REST API</h4>
                    <p class="text-sm text-gray-600">JWT auth, rate limiting, validation</p>
                  </div>
                </div>

                <!-- Arrow -->
                <div class="flex justify-center">
                  <ArrowDownIcon class="h-6 w-6 text-gray-400" />
                </div>

                <!-- Search Engine -->
                <div class="flex items-center space-x-4">
                  <div class="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100">
                    <SearchIcon class="h-6 w-6 text-purple-600" />
                  </div>
                  <div class="flex-1">
                    <h4 class="font-semibold text-gray-900">Altus 4 Search Engine</h4>
                    <p class="text-sm text-gray-600">AI enhancement + MySQL full-text</p>
                  </div>
                </div>

                <!-- Data Layer -->
                <div class="grid grid-cols-2 gap-4 mt-6">
                  <div class="flex items-center space-x-3">
                    <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-100">
                      <DatabaseIcon class="h-5 w-5 text-orange-600" />
                    </div>
                    <div>
                      <h4 class="font-medium text-gray-900">MySQL</h4>
                      <p class="text-xs text-gray-600">Primary database</p>
                    </div>
                  </div>
                  <div class="flex items-center space-x-3">
                    <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-red-100">
                      <ZapIcon class="h-5 w-5 text-red-600" />
                    </div>
                    <div>
                      <h4 class="font-medium text-gray-900">Redis</h4>
                      <p class="text-xs text-gray-600">Caching layer</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <!-- Technical Details -->
        <div class="order-1 lg:order-2 space-y-8">
          <!-- Core Technologies -->
          <Card>
            <CardHeader>
              <h3 class="text-xl font-semibold text-gray-900">Core Technologies</h3>
            </CardHeader>
            <CardContent>
              <div class="space-y-3">
                <div class="flex items-center justify-between">
                  <span class="text-gray-700">Runtime</span>
                  <span class="font-medium text-gray-900">Node.js</span>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-gray-700">Language</span>
                  <span class="font-medium text-gray-900">TypeScript</span>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-gray-700">Web Framework</span>
                  <span class="font-medium text-gray-900">Express.js</span>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-gray-700">Database</span>
                  <span class="font-medium text-gray-900">MySQL 8.0+</span>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-gray-700">Cache</span>
                  <span class="font-medium text-gray-900">Redis</span>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-gray-700">AI Provider</span>
                  <span class="font-medium text-gray-900">OpenAI API</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <!-- Security Features -->
          <Card>
            <CardHeader>
              <h3 class="text-xl font-semibold text-gray-900">Security Features</h3>
            </CardHeader>
            <CardContent>
              <div class="space-y-3">
                <div class="flex items-start space-x-3">
                  <CheckIcon class="h-5 w-5 text-green-500 mt-0.5" />
                  <div>
                    <p class="font-medium text-gray-900">JWT Authentication</p>
                    <p class="text-sm text-gray-600">Secure token-based authentication</p>
                  </div>
                </div>
                <div class="flex items-start space-x-3">
                  <CheckIcon class="h-5 w-5 text-green-500 mt-0.5" />
                  <div>
                    <p class="font-medium text-gray-900">Password Encryption</p>
                    <p class="text-sm text-gray-600">bcrypt hashing with salt rounds</p>
                  </div>
                </div>
                <div class="flex items-start space-x-3">
                  <CheckIcon class="h-5 w-5 text-green-500 mt-0.5" />
                  <div>
                    <p class="font-medium text-gray-900">Input Validation</p>
                    <p class="text-sm text-gray-600">Request sanitization and validation</p>
                  </div>
                </div>
                <div class="flex items-start space-x-3">
                  <CheckIcon class="h-5 w-5 text-green-500 mt-0.5" />
                  <div>
                    <p class="font-medium text-gray-900">Rate Limiting</p>
                    <p class="text-sm text-gray-600">API rate limiting and throttling</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <!-- Performance Metrics -->
          <Card>
            <CardHeader>
              <h3 class="text-xl font-semibold text-gray-900">Performance</h3>
            </CardHeader>
            <CardContent>
              <div class="grid grid-cols-2 gap-4">
                <div class="text-center">
                  <div class="text-2xl font-bold text-blue-600">85%</div>
                  <div class="text-sm text-gray-600">Project Complete</div>
                </div>
                <div class="text-center">
                  <div class="text-2xl font-bold text-green-600">87.15%</div>
                  <div class="text-sm text-gray-600">Test Coverage</div>
                </div>
                <div class="text-center">
                  <div class="text-2xl font-bold text-purple-600">&lt;100ms</div>
                  <div class="text-sm text-gray-600">Search Response</div>
                </div>
                <div class="text-center">
                  <div class="text-2xl font-bold text-orange-600">99.9%</div>
                  <div class="text-sm text-gray-600">Uptime Target</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import {
  Monitor as MonitorIcon,
  Server as ServerIcon,
  Search as SearchIcon,
  Database as DatabaseIcon,
  Zap as ZapIcon,
  ArrowDown as ArrowDownIcon,
  Check as CheckIcon
} from 'lucide-vue-next'
</script>
