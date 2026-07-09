import Link from "next/link";
import QRCode from "qrcode";
import { getBaseUrl } from "@/lib/baseUrl";
import { Logo } from "@/app/components/Logo";
import { PrintButton } from "@/app/instructions/success/PrintButton";

export const metadata = {
  title: "Lockerly — Setup QR poster",
};

export default async function SetupQrPage() {
  const base = await getBaseUrl();
  const setupUrl = `${base}/setup`;
  const qrDataUrl = await QRCode.toDataURL(setupUrl, {
    width: 640,
    margin: 1,
    color: { dark: "#414042", light: "#ffffff" },
  });

  return (
    <div className="flex min-h-full flex-col">
      <header className="no-print border-b border-ink/10 bg-white">
        <div className="mx-auto flex w-full max-w-2xl items-center justify-between px-5 py-4">
          <Logo href="/setup" />
          <Link
            href="/setup"
            className="text-sm font-semibold text-brand hover:text-brand-dark"
          >
            ← Back to setup
          </Link>
        </div>
      </header>

      <main className="mx-auto w-full max-w-2xl flex-1 px-5 py-8">
        <div className="no-print mb-6">
          <h1 className="font-display text-3xl font-extrabold text-ink">
            Setup QR poster
          </h1>
          <p className="mt-2 text-ink/60">
            Print this and place it on the Lockerly unit, packaging, or an
            install flyer. Anyone who scans it lands on the setup guide.
          </p>
        </div>

        {/* Printable poster */}
        <div className="print-card mx-auto max-w-md overflow-hidden rounded-3xl border border-ink/10 bg-white shadow-lg">
          <div className="brand-gradient px-8 py-6 text-center text-white">
            <Logo variant="white" href={null} className="mx-auto h-9" />
            <p className="mt-3 font-display text-sm font-semibold uppercase tracking-widest text-white/85">
              Set up your deliveries
            </p>
          </div>
          <div className="px-8 py-8 text-center">
            <p className="font-display text-2xl font-extrabold leading-snug text-ink">
              Scan to set up your{" "}
              <span className="text-brand">Lockerly deliveries</span>
            </p>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={qrDataUrl}
              alt="Scan to set up your Lockerly deliveries"
              className="mx-auto mt-6 h-60 w-60"
            />
            <p className="mt-4 font-display text-lg font-bold text-ink">
              {setupUrl.replace(/^https?:\/\//, "")}
            </p>
            <p className="mt-2 text-sm text-ink/60">
              Create your account, flip one switch, and every carrier delivers
              through your Lockerly.
            </p>
          </div>
        </div>

        <div className="no-print mt-8 flex flex-col gap-3 sm:flex-row">
          <PrintButton />
          <Link
            href="/setup"
            className="inline-flex h-12 items-center justify-center rounded-full border border-ink/15 px-7 font-semibold text-ink hover:bg-ink/[.04]"
          >
            Back to setup
          </Link>
        </div>

        {process.env.NEXT_PUBLIC_SITE_URL ? null : (
          <p className="no-print mt-4 text-xs text-ink/45">
            Note: this QR currently points at{" "}
            <code>{setupUrl}</code>. Set <code>NEXT_PUBLIC_SITE_URL</code> to
            your production domain before printing for real, so the code
            resolves off this machine.
          </p>
        )}
      </main>
    </div>
  );
}
