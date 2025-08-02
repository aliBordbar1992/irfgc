import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { createHash } from "crypto";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Generates a public profile URL for a given username
 * @param username - The username to generate the URL for
 * @returns The public profile URL
 */
export function getPublicProfileUrl(username: string): string {
  return `/users/${username}`;
}

/**
 * Computes a deduplication hash for view tracking
 * Uses SHA256 hash of content + user identification to prevent duplicate views
 */
export function computeDedupHash(
  contentId: string,
  contentType: string,
  userId: string | null,
  anonId: string | null,
  ip: string,
  userAgent: string
): string {
  const identifier = userId || anonId || ip;
  const combined = `${contentId}|${contentType}|${identifier}|${userAgent}`;
  return createHash("sha256").update(combined).digest("hex");
}

/**
 * Ensures an anonymous ID exists in cookies
 * Generates a UUID if not present and sets it for 1 year
 */
export function ensureAnonId(): string {
  if (typeof window === "undefined") {
    throw new Error("ensureAnonId must be called on the client side");
  }

  const cookieName = "anon_id";
  const existingId = getCookie(cookieName);

  if (existingId) {
    return existingId;
  }

  const newId = crypto.randomUUID();
  setCookie(cookieName, newId, 365); // 1 year
  return newId;
}

/**
 * Gets a cookie value by name
 */
function getCookie(name: string): string | null {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop()?.split(";").shift() || null;
  }
  return null;
}

/**
 * Sets a cookie with the given name, value, and expiration days
 */
function setCookie(name: string, value: string, days: number): void {
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
}

/**
 * Formats a view count with appropriate suffixes
 */
export function formatViewCount(count: number): string {
  if (count < 1000) {
    return count.toString();
  } else if (count < 1000000) {
    return `${(count / 1000).toFixed(1)}K`;
  } else {
    return `${(count / 1000000).toFixed(1)}M`;
  }
}
