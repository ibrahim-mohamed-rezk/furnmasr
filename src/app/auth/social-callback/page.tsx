"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { authStorage } from "@/lib/auth";
import { postLoginRedirect } from "@/lib/postLoginRedirect";
import { captureAnonymousCart, replayCartAfterLogin } from "@/lib/cartMerge";
import { useLanguage } from "@/contexts/LanguageContext";
import { identifyUser } from "@/lib/tiktokPixel";

// Extend the session type to include our custom properties
interface ExtendedSession {
  userData?: any;
  apiToken?: string;
  idToken?: string;
  user?: any;
}

export default function SocialCallback() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { language } = useLanguage();

  // Cast session to extended type
  const extendedSession = session as ExtendedSession | null;

  useEffect(() => {
    if (status === "authenticated") {
      // Try different possible locations for user data
      const userData =
        extendedSession?.userData || (extendedSession?.user as any)?.userData;
      const apiToken =
        extendedSession?.apiToken || (extendedSession?.user as any)?.apiToken;

      if (userData && apiToken) {
        // Capture the guest cart, authenticate, then replay it into the
        // authenticated cart. The backend does not reliably merge guest carts,
        // so we re-add the items as the authenticated user.
        (async () => {
          const capturedCart = await captureAnonymousCart(language);

          // Save user data + token to localStorage/cookies (client-side).
          authStorage.setUserData(userData);
          authStorage.setToken(apiToken);

          // Token is now set, so the replay runs as the authenticated user.
          // replayCartAfterLogin clears the anonymous session when done.
          await replayCartAfterLogin(language, capturedCart);

          await identifyUser({
            email: userData?.email,
            phone_number: userData?.phone,
            external_id: userData?.id,
          });

          // Return the user to whichever page they triggered the login from
          // (saved by postLoginRedirect.capture before signIn was called).
          // Falls back to home if nothing was stored.
          window.location.href = postLoginRedirect.consume("/");
        })();
      } else {
        router.push("/auth/error?message=Missing user data");
      }
    } else if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status, extendedSession, router, language]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Processing your login...</h1>
        <p>Please wait while we set up your account.</p>
      </div>
    </div>
  );
}
