import { ref } from 'vue';

const intendedRoute = ref<string | null>(null);

export function useRedirect() {
  const setIntendedRoute = (route: string) => {
    intendedRoute.value = route;
  };

  const getIntendedRoute = () => {
    const route = intendedRoute.value;
    intendedRoute.value = null; // Clear after getting
    return route;
  };

  const redirectAfterLogin = () => {
    const intended = getIntendedRoute();
    const destination = intended || '/dashboard';

    window.history.pushState({}, '', destination);
    window.location.reload();
  };

  return {
    setIntendedRoute,
    getIntendedRoute,
    redirectAfterLogin,
  };
}
