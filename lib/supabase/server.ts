import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Server-side Supabase client bound to the request cookies. Uses the anon key,
 * so RLS still applies — it just carries the logged-in user's session so
 * queries run as that user. Use in Server Components, Route Handlers, Actions.
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // Called from a Server Component — cookies are read-only here.
            // The middleware refresh handles writing the session cookie.
          }
        },
      },
    },
  );
}

/**
 * Privileged server-side client using the service-role key. Bypasses RLS.
 * ONLY use for the public driver-facing address lookup, never expose to the
 * browser. Never import this into a client component.
 */
export function createServiceClient() {
  const { createClient: createSbClient } = require("@supabase/supabase-js");
  return createSbClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } },
  );
}
