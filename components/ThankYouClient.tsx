"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CheckIcon, SparkleIcon, BellIcon, HeartIcon } from "./icons";
import { siteConfig } from "@/lib/siteConfig";
import { trackPurchase } from "./Tracking";

export default function ThankYouClient() {
  const [firstName, setFirstName] = useState<string>("");

  useEffect(() => {
    let email = "", name = "";
    try {
      const raw = localStorage.getItem("pawme_user");
      if (raw) {
        const u = JSON.parse(raw);
        email = u.email || "";
        name = u.first_name || "";
        setFirstName(name);
      }
    } catch {}

    const params = new URLSearchParams(window.location.search);
    const sessionId = params.get("session_id") || "";

    // Forward purchase event directly to GHL webhook so the contact moves to the right pipeline stage
    if (email && siteConfig.ghlInboundWebhookUrl) {
      try {
        let utm = {};
        try { utm = JSON.parse(localStorage.getItem("pawme_utm") || "{}"); } catch {}
        fetch(siteConfig.ghlInboundWebhookUrl, {
          method: "POST",
          mode: "no-cors",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            first_name: name,
            email,
            stage: "purchased",
            source: "pawmebot.com",
            page_url: window.location.href,
            session_id: sessionId,
            ...utm,
            timestamp: new Date().toISOString(),
          }),
          keepalive: true,
        });
      } catch {}
    }

    trackPurchase({ email, sessionId });
  }, []);

  const nextSteps = [
    { icon: <BellIcon size={18} color="#FF9F43" />, title: "Watch your inbox", body: "Your VIP receipt is on its way. We email shipping and product updates only — never spam." },
    { icon: <SparkleIcon size={18} color="#0085FF" />, title: "Lock-in confirmed", body: "Your $199 VIP price is secured. The remaining $198 is only charged when PawMe ships." },
    { icon: <HeartIcon size={18} color="#FF6B6B" />, title: "Refer a friend", body: "Send PawMe to one fellow pet parent and we'll upgrade your warranty to 3 years, on us." },
  ];

  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-b from-white to-[#F0FDF8] text-brand-dark">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(4,218,141,0.18)_0%,transparent_55%)] pointer-events-none" />

      <header className="relative z-10 mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-5 sm:px-8">
        <div className="flex items-center gap-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/assets/images/logo-mark.png" alt="" className="h-8 w-8 rounded-md object-contain" />
          <span className="font-heading text-lg font-extrabold tracking-tight">PawMe</span>
        </div>
      </header>

      <section className="relative z-10 mx-auto max-w-3xl px-5 sm:px-8 pt-8 pb-20 text-center">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 220, damping: 18 }}
          className="mx-auto mb-7 grid h-20 w-20 place-items-center rounded-full bg-primary-gradient shadow-button"
        >
          <CheckIcon size={42} color="#fff" />
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <div className="inline-flex items-center gap-2 rounded-full bg-brand-green/10 px-4 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.18em] text-brand-green">
            <SparkleIcon size={12} color="#04DA8D" /> VIP RESERVED
          </div>
          <h1 className="mt-5 font-heading text-[40px] sm:text-[60px] font-black leading-tight tracking-tight">
            {firstName ? `${firstName}, you're in.` : "You're in."}
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-[17px] sm:text-[19px] leading-relaxed text-slate-600">
            Your $1 deposit locked in <span className="font-extrabold text-brand-dark">{`$${siteConfig.pricing.vip.total} VIP pricing`}</span> ({siteConfig.pricing.vip.off}). PawMe ships first to the VIP family.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-12 grid gap-4 text-left sm:grid-cols-3"
        >
          {nextSteps.map((step, i) => (
            <div key={i} className="rounded-2xl bg-white p-5 shadow-card">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-slate-50">{step.icon}</div>
              <h3 className="mt-4 font-heading text-[16px] font-extrabold">{step.title}</h3>
              <p className="mt-1.5 text-[14px] leading-relaxed text-slate-600">{step.body}</p>
            </div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35 }}
          className="mt-14"
        >
          <div className="rounded-3xl border border-slate-100 bg-white p-7 sm:p-9 shadow-card text-left">
            <div className="text-[12px] font-extrabold uppercase tracking-widest text-brand-green">What happens next</div>
            <ol className="mt-4 space-y-3 text-[15px] sm:text-[16px] leading-relaxed text-slate-700">
              <li className="flex gap-3"><span className="font-extrabold text-brand-dark">1.</span> Look for our welcome email in the next few minutes — add hello@pawmebot.com to your contacts so it doesn't land in spam.</li>
              <li className="flex gap-3"><span className="font-extrabold text-brand-dark">2.</span> We'll send Kickstarter launch early-access in Q2 2026 — VIPs get to claim units 24h before public.</li>
              <li className="flex gap-3"><span className="font-extrabold text-brand-dark">3.</span> When PawMe ships in Q4 2026, you're charged the remaining $198 and your unit goes out priority.</li>
            </ol>
          </div>

          <div className="mt-8 flex flex-col items-center gap-3 text-center">
            <a
              href="/"
              className="text-[13px] font-bold text-slate-400 underline-offset-4 hover:text-slate-600 hover:underline"
            >
              ← Back to PawMe home
            </a>
          </div>
        </motion.div>
      </section>

      <footer className="relative z-10 border-t border-slate-100 bg-white py-8 text-center text-[12px] text-slate-400">
        © 2026 PawMe. All rights reserved.
      </footer>
    </main>
  );
}
