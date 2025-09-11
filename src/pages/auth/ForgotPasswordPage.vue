<template>
  <div
    class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8"
  >
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <div class="flex justify-center">
        <AltusLogo variant="dark" size="48" :animated="true" />
      </div>
      <h2
        class="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900"
      >
        Reset your password
      </h2>
      <p class="mt-2 text-center text-sm text-gray-600">
        Remember your password?
        <a
          href="/login"
          class="font-medium text-blue-600 hover:text-blue-500 transition-colors"
        >
          Sign in here
        </a>
      </p>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <Card class="py-8 px-4 shadow sm:rounded-lg sm:px-10">
        <div v-if="!emailSent">
          <p class="text-sm text-gray-600 mb-6">
            Enter your email address and we'll send you a link to reset your
            password.
          </p>

          <form class="space-y-6" @submit.prevent="handleSubmit">
            <Alert
              v-if="error"
              variant="destructive"
              :description="error"
              dismissible
              @dismiss="clearError"
            />

            <Input
              id="email"
              v-model="form.email"
              type="email"
              label="Email address"
              placeholder="Enter your email"
              required
              :error="fieldErrors.email"
              :disabled="isLoading"
            />

            <Button
              type="submit"
              class="w-full"
              :disabled="isLoading || !form.email"
            >
              <Loader2 v-if="isLoading" class="mr-2 h-4 w-4 animate-spin" />
              {{ isLoading ? 'Sending reset link...' : 'Send reset link' }}
            </Button>
          </form>
        </div>

        <div v-else class="text-center">
          <div
            class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4"
          >
            <CheckCircle class="h-6 w-6 text-green-600" />
          </div>

          <h3 class="text-lg font-medium text-gray-900 mb-2">
            Check your email
          </h3>

          <p class="text-sm text-gray-600 mb-6">
            We've sent a password reset link to
            <strong>{{ form.email }}</strong>
          </p>

          <div class="space-y-4">
            <Button
              variant="outline"
              class="w-full"
              :disabled="resendCooldown > 0 || isLoading"
              @click="resendEmail"
            >
              <Loader2 v-if="isLoading" class="mr-2 h-4 w-4 animate-spin" />
              <template v-else-if="resendCooldown > 0">
                Resend in {{ resendCooldown }}s
              </template>
              <template v-else> Resend email </template>
            </Button>

            <Button variant="ghost" class="w-full" @click="goBack">
              ← Back to login
            </Button>
          </div>
        </div>

        <div class="mt-6 text-center">
          <p class="text-xs text-gray-500">
            Didn't receive the email? Check your spam folder or
            <a href="/contact" class="text-blue-600 hover:text-blue-500"
              >contact support</a
            >
          </p>
        </div>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onUnmounted } from 'vue';
import { useAuth } from '@/composables/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert } from '@/components/ui/alert';
import { Card } from '@/components/ui/card';
import AltusLogo from '@/components/ui/AltusLogo.vue';
import { Loader2, CheckCircle } from 'lucide-vue-next';

const { forgotPassword, isLoading, error, clearError } = useAuth();

const form = reactive({
  email: '',
});

const fieldErrors = ref<Record<string, string>>({});
const emailSent = ref(false);
const resendCooldown = ref(0);
let resendTimer: ReturnType<typeof globalThis.setInterval> | null = null;

const startResendCooldown = () => {
  resendCooldown.value = 60; // 60 seconds cooldown
  resendTimer = globalThis.setInterval(() => {
    resendCooldown.value--;
    if (resendCooldown.value <= 0 && resendTimer) {
      globalThis.clearInterval(resendTimer);
      resendTimer = null;
    }
  }, 1000);
};

const handleSubmit = async () => {
  fieldErrors.value = {};

  if (!form.email) {
    return;
  }

  const result = await forgotPassword({
    email: form.email,
  });

  if (result.success) {
    emailSent.value = true;
    startResendCooldown();
  } else {
    const errs = (result as unknown as { errors?: Record<string, string[]> })
      .errors;
    if (errs && typeof errs === 'object') {
      fieldErrors.value = Object.fromEntries(
        Object.entries(errs).map(([key, arr]) => [key, arr?.[0] || ''])
      );
    }
  }
};

const resendEmail = async () => {
  if (resendCooldown.value > 0) return;

  const result = await forgotPassword({
    email: form.email,
  });

  if (result.success) {
    startResendCooldown();
  }
};

const goBack = () => {
  emailSent.value = false;
  form.email = '';
  fieldErrors.value = {};
  clearError();
};

onUnmounted(() => {
  if (resendTimer) {
    globalThis.clearInterval(resendTimer);
  }
});
</script>
