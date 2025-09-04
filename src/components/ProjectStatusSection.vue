<template>
  <section class="py-16 md:py-24 bg-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Section Header -->
      <div class="mx-auto max-w-3xl text-center mb-16">
        <h2 class="text-3xl font-bold text-gray-900 sm:text-4xl mb-4">
          Project Status & Metrics
        </h2>
        <p class="text-xl text-gray-600">
          Real-time insights into development progress, code quality, and
          production readiness.
        </p>
      </div>

      <!-- Status Grid -->
      <div class="grid gap-8 md:grid-cols-2 lg:grid-cols-4 mb-12">
        <!-- Core Complete -->
        <Card class="text-center border-l-4 border-l-green-500">
          <CardContent class="pt-6">
            <div class="mb-4">
              <div class="text-3xl font-bold text-green-600">100%</div>
              <div class="text-sm text-gray-500 uppercase tracking-wide">
                Core Features
              </div>
            </div>
            <div class="mb-4">
              <div class="w-full bg-gray-200 rounded-full h-2">
                <div
                  class="bg-green-600 h-2 rounded-full"
                  style="width: 100%"
                ></div>
              </div>
            </div>
            <p class="text-sm text-gray-600">
              Search engine & AI integration complete
            </p>
          </CardContent>
        </Card>

        <!-- Test Coverage -->
        <Card class="text-center border-l-4 border-l-green-500">
          <CardContent class="pt-6">
            <div class="mb-4">
              <div class="text-3xl font-bold text-green-600">100%</div>
              <div class="text-sm text-gray-500 uppercase tracking-wide">
                Test Pass Rate
              </div>
            </div>
            <div class="mb-4">
              <div class="w-full bg-gray-200 rounded-full h-2">
                <div
                  class="bg-green-600 h-2 rounded-full"
                  style="width: 100%"
                ></div>
              </div>
            </div>
            <p class="text-sm text-gray-600">508 tests across 21 test suites</p>
          </CardContent>
        </Card>

        <!-- Code Quality -->
        <Card class="text-center border-l-4 border-l-purple-500">
          <CardContent class="pt-6">
            <div class="mb-4">
              <div class="text-3xl font-bold text-purple-600">A+</div>
              <div class="text-sm text-gray-500 uppercase tracking-wide">
                Code Grade
              </div>
            </div>
            <div class="mb-4">
              <div class="flex justify-center space-x-1">
                <StarIcon class="h-4 w-4 text-yellow-400 fill-current" />
                <StarIcon class="h-4 w-4 text-yellow-400 fill-current" />
                <StarIcon class="h-4 w-4 text-yellow-400 fill-current" />
                <StarIcon class="h-4 w-4 text-yellow-400 fill-current" />
                <StarIcon class="h-4 w-4 text-yellow-400 fill-current" />
              </div>
            </div>
            <p class="text-sm text-gray-600">
              TypeScript, ESLint, best practices
            </p>
          </CardContent>
        </Card>

        <!-- Enterprise Features -->
        <Card class="text-center border-l-4 border-l-blue-500">
          <CardContent class="pt-6">
            <div class="mb-4">
              <div class="text-3xl font-bold text-blue-600">60%</div>
              <div class="text-sm text-gray-500 uppercase tracking-wide">
                Enterprise
              </div>
            </div>
            <div class="mb-4">
              <div class="w-full bg-gray-200 rounded-full h-2">
                <div
                  class="bg-blue-600 h-2 rounded-full"
                  style="width: 60%"
                ></div>
              </div>
            </div>
            <p class="text-sm text-gray-600">
              Advanced features & integrations
            </p>
          </CardContent>
        </Card>
      </div>

      <!-- Development Timeline -->
      <div class="grid gap-8 lg:grid-cols-2">
        <!-- Completed Features -->
        <Card>
          <CardHeader>
            <h3 class="text-xl font-semibold text-gray-900 flex items-center">
              <CheckCircleIcon class="h-6 w-6 text-green-500 mr-3" />
              Completed Features
            </h3>
          </CardHeader>
          <CardContent>
            <div class="space-y-4">
              <div class="flex items-start space-x-3">
                <CheckIcon class="h-5 w-5 text-green-500 mt-0.5" />
                <div>
                  <p class="font-medium text-gray-900">
                    MySQL Full-Text Search Engine
                  </p>
                  <p class="text-sm text-gray-600">
                    Core search functionality with indexing
                  </p>
                </div>
              </div>
              <div class="flex items-start space-x-3">
                <CheckIcon class="h-5 w-5 text-green-500 mt-0.5" />
                <div>
                  <p class="font-medium text-gray-900">
                    AI Enhancement Integration
                  </p>
                  <p class="text-sm text-gray-600">
                    OpenAI API for semantic search
                  </p>
                </div>
              </div>
              <div class="flex items-start space-x-3">
                <CheckIcon class="h-5 w-5 text-green-500 mt-0.5" />
                <div>
                  <p class="font-medium text-gray-900">Redis Caching Layer</p>
                  <p class="text-sm text-gray-600">
                    Performance optimization with cache
                  </p>
                </div>
              </div>
              <div class="flex items-start space-x-3">
                <CheckIcon class="h-5 w-5 text-green-500 mt-0.5" />
                <div>
                  <p class="font-medium text-gray-900">
                    API Key Authentication System
                  </p>
                  <p class="text-sm text-gray-600">
                    Production-ready B2B service authentication with tiered
                    permissions
                  </p>
                </div>
              </div>
              <div class="flex items-start space-x-3">
                <CheckIcon class="h-5 w-5 text-green-500 mt-0.5" />
                <div>
                  <p class="font-medium text-gray-900">Express.js REST API</p>
                  <p class="text-sm text-gray-600">
                    RESTful endpoints with validation
                  </p>
                </div>
              </div>
              <div class="flex items-start space-x-3">
                <CheckIcon class="h-5 w-5 text-green-500 mt-0.5" />
                <div>
                  <p class="font-medium text-gray-900">
                    Commit Verification System
                  </p>
                  <p class="text-sm text-gray-600">
                    GPG signing with automated security auditing
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <!-- Upcoming Features -->
        <Card>
          <CardHeader>
            <h3 class="text-xl font-semibold text-gray-900 flex items-center">
              <ClockIcon class="h-6 w-6 text-blue-500 mr-3" />
              Upcoming Features
            </h3>
          </CardHeader>
          <CardContent>
            <div class="space-y-4">
              <div class="flex items-start space-x-3">
                <div
                  class="h-5 w-5 rounded-full border-2 border-blue-300 mt-0.5"
                ></div>
                <div>
                  <p class="font-medium text-gray-900">
                    Advanced Search Filters
                  </p>
                  <p class="text-sm text-gray-600">
                    Date ranges, categories, custom fields
                  </p>
                </div>
              </div>
              <div class="flex items-start space-x-3">
                <div
                  class="h-5 w-5 rounded-full border-2 border-blue-300 mt-0.5"
                ></div>
                <div>
                  <p class="font-medium text-gray-900">
                    Real-time Search Suggestions
                  </p>
                  <p class="text-sm text-gray-600">
                    Auto-complete and query suggestions
                  </p>
                </div>
              </div>
              <div class="flex items-start space-x-3">
                <div
                  class="h-5 w-5 rounded-full border-2 border-blue-300 mt-0.5"
                ></div>
                <div>
                  <p class="font-medium text-gray-900">Analytics Dashboard</p>
                  <p class="text-sm text-gray-600">
                    Search metrics and performance insights
                  </p>
                </div>
              </div>
              <div class="flex items-start space-x-3">
                <div
                  class="h-5 w-5 rounded-full border-2 border-blue-300 mt-0.5"
                ></div>
                <div>
                  <p class="font-medium text-gray-900">
                    Multi-language Support
                  </p>
                  <p class="text-sm text-gray-600">
                    International search capabilities
                  </p>
                </div>
              </div>
              <div class="flex items-start space-x-3">
                <div
                  class="h-5 w-5 rounded-full border-2 border-blue-300 mt-0.5"
                ></div>
                <div>
                  <p class="font-medium text-gray-900">
                    Docker Containerization
                  </p>
                  <p class="text-sm text-gray-600">
                    Easy deployment and scaling
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <!-- Development Phases -->
      <div class="mt-12">
        <Card>
          <CardHeader>
            <h3 class="text-xl font-semibold text-gray-900 text-center">
              Development Phases
            </h3>
          </CardHeader>
          <CardContent>
            <div
              class="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-8"
            >
              <div class="flex items-center space-x-3">
                <div
                  class="flex h-10 w-10 items-center justify-center rounded-full bg-green-100"
                >
                  <CheckIcon class="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p class="font-medium text-gray-900">Phase 1 & 2</p>
                  <p class="text-sm text-gray-600">Core + AI (Complete)</p>
                </div>
              </div>
              <ArrowRightIcon
                class="h-6 w-6 text-gray-400 rotate-90 md:rotate-0"
              />
              <div class="flex items-center space-x-3">
                <div
                  class="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100"
                >
                  <ClockIcon class="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p class="font-medium text-gray-900">Phase 3</p>
                  <p class="text-sm text-gray-600">Advanced (60% Done)</p>
                </div>
              </div>
              <ArrowRightIcon
                class="h-6 w-6 text-gray-400 rotate-90 md:rotate-0"
              />
              <div class="flex items-center space-x-3">
                <div
                  class="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100"
                >
                  <RocketIcon class="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p class="font-medium text-gray-900">Phase 4</p>
                  <p class="text-sm text-gray-600">Enterprise (In Progress)</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import {
  Star as StarIcon,
  CheckCircle as CheckCircleIcon,
  Check as CheckIcon,
  Clock as ClockIcon,
  ArrowRight as ArrowRightIcon,
  Rocket as RocketIcon,
} from 'lucide-vue-next';
</script>
