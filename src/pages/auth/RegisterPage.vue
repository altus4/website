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
        Create your account
      </h2>
      <p class="mt-2 text-center text-sm text-gray-600">
        Or
        <a
          href="/login"
          class="font-medium text-blue-600 hover:text-blue-500 transition-colors"
        >
          sign in to your existing account
        </a>
      </p>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <Card class="py-8 px-4 shadow sm:rounded-lg sm:px-10">
        <form class="space-y-6" @submit.prevent="handleSubmit">
          <Alert
            v-if="error"
            variant="destructive"
            :description="error"
            dismissible
            @dismiss="clearError"
          />

          <Input
            id="name"
            v-model="form.name"
            type="text"
            label="Full name"
            placeholder="Enter your full name"
            required
            :error="fieldErrors.name"
            :disabled="isLoading"
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

          <Input
            id="password"
            v-model="form.password"
            type="password"
            label="Password"
            placeholder="Enter your password"
            required
            :error="fieldErrors.password"
            :disabled="isLoading"
            hint="Password must be at least 8 characters long"
          />

          <Input
            id="password_confirmation"
            v-model="form.password_confirmation"
            type="password"
            label="Confirm password"
            placeholder="Confirm your password"
            required
            :error="fieldErrors.password_confirmation || passwordMismatchError"
            :disabled="isLoading"
          />

          <div class="flex items-start">
            <div class="flex items-center h-5">
              <input
                id="terms"
                v-model="form.agreeToTerms"
                name="terms"
                type="checkbox"
                required
                class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
            </div>
            <div class="ml-3 text-sm">
              <label for="terms" class="text-gray-700">
                I agree to the
                <a
                  href="/terms"
                  class="text-blue-600 hover:text-blue-500 font-medium"
                >
                  Terms of Service
                </a>
                and
                <a
                  href="/privacy"
                  class="text-blue-600 hover:text-blue-500 font-medium"
                >
                  Privacy Policy
                </a>
              </label>
            </div>
          </div>

          <Button
            type="submit"
            class="w-full"
            :disabled="isLoading || !isFormValid"
          >
            <Loader2 v-if="isLoading" class="mr-2 h-4 w-4 animate-spin" />
            {{ isLoading ? 'Creating account...' : 'Create account' }}
          </Button>
        </form>

        <div class="mt-6">
          <div class="relative">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-gray-300" />
            </div>
            <div class="relative flex justify-center text-sm">
              <span class="px-2 bg-white text-gray-500">Or continue with</span>
            </div>
          </div>

          <div class="mt-6 grid grid-cols-2 gap-3">
            <Button variant="outline" class="w-full" disabled>
              <svg class="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Google
            </Button>

            <Button variant="outline" class="w-full" disabled>
              <Github class="w-5 h-5 mr-2" />
              GitHub
            </Button>
          </div>
        </div>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue';
import { useAuth } from '@/composables/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert } from '@/components/ui/alert';
import { Card } from '@/components/ui/card';
import AltusLogo from '@/components/ui/AltusLogo.vue';
import { Loader2, Github } from 'lucide-vue-next';

const { register, isLoading, error, clearError } = useAuth();

const form = reactive({
  name: '',
  email: '',
  password: '',
  password_confirmation: '',
  agreeToTerms: false,
});

const fieldErrors = ref<Record<string, string>>({});

const passwordMismatchError = computed(() => {
  if (
    form.password &&
    form.password_confirmation &&
    form.password !== form.password_confirmation
  ) {
    return 'Passwords do not match';
  }
  return '';
});

const isFormValid = computed(() => {
  return (
    form.name.length > 0 &&
    form.email.length > 0 &&
    form.password.length >= 8 &&
    form.password === form.password_confirmation &&
    form.agreeToTerms
  );
});

const handleSubmit = async () => {
  fieldErrors.value = {};

  if (!isFormValid.value) {
    return;
  }

  const result = await register({
    name: form.name,
    email: form.email,
    password: form.password,
  });

  if (result.success) {
    // Navigate to dashboard or redirect to intended page
    window.history.pushState({}, '', '/dashboard');
    window.location.reload(); // Simple way to update the app state
  } else if (result.errors) {
    fieldErrors.value = Object.fromEntries(
      Object.entries(result.errors).map(([key, errors]) => [key, errors[0]])
    );
  }
};
</script>
