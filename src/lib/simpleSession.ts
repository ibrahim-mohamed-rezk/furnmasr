// Simple session management - just generates and stores session IDs
const SESSION_KEY = "furnmasr_session_id";

export const simpleSession = {
  // Generate a unique session ID
  generateSessionId: (): string => {
    return `anon_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  },

  // Get or create session ID
  getOrCreateSessionId: (): string => {
    if (typeof window === "undefined") return "";

    try {
      let sessionId = localStorage.getItem(SESSION_KEY);
      if (!sessionId) {
        sessionId = simpleSession.generateSessionId();
        localStorage.setItem(SESSION_KEY, sessionId);
      }
      return sessionId;
    } catch (error) {
      console.error("Error managing session:", error);
      return "";
    }
  },

  // Get current session ID
  getSessionId: (): string => {
    if (typeof window === "undefined") return "";
    try {
      return localStorage.getItem(SESSION_KEY) || "";
    } catch (error) {
      return "";
    }
  },

  // Clear session
  clearSession: (): void => {
    if (typeof window === "undefined") return;
    try {
      localStorage.removeItem(SESSION_KEY);
    } catch (error) {
      console.error("Error clearing session:", error);
    }
  },
};
