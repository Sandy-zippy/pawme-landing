"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CheckIcon, BrainIcon, CameraIcon, BellIcon, HeartIcon } from "./icons";
import { siteConfig } from "@/lib/siteConfig";
import { trackPurchase } from "./Tracking";

const CrownIcon = ({ size = 14, color = "#04DA8D" }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M3 8l4 5 5-7 5 7 4-5 1 12H2L3 8z" fill={color} opacity="0.9" />
  </svg>
);

const PartyIcon = ({ size = 32 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
    <path d="M5 27L18 14L23 19L10 32L5 27Z" fill="#FF9F43" />
    <path d="M14 16l1-3M22 13l3-1M21 8l1-3M27 18l3 1M17 6l1.5-2" stroke="#04DA8D" strokeWidth="2" strokeLinecap="round" />
    <circle cx="13" cy="11" r="1.5" fill="#0085FF" />
    <circle cx="26" cy="22" r="1.5" fill="#FF6B6B" />
    <circle cx="20" cy="3" r="1.2" fill="#8E54E9" />
  </svg>
);

function TimelineItem({ tag, title, body, icon, color, last }: {
  tag: string; title: string; body: string; icon: React.ReactNode; color: string; last?: boolean;
}) {
  return (
    <div className="relative grid grid-cols-[40px_1fr] gap-4 sm:gap-5">
      {/* Vertical line connector */}
      {!last && <div className="absolute left-[19px] top-10 bottom-[-22px] w-px bg-gradient-to-b from-white/10 to-transparent" />}
      <div className="grid h-10 w-10 place-items-center rounded-xl bg-white/5 ring-1 ring-white/10">{icon}</div>
      <div className="pb-6">
        <div className="text-[10px] font-extrabold uppercase tracking-[0.18em]" style={{ color }}>{tag}</div>
        <h4 className="mt-0.5 font-heading text-[16px] sm:text-[17px] font-extrabold text-white">{title}</h4>
        <p className="mt-1 text-[13.5px] sm:text-[14.5px] leading-relaxed text-white/60">{body}</p>
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, body, glow }: { icon: React.ReactNode; title: string; body: string; glow: string }) {
  return (
    <motion.div
      whileHover={{ y: -3 }}
      className="relative overflow-hidden rounded-2xl bg-white/[0.04] ring-1 ring-white/[0.07] p-5 backdrop-blur-sm"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-50"
        style={{ background: `radial-gradient(circle at 50% 0%, ${glow}, transparent 60%)` }}
      />
      <div className="relative">
        <div className="grid h-10 w-10 place-items-center rounded-xl bg-white/[0.06]">{icon}</div>
        <h4 className="mt-3 font-heading text-[15px] font-extrabold text-white">{title}</h4>
        <p className="mt-1 text-[12.5px] leading-relaxed text-white/55">{body}</p>
      </div>
    </motion.div>
  );
}

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

    if (email && siteConfig.ghlInboundWebhookUrl) {
      try {
        let utm = {};
        try { utm = JSON.parse(localStorage.getItem("pawme_utm") || "{}"); } catch {}
        fetch(siteConfig.ghlInboundWebhookUrl, {
          method: "POST",
          mode: "no-cors",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            first_name: name, email,
            stage: "purchased", source: "pawmebot.com",
            page_url: window.location.href, session_id: sessionId,
            ...utm, timestamp: new Date().toISOString(),
          }),
          keepalive: true,
        });
      } catch {}
    }

    trackPurchase({ email, sessionId });
  }, []);

  return (
    <main className="relative min-h-screen overflow-hidden bg-brand-dark text-white">
      {/* Atmospheric green glow + corner blobs */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_0%,rgba(4,218,141,0.18),transparent_70%)]" />
      <div className="pointer-events-none absolute top-1/3 left-[-10%] h-[40vw] w-[40vw] rounded-full bg-brand-green/[0.06] blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-[-10%] h-[40vw] w-[40vw] rounded-full bg-brand-blue/[0.06] blur-3xl" />

      <div className="relative z-10 mx-auto max-w-3xl px-5 sm:px-8 pt-16 sm:pt-20 pb-16">
        {/* Hero check halo */}
        <div className="text-center">
          <motion.div
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 220, damping: 20 }}
            className="relative mx-auto mb-6 grid h-20 w-20 place-items-center"
          >
            <span className="absolute inset-0 rounded-full bg-brand-green/30 blur-xl" />
            <span className="absolute inset-0 rounded-full ring-2 ring-brand-green/40 animate-pulse" />
            <span className="relative grid h-20 w-20 place-items-center rounded-full bg-brand-green shadow-[0_0_60px_rgba(4,218,141,0.45)]">
              <CheckIcon size={36} color="#fff" />
            </span>
          </motion.div>

          <motion.div
            initial={{ y: 14, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 rounded-full bg-brand-green/10 px-4 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.2em] text-brand-green ring-1 ring-brand-green/20"
          >
            <CrownIcon size={13} color="#04DA8D" /> VIP Member
          </motion.div>

          <motion.h1
            initial={{ y: 16, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.18 }}
            className="mt-5 font-heading text-[36px] sm:text-[60px] font-black leading-[1.05] tracking-tight bg-gradient-to-r from-[#3FE0BF] via-[#34D9C0] to-[#3FB6E0] bg-clip-text text-transparent"
          >
            {firstName ? `${firstName}, you just changed your pet's life.` : "You just changed your pet's life."}
          </motion.h1>

          <motion.p
            initial={{ y: 16, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.25 }}
            className="mx-auto mt-5 max-w-xl text-[15px] sm:text-[16.5px] leading-relaxed text-white/65"
          >
            Your $1 VIP reservation is confirmed. You've locked in <span className="font-extrabold text-white">${siteConfig.pricing.vip.total}</span> ({siteConfig.pricing.vip.off} off ${siteConfig.pricing.vip.retail} retail), first-batch shipping, and a free charging dock. Here's what happens next.
          </motion.p>
        </div>

        {/* Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="mt-14 sm:mt-16"
        >
          <h2 className="text-center font-heading text-[22px] sm:text-[26px] font-extrabold text-white">Your VIP journey starts now</h2>
          <div className="mt-7 sm:mt-9">
            <TimelineItem
              tag="Right now"
              title="Check your inbox"
              body={`Your VIP confirmation email is on its way from ${siteConfig.supportEmail} — it has everything you need, including your reservation details and what to expect.`}
              icon={<BellIcon size={18} color="#04DA8D" />}
              color="#04DA8D"
            />
            <TimelineItem
              tag="This week"
              title="You're in the inner circle"
              body="Expect behind-the-scenes updates on PawMe development, early feature reveals, and direct access to our team. You'll know things before anyone else."
              icon={<BrainIcon size={18} color="#FF9F43" />}
              color="#FF9F43"
            />
            <TimelineItem
              tag="Before launch"
              title="Early beta access to PawMe app"
              body="You'll be the first to try the PawMe app — track your pet, set safe zones, and explore AI features. Your feedback shapes what we build."
              icon={<CameraIcon size={18} color="#FF6B6B" />}
              color="#FF6B6B"
            />
            <TimelineItem
              tag="Launch day (Q4 2026)"
              title="PawMe ships to you first"
              body={`Your pet gets their companion before anyone else. The remaining $${siteConfig.pricing.vip.total - 1} is charged at shipping — and your $${siteConfig.pricing.vip.total} VIP price is locked in forever.`}
              icon={<HeartIcon size={18} color="#3FB6E0" />}
              color="#3FB6E0"
              last
            />
          </div>
        </motion.div>

        {/* Feature cards */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-12 sm:mt-14"
        >
          <h2 className="text-center font-heading text-[22px] sm:text-[26px] font-extrabold text-white">What your pet is getting</h2>
          <p className="mt-2 text-center text-[13px] sm:text-[14px] text-white/55">
            Everything you need to never leave them truly alone again
          </p>
          <div className="mt-6 sm:mt-8 grid grid-cols-2 gap-3 sm:gap-4">
            <FeatureCard glow="rgba(4,218,141,0.18)" icon={<BrainIcon size={20} color="#04DA8D" />} title="AI Companion" body="Follows your pet room to room — they're never truly alone." />
            <FeatureCard glow="rgba(255,107,107,0.18)" icon={<CameraIcon size={20} color="#FF6B6B" />} title="Live GPS Tracking" body="Know exactly where they are, anytime." />
            <FeatureCard glow="rgba(142,84,233,0.18)" icon={<BellIcon size={20} color="#8E54E9" />} title="Anxiety Detection" body="AI learns their patterns and alerts you early." />
            <FeatureCard glow="rgba(0,133,255,0.18)" icon={<HeartIcon size={20} color="#0085FF" />} title="Health Monitoring" body="Activity, sleep, and wellness — all tracked." />
          </div>
        </motion.div>

        {/* Reservation summary */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65 }}
          className="mt-12 sm:mt-14 rounded-3xl bg-white/[0.04] ring-1 ring-white/[0.08] p-6 sm:p-8 backdrop-blur-sm"
        >
          <div className="flex flex-col items-center text-center">
            <PartyIcon size={36} />
            <h3 className="mt-3 font-heading text-[20px] sm:text-[22px] font-extrabold text-white">Your VIP Reservation Summary</h3>
          </div>

          <div className="mt-6 divide-y divide-white/[0.06] text-[14.5px]">
            {[
              { k: "VIP Price", v: <><span className="font-extrabold text-brand-green">${siteConfig.pricing.vip.total}</span> <span className="text-white/40 text-[12px] ml-1">({siteConfig.pricing.vip.off} off ${siteConfig.pricing.vip.retail} retail)</span></> },
              { k: "Paid Today", v: <span className="font-extrabold text-brand-green">$1</span> },
              { k: "Due at Shipping", v: <span className="font-extrabold text-brand-green">${siteConfig.pricing.vip.total - 1}</span> },
              { k: "Charging Dock", v: <><span className="font-extrabold text-brand-green">Free</span> <span className="text-white/40 text-[12px] ml-1">($49 value included)</span></> },
              { k: "Shipping Priority", v: <span className="font-extrabold text-brand-green">First Batch</span> },
              { k: "Refund Policy", v: <><span className="font-extrabold text-brand-green">100% Refundable</span> <span className="text-white/40 text-[12px] ml-1">Cancel anytime</span></> },
            ].map((row, i) => (
              <div key={i} className="flex items-center justify-between py-3 sm:py-3.5">
                <span className="text-white/60">{row.k}</span>
                <span>{row.v}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Founder note */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.75 }}
          className="mt-10 sm:mt-12 rounded-3xl bg-white/[0.03] ring-1 ring-white/[0.06] p-6 sm:p-8"
        >
          <p className="text-[14.5px] sm:text-[15.5px] leading-relaxed text-white/75 italic">
            "Thank you for believing in what we're building. PawMe started because we know the guilt of leaving our pets alone — and we're building the solution we wish existed. As a VIP founder, you're not just getting a product early. You're helping us build something that'll change how millions of pet parents feel every time they walk out the door."
          </p>
          <div className="mt-5 flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/assets/images/founder-ashok.png" alt="" className="h-10 w-10 rounded-full object-cover" />
            <div>
              <div className="font-heading text-[14px] font-extrabold text-white">The PawMe Team</div>
              <div className="text-[12.5px] text-white/50">Founders &amp; fellow pet parents</div>
            </div>
          </div>
        </motion.div>

        {/* Footer */}
        <div className="mt-12 sm:mt-14 border-t border-white/[0.06] pt-8 text-center">
          <div className="flex items-center justify-center gap-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/assets/images/pawme-logo.png" alt="PawMe" className="h-7 w-auto opacity-90" />
          </div>
          <p className="mt-3 text-[13px] text-white/45">Questions about your VIP reservation? We're here for you.</p>
          <a href={`mailto:${siteConfig.supportEmail}`} className="mt-1.5 inline-block font-extrabold text-brand-green hover:underline">
            {siteConfig.supportEmail}
          </a>
        </div>
      </div>
    </main>
  );
}
