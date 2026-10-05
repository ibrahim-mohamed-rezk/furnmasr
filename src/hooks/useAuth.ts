import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api, LoginData, RegisterData, UserData } from "@/lib/api";
import { authStorage, authCookies } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTranslation } from "./useTranslation";
import { simpleSession } from "@/lib/simpleSession";
import { captureAnonymousCart, replayCartAfterLogin } from "@/lib/cartMerge";
import {
  identifyUser,
  trackCompleteRegistration,
} from "@/lib/tiktokPixel";
import Cookies from "js-cookie";

// Initialize auth data on page load
export const useInitializeAuth = () => {
  useEffect(() => {
    // Initialize auth data when component mounts
    authStorage.initializeAuth();
  }, []);
};

// Login hook
export const useLogin = (successText: string, errorText: string) => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { language } = useLanguage();

  return useMutation({
    mutationFn: async (data: LoginData) => {
      try {
        // Get session ID if user is anonymous
        const sessionId = simpleSession.getSessionId();
        const additionalData = sessionId
          ? { session_id: parseInt(sessionId.replace("anon_", "")) }
          : undefined;

        // Snapshot the guest cart before authenticating so we can replay it.
        const capturedCart = await captureAnonymousCart(language);

        const response = await api.login(data, language, additionalData);

        if (response.status) {
          // Set the token now so the cart replay runs as the authenticated
          // user. replayCartAfterLogin re-adds the captured guest cart and
          // clears the anonymous session when done.
          authCookies.setToken(response.token);
          await replayCartAfterLogin(language, capturedCart);
        }

        return response;
      } catch (error) {
        const errorMsg = (error as Error).message || "Login failed";
        toast.error(errorMsg);
        throw error;
      }
    },
    onSuccess: async (response) => {
      if (response.status) {
        // Save user data to localStorage
        authStorage.setUserData(response.data.user_data);

        // Save token to both localStorage and cookies
        // authStorage.setToken(response.token);
        authCookies.setToken(response.token);

        // Show success message
        toast.success(successText || "Login successful!");

        // TikTok identify (hashed PII). Awaited so the SHA-256 hashing
        // completes before the page reload below tears down this context.
        const u = response.data.user_data;
        await identifyUser({
          email: u?.email,
          phone_number: u?.phone,
          external_id: u?.id,
        });

        // Invalidate and refetch user-related queries
        queryClient.invalidateQueries({ queryKey: ["user"] });
        queryClient.invalidateQueries({ queryKey: ["cart"] });

        // Reload the page
        window.location.reload();
      } else {
        toast.error(errorText || "Login failed");
      }
    },
    onError: (error) => {
      console.error("Login error:", error);
    },
  });
};

// Register hook
export const useRegister = (successText: string, errorText: string) => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { language } = useLanguage();

  return useMutation({
    mutationFn: async (data: RegisterData) => {
      try {
        // Get session ID if user is anonymous
        const sessionId = simpleSession.getSessionId();
        const additionalData = sessionId
          ? { session_id: parseInt(sessionId.replace("anon_", "")) }
          : undefined;

        // Snapshot the guest cart before authenticating so we can replay it.
        const capturedCart = await captureAnonymousCart(language);

        const response = await api.register(data, language, additionalData);

        if (response.status) {
          // Set the token now so the cart replay runs as the authenticated
          // user. replayCartAfterLogin re-adds the captured guest cart and
          // clears the anonymous session when done.
          authCookies.setToken(response.token);
          await replayCartAfterLogin(language, capturedCart);
        }

        return response;
      } catch (error) {
        const errorMsg = (error as Error).message || "Registration failed";
        toast.error(errorMsg);
        throw error;
      }
    },
    onSuccess: async (response) => {
      if (response.status) {
        // Save user data to localStorage
        authStorage.setUserData(response.data.user_data);

        // Save token to both localStorage and cookies
        // authStorage.setToken(response.token);
        authCookies.setToken(response.token);

        // Show success message
        toast.success(successText || "Registration successful!");

        // TikTok identify + CompleteRegistration. Awaited so the SHA-256
        // hashing completes before the page reload below.
        const u = response.data.user_data;
        await identifyUser({
          email: u?.email,
          phone_number: u?.phone,
          external_id: u?.id,
        });
        trackCompleteRegistration();

        // Invalidate and refetch user-related queries
        queryClient.invalidateQueries({ queryKey: ["user"] });

        // Redirect to home page or dashboard
        window.location.reload();
      } else {
        toast.error(errorText || "Registration failed");
      }
    },
    onError: (error) => {
      console.error("Registration error:", error);
    },
  });
};

// Logout hook
export const useLogout = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { language } = useLanguage();
  const { t } = useTranslation();
  return useMutation({
    mutationFn: async () => {
      try {
        const response = await api.logout(language);
        return response;
      } catch (error) {
        // Even if API call fails, we should still clear local data
        return { status: true, msg: "Logged out successfully" };
      }
    },
    onSuccess: () => {
      // Clear all auth data
      authStorage.clearAuth();
      authCookies.removeToken();
      Cookies.remove("next-auth.callback-url");
      Cookies.remove("next-auth.csrf-token");
      Cookies.remove("next-auth.session-token");

      // Show success message
      toast.success(t("auth.logout_successful"));

      // Invalidate all queries
      queryClient.clear();

      // Redirect to login page
      window.location.href = "/";
    },
    onError: (error) => {
      // Even if there's an error, clear local data
      // authStorage.clearAuth();
      // authCookies.removeToken();
      // queryClient.clear();
      // window.location.href = '/auth';
      toast.error(t("auth.logout_failed"));
    },
  });
};

// Get current user hook
export const useCurrentUser = () => {
  const user = authStorage.getUserData();
  const token = authStorage.getToken() || authCookies.getToken();

  return {
    user,
    token,
    isAuthenticated: !!(user && token),
  };
};

// Update profile hook
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  const { language } = useLanguage();
  return useMutation({
    mutationFn: async (data: {
      name: string;
      email: string;
      phone: string;
    }) => {
      const response = await api.post("/users", data, undefined, language);
      if (!response.status) {
        throw new Error(response.msg || "Failed to update profile");
      }
      return response;
    },
    onSuccess: (response, variables) => {
      if (typeof window !== "undefined") {
        toast.success("Profile updated successfully");

        // Update localStorage with the new user data
        const currentUser = authStorage.getUserData();
        if (currentUser) {
          const updatedUser = {
            ...currentUser,
            name: variables.name,
            email: variables.email,
            phone: variables.phone,
          };
          authStorage.setUserData(updatedUser);
        }
      }
      queryClient.invalidateQueries({ queryKey: ["user-profile"] });
    },
    onError: (error) => {
      if (typeof window !== "undefined") {
        toast.error((error as Error).message || "Failed to update profile");
      }
    },
  });
};

// Change password hook
export const useChangePassword = () => {
  const { language } = useLanguage();
  const { t } = useTranslation();
  return useMutation({
    mutationFn: async (data: {
      email: string;
      password: string;
      password_confirmation: string;
      current_password: string;
    }) => {
      const response = await api.post("/users", data, undefined, language);
      if (!response.status) {
        throw new Error(response.msg || "Failed to change password");
      }
      return response;
    },
    onSuccess: () => {
      if (typeof window !== "undefined") {
        toast.success(t("auth.password_changed_successfully"));
      }
    },
    onError: (error) => {
      if (typeof window !== "undefined") {
        toast.error((error as Error).message || "Failed to change password");
      }
    },
  });
};

// Forgot password: send OTP to email
export const useForgetPassword = () => {
  const { language } = useLanguage();
  const { t } = useTranslation();
  return useMutation({
    mutationFn: async (data: { email: string }) => {
      const response = await api.post(
        "/forget-password",
        data,
        undefined,
        language
      );
      if (!response.status) {
        throw new Error(response.msg || "Failed to send OTP");
      }
      return response;
    },
    onSuccess: (res) => {
      if (typeof window !== "undefined") {
        toast.success(t("auth.otp_sent_successfully"));
      }
    },
    onError: (error) => {
      if (typeof window !== "undefined") {
        toast.error((error as Error).message || "Failed to send OTP");
      }
    },
  });
};

// Validate OTP
export const useValidateOtp = () => {
  const { language } = useLanguage();
  const { t } = useTranslation();
  return useMutation({
    mutationFn: async (data: { email: string; otp: string }) => {
      const response = await api.post(
        "/validate-otp",
        data,
        undefined,
        language
      );
      if (!response.status) {
        throw new Error(response.msg || "Invalid OTP");
      }
      return response;
    },
    onSuccess: (res) => {
      if (typeof window !== "undefined") {
        toast.success(t("auth.otp_verified_successfully"));
      }
    },
    onError: (error) => {
      if (typeof window !== "undefined") {
        toast.error((error as Error).message || "Invalid OTP");
      }
    },
  });
};

// Reset password using email + new password
export const useResetPassword = () => {
  const { language } = useLanguage();
  const { t } = useTranslation();
  return useMutation({
    mutationFn: async (data: {
      email: string;
      password: string;
      password_confirmation: string;
    }) => {
      const response = await api.post(
        "/reset-password",
        data,
        undefined,
        language
      );
      if (!response.status) {
        throw new Error(response.msg || "Failed to reset password");
      }
      return response;
    },
    onSuccess: (res) => {
      if (typeof window !== "undefined") {
        toast.success(t("auth.password_reset_successfully"));
      }
    },
    onError: (error) => {
      if (typeof window !== "undefined") {
        toast.error((error as Error).message || "Failed to reset password");
      }
    },
  });
};

export const isAuthenticated = () => {
  if (typeof window === "undefined") return false;
  const token =
    authCookies.getToken() &&
    authStorage.getUserData() !== null;
  return !!token;
};
