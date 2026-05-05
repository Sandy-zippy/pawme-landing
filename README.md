# PawMe Landing

Static Next.js 14 site for **pawmebot.com** — rebuilt from the original Framer page so we own the funnel, the tracking, and the CRO levers.

## Architecture

- **Next.js 14 App Router** with `output: "export"` → static HTML in `out/`
- **Tailwind CSS** + Framer Motion
- **Two routes**: `/` landing + `/thank-you/` (Stripe redirects here post-payment)
- **Funnel**: every CTA → email-gate popup → POST to GHL inbound webhook → Stripe Payment Link with `prefilled_email` → Stripe redirects to `/thank-you/` → second event fired to GHL with `stage=purchased`
- **Tracking**: Microsoft Clarity, Meta Pixel, GA4 (env-driven, all `NEXT_PUBLIC_*`)

## Local dev

```bash
cp .env.example .env.local   # fill in IDs
npm install
npm run dev                   # http://localhost:3030
```

## Build (static export)

```bash
npm run build                 # outputs to ./out
```

## Deploy

Auto-deployed by `.github/workflows/pages.yml` on push to `main`. Output lands on the `gh-pages` branch and is served by GitHub Pages.

To wire `pawmebot.com`:
1. In repo Settings → Pages, set source to `gh-pages` branch
2. Add custom domain `pawmebot.com`
3. Update DNS at the registrar:
   - `A` records to GitHub Pages IPs (185.199.108.153, 185.199.109.153, 185.199.110.153, 185.199.111.153)
   - or `CNAME` `www.pawmebot.com` → `sandy-zippy.github.io`

## Environment variables (build-time)

Set as **Repository secrets** (`Settings → Secrets and variables → Actions`):

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_GHL_INBOUND_WEBHOOK_URL` | GHL inbound webhook URL for the PawMe location |
| `NEXT_PUBLIC_CLARITY_PROJECT_ID` | Microsoft Clarity project ID |
| `NEXT_PUBLIC_META_PIXEL_ID` | Meta Pixel ID |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | GA4 measurement ID (optional) |

These are public by design (they ship in the bundle). The GHL webhook is intended to be called from the browser.

## Conversion API (CAPI)

CAPI runs server-side and **cannot** run from a static GitHub Pages site directly. Two options:
1. **Route through GHL** — GHL has built-in CAPI forwarding; configure it inside the Meta Ads integration on the PawMe sub-account. The browser fires Pixel + the GHL webhook fires CAPI.
2. **Cloudflare Worker** — drop a tiny Worker at `capi.pawmebot.com` that receives events and forwards to Meta's Conversions API. Wire it as an additional fetch in `EmailGate.tsx` / `ThankYouClient.tsx`.

We're going with option 1 to keep ops simple.

## Project layout

```
app/                 Next App Router pages
  layout.tsx           Root layout + Tracking
  page.tsx             /
  thank-you/page.tsx   /thank-you
components/
  LandingPage.tsx      Top-level landing composition
  EmailGate.tsx        Email-capture modal
  LiveFeed.tsx         Animated activity-feed motion graphic
  CountUp.tsx          Number counter component
  ThankYouClient.tsx   Post-purchase confirmation
  Tracking.tsx         Clarity / Pixel / GA4 + helper exports
  icons.tsx            Inline SVG icon set
lib/
  siteConfig.ts        All public/CRO knobs (prices, social, env IDs)
public/
  assets/images/       Logo, bots, polaroid portraits, app mockup
  assets/video/        meet-pawme.mp4 hero video
  favicon.png
```
