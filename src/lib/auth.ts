// Auth utilities for handling local storage and cookies

export interface UserData {
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
}

export interface AuthResponse {
  status: boolean;
  token: string;
  msg: string;
  data: {
    user_data: UserData;
  };
}

// Local Storage Keys
const USER_DATA_KEY = "furnmasr_user_data";
const TOKEN_KEY = "furnmasr_token";

// Default data and token (as provided by user)
const DEFAULT_USER_DATA: UserData = {
  id: 4,
  name: "ss",
  email: "shahd@gmail.com",
  phone: "989.739.9198",
  address: "455 Sister Meadow Apt. 944\r\nLeslyborough, RI 92069",
  postal_code: "47422-2931",
  date_of_birth: "1967-05-28",
  gender: "other",
  avatar: null,
  status: true,
};

const DEFAULT_TOKEN = "25|j4NvfA0gGMdpfFziGMkDRbjUORlRdaFem8d5qsgwabfd67c7";

// Local Storage Functions
export const authStorage = {
  // User Data
  getUserData: (): UserData | null => {
    if (typeof window === "undefined") return null;
    try {
      const data = localStorage.getItem(USER_DATA_KEY);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error("Error getting user data from localStorage:", error);
      return null;
    }
  },

  setUserData: (userData: UserData): void => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(USER_DATA_KEY, JSON.stringify(userData));
    } catch (error) {
      console.error("Error setting user data to localStorage:", error);
    }
  },

  removeUserData: (): void => {
    if (typeof window === "undefined") return;
    try {
      localStorage.removeItem(USER_DATA_KEY);
    } catch (error) {
      console.error("Error removing user data from localStorage:", error);
    }
  },

  // Token
  getToken: (): string | null => {
    if (typeof window === "undefined") return null;
    try {
      return authCookies.getToken();
    } catch (error) {
      console.error("Error getting token from localStorage:", error);
      return null;
    }
  },

  setToken: (token: string): void => {
    if (typeof window === "undefined") return;
    try {
      authCookies.setToken(token);
    } catch (error) {
      console.error("Error setting token to localStorage:", error);
    }
  },

  removeToken: (): void => {
    if (typeof window === "undefined") return;
    try {
      authCookies.removeToken();
    } catch (error) {
      console.error("Error removing token from localStorage:", error);
    }
  },

  // Clear all auth data
  clearAuth: (): void => {
    authStorage.removeUserData();
    authCookies.removeToken();
  },

  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    return !!(authStorage.getToken() && authStorage.getUserData());
  },

  // Set default data and token
  setDefaultData: (): void => {
    authStorage.setUserData(DEFAULT_USER_DATA);
    // authStorage.setToken(DEFAULT_TOKEN);
    authCookies.setToken(DEFAULT_TOKEN);
  },

  // Initialize auth data on page load
  initializeAuth: (): void => {
    if (typeof window === "undefined") return;

    // Check if auth data already exists
    const existingUserData = authStorage.getUserData();
    const existingToken = authCookies.getToken();

    // If no auth data exists, set default data
    if (!existingUserData || !existingToken) {
      // authStorage.setDefaultData();
    }
  },
};

// Cookie Functions
export const authCookies = {
  setToken: (token: string): void => {
    if (typeof window === "undefined") return;
    try {
      // Set cookie without expiration (session cookie)
      document.cookie = `${TOKEN_KEY}=${token};path=/;SameSite=Strict`;
    } catch (error) {
      console.error("Error setting token cookie:", error);
    }
  },

  getToken: (): string | null => {
    if (typeof window === "undefined") return null;
    try {
      const nameEQ = TOKEN_KEY + "=";
      const ca = document.cookie.split(";");
      for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === " ") c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0)
          return c.substring(nameEQ.length, c.length);
      }
      return null;
    } catch (error) {
      console.error("Error getting token from cookies:", error);
      return null;
    }
  },

  removeToken: (): void => {
    if (typeof window === "undefined") return;
    try {
      document.cookie = `${TOKEN_KEY}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
    } catch (error) {
      console.error("Error removing token cookie:", error);
    }
  },
};
