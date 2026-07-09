"use client";

import { useActionState } from "react";
import Link from "next/link";
import { signUp, type AuthState } from "@/app/auth/actions";
import { Logo } from "@/app/components/Logo";

const US_STATES = [
  "AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA",
  "KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ",
  "NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT",
  "VA","WA","WV","WI","WY","DC",
];

export default function SignupPage() {
  const [state, action, pending] = useActionState<AuthState, FormData>(
    signUp,
    null,
  );

  return (
    <div className="flex min-h-full flex-col">
      <header className="mx-auto w-full max-w-md px-5 py-5">
        <Logo />
      </header>

      <main className="mx-auto w-full max-w-md flex-1 px-5 pb-16">
        <h1 className="font-display text-3xl font-extrabold text-ink">
          Create your account
        </h1>
        <p className="mt-2 text-ink/60">
          One minute to set up. Then flip a single switch and you&apos;re done.
        </p>

        {state?.notice ? (
          <div className="mt-6 rounded-xl border border-brand/30 bg-brand-tint px-4 py-3 text-sm text-brand-dark">
            {state.notice}{" "}
            <Link href="/login" className="font-semibold underline">
              Go to log in
            </Link>
          </div>
        ) : (
          <form action={action} className="mt-6 space-y-5">
            {state?.error && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {state.error}
              </div>
            )}

            <Field label="Email" htmlFor="email">
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className={inputCls}
                placeholder="you@example.com"
              />
            </Field>

            <Field label="Password" htmlFor="password" hint="At least 8 characters">
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                minLength={8}
                className={inputCls}
                placeholder="••••••••"
              />
            </Field>

            <Field
              label="Phone"
              htmlFor="phone"
              hint="Optional — for package text alerts later"
            >
              <input
                id="phone"
                name="phone"
                type="tel"
                autoComplete="tel"
                className={inputCls}
                placeholder="(555) 555-5555"
              />
            </Field>

            <fieldset className="space-y-4 rounded-2xl border border-ink/10 bg-white p-4">
              <legend className="px-1 font-display text-sm font-bold text-ink">
                Delivery address
              </legend>

              <Field label="Street address" htmlFor="address_line1">
                <input
                  id="address_line1"
                  name="address_line1"
                  autoComplete="address-line1"
                  required
                  className={inputCls}
                  placeholder="123 Maple St"
                />
              </Field>

              <Field label="Apt / Unit" htmlFor="address_line2" hint="Optional">
                <input
                  id="address_line2"
                  name="address_line2"
                  autoComplete="address-line2"
                  className={inputCls}
                  placeholder="Unit B"
                />
              </Field>

              <Field label="City" htmlFor="city">
                <input
                  id="city"
                  name="city"
                  autoComplete="address-level2"
                  required
                  className={inputCls}
                  placeholder="Phoenix"
                />
              </Field>

              <div className="grid grid-cols-2 gap-3">
                <Field label="State" htmlFor="state">
                  <select
                    id="state"
                    name="state"
                    required
                    defaultValue=""
                    className={inputCls}
                  >
                    <option value="" disabled>
                      —
                    </option>
                    {US_STATES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="ZIP" htmlFor="zip">
                  <input
                    id="zip"
                    name="zip"
                    inputMode="numeric"
                    autoComplete="postal-code"
                    required
                    pattern="[0-9]{5}(-[0-9]{4})?"
                    className={inputCls}
                    placeholder="85254"
                  />
                </Field>
              </div>
            </fieldset>

            <button
              type="submit"
              disabled={pending}
              className="h-12 w-full rounded-full bg-accent font-semibold text-white transition-colors hover:bg-accent-dark disabled:opacity-60"
            >
              {pending ? "Creating account…" : "Create account"}
            </button>

            <p className="text-center text-sm text-ink/60">
              Already set up?{" "}
              <Link href="/login" className="font-semibold text-brand">
                Log in
              </Link>
            </p>
          </form>
        )}
      </main>
    </div>
  );
}

const inputCls =
  "w-full rounded-xl border border-ink/15 bg-white px-4 py-3 text-ink outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20";

function Field({
  label,
  htmlFor,
  hint,
  children,
}: {
  label: string;
  htmlFor: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label htmlFor={htmlFor} className="block">
      <span className="mb-1.5 flex items-baseline justify-between">
        <span className="text-sm font-semibold text-ink">{label}</span>
        {hint && <span className="text-xs text-ink/45">{hint}</span>}
      </span>
      {children}
    </label>
  );
}
