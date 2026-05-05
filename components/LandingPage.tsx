"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useInView, AnimatePresence, useScroll, useTransform } from "framer-motion";
import EmailGate from "./EmailGate";
import LiveFeed from "./LiveFeed";
import CountUp from "./CountUp";
import KickstarterBar from "./KickstarterBar";
import { siteConfig } from "@/lib/siteConfig";
import {
  PawIcon, HeartIcon, ShieldIcon, CameraIcon, BellIcon, ClockIcon,
  CheckIcon, XIcon, SparkleIcon, ChartIcon, BrainIcon,
} from "./icons";

// ============================================================================
// PRIMITIVES
// ============================================================================
function GradientButton({
  children, onClick, className = "", size = "large",
}: { children: React.ReactNode; onClick?: () => void; className?: string; size?: "large" | "medium" }) {
  const padding = size === "large" ? "px-7 sm:px-10 py-4 sm:py-5 text-[16px] sm:text-[18px]" : "px-6 py-3.5 text-[15px]";
  return (
    <motion.button
      whileHover={{ scale: 1.03, boxShadow: "0 0 60px rgba(4,218,141,0.5), 0 0 100px rgba(0,133,255,0.3)" }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className={`relative inline-flex items-center justify-center rounded-full bg-primary-gradient font-extrabold text-white shadow-button font-heading whitespace-nowrap ${padding} ${className}`}
    >
      {children}
    </motion.button>
  );
}

function SectionTag({ children, color = "green" }: { children: React.ReactNode; color?: "green" | "blue" | "red" }) {
  const palette = {
    green: "text-brand-green bg-brand-green/10",
    blue: "text-brand-blue bg-brand-blue/10",
    red: "text-brand-red bg-brand-red/10",
  }[color];
  return (
    <span className={`inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-[10px] sm:text-[11px] font-extrabold uppercase tracking-[0.22em] ${palette}`}>
      {children}
    </span>
  );
}

function FadeIn({ children, delay = 0, y = 24 }: { children: React.ReactNode; delay?: number; y?: number }) {
  // Always start visible; subtle Y/scale pop on mount so motion is preserved
  // but content never disappears for users with reduced motion or for crawlers/screenshotters.
  return (
    <motion.div
      initial={{ opacity: 0.001, y, willChange: "transform, opacity" }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

// ============================================================================
// DECORATIVE ELEMENTS
// ============================================================================
const StarOutline = ({ size = 40, color = "#8E54E9", className = "" }: { size?: number; color?: string; className?: string }) => (
  <motion.svg
    width={size} height={size} viewBox="0 0 40 40" fill="none"
    className={className}
    initial={{ opacity: 0, scale: 0.6, rotate: -20 }}
    animate={{ opacity: 1, scale: 1, rotate: 0 }}
    transition={{ duration: 0.9, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
  >
    <motion.path
      d="M20 2L24 14L38 14L26 22L30 36L20 28L10 36L14 22L2 14L16 14L20 2Z"
      fill={color} opacity="0.15"
      animate={{ rotate: [0, 6, -3, 0] }}
      transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      style={{ transformOrigin: "center" }}
    />
    <path d="M20 2L24 14L38 14L26 22L30 36L20 28L10 36L14 22L2 14L16 14L20 2Z" stroke={color} strokeWidth="2" strokeLinejoin="round" />
  </motion.svg>
);

/** Hand-drawn squiggle underline beneath the highlighted hero word */
const ScribbleUnderline = ({ className = "" }: { className?: string }) => (
  <motion.svg
    viewBox="0 0 200 18" preserveAspectRatio="none"
    className={`absolute left-0 right-0 -bottom-2 sm:-bottom-3 w-full h-[10px] sm:h-[14px] ${className}`}
    initial={{ pathLength: 0, opacity: 0 }}
    whileInView={{ pathLength: 1, opacity: 1 }}
    viewport={{ once: true }}
    transition={{ duration: 1.1, delay: 0.45, ease: "easeInOut" }}
  >
    <motion.path
      d="M2 14C 30 4, 60 16, 100 8 S 170 4, 198 12"
      stroke="#04DA8D" strokeWidth="4" strokeLinecap="round" fill="none"
      style={{ filter: "drop-shadow(0 1px 0 rgba(4,218,141,0.25))" }}
    />
  </motion.svg>
);

// ============================================================================
// STICKY NAV — matches updated live site
// ============================================================================
function StickyNav({ onCtaClick }: { onCtaClick: () => void }) {
  return (
    <header className="fixed inset-x-0 top-0 z-40 backdrop-blur-md bg-white/85 border-b border-slate-100/80">
      <div className="mx-auto flex h-[64px] sm:h-[68px] w-full max-w-7xl items-center justify-between px-4 sm:px-8">
        <a href="#top" className="flex items-center" aria-label="PawMe">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/assets/images/pawme-logo.png" alt="PawMe" className="h-7 sm:h-9 w-auto select-none" />
        </a>
        <button
          onClick={onCtaClick}
          className="rounded-full bg-primary-gradient px-4 sm:px-7 py-2.5 sm:py-3 text-[12px] sm:text-[14px] font-extrabold text-white shadow-button whitespace-nowrap font-heading"
        >
          {/* Compact label on phones, full label from sm: up */}
          <span className="sm:hidden">Reserve for $1</span>
          <span className="hidden sm:inline">Claim Your VIP Spot for $1</span>
        </button>
      </div>
    </header>
  );
}

// ============================================================================
// HERO — matches pawmebot.com exactly: big flanking bots, polaroids, scribble
// ============================================================================
function Hero({ onCtaClick }: { onCtaClick: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const botYL = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const botYR = useTransform(scrollYProgress, [0, 1], [0, -60]);

  return (
    <section id="top" ref={ref} className="relative isolate overflow-hidden bg-gradient-to-b from-white via-[#F5FBFB] to-[#EFF8F4] pt-[68px]">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_0%,rgba(4,218,141,0.10),transparent_70%)] pointer-events-none" />

      {/* Decorative stars — render two pairs, one for mobile (smaller, tucked into corners) and one for sm:+ (full live-spec size + position). */}
      {/* Mobile pair */}
      <StarOutline size={32} color="#8E54E9" className="absolute top-[16%] left-[6%] z-[5] sm:hidden" />
      <StarOutline size={24} color="#0085FF" className="absolute top-[20%] right-[6%] z-[5] sm:hidden" />
      {/* Desktop pair (matches pawmebot.com exactly) */}
      <StarOutline size={54} color="#8E54E9" className="absolute top-[10%] left-[25%] z-[5] hidden sm:block" />
      <StarOutline size={39} color="#0085FF" className="absolute top-[14%] right-[25%] z-[5] hidden sm:block" />

      {/* Flanking bots — desktop: huge, beside; mobile: smaller, behind */}
      <motion.div
        style={{ y: botYL }}
        animate={{ rotate: [0, -1.5, 0, 1.5, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="pointer-events-none absolute left-[-8%] sm:left-[-2%] lg:left-[1%] bottom-[-5%] sm:bottom-[-8%] z-0 w-[58%] sm:w-[40%] lg:w-[32%] opacity-90"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/assets/images/bot-left.png" alt="" className="w-full select-none drop-shadow-2xl" />
      </motion.div>
      <motion.div
        style={{ y: botYR }}
        animate={{ rotate: [0, 1.5, 0, -1.5, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
        className="pointer-events-none absolute right-[-8%] sm:right-[-2%] lg:right-[1%] bottom-[-5%] sm:bottom-[-8%] z-0 w-[58%] sm:w-[40%] lg:w-[32%] opacity-90"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/assets/images/bot-right.png" alt="" className="w-full select-none drop-shadow-2xl" />
      </motion.div>

      <div className="relative z-10 mx-auto w-full max-w-5xl px-5 sm:px-8 pt-12 pb-[60vw] sm:pt-20 sm:pb-[28%] lg:pb-[24%]">
        <div className="text-center">
          <FadeIn>
            <SectionTag color="green">Coming to Kickstarter</SectionTag>
          </FadeIn>

          <FadeIn delay={0.05}>
            <h1 className="mt-5 font-heading text-[40px] sm:text-[64px] lg:text-[84px] font-black leading-[1.02] tracking-[-0.02em] text-brand-dark">
              You{" "}
              <span className="relative inline-block">
                leave.
                <ScribbleUnderline />
              </span>
              {" "}They wonder<br />
              if you're coming back.
            </h1>
          </FadeIn>

          <FadeIn delay={0.15}>
            <p className="mt-6 mx-auto max-w-2xl text-[16px] sm:text-[20px] leading-relaxed text-slate-700">
              <span className="font-extrabold text-brand-dark">76% of dogs show separation anxiety.</span>{" "}
              PawMe stays with them — so you don't have to feel guilty.
            </p>
          </FadeIn>

          <FadeIn delay={0.22}>
            <div className="mt-8 flex flex-col items-center gap-3">
              <GradientButton onClick={onCtaClick}>Claim Your VIP Spot for $1</GradientButton>
              <p className="text-[13px] sm:text-[14px] text-slate-500">
                <span className="font-extrabold text-brand-green">{siteConfig.vipCount} pet parents</span> already joined the waitlist. Lock in 50% off before we launch.
              </p>
            </div>
          </FadeIn>

          {/* Polaroid portrait strip */}
          <FadeIn delay={0.32}>
            <div className="relative mx-auto mt-10 sm:mt-14 grid grid-cols-4 gap-2 sm:gap-4 max-w-3xl">
              {[1,2,3,4].map((i) => {
                const tilt = [-6, 4, -3, 7][i-1];
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20, rotate: tilt - 4 }}
                    whileInView={{ opacity: 1, y: 0, rotate: tilt }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.1 * i, ease: [0.22, 1, 0.36, 1] }}
                    whileHover={{ rotate: 0, y: -6, scale: 1.04 }}
                    className="rounded-xl bg-white p-1.5 sm:p-2 shadow-[0_10px_30px_rgba(0,0,0,0.12)] origin-center"
                    style={{ transform: `rotate(${tilt}deg)` }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={`/assets/images/portrait-${i}.png`} alt="Pet portrait" className="aspect-square w-full rounded-lg object-cover" />
                  </motion.div>
                );
              })}
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// MEET PAWME — full-bleed video, text overlay at bottom (matches live site)
// ============================================================================
function MeetPawMe() {
  return (
    <section className="relative overflow-hidden bg-brand-dark h-[80vh] sm:h-screen min-h-[540px]">
      {/* Full-bleed background video */}
      <video
        src="/assets/video/meet-pawme.mp4"
        autoPlay muted loop playsInline
        className="absolute inset-0 h-full w-full object-cover"
      />
      {/* Bottom gradient for text legibility */}
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
      {/* Top gradient blends with sticky nav */}
      <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/30 to-transparent" />

      {/* Overlay headline */}
      <div className="absolute inset-x-0 bottom-0 px-5 sm:px-8 pb-12 sm:pb-20 text-center">
        <FadeIn>
          <h2 className="font-heading text-[36px] sm:text-[64px] font-black tracking-tight text-white drop-shadow-[0_4px_24px_rgba(0,0,0,0.6)]">
            Meet PawMe
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-[15px] sm:text-[18px] leading-relaxed text-white/85 drop-shadow-[0_2px_12px_rgba(0,0,0,0.6)]">
            The AI companion that follows your pet from room to room — so they're never truly alone.
          </p>
        </FadeIn>
      </div>
    </section>
  );
}

// ============================================================================
// PROBLEM
// ============================================================================
function Problem() {
  const items = [
    { icon: <HeartIcon size={28} color="#FF6B6B" />, stat: "76%", label: "Show Anxiety Signs", body: "76% of dogs display at least one sign of separation anxiety — pacing, whining, destructive behavior — when left alone. Most owners never realize it." },
    { icon: <ClockIcon size={28} color="#FF9F43" />, stat: "40min", label: "Peak Stress Window", body: "Research shows pets hit peak anxiety within the first 40 minutes of being alone. That's when they need comfort the most — and you can't be there." },
    { icon: <ChartIcon size={28} color="#8E54E9" />, stat: "$1,200+", label: "Annual Damage Cost", body: "Pet owners spend an average of $1,200/year on anxiety-related damage and vet bills. The emotional cost? That's harder to measure." },
  ];
  return (
    <section className="bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="text-center">
          <FadeIn><SectionTag color="red">The Problem</SectionTag></FadeIn>
          <FadeIn delay={0.05}>
            <h2 className="mt-4 font-heading text-[30px] sm:text-[48px] font-black leading-[1.1] tracking-tight text-brand-dark">
              Every time you leave, they feel it.
            </h2>
          </FadeIn>
          <FadeIn delay={0.1}>
            <p className="mx-auto mt-3 max-w-2xl text-[15px] sm:text-[18px] leading-relaxed text-slate-600">
              Separation anxiety affects more pets than most owners realize. Here's what the research shows:
            </p>
          </FadeIn>
        </div>

        <div className="mt-10 sm:mt-12 grid gap-4 sm:gap-5 sm:grid-cols-3">
          {items.map((it, i) => (
            <FadeIn key={i} delay={0.06 * i}>
              <motion.div whileHover={{ y: -4, boxShadow: "0 12px 40px rgba(0,0,0,0.10)" }} className="h-full rounded-3xl bg-white p-6 sm:p-7 shadow-card transition">
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-slate-50">{it.icon}</div>
                <div className="mt-5 font-heading text-[34px] sm:text-[42px] font-black leading-none text-brand-dark">{it.stat}</div>
                <div className="mt-1 text-[12px] sm:text-[13px] font-extrabold uppercase tracking-wider text-slate-400">{it.label}</div>
                <p className="mt-3 text-[14px] sm:text-[15px] leading-relaxed text-slate-600">{it.body}</p>
              </motion.div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// MID CTA
// ============================================================================
function MidCta({ onCtaClick }: { onCtaClick: () => void }) {
  return (
    <section className="bg-gradient-to-br from-[#F0FDF8] to-[#EFF6FF] py-14 sm:py-20">
      <div className="mx-auto max-w-3xl px-5 sm:px-8 text-center">
        <FadeIn><SectionTag color="green">Quick Check-In</SectionTag></FadeIn>
        <FadeIn delay={0.05}>
          <h2 className="mt-4 font-heading text-[26px] sm:text-[40px] font-black leading-[1.15] tracking-tight text-brand-dark">
            Is your pet struggling when you're away?
          </h2>
        </FadeIn>
        <FadeIn delay={0.1}>
          <p className="mx-auto mt-3 max-w-xl text-[15px] sm:text-[16px] leading-relaxed text-slate-600">
            Most owners don't know until something breaks. PawMe gives you eyes, ears, and AI insight in every room — so you stop guessing.
          </p>
        </FadeIn>
        <FadeIn delay={0.15}>
          <div className="mt-6 sm:mt-7"><GradientButton onClick={onCtaClick} size="medium">Reserve VIP for $1 →</GradientButton></div>
        </FadeIn>
      </div>
    </section>
  );
}

// ============================================================================
// SOLUTION
// ============================================================================
function Solution() {
  const items = [
    { icon: <CameraIcon size={28} />, title: "Follows Them Everywhere", body: "AI-powered navigation moves from room to room, tracking your pet's location so you never stare at an empty frame again." },
    { icon: <BrainIcon size={28} />, title: "Understands Their Behavior", body: "Machine learning detects anxiety patterns, unusual behavior, and health anomalies — then alerts you before it becomes a problem." },
    { icon: <HeartIcon size={28} color="#04DA8D" />, title: "Comforts When You Can't", body: "Interactive features let PawMe respond to your pet with calming sounds, treat dispensing, and familiar voice playback." },
  ];
  return (
    <section className="bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="text-center">
          <FadeIn><SectionTag color="green">The Solution</SectionTag></FadeIn>
          <FadeIn delay={0.05}>
            <h2 className="mt-4 font-heading text-[30px] sm:text-[48px] font-black leading-[1.1] tracking-tight text-brand-dark">
              What if you never had to worry<br className="hidden sm:block" />
              about leaving them alone?
            </h2>
          </FadeIn>
          <FadeIn delay={0.1}>
            <p className="mx-auto mt-4 max-w-3xl text-[15px] sm:text-[18px] leading-relaxed text-slate-600">
              PawMe is the world's first AI pet companion that follows your pet room to room, responds to their behavior, and gives you real-time peace of mind — wherever you are.
            </p>
          </FadeIn>
        </div>

        <div className="mt-10 sm:mt-14 grid gap-5 sm:gap-6 md:grid-cols-3">
          {items.map((it, i) => (
            <FadeIn key={i} delay={0.06 * i}>
              <motion.div whileHover={{ y: -4 }} className="h-full rounded-3xl border border-brand-green/15 bg-gradient-to-br from-white to-[#F0FDF8] p-6 sm:p-7 shadow-card transition">
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-brand-green/10">{it.icon}</div>
                <h3 className="mt-5 font-heading text-[18px] sm:text-[20px] font-extrabold text-brand-dark">{it.title}</h3>
                <p className="mt-2 text-[14px] sm:text-[15px] leading-relaxed text-slate-600">{it.body}</p>
              </motion.div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// FEATURE GRID
// ============================================================================
function Features() {
  const items = [
    { icon: <CameraIcon size={26} />, title: "360° Room-to-Room Tracking", body: "AI-powered wheels and sensors follow your pet seamlessly between rooms. No blind spots." },
    { icon: <BellIcon size={26} />, title: "Smart Anxiety Alerts", body: "Get notified the moment PawMe detects stress signals — pacing, whining, or unusual stillness." },
    { icon: <ChartIcon size={26} />, title: "Daily Activity Reports", body: "Track sleep, play, and movement patterns. Know exactly how your pet spends their day." },
    { icon: <SparkleIcon size={26} />, title: "HD Live Stream", body: "Crystal-clear video with two-way audio. Talk to your pet from anywhere in the world." },
    { icon: <ShieldIcon size={26} />, title: "Health Monitoring", body: "Early detection of limping, lethargy, or breathing changes. Your vet will thank you." },
    { icon: <BrainIcon size={26} />, title: "AI Learning Engine", body: "Gets smarter every day. Learns your pet's routines, preferences, and unique personality." },
  ];
  return (
    <section className="bg-gradient-to-b from-white to-[#F0FDF8] py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="text-center">
          <FadeIn>
            <h2 className="font-heading text-[28px] sm:text-[44px] font-black leading-[1.1] tracking-tight text-brand-dark">
              Everything your pet needs.<br className="hidden sm:block" />
              <span className="bg-primary-gradient bg-clip-text text-transparent">Everything you've been missing.</span>
            </h2>
          </FadeIn>
        </div>

        <div className="mt-10 sm:mt-12 grid gap-4 sm:gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((it, i) => (
            <FadeIn key={i} delay={0.04 * i}>
              <motion.div whileHover={{ y: -3 }} className="h-full rounded-3xl bg-white p-5 sm:p-6 shadow-card transition">
                <div className="grid h-11 w-11 place-items-center rounded-xl bg-slate-50">{it.icon}</div>
                <h3 className="mt-4 font-heading text-[16px] sm:text-[17px] font-extrabold text-brand-dark">{it.title}</h3>
                <p className="mt-1.5 text-[13px] sm:text-[14px] leading-relaxed text-slate-600">{it.body}</p>
              </motion.div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// STATS BAR
// ============================================================================
function StatsBar() {
  const stats = [
    { value: 847, suffix: "+", label: "Pet Parents Joined" },
    { value: 94, suffix: "%", label: "Reported Less Worry" },
    { value: 12, suffix: "+", label: "Months of R&D" },
  ];
  return (
    <section className="bg-brand-dark py-12 sm:py-16">
      <div className="mx-auto grid max-w-5xl grid-cols-3 gap-4 sm:gap-6 px-5 sm:px-8 text-center">
        {stats.map((s, i) => (
          <FadeIn key={i} delay={0.05 * i} y={12}>
            <div>
              <div className="font-heading text-[28px] sm:text-5xl font-black bg-primary-gradient bg-clip-text text-transparent">
                <CountUp value={s.value} suffix={s.suffix} />
              </div>
              <div className="mt-1 text-[10px] sm:text-[14px] font-bold uppercase tracking-wider text-white/60">{s.label}</div>
            </div>
          </FadeIn>
        ))}
      </div>
    </section>
  );
}

// ============================================================================
// COMPARISON TABLE
// ============================================================================
function Comparison() {
  const rows = [
    "Know where your pet is",
    "Detect anxiety early",
    "Follows room to room",
    "Daily health insights",
    "Two-way communication",
    "Peace of mind at work",
  ];
  return (
    <section className="bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-4xl px-5 sm:px-8">
        <div className="text-center">
          <FadeIn>
            <h2 className="font-heading text-[26px] sm:text-[44px] font-black tracking-tight text-brand-dark">
              Life with PawMe vs. without
            </h2>
          </FadeIn>
        </div>

        <FadeIn delay={0.05}>
          <div className="mt-8 sm:mt-10 overflow-hidden rounded-2xl sm:rounded-3xl border border-slate-100 shadow-card">
            <div className="grid grid-cols-3 bg-slate-50 px-3 sm:px-5 py-3 sm:py-4 text-[10px] sm:text-[13px] font-extrabold uppercase tracking-wider">
              <div className="text-slate-400">&nbsp;</div>
              <div className="text-center text-slate-500">Without</div>
              <div className="text-center text-brand-green">With PawMe</div>
            </div>
            {rows.map((row, i) => (
              <div key={i} className={`grid grid-cols-3 items-center px-3 sm:px-5 py-3 sm:py-4 ${i % 2 === 0 ? "bg-white" : "bg-slate-50/40"}`}>
                <div className="text-[13px] sm:text-[15px] font-semibold text-brand-dark pr-2">{row}</div>
                <div className="flex justify-center"><XIcon size={18} /></div>
                <div className="flex justify-center"><CheckIcon size={18} /></div>
              </div>
            ))}
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

// ============================================================================
// APP MOCKUP
// ============================================================================
function AppMockup() {
  const items = [
    { title: "Live HD stream", body: "See exactly what your pet sees, from their perspective." },
    { title: "Behavior timeline", body: "Minute-by-minute log of activity, rest, and play." },
    { title: "Smart notifications", body: "Only get alerts that matter — no notification fatigue." },
  ];
  return (
    <section className="bg-gradient-to-br from-[#F0FDF8] to-[#EFF6FF] py-16 sm:py-24">
      <div className="mx-auto grid max-w-6xl items-center gap-10 sm:gap-14 px-5 sm:px-8 md:grid-cols-2">
        <FadeIn>
          <motion.div animate={{ y: [0, -6, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}>
            <LiveFeed />
          </motion.div>
        </FadeIn>
        <FadeIn delay={0.1}>
          <div>
            <h2 className="font-heading text-[28px] sm:text-[44px] font-black leading-[1.1] tracking-tight text-brand-dark">
              Control everything<br />from your phone.
            </h2>
            <p className="mt-3 text-[15px] sm:text-[17px] leading-relaxed text-slate-600">
              The PawMe app gives you a real-time window into your pet's world — with AI insights that actually matter.
            </p>
            <ul className="mt-6 sm:mt-7 space-y-4">
              {items.map((it, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="mt-1 grid h-6 w-6 place-items-center rounded-full bg-brand-green/15"><CheckIcon size={14} /></span>
                  <div>
                    <h4 className="font-heading text-[15px] sm:text-[16px] font-extrabold text-brand-dark">{it.title}</h4>
                    <p className="text-[13px] sm:text-[14px] text-slate-600">{it.body}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

// ============================================================================
// WORKSHOP — "Built by hand" Kickstarter credibility section
// ============================================================================
function Workshop() {
  return (
    <section className="relative overflow-hidden bg-brand-dark py-16 sm:py-24">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_30%,rgba(4,218,141,0.10)_0%,transparent_60%)]" />
      <div className="relative mx-auto grid max-w-6xl items-center gap-10 sm:gap-14 px-5 sm:px-8 md:grid-cols-2">
        <FadeIn>
          <div>
            <SectionTag color="green">Behind the build</SectionTag>
            <h2 className="mt-4 font-heading text-[30px] sm:text-[48px] font-black leading-[1.1] tracking-tight text-white">
              Built by hand.<br className="hidden sm:block" />
              <span className="bg-primary-gradient bg-clip-text text-transparent">Built for them.</span>
            </h2>
            <p className="mt-4 text-[15px] sm:text-[17px] leading-relaxed text-white/65">
              Every PawMe is hand-assembled by our team — soldered, calibrated, and tested with real pets before it ever leaves the workshop. When you back our Kickstarter, you're not just pre-ordering a product. You're funding the next batch off the bench.
            </p>
            <ul className="mt-6 space-y-3">
              {[
                "200+ prototype iterations across 12 months",
                "Vet-approved gentle-motion calibration",
                "Tested with 200+ pets before a unit ships",
              ].map((line, i) => (
                <li key={i} className="flex items-start gap-2.5 text-[14px] sm:text-[15px] text-white/80">
                  <span className="mt-1.5 grid h-3.5 w-3.5 place-items-center rounded-full bg-brand-green/25">
                    <CheckIcon size={9} color="#00FF94" />
                  </span>
                  {line}
                </li>
              ))}
            </ul>
          </div>
        </FadeIn>

        <FadeIn delay={0.1}>
          <motion.div
            whileHover={{ scale: 1.01 }}
            className="relative aspect-[9/16] sm:aspect-[4/5] w-full max-w-[360px] mx-auto overflow-hidden rounded-3xl border border-white/10 shadow-[0_30px_80px_rgba(0,0,0,0.5)]"
          >
            <video
              src="/assets/video/workshop.mp4"
              autoPlay muted loop playsInline
              className="h-full w-full object-cover"
            />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/70 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-white/85">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-red opacity-70" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-red" />
              </span>
              Workshop · Mar 2026
            </div>
          </motion.div>
        </FadeIn>
      </div>
    </section>
  );
}

// ============================================================================
// FOUNDER QUOTE
// ============================================================================
function FounderQuote() {
  return (
    <section className="bg-white py-12 sm:py-20">
      <div className="mx-auto max-w-3xl px-5 sm:px-8">
        <FadeIn>
          <div className="rounded-3xl border border-slate-100 bg-gradient-to-br from-white to-[#F8FAFC] p-7 sm:p-10 shadow-card">
            <div className="flex items-center gap-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/assets/images/founder-with-dog.jpg" alt="Ashok with his dog" className="h-14 w-14 sm:h-16 sm:w-16 rounded-full object-cover ring-2 ring-brand-green/20" />
              <div>
                <div className="font-heading text-[15px] sm:text-[16px] font-extrabold text-brand-dark">{siteConfig.founder.name}</div>
                <div className="text-[12px] sm:text-[13px] text-slate-500">{siteConfig.founder.title}</div>
              </div>
            </div>
            <p className="mt-5 text-[15px] sm:text-[18px] leading-relaxed text-slate-700">
              "I built PawMe because I was tired of the guilt. Every morning, leaving for work, seeing my dog's face — wondering if she's okay all day. Static cameras didn't help. They just showed me an empty room. I knew there had to be something better."
            </p>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

// ============================================================================
// PRICING
// ============================================================================
function Pricing({ onCtaClick }: { onCtaClick: () => void }) {
  const baseFeatures = ["Room-to-room tracking", "HD live stream", "Basic activity reports", "Mobile app access"];
  const tiers = [
    { label: "Retail", badge: "Full Price", price: "$399", retail: null as string | null, off: null as string | null,
      features: [...baseFeatures], footer: "Available at launch", highlight: false },
    { label: "VIP", badge: "BEST VALUE", price: "$199", retail: "$399", off: "50% OFF",
      features: [...baseFeatures, "AI anxiety detection", "Health monitoring", "Priority shipping", "2-year warranty", "Lifetime app updates"],
      footer: "$1 deposit is 100% refundable.", cta: "Reserve for $1 — 100% Refundable", highlight: true },
    { label: "Early Bird", badge: "38% OFF", price: "$249", retail: "$399", off: null,
      features: [...baseFeatures, "AI anxiety detection", "Health monitoring", "Priority shipping", "1-year warranty"],
      footer: "Available at Kickstarter", highlight: false },
  ];
  return (
    <section className="bg-gradient-to-b from-white to-[#F0FDF8] py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="text-center">
          <FadeIn>
            <h2 className="font-heading text-[28px] sm:text-[44px] font-black tracking-tight text-brand-dark">
              See why VIP is the smartest move
            </h2>
          </FadeIn>
          <FadeIn delay={0.05}>
            <p className="mx-auto mt-3 max-w-2xl text-[14px] sm:text-[17px] leading-relaxed text-slate-600">
              Compare what you get at each tier. VIP members get the most features at the lowest price — and you can lock it in today for just $1.
            </p>
          </FadeIn>
        </div>

        <div className="mt-10 sm:mt-12 grid gap-5 sm:gap-6 lg:grid-cols-3 lg:items-center">
          {tiers.map((t, idx) => (
            <FadeIn key={t.label} delay={0.06 * idx}>
              <div className={`relative h-full rounded-[24px] sm:rounded-[28px] p-6 sm:p-8 ${
                t.highlight
                  ? "bg-brand-dark text-white shadow-2xl lg:scale-[1.04] ring-4 ring-brand-green/40"
                  : "bg-white text-brand-dark shadow-card"
              }`}>
                {t.highlight && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-primary-gradient px-4 py-1.5 text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider text-white shadow-lg">
                    {t.badge}
                  </div>
                )}
                <div className="text-[11px] sm:text-[12px] font-extrabold uppercase tracking-widest text-current/60">{t.label}</div>

                <div className="mt-3 flex items-baseline gap-3">
                  <span className={`font-heading text-[40px] sm:text-5xl font-black ${t.highlight ? "bg-primary-gradient bg-clip-text text-transparent" : ""}`}>
                    {t.price}
                  </span>
                  {t.retail && <span className={`text-lg sm:text-xl line-through ${t.highlight ? "text-white/30" : "text-slate-300"}`}>{t.retail}</span>}
                </div>

                {t.off && (
                  <div className={`mt-1 inline-block rounded-full px-2.5 py-1 text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider ${
                    t.highlight ? "bg-brand-green/20 text-brand-neon" : "bg-brand-green/15 text-brand-green"
                  }`}>{t.off}</div>
                )}
                {!t.off && !t.retail && (
                  <div className={`mt-1 inline-block rounded-full px-2.5 py-1 text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider ${
                    t.highlight ? "bg-white/10 text-white/70" : "bg-slate-100 text-slate-500"
                  }`}>{t.badge}</div>
                )}

                <div className={`my-5 sm:my-6 h-px ${t.highlight ? "bg-white/10" : "bg-slate-100"}`} />

                <ul className="space-y-2.5">
                  {t.features.map((f, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-[13px] sm:text-[14px]">
                      <span className={`mt-1 grid h-4 w-4 place-items-center rounded-full ${t.highlight ? "bg-brand-green/20" : "bg-brand-green/15"}`}>
                        <CheckIcon size={10} color={t.highlight ? "#00FF94" : "#04DA8D"} />
                      </span>
                      <span className={t.highlight ? "text-white/90" : "text-slate-700"}>{f}</span>
                    </li>
                  ))}
                </ul>

                {t.highlight && (
                  <button onClick={onCtaClick} className="mt-7 w-full rounded-full bg-primary-gradient px-5 py-3.5 sm:py-4 text-[14px] sm:text-[15px] font-extrabold text-white shadow-button">
                    {t.cta}
                  </button>
                )}

                <p className={`mt-4 text-center text-[11px] sm:text-[12px] ${t.highlight ? "text-white/50" : "text-slate-400"}`}>{t.footer}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// FAQ
// ============================================================================
function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white">
      <button onClick={() => setOpen(v => !v)} className="flex w-full items-center justify-between gap-3 px-5 sm:px-6 py-4 sm:py-5 text-left">
        <span className="font-heading text-[15px] sm:text-[17px] font-extrabold text-brand-dark">{q}</span>
        <span className={`grid h-7 w-7 flex-shrink-0 place-items-center rounded-full bg-slate-100 transition ${open ? "rotate-45" : ""}`}>+</span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }}>
            <p className="px-5 sm:px-6 pb-5 text-[14px] sm:text-[15px] leading-relaxed text-slate-600">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Faq() {
  const items = [
    { q: "What exactly is PawMe?", a: "PawMe is an AI-powered robotic pet companion that autonomously follows your pet from room to room. It uses advanced sensors and machine learning to track their behavior, detect anxiety, monitor health patterns, and provide comfort through interactive features — all controllable from your phone." },
    { q: "How does the $1 reservation work?", a: "You pay just $1 today to lock in your VIP price ($199 vs $399 retail). When our Kickstarter campaign goes live in Q2 2026, the remaining $198 is charged through the campaign — that's where you officially become a backer. PawMe then ships to VIPs first in Q4 2026. If you change your mind any time before the Kickstarter charges, you get a full refund of your $1 deposit. Zero risk." },
    { q: "Is it safe for my pet?", a: "Absolutely. PawMe is designed with pet safety as the #1 priority. It uses gentle, slow movements, soft-touch materials, and advanced obstacle detection. It's been tested with over 200 pets during development and is vet-approved." },
    { q: "Will it work in my home?", a: "PawMe works in any home with flat flooring. It navigates doorways, hallways, and open floor plans seamlessly. During setup, it maps your home automatically and learns the optimal routes to follow your pet." },
    { q: "What if my pet is scared of it?", a: "Most pets are curious, not scared. PawMe has a gradual introduction mode that lets your pet approach and investigate at their own pace. 94% of pets in our testing program were comfortable with PawMe within 48 hours." },
    { q: "When does PawMe ship?", a: "We're targeting our Kickstarter launch in Q2 2026 with first units shipping in Q4 2026. VIP reservation holders get priority shipping — meaning you'll be among the very first to receive PawMe, before any other Kickstarter backer." },
    { q: "Can I get a refund?", a: "Yes. Your $1 deposit is 100% refundable any time before the Kickstarter campaign charges. No questions asked, no hoops to jump through. We want you to feel completely comfortable." },
  ];
  return (
    <section className="bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-3xl px-5 sm:px-8">
        <div className="text-center">
          <FadeIn>
            <h2 className="font-heading text-[28px] sm:text-[44px] font-black tracking-tight text-brand-dark">
              Got questions? We've got answers.
            </h2>
          </FadeIn>
        </div>
        <div className="mt-8 sm:mt-10 space-y-3">
          {items.map((it, i) => <FadeIn key={i} delay={0.03 * i} y={12}><FaqItem q={it.q} a={it.a} /></FadeIn>)}
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// FINAL CTA
// ============================================================================
function FinalCta({ onCtaClick }: { onCtaClick: () => void }) {
  return (
    <section id="final-cta" className="relative overflow-hidden bg-brand-dark py-16 sm:py-24">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(4,218,141,0.18)_0%,transparent_55%)]" />
      <div className="relative mx-auto max-w-3xl px-5 sm:px-8 text-center">
        <FadeIn>
          <h2 className="font-heading text-[32px] sm:text-[60px] font-black leading-[1.1] tracking-tight text-white">
            They're waiting for you<br />to come home.
          </h2>
        </FadeIn>
        <FadeIn delay={0.05}>
          <p className="mx-auto mt-4 sm:mt-5 max-w-xl text-[15px] sm:text-[18px] leading-relaxed text-white/60">
            Give them the companion they deserve while you're away. Join 847+ pet parents who already reserved their PawMe.
          </p>
        </FadeIn>
        <FadeIn delay={0.1}>
          <div className="mt-7 sm:mt-9"><GradientButton onClick={onCtaClick}>Claim Your VIP Spot for $1 →</GradientButton></div>
        </FadeIn>
      </div>
    </section>
  );
}

// ============================================================================
// FOOTER
// ============================================================================
function Footer() {
  return (
    <footer className="bg-brand-dark py-8 sm:py-10 text-white/60 pb-[88px] sm:pb-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-5 sm:px-8 sm:flex-row">
        <div className="flex items-center gap-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/assets/images/logo-mark.png" alt="" className="h-7 w-7 rounded-md object-contain" />
          <span className="font-heading text-[15px] font-extrabold text-white">PawMe</span>
        </div>
        <div className="flex items-center gap-5 text-[13px] font-semibold">
          <a href={siteConfig.social.instagram} target="_blank" rel="noreferrer" className="hover:text-white">Instagram</a>
          <a href={siteConfig.social.tiktok} target="_blank" rel="noreferrer" className="hover:text-white">TikTok</a>
          <a href={siteConfig.social.facebook} target="_blank" rel="noreferrer" className="hover:text-white">Facebook</a>
        </div>
        <div className="text-[12px]">© 2026 PawMe. All rights reserved.</div>
      </div>
    </footer>
  );
}

// ============================================================================
// MOBILE STICKY CTA
// ============================================================================
function MobileStickyCta({ onCtaClick }: { onCtaClick: () => void }) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onScroll = () => {
      const scrolledFar = window.scrollY > 600;
      // Hide when the final dark CTA is in view so we don't double-stack two CTAs
      const finalCta = document.getElementById("final-cta");
      const finalInView = finalCta ? finalCta.getBoundingClientRect().top < window.innerHeight - 80 : false;
      setShow(scrolledFar && !finalInView);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ type: "spring", damping: 22, stiffness: 280 }}
          className="fixed bottom-3 left-3 right-3 z-50 sm:hidden"
        >
          <button
            onClick={onCtaClick}
            className="w-full rounded-full bg-primary-gradient px-5 py-4 text-[15px] font-extrabold text-white shadow-button shadow-[0_10px_30px_rgba(4,218,141,0.45)]"
          >
            Reserve for $1 — Lock in 50% off →
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ============================================================================
// ROOT
// ============================================================================
export default function LandingPage() {
  const [gateOpen, setGateOpen] = useState(false);
  const open = () => setGateOpen(true);
  return (
    <main className="min-h-screen bg-white text-brand-dark">
      <StickyNav onCtaClick={open} />
      <Hero onCtaClick={open} />
      <KickstarterBar />
      <MeetPawMe />
      <Problem />
      <MidCta onCtaClick={open} />
      <Solution />
      <Features />
      <StatsBar />
      <Comparison />
      <AppMockup />
      <Workshop />
      <FounderQuote />
      <Pricing onCtaClick={open} />
      <Faq />
      <FinalCta onCtaClick={open} />
      <Footer />

      <MobileStickyCta onCtaClick={open} />
      <EmailGate isOpen={gateOpen} onClose={() => setGateOpen(false)} />
    </main>
  );
}
