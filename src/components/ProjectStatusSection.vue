<template>
  <section class="py-16 md:py-24 bg-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Section Header -->
      <div class="mx-auto max-w-3xl text-center mb-16">
        <h2 class="text-3xl font-bold text-gray-900 sm:text-4xl mb-4">
          Why Teams Choose Altus 4
        </h2>
        <p class="text-xl text-gray-600">
          Faster time‑to‑value, simpler stack, and better relevance—while you
          keep data and costs under control.
        </p>
      </div>

      <!-- Status Grid -->
      <div class="grid gap-8 md:grid-cols-2 lg:grid-cols-4 mb-12">
        <!-- Time to Value -->
        <Card class="text-center border-l-4 border-l-green-500">
          <CardContent class="pt-6">
            <div class="mb-4">
              <div class="text-3xl font-bold text-green-600">Hours</div>
              <div class="text-sm text-gray-500 uppercase tracking-wide">
                Time‑to‑Value
              </div>
            </div>
            <div class="mb-4">
              <div class="w-full bg-gray-200 rounded-full h-2">
                <div
                  class="bg-green-600 h-2 rounded-full"
                  style="width: 85%"
                ></div>
              </div>
            </div>
            <p class="text-sm text-gray-600">Deploy in hours, not weeks</p>
          </CardContent>
        </Card>

        <!-- Simplicity -->
        <Card class="text-center border-l-4 border-l-green-500">
          <CardContent class="pt-6">
            <div class="mb-4">
              <div class="text-3xl font-bold text-green-600">MySQL</div>
              <div class="text-sm text-gray-500 uppercase tracking-wide">
                Simplicity
              </div>
            </div>
            <div class="mb-4">
              <div class="w-full bg-gray-200 rounded-full h-2">
                <div
                  class="bg-green-600 h-2 rounded-full"
                  style="width: 80%"
                ></div>
              </div>
            </div>
            <p class="text-sm text-gray-600">Stay on MySQL—no new cluster</p>
          </CardContent>
        </Card>

        <!-- Relevance -->
        <Card class="text-center border-l-4 border-l-purple-500">
          <CardContent class="pt-6">
            <div class="mb-4">
              <div class="text-3xl font-bold text-purple-600">AI+</div>
              <div class="text-sm text-gray-500 uppercase tracking-wide">
                Relevance
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
            <p class="text-sm text-gray-600">Semantic + keyword precision</p>
          </CardContent>
        </Card>

        <!-- Control -->
        <Card class="text-center border-l-4 border-l-blue-500">
          <CardContent class="pt-6">
            <div class="mb-4">
              <div class="text-3xl font-bold text-blue-600">Own</div>
              <div class="text-sm text-gray-500 uppercase tracking-wide">
                Control
              </div>
            </div>
            <div class="mb-4">
              <div class="w-full bg-gray-200 rounded-full h-2">
                <div
                  class="bg-blue-600 h-2 rounded-full"
                  style="width: 90%"
                ></div>
              </div>
            </div>
            <p class="text-sm text-gray-600">
              Keep data and costs in your control
            </p>
          </CardContent>
        </Card>
      </div>

      <!-- Development Timeline -->
      <div class="grid gap-8 lg:grid-cols-2">
        <!-- How It Works -->
        <Card>
          <CardHeader>
            <h3 class="text-xl font-semibold text-gray-900 flex items-center">
              <CheckCircleIcon class="h-6 w-6 text-green-500 mr-3" />
              How It Works
            </h3>
          </CardHeader>
          <CardContent>
            <div class="space-y-4">
              <div class="flex items-start space-x-3">
                <CheckIcon class="h-5 w-5 text-green-500 mt-0.5" />
                <div>
                  <p class="font-medium text-gray-900">Connect your MySQL</p>
                  <p class="text-sm text-gray-600">
                    Point Altus 4 at your existing DB
                  </p>
                </div>
              </div>
              <div class="flex items-start space-x-3">
                <CheckIcon class="h-5 w-5 text-green-500 mt-0.5" />
                <div>
                  <p class="font-medium text-gray-900">Enable AI when ready</p>
                  <p class="text-sm text-gray-600">
                    Use the OpenAI proxy for semantic relevance
                  </p>
                </div>
              </div>
              <div class="flex items-start space-x-3">
                <CheckIcon class="h-5 w-5 text-green-500 mt-0.5" />
                <div>
                  <p class="font-medium text-gray-900">Query via REST</p>
                  <p class="text-sm text-gray-600">
                    Call /api/v1/search and tune relevance
                  </p>
                </div>
              </div>
              <div class="flex items-start space-x-3">
                <CheckIcon class="h-5 w-5 text-green-500 mt-0.5" />
                <div>
                  <p class="font-medium text-gray-900">
                    Improve with analytics
                  </p>
                  <p class="text-sm text-gray-600">
                    Track zero‑result queries and iterate
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <!-- Common Use Cases -->
        <Card>
          <CardHeader>
            <h3 class="text-xl font-semibold text-gray-900 flex items-center">
              <ClockIcon class="h-6 w-6 text-blue-500 mr-3" />
              Common Use Cases
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
                    Ecommerce product search
                  </p>
                  <p class="text-sm text-gray-600">
                    Relevance tuning and synonyms
                  </p>
                </div>
              </div>
              <div class="flex items-start space-x-3">
                <div
                  class="h-5 w-5 rounded-full border-2 border-blue-300 mt-0.5"
                ></div>
                <div>
                  <p class="font-medium text-gray-900">
                    SaaS docs & help search
                  </p>
                  <p class="text-sm text-gray-600">
                    Better answers with AI context
                  </p>
                </div>
              </div>
              <div class="flex items-start space-x-3">
                <div
                  class="h-5 w-5 rounded-full border-2 border-blue-300 mt-0.5"
                ></div>
                <div>
                  <p class="font-medium text-gray-900">Knowledge bases</p>
                  <p class="text-sm text-gray-600">
                    Findability for internal tools
                  </p>
                </div>
              </div>
              <div class="flex items-start space-x-3">
                <div
                  class="h-5 w-5 rounded-full border-2 border-blue-300 mt-0.5"
                ></div>
                <div>
                  <p class="font-medium text-gray-900">App search</p>
                  <p class="text-sm text-gray-600">Content‑heavy products</p>
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
} from 'lucide-vue-next';
</script>
