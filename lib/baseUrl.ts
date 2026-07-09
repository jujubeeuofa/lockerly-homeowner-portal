import { headers } from "next/headers";

/**
 * Absolute origin used to build QR-code links. Prefers NEXT_PUBLIC_SITE_URL
 * (set this in production so printed QR codes point at the real domain);
 * otherwise falls back to the current request host (fine for local dev).
 */
export async function getBaseUrl(): Promise<string> {
  if (process.env.NEXT_PUBLIC_SITE_URL)
    return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000";
  const proto = h.get("x-forwarded-proto") ?? "http";
  return `${proto}://${host}`;
}
