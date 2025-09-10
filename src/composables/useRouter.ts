import { ref, computed } from 'vue';

export function useRouter() {
  const currentRoute = ref(window.location.pathname);

  const currentPage = computed(() => {
    switch (currentRoute.value) {
      case '/privacy':
        return 'privacy';
      case '/terms':
        return 'terms';
      case '/login':
        return 'login';
      case '/register':
        return 'register';
      case '/forgot-password':
        return 'forgot-password';
      case '/dashboard':
        return 'dashboard';
      default:
        return 'home';
    }
  });

  const handlePopState = () => {
    currentRoute.value = window.location.pathname;
  };

  const handleAnchorClick = (event: Event) => {
    const target = event.target as HTMLAnchorElement;
    const href = target.getAttribute('href');

    if (href?.startsWith('/#')) {
      event.preventDefault();
      const hash = href.substring(1);

      if (currentRoute.value !== '/') {
        window.history.pushState({}, '', '/');
        currentRoute.value = '/';

        setTimeout(() => {
          scrollToElement(hash);
        }, 100);
      } else {
        scrollToElement(hash);
      }
    } else if (href?.startsWith('#')) {
      event.preventDefault();
      scrollToElement(href);
    }
  };

  const scrollToElement = (hash: string) => {
    const element = document.querySelector(hash);
    if (element) {
      const navHeight = 64;
      const elementTop =
        element.getBoundingClientRect().top + window.scrollY - navHeight;
      window.scrollTo({
        top: elementTop,
        behavior: 'smooth',
      });
    }
  };

  const navigateTo = (path: string) => {
    window.history.pushState({}, '', path);
    currentRoute.value = path;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const setupRouting = () => {
    window.addEventListener('popstate', handlePopState);

    document.addEventListener('click', event => {
      const target = event.target as HTMLElement;
      const anchor = target.closest('a') as HTMLAnchorElement;

      if (anchor) {
        const href = anchor.getAttribute('href');

        if (href?.startsWith('#') || href?.startsWith('/#')) {
          handleAnchorClick(event);
        } else if (
          href === '/' ||
          href === '/privacy' ||
          href === '/terms' ||
          href === '/login' ||
          href === '/register' ||
          href === '/forgot-password' ||
          href === '/dashboard'
        ) {
          event.preventDefault();
          navigateTo(href);
        }
      }
    });
  };

  const cleanupRouting = () => {
    window.removeEventListener('popstate', handlePopState);
  };

  return {
    currentRoute,
    currentPage,
    navigateTo,
    setupRouting,
    cleanupRouting,
  };
}
