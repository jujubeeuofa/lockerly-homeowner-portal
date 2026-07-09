/** Carriers a homeowner can opt to allow (empty selection = all carriers). */
export const CARRIERS = [
  { id: "usps", label: "USPS" },
  { id: "ups", label: "UPS" },
  { id: "fedex", label: "FedEx" },
  { id: "amazon", label: "Amazon" },
  { id: "dhl", label: "DHL" },
] as const;

export type CarrierId = (typeof CARRIERS)[number]["id"];

/** A homeowner's delivery profile row (public.profiles). */
export type Profile = {
  id: string;
  email: string;
  phone: string | null;
  address_line1: string;
  address_line2: string | null;
  city: string;
  state: string;
  zip: string;
  deliver_to_lockerly: boolean;
  custom_notes: string | null;
  /** Empty array = all carriers allowed. */
  allowed_carriers: CarrierId[];
  created_at: string;
  updated_at: string;
};

/** Shape returned to the public driver-facing confirm page (no PII beyond address). */
export type PublicInstruction = {
  address_line1: string;
  address_line2: string | null;
  city: string;
  state: string;
  zip: string;
  deliver_to_lockerly: boolean;
  custom_notes: string | null;
  allowed_carriers: CarrierId[];
};

/** Normalize an address into the canonical key used for the driver QR lookup. */
export function addressKey(parts: {
  address_line1: string;
  zip: string;
}): string {
  return `${parts.address_line1.trim().toLowerCase().replace(/\s+/g, " ")}|${parts.zip.trim()}`;
}
