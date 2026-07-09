import Link from "next/link";
import { Logo } from "@/app/components/Logo";

export default function Home() {
  return (
    <div className="flex min-h-full flex-col">
      {/* Top bar */}
      <header className="mx-auto flex w-full max-w-5xl items-center justify-between px-5 py-5">
        <Logo />
        <nav className="flex items-center gap-2 text-sm font-semibold">
          <Link
            href="/login"
            className="rounded-full px-4 py-2 text-ink/70 hover:text-ink"
          >
            Log in
          </Link>
          <Link
            href="/signup"
            className="rounded-full bg-brand px-4 py-2 text-white hover:bg-brand-dark"
          >
            Get set up
          </Link>
        </nav>
      </header>

      {/* Hero */}
      <main className="flex-1">
        <section className="mx-auto w-full max-w-5xl px-5 pt-10 pb-16 sm:pt-16">
          <span className="inline-block rounded-full bg-brand-tint px-3 py-1 text-xs font-semibold uppercase tracking-wide text-brand-dark">
            For homeowners
          </span>
          <h1 className="mt-5 max-w-2xl font-display text-4xl font-extrabold leading-tight text-ink sm:text-5xl">
            Deliver every package{" "}
            <span className="text-brand">through your Lockerly.</span>
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-8 text-ink/70">
            Set it once. Every carrier — USPS, UPS, FedEx, Amazon, DHL — leaves
            your packages safely inside your home instead of on the porch. No
            codes, no apps for the driver, no porch pirates.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/signup"
              className="inline-flex h-12 items-center justify-center rounded-full bg-accent px-7 font-semibold text-white shadow-sm transition-colors hover:bg-accent-dark"
            >
              Set up my delivery instructions
            </Link>
            <Link
              href="/login"
              className="inline-flex h-12 items-center justify-center rounded-full border border-ink/15 px-7 font-semibold text-ink transition-colors hover:bg-ink/[.04]"
            >
              I already have an account
            </Link>
          </div>

          {/* Three quick steps */}
          <div className="mt-16 grid gap-4 sm:grid-cols-3">
            {[
              {
                n: "1",
                t: "Sign up",
                d: "Email, address, password. Takes under a minute.",
              },
              {
                n: "2",
                t: "Flip the switch",
                d: "“I have a Lockerly — deliver packages here.” Done.",
              },
              {
                n: "3",
                t: "Print your card",
                d: "A QR signage card drivers can scan at your door.",
              },
            ].map((s) => (
              <div
                key={s.n}
                className="rounded-2xl border border-ink/10 bg-white p-6 shadow-sm"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-tint font-display font-bold text-brand-dark">
                  {s.n}
                </div>
                <h3 className="mt-4 font-display text-lg font-bold text-ink">
                  {s.t}
                </h3>
                <p className="mt-1 text-sm leading-6 text-ink/60">{s.d}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t border-ink/10">
        <div className="mx-auto w-full max-w-5xl px-5 py-6 text-sm text-ink/50">
          © {new Date().getFullYear()} Lockerly · Packages that make it inside.
        </div>
      </footer>
    </div>
  );
}
