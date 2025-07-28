/**
 * Utility functions for normalizing usernames and emails
 */

/**
 * Normalizes a username to lowercase for case-insensitive operations
 * @param username - The username to normalize
 * @returns The normalized username in lowercase
 */
export function normalizeUsername(username: string): string {
  return username.toLowerCase().trim();
}

/**
 * Normalizes an email to lowercase for case-insensitive operations
 * @param email - The email to normalize
 * @returns The normalized email in lowercase, or null if email is empty/null
 */
export function normalizeEmail(
  email: string | null | undefined
): string | null {
  if (!email) return null;
  return email.toLowerCase().trim();
}

/**
 * Validates if a username is available (case-insensitive)
 * @param username - The username to check
 * @returns Promise<boolean> - True if username is available
 */
export async function isUsernameAvailable(username: string): Promise<boolean> {
  try {
    const response = await fetch("/api/auth/check-username", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username }),
    });

    if (response.ok) {
      const data = await response.json();
      return data.available;
    }
    return false;
  } catch (error) {
    console.error("Error checking username availability:", error);
    return false;
  }
}
