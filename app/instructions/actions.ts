"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { CARRIERS, type CarrierId } from "@/lib/types";

export type SaveState = { ok?: boolean; error?: string } | null;

const VALID = new Set<string>(CARRIERS.map((c) => c.id));

export async function saveInstructions(
  _prev: SaveState,
  formData: FormData,
): Promise<SaveState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "You must be logged in." };

  const deliver_to_lockerly = formData.get("deliver_to_lockerly") === "on";
  const custom_notes = (formData.get("custom_notes") as string | null)?.trim() || null;
  const allowed_carriers = formData
    .getAll("allowed_carriers")
    .map(String)
    .filter((c): c is CarrierId => VALID.has(c));

  const { error } = await supabase
    .from("profiles")
    .update({ deliver_to_lockerly, custom_notes, allowed_carriers })
    .eq("id", user.id);

  if (error) return { error: error.message };

  revalidatePath("/instructions");
  return { ok: true };
}
