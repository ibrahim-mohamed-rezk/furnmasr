import { useQuery } from "@tanstack/react-query";
import { useLanguage } from "@/contexts/LanguageContext";
import { api } from "@/lib/api";
import { authStorage } from "@/lib/auth";
import { useEffect, useState } from "react";

interface UserProfile {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  postal_code: string;
  date_of_birth: string;
  gender: string;
  avatar: string | null;
  status: boolean;
  city?: {
    id: number;
    status: boolean;
    name: string;
  };
  country?: {
    id: number;
    status: boolean;
    name: string;
  };
}

interface UseUserProfileReturn {
  user: UserProfile | null;
  isLoading: boolean;
  error: Error | null;
  isFromLocalStorage: boolean;
}

export const useUserProfile = (): UseUserProfileReturn => {
  const { language } = useLanguage();
  const [isClient, setIsClient] = useState(false);

  // Get user data from localStorage as fallback
  const [localUser, setLocalUser] = useState<UserProfile | null>(null);
  const [token, setToken] = useState<string | null>(null);

  // Handle SSR - only access localStorage on client
  useEffect(() => {
    setIsClient(true);
    setLocalUser(authStorage.getUserData());
    setToken(authStorage.getToken());
  }, []);

  const {
    data: apiUser,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["user-profile"],
    queryFn: async (): Promise<UserProfile> => {
      const response = await api.get("/users", undefined, language);
      if (
        response.status &&
        response.data &&
        Array.isArray(response.data) &&
        response.data.length > 0
      ) {
        return response.data[0]; // Return the first user (current user)
      }
      throw new Error(response.msg || "Failed to fetch user profile");
    },
    enabled: !!token && isClient, // Only fetch from API if we have a token and are on client
    retry: 1, // Only retry once to avoid too many failed requests
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
  });

  // Update localStorage whenever we get fresh data from API
  useEffect(() => {
    if (apiUser && isClient) {
      // Update localStorage with fresh user data
      authStorage.setUserData(apiUser);
      // Also update the local state
      setLocalUser(apiUser);
    }
  }, [apiUser, isClient]);

  // Determine which data to use
  const user = apiUser || localUser;
  const isFromLocalStorage = !apiUser && !!localUser;

  return {
    user,
    isLoading: isLoading || !isClient, // Show loading during SSR
    error,
    isFromLocalStorage,
  };
};
