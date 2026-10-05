// Helpers for returning the user to the page they were on before a social
// (or email/password) login flow. NextAuth's `redirect` callback in this
// project forces every social sign-in through /auth/social-callback, which
// then needs to know where to send the user next.
//
// We persist the desired return URL in localStorage right before kicking off
// signIn(), and the social-callback page (or any post-login code) reads and
// consumes it.

const REDIRECT_KEY = "furnmasr_post_login_redirect";

const isSafeInternalPath = (value: string): boolean => {
  // Only accept same-origin paths to avoid open-redirect issues.
  return value.startsWith("/") && !value.startsWith("//");
};

export const postLoginRedirect = {
  // Save the current URL (path + query + hash) so we can come back to it.
  capture: (override?: string): void => {
    if (typeof window === "undefined") return;
    try {
      const target =
        override ??
        window.location.pathname + window.location.search + window.location.hash;
      if (!isSafeInternalPath(target)) return;
      // Don't try to "return to" the auth callback itself.
      if (target.startsWith("/auth/social-callback")) return;
      localStorage.setItem(REDIRECT_KEY, target);
    } catch {
      // ignore storage errors
    }
  },

  // Read the saved URL without clearing it. Use this if you want to check
  // before deciding to navigate.
  peek: (): string | null => {
    if (typeof window === "undefined") return null;
    try {
      const value = localStorage.getItem(REDIRECT_KEY);
      if (!value) return null;
      return isSafeInternalPath(value) ? value : null;
    } catch {
      return null;
    }
  },

  // Read the saved URL and remove it from storage in one step.
  consume: (fallback: string = "/"): string => {
    if (typeof window === "undefined") return fallback;
    try {
      const value = localStorage.getItem(REDIRECT_KEY);
      localStorage.removeItem(REDIRECT_KEY);
      if (value && isSafeInternalPath(value)) return value;
      return fallback;
    } catch {
      return fallback;
    }
  },

  clear: (): void => {
    if (typeof window === "undefined") return;
    try {
      localStorage.removeItem(REDIRECT_KEY);
    } catch {
      // ignore
    }
  },
};
