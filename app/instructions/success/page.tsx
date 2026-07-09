import Link from "next/link";
import { redirect } from "next/navigation";
import QRCode from "qrcode";
import { createClient } from "@/lib/supabase/server";
import { getBaseUrl } from "@/lib/baseUrl";
import { Logo } from "@/app/components/Logo";
import type { Profile } from "@/lib/types";
import { PrintButton } from "./PrintButton";
import { CarrierSetup } from "../CarrierSetup";

export default async function SuccessPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/instructions/success");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single<Profile>();
  if (!profile) redirect("/instructions");

  const base = await getBaseUrl();
  const confirmUrl = `${base}/instructions/confirm?address=${encodeURIComponent(
    profile.address_line1,
  )}&zip=${encodeURIComponent(profile.zip)}`;

  const qrDataUrl = await QRCode.toDataURL(confirmUrl, {
    width: 520,
    margin: 1,
    color: { dark: "#414042", light: "#ffffff" },
  });

  return (
    <div className="flex min-h-full flex-col">
      <header className="no-print border-b border-ink/10 bg-white">
        <div className="mx-auto flex w-full max-w-2xl items-center justify-between px-5 py-4">
          <Logo href="/instructions" />
          <Link
            href="/instructions"
            className="text-sm font-semibold text-brand hover:text-brand-dark"
          >
            ← Back to instructions
          </Link>
        </div>
      </header>

      <main className="mx-auto w-full max-w-2xl flex-1 px-5 py-8">
        <div className="no-print mb-6">
          <h1 className="font-display text-3xl font-extrabold text-ink">
            Your door card is ready
          </h1>
          <p className="mt-2 text-ink/60">
            Print it and place it near your door or on your Lockerly. Drivers
            scan the code to confirm they should deliver here.
          </p>
          {!profile.deliver_to_lockerly && (
            <p className="mt-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
              Heads up: delivery is currently <strong>off</strong>. Drivers who
              scan will see that this address is paused. Turn it on from your
              instructions page.
            </p>
          )}
        </div>

        {/* The printable card */}
        <div className="print-card mx-auto max-w-md overflow-hidden rounded-3xl border border-ink/10 bg-white shadow-lg">
          <div className="brand-gradient px-8 py-6 text-center text-white">
            <Logo variant="white" href={null} className="mx-auto h-9" />
            <p className="mt-3 font-display text-sm font-semibold uppercase tracking-widest text-white/85">
              Delivery instructions
            </p>
          </div>
          <div className="px-8 py-8 text-center">
            <p className="font-display text-2xl font-extrabold leading-snug text-ink">
              Driver: please leave all packages{" "}
              <span className="text-brand">in the Lockerly.</span>
            </p>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={qrDataUrl}
              alt="Scan for delivery instructions"
              className="mx-auto mt-6 h-56 w-56"
            />
            <p className="mt-3 text-sm font-semibold text-ink/60">
              Scan to confirm delivery instructions
            </p>
            <p className="mt-6 border-t border-ink/10 pt-4 font-display text-lg font-bold text-ink">
              {profile.address_line1}
              {profile.address_line2 ? `, ${profile.address_line2}` : ""}
            </p>
            <p className="text-ink/60">
              {profile.city}, {profile.state} {profile.zip}
            </p>
          </div>
        </div>

        <div className="no-print mt-8 flex flex-col gap-3 sm:flex-row">
          <PrintButton />
          <Link
            href="/instructions"
            className="inline-flex h-12 items-center justify-center rounded-full border border-ink/15 px-7 font-semibold text-ink hover:bg-ink/[.04]"
          >
            Done
          </Link>
        </div>

        {/* Step 2: set the same instruction inside each carrier account */}
        <div className="no-print mt-12 border-t border-ink/10 pt-8">
          <CarrierSetup customNotes={profile.custom_notes} />
          <p className="mt-6 text-center text-sm text-ink/55">
            Want to share these steps?{" "}
            <Link
              href="/setup/qr"
              className="font-semibold text-brand hover:text-brand-dark"
            >
              Print a scannable QR poster →
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
