// Public client-side config. Anything here ships in the bundle — never put secrets.
// Server-side env vars no longer apply since the site is statically exported to GitHub Pages.

export const siteConfig = {
  brand: "PawMe",
  domain: "pawmebot.com",
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

  social: {
    instagram: "https://instagram.com/pawmebot",
    tiktok: "https://tiktok.com/@pawmebot",
    facebook: "https://facebook.com/pawmebot",
  },

  // Tracking IDs — populated at build via NEXT_PUBLIC_* env vars.
  // GHL inbound webhook is also a public URL by design (it's a generic intake endpoint).
  tracking: {
    clarityProjectId: process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID ?? "",
    metaPixelId: process.env.NEXT_PUBLIC_META_PIXEL_ID ?? "",
    gaMeasurementId: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ?? "",
  },

  ghlInboundWebhookUrl: process.env.NEXT_PUBLIC_GHL_INBOUND_WEBHOOK_URL ?? "",
};
