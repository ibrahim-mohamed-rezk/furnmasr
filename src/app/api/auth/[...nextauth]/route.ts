import NextAuth from "next-auth";
import type { OAuthConfig } from "next-auth/providers/oauth";
import GoogleProvider from "next-auth/providers/google";
import { authCookies } from "@/lib/auth";
import { simpleSession } from "@/lib/simpleSession";

const FacebookCustomProvider: OAuthConfig<any> = {
  id: "facebook",
  name: "Facebook",
  type: "oauth",
  checks: [],
  clientId: process.env.FACEBOOK_CLIENT_ID as string,
  clientSecret: process.env.FACEBOOK_CLIENT_SECRET as string,
  client: {
    token_endpoint_auth_method: "client_secret_post",
  },
  authorization: {
    url: "https://www.facebook.com/v19.0/dialog/oauth",
    params: { scope: "public_profile,email" },
  },
  token: {
    url: "https://graph.facebook.com/v19.0/oauth/access_token",
    async request({ params, provider }: any) {
      // Non-www: next.config.js 308-redirects www → apex, and a redirect on the
      // OAuth callback would drop the POST body / query.
      const baseUrl = process.env.NEXTAUTH_URL || "https://furnmasr.com";
      const redirectUri = `${baseUrl}/api/auth/callback/facebook`;

      const url = new URL("https://graph.facebook.com/v19.0/oauth/access_token");
      url.searchParams.set("client_id", provider.clientId);
      url.searchParams.set("client_secret", provider.clientSecret);
      url.searchParams.set("code", params.code as string);
      url.searchParams.set("redirect_uri", redirectUri);

      const res = await fetch(url.toString());
      const tokens = await res.json();

      if (tokens.error) {
        console.error("[Facebook token error]", tokens.error);
        throw new Error(tokens.error.message || "Facebook token exchange failed");
      }

      return { tokens };
    },
  },
  userinfo: {
    url: "https://graph.facebook.com/me",
    async request({ tokens }: any) {
      const url = new URL("https://graph.facebook.com/me");
      url.searchParams.set("fields", "id,name,email,picture");
      url.searchParams.set("access_token", tokens.access_token);

      const res = await fetch(url.toString());
      const profile = await res.json();

      if (profile.error) {
        console.error("[Facebook userinfo error]", profile.error);
        throw new Error(profile.error.message || "Facebook userinfo failed");
      }

      return profile;
    },
  },
  profile(profile: any) {
    return {
      id: profile.id,
      name: profile.name,
      email: profile.email,
      image: profile.picture?.data?.url,
    };
  },
};

const authSecret = process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET;

// next-auth's own failure mode here is an opaque 500 on every /api/auth/*
// request (surfacing in the browser as CLIENT_FETCH_ERROR with no server
// detail), so name the missing variable in the server log instead.
if (!authSecret) {
  console.error(
    "[next-auth] AUTH_SECRET/NEXTAUTH_SECRET is not set — every /api/auth/* " +
      "request will fail with 500. Set it in the server environment (.env in " +
      "the release root for the standalone build).",
  );
}

const options = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
          scope: "openid email profile",
        },
      },
    }),
    FacebookCustomProvider,
  ],
  secret: authSecret,
  callbacks: {
    async jwt({
      token,
      account,
      user,
    }: {
      token: any;
      account: any;
      user: any;
    }) {
      if (account?.id_token) {
        token.idToken = account.id_token;
      }

      // Pass user data and API token from signIn callback to JWT
      if (user?.apiToken) {
        token.apiToken = user.apiToken;
      }
      if (user?.userData) {
        token.userData = user.userData;
      }

      return token;
    },
    async session({ session, token }: { session: any; token: any }) {
      session.idToken = token.idToken;
      session.apiToken = token.apiToken;
      session.userData = token.userData;

      return session;
    },
    async signIn({ user, account }: { user: any; account: any }) {
      if ((account?.provider === "google" && account.id_token) || (account?.provider === "facebook" && account.access_token)) {
        try {
          // signIn runs on the server, where simpleSession (localStorage-backed)
          // always returns "". Kept for the case where that changes; the param
          // is omitted rather than sent as the literal "undefined" it used to be.
          const sessionId = simpleSession.getSessionId();
          const anonId = sessionId
            ? parseInt(sessionId.replace("anon_", ""), 10)
            : NaN;

          const tokenToUse = account?.provider === "google" ? account.id_token : account.access_token;

          const url = new URL(
            `${process.env.NEXT_PUBLIC_API_URL}/social_login`,
          );
          url.searchParams.set("provider", account.provider);
          url.searchParams.set("token", tokenToUse);
          if (Number.isFinite(anonId)) {
            url.searchParams.set("session_id", String(anonId));
          }

          const response = await fetch(url.toString());

          if (!response.ok) throw new Error("Network response was not ok");

          const data = await response.json();

          if (data.status) {
            // Store token in cookies (server-side)
            authCookies.setToken(data.token);

            // Attach all necessary data to user object
            user.apiToken = data.token;
            user.userData = data?.data?.user;
            return true;
          }
          return `/auth/error?message=${encodeURIComponent(
            data.msg || "Login failed"
          )}`;
        } catch (error) {
          return `/auth/error?message=${encodeURIComponent(
            "Connection error"
          )}`;
        }
      }
      return true;
    },
    async redirect() {
      return "/auth/social-callback";
    },
  },
  pages: {
    error: "/auth/error",
  },
};

const handler = NextAuth(options);

export { handler as GET, handler as POST };
