# Lockerly — Homeowner Portal (MVP)

Sign up → flip one switch → print a QR door card. Every carrier delivers
through your Lockerly. Built with **Next.js 16 (App Router)** + **Supabase**
(Postgres + Auth). Mobile-first.

## Routes

| Route | Auth | What it is |
| --- | --- | --- |
| `/` | public | Marketing landing + how it works |
| `/setup` | public | Setup hub: account CTAs + carrier instructions (QR target) |
| `/setup/qr` | public | Printable QR poster that points at `/setup` |
| `/signup` | public | Email, password, phone (optional), address |
| `/login` | public | Log in |
| `/instructions` | **required** | The one toggle + notes + preferred carriers |
| `/instructions/success` | **required** | Printable QR door card + "tell your carriers" setup (Amazon / UPS / FedEx / USPS) |
| `/instructions/confirm?address=…&zip=…` | **public** | Driver-facing page the QR points at |

Auth is enforced in `proxy.ts` (Next 16's renamed middleware). The driver
confirm page is intentionally public.

## Setup

### 1. Create a Supabase project
At [supabase.com](https://supabase.com) → New project. Then open
**Settings → API** and copy the Project URL and the `anon` public key.

### 2. Configure env
```bash
cp .env.example .env.local
# paste your NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY
```

### 3. Apply the database schema
Open the Supabase **SQL Editor**, paste the contents of
[`supabase/schema.sql`](supabase/schema.sql), and run it. This creates:
- `public.profiles` (one row per homeowner, keyed to the auth user)
- a trigger that seeds a profile on signup (address comes from signup metadata)
- Row Level Security so each user only sees their own row
- `lookup_instruction(address_key)` — a `security definer` function the public
  driver page calls; it returns only delivery fields, never email/phone.

### 4. (Dev convenience) turn off email confirmation
**Authentication → Providers → Email → "Confirm email" = off** so signup logs
you straight in. With it on, signup shows a "check your email" notice instead.

### 5. Run
```bash
npm run dev      # http://localhost:3000
```

## How the driver QR works
The signage card encodes `…/instructions/confirm?address=<street>&zip=<zip>`.
That address is normalized to a lookup key (`lower(street)|zip`) and matched
against opted-in profiles via the `lookup_instruction` RPC — no login, and it
never exposes anything beyond the delivery instruction itself.

## Roadmap (v2)
- Dashboard: recent deliveries, unit door/battery status from the ESP32
- SMS "package arriving" alerts (GoHighLevel A2P) using the stored phone
- Auto-detect address from carrier tracking data
