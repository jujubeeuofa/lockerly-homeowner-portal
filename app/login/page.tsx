"use client";

import { Suspense, useActionState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { logIn, type AuthState } from "@/app/auth/actions";
import { Logo } from "@/app/components/Logo";

const inputCls =
  "w-full rounded-xl border border-ink/15 bg-white px-4 py-3 text-ink outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20";

function LoginForm() {
  const [state, action, pending] = useActionState<AuthState, FormData>(
    logIn,
    null,
  );
  const next = useSearchParams().get("next") || "/instructions";

  return (
    <form action={action} className="mt-6 space-y-5">
      <input type="hidden" name="next" value={next} />
      {state?.error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {state.error}
        </div>
      )}

      <label htmlFor="email" className="block">
        <span className="mb-1.5 block text-sm font-semibold text-ink">
          Email
        </span>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          className={inputCls}
          placeholder="you@example.com"
        />
      </label>

      <label htmlFor="password" className="block">
        <span className="mb-1.5 block text-sm font-semibold text-ink">
          Password
        </span>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className={inputCls}
          placeholder="••••••••"
        />
      </label>

      <button
        type="submit"
        disabled={pending}
        className="h-12 w-full rounded-full bg-brand font-semibold text-white transition-colors hover:bg-brand-dark disabled:opacity-60"
      >
        {pending ? "Logging in…" : "Log in"}
      </button>

      <p className="text-center text-sm text-ink/60">
        New here?{" "}
        <Link href="/signup" className="font-semibold text-brand">
          Create an account
        </Link>
      </p>
    </form>
  );
}

export default function LoginPage() {
  return (
    <div className="flex min-h-full flex-col">
      <header className="mx-auto w-full max-w-md px-5 py-5">
        <Logo />
      </header>
      <main className="mx-auto w-full max-w-md flex-1 px-5 pb-16">
        <h1 className="font-display text-3xl font-extrabold text-ink">
          Welcome back
        </h1>
        <p className="mt-2 text-ink/60">
          Log in to update your delivery instructions.
        </p>
        <Suspense fallback={null}>
          <LoginForm />
        </Suspense>
      </main>
    </div>
  );
}
