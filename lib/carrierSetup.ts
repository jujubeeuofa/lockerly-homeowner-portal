/**
 * Per-carrier instructions the homeowner follows to route packages to their
 * Lockerly inside each carrier's own account. Exact menu labels change over
 * time, so steps are kept to the stable path + what to do. Each carrier has a
 * free-text "delivery instructions / notes" field — that's where the suggested
 * note (see suggestedNote() below) goes.
 */
export type CarrierGuide = {
  id: string;
  name: string;
  /** Free tool the homeowner needs (if any) to set standing instructions. */
  program?: string;
  url: string;
  /** Short, ordered steps. Last step is usually "paste the note". */
  steps: string[];
};

export const CARRIER_GUIDES: CarrierGuide[] = [
  {
    id: "amazon",
    name: "Amazon",
    url: "https://www.amazon.com/a/addresses",
    steps: [
      "Open Your Addresses (Account & Lists → Your Addresses).",
      "Find your address and choose Edit.",
      "Open “Add delivery instructions.”",
      "Set property type to House, and under “Where should we leave your packages?” pick a specific spot.",
      "Paste the note into the “Additional instructions” box and Save.",
    ],
  },
  {
    id: "ups",
    name: "UPS",
    program: "UPS My Choice (free)",
    url: "https://www.ups.com/mychoice",
    steps: [
      "Enroll in UPS My Choice (free) if you haven’t, using this address.",
      "Go to Preferences → Delivery Instructions.",
      "Choose to leave packages at a specific location at the door.",
      "Paste the note into the delivery instructions field and Save.",
    ],
  },
  {
    id: "fedex",
    name: "FedEx",
    program: "FedEx Delivery Manager (free)",
    url: "https://www.fedex.com/en-us/delivery-manager.html",
    steps: [
      "Sign up for FedEx Delivery Manager (free) for this address.",
      "Open Delivery Instructions → “Where to leave my package.”",
      "Select a specific location and add access details.",
      "Paste the note into the instructions field and Save.",
    ],
  },
  {
    id: "usps",
    name: "USPS",
    program: "USPS Informed Delivery (free)",
    url: "https://informeddelivery.usps.com",
    steps: [
      "Create/verify a free USPS Informed Delivery account for this address.",
      "Use Delivery Instructions to set a standing preference for your carrier.",
      "Note where the Lockerly is and that all packages go inside it.",
    ],
  },
];

/** The text the homeowner pastes into each carrier's instructions field. */
export function suggestedNote(customNotes?: string | null): string {
  const base =
    "Deliver through the Lockerly — a secure pass-through door. Please place ALL packages inside; the door closes and the package slides safely into the home. No code or signature needed.";
  const extra = customNotes?.trim();
  return extra ? `${base} ${extra}` : base;
}

/** Amazon's free-text field is short — a trimmed version for tight fields. */
export function suggestedNoteShort(): string {
  return "Leave ALL packages inside the Lockerly pass-through door. No code needed.";
}
