"use client";

import { useActionState, useState } from "react";
import { saveInstructions, type SaveState } from "./actions";
import { CARRIERS, type Profile } from "@/lib/types";

export function InstructionsForm({ profile }: { profile: Profile }) {
  const [state, action, pending] = useActionState<SaveState, FormData>(
    saveInstructions,
    null,
  );
  const [on, setOn] = useState(profile.deliver_to_lockerly);

  return (
    <form action={action} className="space-y-6">
      {/* The one setting that matters */}
      <div className="rounded-2xl border border-ink/10 bg-white p-5 shadow-sm">
        <label className="flex items-start gap-4">
          <span className="flex-1">
            <span className="block font-display text-lg font-bold text-ink">
              I have a Lockerly unit — deliver packages here
            </span>
            <span className="mt-1 block text-sm leading-6 text-ink/60">
              When on, drivers who scan your door card are told to leave every
              package in your Lockerly. Turn off to pause and hide your card.
            </span>
          </span>
          {/* Toggle */}
          <span className="relative mt-1 inline-flex shrink-0">
            <input
              type="checkbox"
              name="deliver_to_lockerly"
              checked={on}
              onChange={(e) => setOn(e.target.checked)}
              className="peer sr-only"
            />
            <span
              onClick={() => setOn((v) => !v)}
              role="switch"
              aria-checked={on}
              aria-label="Deliver packages to my Lockerly"
              className={`h-7 w-12 cursor-pointer rounded-full transition-colors ${
                on ? "bg-brand" : "bg-ink/20"
              }`}
            >
              <span
                className={`block h-6 w-6 translate-y-0.5 rounded-full bg-white shadow transition-transform ${
                  on ? "translate-x-[22px]" : "translate-x-0.5"
                }`}
              />
            </span>
          </span>
        </label>
      </div>

      {/* Custom notes */}
      <div className="rounded-2xl border border-ink/10 bg-white p-5 shadow-sm">
        <label htmlFor="custom_notes" className="block">
          <span className="font-display text-base font-bold text-ink">
            Custom notes for drivers
          </span>
          <span className="mt-1 block text-sm text-ink/60">
            Optional. Shown on the driver page for edge cases.
          </span>
          <textarea
            id="custom_notes"
            name="custom_notes"
            rows={3}
            defaultValue={profile.custom_notes ?? ""}
            maxLength={300}
            placeholder="e.g. Lockerly is on the left side of the garage. Ring bell for oversized items."
            className="mt-3 w-full rounded-xl border border-ink/15 bg-white px-4 py-3 text-ink outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
          />
        </label>
      </div>

      {/* Preferred carriers */}
      <div className="rounded-2xl border border-ink/10 bg-white p-5 shadow-sm">
        <span className="font-display text-base font-bold text-ink">
          Preferred carriers
        </span>
        <p className="mt-1 text-sm text-ink/60">
          Leave all unchecked to allow <strong>every</strong> carrier
          (recommended). Check specific carriers only if you want to limit it.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {CARRIERS.map((c) => {
            const checked = profile.allowed_carriers.includes(c.id);
            return (
              <label
                key={c.id}
                className="cursor-pointer select-none rounded-full border border-ink/15 bg-white px-4 py-2 text-sm font-semibold text-ink/70 transition has-[:checked]:border-brand has-[:checked]:bg-brand-tint has-[:checked]:text-brand-dark"
              >
                <input
                  type="checkbox"
                  name="allowed_carriers"
                  value={c.id}
                  defaultChecked={checked}
                  className="sr-only"
                />
                {c.label}
              </label>
            );
          })}
        </div>
      </div>

      {/* Save bar */}
      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={pending}
          className="h-12 rounded-full bg-accent px-8 font-semibold text-white transition-colors hover:bg-accent-dark disabled:opacity-60"
        >
          {pending ? "Saving…" : "Save instructions"}
        </button>
        {state?.ok && (
          <span className="text-sm font-semibold text-green-600">Saved ✓</span>
        )}
        {state?.error && (
          <span className="text-sm font-semibold text-red-600">
            {state.error}
          </span>
        )}
      </div>
    </form>
  );
}
