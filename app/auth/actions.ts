"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type AuthState = { error?: string; notice?: string } | null;

function str(v: FormDataEntryValue | null): string {
  return typeof v === "string" ? v.trim() : "";
}

export async function signUp(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const email = str(formData.get("email"));
  const password = str(formData.get("password"));
  const address_line1 = str(formData.get("address_line1"));
  const address_line2 = str(formData.get("address_line2"));
  const city = str(formData.get("city"));
  const state = str(formData.get("state"));
  const zip = str(formData.get("zip"));
  const phone = str(formData.get("phone"));

  if (!email || !password) return { error: "Email and password are required." };
  if (password.length < 8)
    return { error: "Password must be at least 8 characters." };
  if (!address_line1 || !city || !state || !zip)
    return { error: "Please enter your full delivery address." };

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      // Passed to the DB trigger that seeds the profile row.
      data: { address_line1, address_line2, city, state, zip, phone },
    },
  });

  if (error) return { error: error.message };

  // If email confirmation is on, there's a user but no active session yet.
  if (data.user && !data.session) {
    return {
      notice:
        "Check your email to confirm your account, then log in to finish setup.",
    };
  }

  redirect("/instructions?welcome=1");
}

export async function logIn(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const email = str(formData.get("email"));
  const password = str(formData.get("password"));
  const next = str(formData.get("next")) || "/instructions";

  if (!email || !password) return { error: "Enter your email and password." };

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) return { error: error.message };

  redirect(next);
}

export async function logOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
