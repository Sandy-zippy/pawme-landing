// Public client-side config. Anything here ships in the bundle — never put secrets.
// Server-side env vars no longer apply since the site is statically exported to GitHub Pages.

export const siteConfig = {
  brand: "PawMe",
  domain: "pawmebot.com",
  // Customer-facing outbound address — appears in the thank-you "watch your inbox" copy
  // and in the footer so customers can whitelist it.
  supportEmail: "pawme@ayvalabs.com",
  founder: { name: "Ashok", title: "Founder & CEO, PawMe" },

  vipCount: "847",
  vipSpotsRemaining: "153",

  // Existing $1-deposit Stripe Payment Link.
  // Stripe is configured to redirect to /thank-you/ after successful payment.
  stripePaymentLink: "https://buy.stripe.com/4gMbJ13EegzXaUMbuq9Ve00",

  pricing: {
    vip: { label: "VIP", today: 1, total: 199, retail: 399, off: "50% OFF" },
    earlyBird: { label: "Early Bird", price: 249, retail: 399, off: "38% OFF" },
    retail: { label: "Retail", price: 399 },
  },

  // Tracking IDs — populated at build via NEXT_PUBLIC_* env vars.
  tracking: {
    clarityProjectId: process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID ?? "wmeree76xu",
    metaPixelId: process.env.NEXT_PUBLIC_META_PIXEL_ID ?? "1957428058474676",
    gaMeasurementId: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ?? "",
  },

  // n8n webhook — handles both Lead and Purchase via event_name in payload.
  // Public by design (anti-spam handled inside the n8n workflow).
  eventsWebhookUrl: process.env.NEXT_PUBLIC_EVENTS_WEBHOOK_URL ?? "https://sandyautomations.app.n8n.cloud/webhook/pawme-events",
};
