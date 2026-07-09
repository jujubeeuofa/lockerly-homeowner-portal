"use client";

export function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      className="inline-flex h-12 items-center justify-center rounded-full bg-accent px-7 font-semibold text-white transition-colors hover:bg-accent-dark"
    >
      Print card
    </button>
  );
}
