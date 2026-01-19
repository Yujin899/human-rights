import { ExamSession } from "./types";

const STORAGE_KEY = "exam_session";
const EXPIRATION_DAYS = 7;

/**
 * Check if a session is expired (older than 7 days)
 */
export function isSessionExpired(timestamp: number): boolean {
  const now = Date.now();
  const expirationTime = EXPIRATION_DAYS * 24 * 60 * 60 * 1000; // 7 days in milliseconds
  return now - timestamp > expirationTime;
}

/**
 * Save current exam session to localStorage
 */
export function saveSession(session: ExamSession): void {
  try {
    const sessionData = {
      ...session,
      lastUpdated: Date.now(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessionData));
  } catch (error) {
    console.error("Failed to save session:", error);
  }
}

/**
 * Load exam session from localStorage
 * Returns null if no session exists or if session is expired
 */
export function loadSession(): ExamSession | null {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return null;

    const session: ExamSession = JSON.parse(data);

    // Check if session is expired
    if (isSessionExpired(session.timestamp)) {
      clearSession();
      return null;
    }

    return session;
  } catch (error) {
    console.error("Failed to load session:", error);
    return null;
  }
}

/**
 * Clear exam session from localStorage
 */
export function clearSession(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error("Failed to clear session:", error);
  }
}
