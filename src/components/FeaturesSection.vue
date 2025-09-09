<template>
  <section class="py-16 md:py-24 bg-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Section Header -->
      <div class="mx-auto max-w-3xl text-center mb-16">
        <h2 class="text-3xl font-bold text-gray-900 sm:text-4xl mb-4">
          Benefits That Drive Adoption
        </h2>
        <p class="text-xl text-gray-600">
          Ship AI‑quality search without a costly migration. Keep MySQL, reduce
          complexity, and deliver better results—fast.
        </p>
      </div>

      <!-- Features Grid -->
      <div class="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        <!-- AI Enhancement -->
        <Card class="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div class="mb-4">
              <div
                class="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600"
              >
                <BrainIcon class="h-6 w-6 text-white" />
              </div>
            </div>
            <h3 class="text-xl font-semibold text-gray-900">
              AI Relevance, Safely
            </h3>
          </CardHeader>
          <CardContent>
            <p class="text-gray-600 mb-4">
              Semantic expansion and intent detection via an OpenAI proxy with
              built‑in timeouts and robust error handling.
            </p>
            <div class="flex items-center text-sm text-blue-600 font-medium">
              <CheckIcon class="h-4 w-4 mr-2" />
              Semantic + intent recognition
            </div>
          </CardContent>
        </Card>

        <!-- Performance -->
        <Card class="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div class="mb-4">
              <div
                class="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-green-500 to-emerald-600"
              >
                <ZapIcon class="h-6 w-6 text-white" />
              </div>
            </div>
            <h3 class="text-xl font-semibold text-gray-900">
              Lower Total Cost
            </h3>
          </CardHeader>
          <CardContent>
            <p class="text-gray-600 mb-4">
              Stay on MySQL—avoid running and tuning a separate search cluster.
              Use caching to scale without complexity.
            </p>
            <div class="flex items-center text-sm text-green-600 font-medium">
              <CheckIcon class="h-4 w-4 mr-2" />
              Reduce infra and ops overhead
            </div>
          </CardContent>
        </Card>

        <!-- Security -->
        <Card class="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div class="mb-4">
              <div
                class="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-violet-600"
              >
                <ShieldIcon class="h-6 w-6 text-white" />
              </div>
            </div>
            <h3 class="text-xl font-semibold text-gray-900">
              Enterprise Security
            </h3>
          </CardHeader>
          <CardContent>
            <p class="text-gray-600 mb-4">
              API keys with scoped permissions, tiered rate limits, bcrypt, and
              auditable logs for B2B service access.
            </p>
            <div class="flex items-center text-sm text-purple-600 font-medium">
              <CheckIcon class="h-4 w-4 mr-2" />
              Scoped permissions & tiered limits
            </div>
          </CardContent>
        </Card>

        <!-- Database Integration -->
        <Card class="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div class="mb-4">
              <div
                class="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-orange-500 to-red-600"
              >
                <DatabaseIcon class="h-6 w-6 text-white" />
              </div>
            </div>
            <h3 class="text-xl font-semibold text-gray-900">
              No‑Migration Setup
            </h3>
          </CardHeader>
          <CardContent>
            <p class="text-gray-600 mb-4">
              Works with your existing schema and FULLTEXT. Deploy in hours—not
              weeks.
            </p>
            <div class="flex items-center text-sm text-orange-600 font-medium">
              <CheckIcon class="h-4 w-4 mr-2" />
              Zero data migration
            </div>
          </CardContent>
        </Card>

        <!-- Developer Experience -->
        <Card class="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div class="mb-4">
              <div
                class="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-teal-500 to-cyan-600"
              >
                <CodeIcon class="h-6 w-6 text-white" />
              </div>
            </div>
            <h3 class="text-xl font-semibold text-gray-900">
              Developer Experience
            </h3>
          </CardHeader>
          <CardContent>
            <p class="text-gray-600 mb-4">
              REST API + TypeScript, one‑command Docker dev, and comprehensive
              docs under /docs. Open source and self‑hosted.
            </p>
            <div class="flex items-center text-sm text-teal-600 font-medium">
              <CheckIcon class="h-4 w-4 mr-2" />
              Quick start at /docs/setup/quickstart
            </div>
          </CardContent>
        </Card>

        <!-- Production Ready -->
        <Card class="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div class="mb-4">
              <div
                class="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-rose-500 to-pink-600"
              >
                <RocketIcon class="h-6 w-6 text-white" />
              </div>
            </div>
            <h3 class="text-xl font-semibold text-gray-900">
              Search Analytics
            </h3>
          </CardHeader>
          <CardContent>
            <p class="text-gray-600 mb-4">
              Track zero‑result queries and usage patterns to continuously
              improve relevance.
            </p>
            <div class="flex items-center text-sm text-rose-600 font-medium">
              <CheckIcon class="h-4 w-4 mr-2" />
              Built‑in analytics endpoints
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
  Check as CheckIcon,
} from 'lucide-vue-next';
</script>
