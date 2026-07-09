import { NextResponse } from "next/server";

// Temporary diagnostic: reports whether Supabase env vars are visible to the
// running server WITHOUT leaking secrets (only presence, host, and lengths).
// Safe to delete once the deploy is confirmed healthy.
export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  let host: string | null = null;
  try {
    host = url ? new URL(url).host : null;
  } catch {
    host = "INVALID_URL";
  }
  return NextResponse.json({
    supabaseUrl: url ? "set" : "MISSING",
    supabaseUrlHost: host,
    anonKey: key ? "set" : "MISSING",
    anonKeyLength: key ? key.length : 0,
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "(unset)",
  });
}
