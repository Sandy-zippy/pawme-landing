"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CameraIcon, BellIcon, HeartIcon, BrainIcon, ChartIcon, CheckIcon } from "./icons";

type Event = { id: string; icon: React.ReactNode; tag: string; title: string; body: string; tone: "good" | "info" | "alert" };

const POOL: Omit<Event, "id">[] = [
  { icon: <CheckIcon size={16} color="#04DA8D" />, tag: "Calm", title: "Buddy resting in living room", body: "Anxiety level: 12 — well below baseline.", tone: "good" },
  { icon: <CameraIcon size={16} color="#0085FF" />, tag: "Tracking", title: "PawMe followed Luna into kitchen", body: "Pet has moved 4 rooms today.", tone: "info" },
  { icon: <BellIcon size={16} color="#FF9F43" />, tag: "Alert", title: "Pacing detected near front door", body: "Triggered calming sound (3:42 PM).", tone: "alert" },
  { icon: <HeartIcon size={16} color="#FF6B6B" />, tag: "Health", title: "Heart rate normal — 92 bpm", body: "Within healthy range for breed/age.", tone: "good" },
  { icon: <BrainIcon size={16} color="#8E54E9" />, tag: "AI", title: "Routine learned: 4 PM nap window", body: "Notifications muted during nap times.", tone: "info" },
  { icon: <ChartIcon size={16} color="#04DA8D" />, tag: "Insight", title: "Anxiety down 23% this week", body: "Compared to last 7 days.", tone: "good" },
  { icon: <CameraIcon size={16} color="#0085FF" />, tag: "Live", title: "HD stream active in bedroom", body: "Two-way audio enabled.", tone: "info" },
];

function newEvent(): Event {
  const e = POOL[Math.floor(Math.random() * POOL.length)];
  return { ...e, id: Math.random().toString(36).slice(2) };
}

export default function LiveFeed() {
  const [items, setItems] = useState<Event[]>(() => [newEvent(), newEvent(), newEvent()]);
  const [time, setTime] = useState<string>("");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setTime(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
    const tick = setInterval(() => {
      setTime(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
    }, 60000);

    let mounted = true;
    let visible = true;
    const obs = new IntersectionObserver(([e]) => { visible = e.isIntersecting; }, { threshold: 0.3 });
    if (ref.current) obs.observe(ref.current);

    const interval = setInterval(() => {
      if (!mounted || !visible) return;
      setItems((prev) => [newEvent(), ...prev].slice(0, 4));
    }, 2400);
    return () => { mounted = false; clearInterval(interval); clearInterval(tick); obs.disconnect(); };
  }, []);

  const toneRing = (tone: Event["tone"]) => ({
    good: "ring-1 ring-brand-green/20 bg-brand-green/[0.06]",
    info: "ring-1 ring-brand-blue/15 bg-brand-blue/[0.04]",
    alert: "ring-1 ring-brand-orange/20 bg-brand-orange/[0.05]",
  }[tone]);

  return (
    <div ref={ref} className="relative mx-auto w-full max-w-sm overflow-hidden rounded-3xl border border-white/10 bg-brand-dark p-4 sm:p-5 shadow-[0_30px_80px_rgba(0,0,0,0.35)]">
      {/* Status bar */}
      <div className="flex items-center justify-between text-[11px] text-white/60 pb-3 mb-2 border-b border-white/5">
        <span className="flex items-center gap-2 font-bold">
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-green opacity-60" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-brand-green" />
          </span>
          LIVE — Buddy at home
        </span>
        <span suppressHydrationWarning>{time}</span>
      </div>

      <AnimatePresence initial={false}>
        {items.map((it, i) => (
          <motion.div
            key={it.id}
            layout
            initial={{ opacity: 0, y: -16, scale: 0.96 }}
            animate={{ opacity: 1 - i * 0.18, y: 0, scale: 1 - i * 0.02 }}
            exit={{ opacity: 0, y: 24, scale: 0.94 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className={`mt-2 first:mt-0 flex items-start gap-3 rounded-2xl p-3 sm:p-3.5 ${toneRing(it.tone)} bg-white/[0.04] backdrop-blur-sm`}
          >
            <span className="grid h-8 w-8 flex-shrink-0 place-items-center rounded-xl bg-white/10">{it.icon}</span>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-white/50">{it.tag}</span>
                <span className="h-1 w-1 rounded-full bg-white/20" />
                <span className="text-[10px] text-white/40">just now</span>
              </div>
              <div className="mt-0.5 truncate text-[13.5px] font-bold text-white">{it.title}</div>
              <div className="mt-0.5 text-[11.5px] text-white/55 line-clamp-1">{it.body}</div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between text-[11px]">
        <span className="text-white/40">PawMe iOS · v1.0</span>
        <span className="font-bold text-brand-green">All systems calm</span>
      </div>
    </div>
  );
}
