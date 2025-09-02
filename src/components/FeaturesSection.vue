<template>
  <section class="py-16 md:py-24 bg-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Section Header -->
      <div class="mx-auto max-w-3xl text-center mb-16">
        <h2 class="text-3xl font-bold text-gray-900 sm:text-4xl mb-4">
          Production-Ready Features
        </h2>
        <p class="text-xl text-gray-600">
          Fully implemented and tested features ready for enterprise deployment with comprehensive security and monitoring.
        </p>
      </div>

      <!-- Features Grid -->
      <div class="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        <!-- AI Enhancement -->
        <Card class="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div class="mb-4">
              <div class="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600">
                <BrainIcon class="h-6 w-6 text-white" />
              </div>
            </div>
            <h3 class="text-xl font-semibold text-gray-900">AI-Enhanced Search</h3>
          </CardHeader>
          <CardContent>
            <p class="text-gray-600 mb-4">
              Leverage OpenAI API integration to enhance search results with semantic understanding and contextual relevance.
            </p>
            <div class="flex items-center text-sm text-blue-600 font-medium">
              <CheckIcon class="h-4 w-4 mr-2" />
              Semantic search capabilities
            </div>
          </CardContent>
        </Card>

        <!-- Performance -->
        <Card class="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div class="mb-4">
              <div class="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-green-500 to-emerald-600">
                <ZapIcon class="h-6 w-6 text-white" />
              </div>
            </div>
            <h3 class="text-xl font-semibold text-gray-900">High Performance</h3>
          </CardHeader>
          <CardContent>
            <p class="text-gray-600 mb-4">
              Optimized MySQL full-text search with Redis caching for lightning-fast query responses and scalability.
            </p>
            <div class="flex items-center text-sm text-green-600 font-medium">
              <CheckIcon class="h-4 w-4 mr-2" />
              Redis caching layer
            </div>
          </CardContent>
        </Card>

        <!-- Security -->
        <Card class="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div class="mb-4">
              <div class="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-violet-600">
                <ShieldIcon class="h-6 w-6 text-white" />
              </div>
            </div>
            <h3 class="text-xl font-semibold text-gray-900">Enterprise Security</h3>
          </CardHeader>
          <CardContent>
            <p class="text-gray-600 mb-4">
              Production-ready API key authentication system, bcrypt password hashing, and secure API endpoints for B2B service integration.
            </p>
            <div class="flex items-center text-sm text-purple-600 font-medium">
              <CheckIcon class="h-4 w-4 mr-2" />
              API Key & bcrypt security
            </div>
          </CardContent>
        </Card>

        <!-- Database Integration -->
        <Card class="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div class="mb-4">
              <div class="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-orange-500 to-red-600">
                <DatabaseIcon class="h-6 w-6 text-white" />
              </div>
            </div>
            <h3 class="text-xl font-semibold text-gray-900">MySQL Integration</h3>
          </CardHeader>
          <CardContent>
            <p class="text-gray-600 mb-4">
              Native MySQL full-text search capabilities with advanced indexing and query optimization for complex searches.
            </p>
            <div class="flex items-center text-sm text-orange-600 font-medium">
              <CheckIcon class="h-4 w-4 mr-2" />
              Full-text indexing
            </div>
          </CardContent>
        </Card>

        <!-- Developer Experience -->
        <Card class="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div class="mb-4">
              <div class="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-teal-500 to-cyan-600">
                <CodeIcon class="h-6 w-6 text-white" />
              </div>
            </div>
            <h3 class="text-xl font-semibold text-gray-900">Developer Friendly</h3>
          </CardHeader>
          <CardContent>
            <p class="text-gray-600 mb-4">
              TypeScript-first approach with comprehensive testing, clear documentation, and Express.js REST API.
            </p>
            <div class="flex items-center text-sm text-teal-600 font-medium">
              <CheckIcon class="h-4 w-4 mr-2" />
              TypeScript & REST API
            </div>
          </CardContent>
        </Card>

        <!-- Production Ready -->
        <Card class="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div class="mb-4">
              <div class="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-rose-500 to-pink-600">
                <RocketIcon class="h-6 w-6 text-white" />
              </div>
            </div>
            <h3 class="text-xl font-semibold text-gray-900">Production Ready</h3>
          </CardHeader>
          <CardContent>
            <p class="text-gray-600 mb-4">
              100% test pass rate with 508 comprehensive unit and integration tests across 21 test suites ensures reliability in production environments.
            </p>
            <div class="flex items-center text-sm text-rose-600 font-medium">
              <CheckIcon class="h-4 w-4 mr-2" />
              100% test pass rate (508 tests)
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
  Brain as BrainIcon,
  Zap as ZapIcon,
  Shield as ShieldIcon,
  Database as DatabaseIcon,
  Code as CodeIcon,
  Rocket as RocketIcon,
  Check as CheckIcon
} from 'lucide-vue-next';
</script>
