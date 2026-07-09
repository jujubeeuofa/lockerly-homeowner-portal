import Link from "next/link";
import { Logo } from "@/app/components/Logo";
import { CarrierSetup } from "@/app/instructions/CarrierSetup";

export const metadata = {
  title: "Lockerly — Set up your deliveries",
  description:
    "Create your account and tell every carrier to deliver through your Lockerly.",
};

export default function SetupPage() {
  return (
    <div className="flex min-h-full flex-col">
      <header className="mx-auto flex w-full max-w-2xl items-center justify-between px-5 py-5">
        <Logo />
        <Link
          href="/login"
          className="text-sm font-semibold text-brand hover:text-brand-dark"
        >
          Log in
        </Link>
      </header>

      <main className="mx-auto w-full max-w-2xl flex-1 px-5 pb-16">
        {/* Hero + account CTAs */}
        <section className="rounded-3xl border border-ink/10 bg-white p-6 shadow-sm sm:p-8">
          <span className="inline-block rounded-full bg-brand-tint px-3 py-1 text-xs font-semibold uppercase tracking-wide text-brand-dark">
            Set up in minutes
          </span>
          <h1 className="mt-4 font-display text-3xl font-extrabold leading-tight text-ink sm:text-4xl">
            Set up your Lockerly deliveries
          </h1>
          <p className="mt-3 text-ink/70">
            Create your account, flip one switch, and every carrier — USPS, UPS,
            FedEx, Amazon, DHL — delivers safely through your Lockerly.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/signup"
              className="inline-flex h-12 items-center justify-center rounded-full bg-accent px-7 font-semibold text-white shadow-sm transition-colors hover:bg-accent-dark"
            >
              Create my account
            </Link>
            <Link
              href="/login"
              className="inline-flex h-12 items-center justify-center rounded-full border border-ink/15 px-7 font-semibold text-ink transition-colors hover:bg-ink/[.04]"
            >
              I already have an account
            </Link>
          </div>
        </section>

        {/* Carrier setup steps (generic — no personalized note when logged out) */}
        <div className="mt-10">
          <CarrierSetup />
        </div>

        <div className="mt-10 rounded-2xl border border-dashed border-brand/40 bg-white p-5 text-center">
          <p className="text-sm text-ink/60">
            Handing these instructions to a neighbor or resident?
          </p>
          <Link
            href="/setup/qr"
            className="mt-2 inline-flex items-center justify-center text-sm font-semibold text-brand hover:text-brand-dark"
          >
            Print a scannable QR poster →
          </Link>
        </div>
      </main>

      <footer className="border-t border-ink/10">
        <div className="mx-auto w-full max-w-2xl px-5 py-6 text-sm text-ink/50">
          © {new Date().getFullYear()} Lockerly · Packages that make it inside.
        </div>
      </footer>
    </div>
  );
}
