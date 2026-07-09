"use client";

import { useState } from "react";
import {
  CARRIER_GUIDES,
  suggestedNote,
  suggestedNoteShort,
} from "@/lib/carrierSetup";

export function CarrierSetup({ customNotes }: { customNotes?: string | null }) {
  const note = suggestedNote(customNotes);
  const [open, setOpen] = useState<string | null>(CARRIER_GUIDES[0].id);
  const [copied, setCopied] = useState<string | null>(null);

  async function copy(text: string, key: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(key);
      setTimeout(() => setCopied((c) => (c === key ? null : c)), 1800);
    } catch {
      setCopied(null);
    }
  }

  return (
    <section>
      <h2 className="font-display text-xl font-extrabold text-ink">
        Tell your carriers
      </h2>
      <p className="mt-1 text-sm leading-6 text-ink/60">
        The door card covers drivers who scan it. For everything else, add a
        standing delivery instruction inside each carrier account so packages
        are routed to your Lockerly automatically.
      </p>

      {/* The reusable note the homeowner pastes into each carrier */}
      <div className="mt-4 rounded-2xl border border-brand/30 bg-brand-tint/60 p-4">
        <div className="flex items-center justify-between gap-3">
          <span className="text-xs font-bold uppercase tracking-wide text-brand-dark">
            Paste this into each carrier
          </span>
          <button
            type="button"
            onClick={() => copy(note, "note")}
            className="shrink-0 rounded-full bg-brand px-3 py-1.5 text-xs font-semibold text-white hover:bg-brand-dark"
          >
            {copied === "note" ? "Copied ✓" : "Copy"}
          </button>
        </div>
        <p className="mt-2 text-sm leading-6 text-ink/80">“{note}”</p>
      </div>

      {/* Per-carrier accordions */}
      <div className="mt-4 space-y-3">
        {CARRIER_GUIDES.map((g) => {
          const isOpen = open === g.id;
          return (
            <div
              key={g.id}
              className="overflow-hidden rounded-2xl border border-ink/10 bg-white"
            >
              <button
                type="button"
                aria-expanded={isOpen}
                onClick={() => setOpen(isOpen ? null : g.id)}
                className="flex w-full items-center justify-between px-5 py-4 text-left"
              >
                <span>
                  <span className="font-display font-bold text-ink">
                    {g.name}
                  </span>
                  {g.program && (
                    <span className="ml-2 text-xs font-semibold text-ink/45">
                      {g.program}
                    </span>
                  )}
                </span>
                <span
                  className={`text-ink/40 transition-transform ${
                    isOpen ? "rotate-180" : ""
                  }`}
                  aria-hidden
                >
                  ▾
                </span>
              </button>

              {isOpen && (
                <div className="border-t border-ink/10 px-5 py-4">
                  <ol className="space-y-2">
                    {g.steps.map((s, i) => (
                      <li key={i} className="flex gap-3 text-sm text-ink/75">
                        <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-tint text-xs font-bold text-brand-dark">
                          {i + 1}
                        </span>
                        <span className="leading-6">{s}</span>
                      </li>
                    ))}
                  </ol>

                  <div className="mt-4 flex flex-wrap items-center gap-2">
                    <a
                      href={g.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex h-9 items-center rounded-full bg-ink px-4 text-sm font-semibold text-white hover:bg-ink/85"
                    >
                      Open {g.name} ↗
                    </a>
                    <button
                      type="button"
                      onClick={() =>
                        copy(
                          g.id === "amazon" ? suggestedNoteShort() : note,
                          g.id,
                        )
                      }
                      className="inline-flex h-9 items-center rounded-full border border-ink/15 px-4 text-sm font-semibold text-ink/70 hover:bg-ink/[.04]"
                    >
                      {copied === g.id
                        ? "Copied ✓"
                        : g.id === "amazon"
                          ? "Copy short note"
                          : "Copy note"}
                    </button>
                  </div>
                  {g.id === "amazon" && (
                    <p className="mt-2 text-xs text-ink/45">
                      Amazon’s instructions box is short, so this copies a
                      trimmed version.
                    </p>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
