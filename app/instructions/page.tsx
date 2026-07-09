import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { logOut } from "@/app/auth/actions";
import { Logo } from "@/app/components/Logo";
import { InstructionsForm } from "./InstructionsForm";
import type { Profile } from "@/lib/types";

export default async function InstructionsPage({
  searchParams,
}: {
  searchParams: Promise<{ welcome?: string }>;
}) {
  const { welcome } = await searchParams;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/instructions");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single<Profile>();

  if (!profile) {
    return (
      <Shell email={user.email}>
        <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          We couldn&apos;t load your profile. Make sure the database schema has
          been applied, then refresh.
        </p>
      </Shell>
    );
  }

  const addr = `${profile.address_line1}${
    profile.address_line2 ? ", " + profile.address_line2 : ""
  }, ${profile.city}, ${profile.state} ${profile.zip}`;

  return (
    <Shell email={user.email}>
      {welcome && (
        <div className="mb-6 rounded-2xl border border-brand/30 bg-brand-tint px-5 py-4">
          <p className="font-display font-bold text-brand-dark">
            You&apos;re in! One switch to go.
          </p>
          <p className="mt-1 text-sm text-brand-dark/80">
            Turn on delivery below, then print your door card.
          </p>
        </div>
      )}

      <h1 className="font-display text-3xl font-extrabold text-ink">
        Delivery instructions
      </h1>
      <p className="mt-1 flex items-center gap-2 text-ink/60">
        <span className="inline-block h-2 w-2 rounded-full bg-brand" />
        {addr}
      </p>

      <div className="mt-8">
        <InstructionsForm profile={profile} />
      </div>

      {/* Signage / driver card link */}
      <div className="mt-8 flex flex-col items-start gap-3 rounded-2xl border border-dashed border-brand/40 bg-white p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-display font-bold text-ink">
            Door card &amp; carrier setup
          </p>
          <p className="text-sm text-ink/60">
            Print your QR door sign, and set the delivery preference in your
            Amazon, UPS, FedEx &amp; USPS accounts.
          </p>
        </div>
        <Link
          href="/instructions/success"
          className="inline-flex h-11 shrink-0 items-center justify-center rounded-full bg-brand px-6 font-semibold text-white hover:bg-brand-dark"
        >
          Open setup
        </Link>
      </div>
    </Shell>
  );
}

function Shell({
  email,
  children,
}: {
  email?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-full flex-col">
      <header className="border-b border-ink/10 bg-white">
        <div className="mx-auto flex w-full max-w-2xl items-center justify-between px-5 py-4">
          <Logo href="/instructions" />
          <div className="flex items-center gap-3 text-sm">
            {email && (
              <span className="hidden text-ink/50 sm:inline">{email}</span>
            )}
            <form action={logOut}>
              <button
                type="submit"
                className="rounded-full border border-ink/15 px-4 py-2 font-semibold text-ink/70 hover:bg-ink/[.04]"
              >
                Log out
              </button>
            </form>
          </div>
        </div>
      </header>
      <main className="mx-auto w-full max-w-2xl flex-1 px-5 py-8">
        {children}
      </main>
    </div>
  );
}
