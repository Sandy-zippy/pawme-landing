"use client";

import { useRef } from "react";
import { motion, useInView, animate, useMotionValue } from "framer-motion";
import { useEffect, useState } from "react";

type Props = {
  label?: string;
  pledged?: number;
  goal?: number;
  backers?: number;
  daysToLaunch?: string;
};

function AnimatedNumber({ value, prefix = "", suffix = "" }: { value: number; prefix?: string; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-30px" });
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const c = animate(0, value, { duration: 1.5, ease: [0.22, 1, 0.36, 1], onUpdate: (v) => setN(v) });
    return () => c.stop();
  }, [inView, value]);
  return <span ref={ref}>{prefix}{Math.round(n).toLocaleString()}{suffix}</span>;
}

export default function KickstarterBar({
  label = "Pre-launch waitlist",
  pledged = 168953,
  goal = 250000,
  backers = 847,
  daysToLaunch = "Q2 2026",
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const pct = Math.min(100, Math.round((pledged / goal) * 100));

  return (
    <section ref={ref} className="bg-white py-12 sm:py-16">
      <div className="mx-auto max-w-4xl px-5 sm:px-8">
        <div className="rounded-3xl border border-slate-100 bg-gradient-to-br from-white to-[#F0FDF8] p-6 sm:p-8 shadow-card">
          {/* Mobile: pill on its own row, label + progress % on a second row.
              Desktop: pill + label on left, progress % on right. */}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2 sm:justify-between">
            <span className="inline-flex flex-shrink-0 items-center gap-2 rounded-full bg-brand-green/10 px-3 py-1 text-[10px] sm:text-[11px] font-extrabold uppercase tracking-[0.18em] sm:tracking-[0.2em] text-brand-green whitespace-nowrap">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-green opacity-70" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-green" />
              </span>
              Kickstarter · {daysToLaunch}
            </span>
            <span className="text-[11px] sm:text-[12px] font-bold text-slate-500">{label}</span>
            <span className="ml-auto text-[11px] sm:text-[13px] font-bold text-brand-green whitespace-nowrap">{pct}% to goal</span>
          </div>

          {/* Progress bar */}
          <div className="mt-4 h-3 sm:h-3.5 w-full overflow-hidden rounded-full bg-slate-100">
            <motion.div
              initial={{ width: 0 }}
              animate={inView ? { width: `${pct}%` } : { width: 0 }}
              transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
              className="relative h-full rounded-full bg-primary-gradient"
            >
              <span className="absolute inset-0 animate-pulse rounded-full bg-white/15" />
            </motion.div>
          </div>

          <div className="mt-5 grid grid-cols-3 gap-3 sm:gap-6">
            <div>
              <div className="font-heading text-[20px] sm:text-[26px] font-black text-brand-dark">
                <AnimatedNumber value={pledged} prefix="$" />
              </div>
              <div className="mt-0.5 text-[10.5px] sm:text-[12px] font-bold uppercase tracking-wider text-slate-400">
                Reservations to date
              </div>
            </div>
            <div>
              <div className="font-heading text-[20px] sm:text-[26px] font-black text-brand-dark">
                <AnimatedNumber value={backers} suffix="+" />
              </div>
              <div className="mt-0.5 text-[10.5px] sm:text-[12px] font-bold uppercase tracking-wider text-slate-400">
                VIP pet parents
              </div>
            </div>
            <div>
              <div className="font-heading text-[20px] sm:text-[26px] font-black text-brand-dark">
                ${(goal / 1000).toFixed(0)}K
              </div>
              <div className="mt-0.5 text-[10.5px] sm:text-[12px] font-bold uppercase tracking-wider text-slate-400">
                Funding goal
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
