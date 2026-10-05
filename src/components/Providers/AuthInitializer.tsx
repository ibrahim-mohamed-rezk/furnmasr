"use client";

import { useEffect } from "react";
import { useInitializeAuth } from "@/hooks/useAuth";
import { authStorage } from "@/lib/auth";
import { identifyUser } from "@/lib/tiktokPixel";

export const AuthInitializer: React.FC = () => {
  // Initialize auth data when component mounts
  useInitializeAuth();

  // Re-send TikTok identify for already-authenticated visitors. Login/register
  // reload the page, so their identify calls don't persist across navigation;
  // this covers returning users. identifyUser no-ops (and retries once) until
  // the lazy-loaded pixel script is available.
  useEffect(() => {
    const u = authStorage.getUserData();
    if (u) {
      void identifyUser({
        email: u.email,
        phone_number: u.phone,
        external_id: u.id,
      });
    }
  }, []);

  // This component doesn't render anything
  return null;
};
