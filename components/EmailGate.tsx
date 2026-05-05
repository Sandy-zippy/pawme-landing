"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { siteConfig } from "@/lib/siteConfig";
import { trackLead } from "./Tracking";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

function captureUtm(): Record<string, string> {
  try {
    return JSON.parse(localStorage.getItem("pawme_utm") || "{}");
  } catch { return {}; }
}

export default function EmailGate({ isOpen, onClose }: Props) {
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setError(null);
    if (!email || !firstName) {
      setError("Add your first name and email to continue.");
      return;
    }
    setSubmitting(true);

    const utm = captureUtm();
    const payload = {
      first_name: firstName,
      email,
      stage: "lp_email_gate",
      source: "pawmebot.com",
      page_url: typeof window !== "undefined" ? window.location.href : "",
      referrer: typeof document !== "undefined" ? document.referrer : "",
      ...utm,
      timestamp: new Date().toISOString(),
    };

    // Persist for thank-you tagging
    try {
      localStorage.setItem("pawme_user", JSON.stringify({ first_name: firstName, email, ts: Date.now() }));
    } catch {}

    // Fire pixels (Lead event for Meta + GA + Clarity)
    trackLead({ email, firstName });

    // Post directly to GHL inbound webhook (no-cors so we don't see the response,
    // but the data reaches GHL — this is by design for inbound webhooks).
    if (siteConfig.ghlInboundWebhookUrl) {
      try {
        await fetch(siteConfig.ghlInboundWebhookUrl, {
          method: "POST",
          mode: "no-cors",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
          keepalive: true,
        });
      } catch {}
    }

    // Build Stripe URL with prefilled email + reference
    const stripeUrl = new URL(siteConfig.stripePaymentLink);
    stripeUrl.searchParams.set("prefilled_email", email);
    stripeUrl.searchParams.set("client_reference_id", `pawme_${Date.now()}`);
    window.location.href = stripeUrl.toString();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
        >
          <motion.div
            initial={{ y: 24, opacity: 0, scale: 0.96 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 24, opacity: 0, scale: 0.96 }}
            transition={{ type: "spring", damping: 22, stiffness: 280 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md rounded-3xl bg-white p-7 sm:p-8 shadow-2xl"
          >
            <button
              type="button" aria-label="Close" onClick={onClose}
              className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 transition"
            >✕</button>

            <div className="mb-1 text-xs font-bold uppercase tracking-widest text-brand-green">Reserve your VIP spot</div>
            <h3 className="font-heading text-2xl sm:text-[28px] font-extrabold leading-tight text-brand-dark">
              Lock in 50% off for just $1.
            </h3>
            <p className="mt-2 text-[15px] leading-relaxed text-slate-600">
              We'll send your VIP receipt and shipping updates to your email. Pay just <span className="font-bold text-brand-dark">$1 today</span>, the remaining $198 when PawMe ships. 100% refundable.
            </p>

            <form onSubmit={handleSubmit} className="mt-5 space-y-3">
              <input
                type="text" value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="First name" autoComplete="given-name" required
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-5 py-3.5 text-base text-brand-dark outline-none transition focus:border-brand-green focus:bg-white focus:ring-4 focus:ring-brand-green/15"
              />
              <input
                type="email" value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@email.com" autoComplete="email" required
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-5 py-3.5 text-base text-brand-dark outline-none transition focus:border-brand-green focus:bg-white focus:ring-4 focus:ring-brand-green/15"
              />
              {error && <div className="text-sm text-brand-red">{error}</div>}
              <motion.button
                type="submit" disabled={submitting}
                whileHover={{ scale: submitting ? 1 : 1.02 }}
                whileTap={{ scale: submitting ? 1 : 0.98 }}
                className="w-full rounded-full bg-primary-gradient px-6 py-4 text-base font-extrabold text-white shadow-button disabled:opacity-70"
              >
                {submitting ? "Reserving…" : "Continue to checkout — $1 today →"}
              </motion.button>
            </form>

            <div className="mt-4 flex items-center justify-center gap-4 text-[11px] font-semibold text-slate-400">
              <span>🔒 Secure</span>
              <span>💳 Stripe</span>
              <span>✉️ Refundable</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
