import { createClient } from "@/lib/supabase/server";
import { addressKey, CARRIERS, type PublicInstruction } from "@/lib/types";
import { Logo } from "@/app/components/Logo";

export const metadata = {
  title: "Lockerly — Delivery instructions for this address",
};

export default async function ConfirmPage({
  searchParams,
}: {
  searchParams: Promise<{ address?: string; zip?: string }>;
}) {
  const { address, zip } = await searchParams;

  let instruction: PublicInstruction | null = null;
  let looked = false;

  if (address && zip) {
    looked = true;
    const supabase = await createClient();
    const key = addressKey({ address_line1: address, zip });
    // Public, non-PII lookup via a SECURITY DEFINER function (see schema.sql).
    const { data } = await supabase.rpc("lookup_instruction", {
      p_address_key: key,
    });
    const row = Array.isArray(data) ? data[0] : null;
    if (row) instruction = row as PublicInstruction;
  }

  return (
    <div className="flex min-h-full flex-col bg-white">
      <div className="mx-auto flex w-full max-w-md flex-1 flex-col px-5 py-8">
        <Logo href={null} />

        {/* Case: opted in and active */}
        {instruction && instruction.deliver_to_lockerly && (
          <Active instruction={instruction} />
        )}

        {/* Case: found but paused */}
        {instruction && !instruction.deliver_to_lockerly && (
          <Notice
            tone="paused"
            title="Lockerly delivery is paused here"
            body="This resident has temporarily turned off Lockerly delivery. Please deliver as you normally would."
            instruction={instruction}
          />
        )}

        {/* Case: no record */}
        {looked && !instruction && (
          <Notice
            tone="none"
            title="No Lockerly instructions on file"
            body="We don't have delivery instructions for this address. Please deliver as you normally would."
          />
        )}

        {/* Case: opened directly with no address */}
        {!looked && (
          <Notice
            tone="none"
            title="Scan a Lockerly door card"
            body="This page shows delivery instructions when reached from a resident's Lockerly QR code."
          />
        )}

        <p className="mt-auto pt-10 text-center text-xs text-ink/40">
          Powered by Lockerly · Packages that make it inside
        </p>
      </div>
    </div>
  );
}

function Active({ instruction }: { instruction: PublicInstruction }) {
  const allowed = instruction.allowed_carriers ?? [];
  const carriersLabel =
    allowed.length === 0
      ? "All carriers welcome"
      : CARRIERS.filter((c) => allowed.includes(c.id))
          .map((c) => c.label)
          .join(", ") + " only";

  return (
    <div className="mt-6">
      <div className="rounded-3xl border-2 border-brand bg-brand-tint p-6 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-brand text-3xl text-white">
          ✓
        </div>
        <p className="mt-4 font-display text-sm font-bold uppercase tracking-widest text-brand-dark">
          Deliver here
        </p>
        <h1 className="mt-2 font-display text-3xl font-extrabold leading-tight text-ink">
          Leave all packages in the Lockerly
        </h1>
        <p className="mt-3 text-ink/70">
          This resident has a Lockerly pass-through unit. Place the package
          inside — the door closes and it slides safely into the home. No code,
          nothing to scan.
        </p>
      </div>

      <dl className="mt-6 space-y-3">
        <Row label="Address">
          {instruction.address_line1}
          {instruction.address_line2 ? `, ${instruction.address_line2}` : ""}
          {", "}
          {instruction.city}, {instruction.state} {instruction.zip}
        </Row>
        <Row label="Carriers">{carriersLabel}</Row>
        {instruction.custom_notes && (
          <Row label="Notes from resident">
            <span className="italic">“{instruction.custom_notes}”</span>
          </Row>
        )}
      </dl>
    </div>
  );
}

function Row({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-ink/10 bg-white px-4 py-3">
      <dt className="text-xs font-bold uppercase tracking-wide text-ink/45">
        {label}
      </dt>
      <dd className="mt-0.5 font-semibold text-ink">{children}</dd>
    </div>
  );
}

function Notice({
  tone,
  title,
  body,
  instruction,
}: {
  tone: "paused" | "none";
  title: string;
  body: string;
  instruction?: PublicInstruction;
}) {
  const ring = tone === "paused" ? "border-amber-300 bg-amber-50" : "border-ink/15 bg-white";
  return (
    <div className="mt-6">
      <div className={`rounded-3xl border-2 ${ring} p-6 text-center`}>
        <h1 className="font-display text-2xl font-extrabold text-ink">
          {title}
        </h1>
        <p className="mt-3 text-ink/70">{body}</p>
      </div>
      {instruction && (
        <p className="mt-4 text-center text-sm text-ink/50">
          {instruction.address_line1}, {instruction.city}, {instruction.state}{" "}
          {instruction.zip}
        </p>
      )}
    </div>
  );
}
