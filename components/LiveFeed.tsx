"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CameraIcon, BellIcon, HeartIcon, BrainIcon, ChartIcon, CheckIcon } from "./icons";

type Tone = "good" | "info" | "alert";
type Event = { id: string; icon: React.ReactNode; tag: string; title: string; body: string; tone: Tone };

const POOL: Omit<Event, "id">[] = [
  { icon: <CheckIcon size={16} color="#04DA8D" />, tag: "Calm", title: "Buddy resting in living room", body: "Anxiety level: 12 — well below baseline.", tone: "good" },
  { icon: <CameraIcon size={16} color="#0085FF" />, tag: "Tracking", title: "PawMe followed Luna into kitchen", body: "Pet has moved 4 rooms today.", tone: "info" },
  { icon: <BellIcon size={16} color="#FF9F43" />, tag: "Alert", title: "Pacing detected near front door", body: "Triggered calming sound (3:42 PM).", tone: "alert" },
  { icon: <HeartIcon size={16} color="#FF6B6B" />, tag: "Health", title: "Heart rate normal — 92 bpm", body: "Within healthy range for breed/age.", tone: "good" },
  { icon: <BrainIcon size={16} color="#8E54E9" />, tag: "AI", title: "Routine learned: 4 PM nap window", body: "Notifications muted during nap times.", tone: "info" },
  { icon: <ChartIcon size={16} color="#04DA8D" />, tag: "Insight", title: "Anxiety down 23% this week", body: "Compared to last 7 days.", tone: "good" },
  { icon: <CameraIcon size={16} color="#0085FF" />, tag: "Live", title: "HD stream active in bedroom", body: "Two-way audio enabled.", tone: "info" },
];

const TONE_BG: Record<Tone, string> = {
  good: "bg-brand-green/[0.07] ring-brand-green/25",
  info: "bg-brand-blue/[0.06] ring-brand-blue/25",
  alert: "bg-brand-orange/[0.07] ring-brand-orange/30",
};

// Pre-pick deterministic initial events so server + client HTML match.
const INITIAL: Event[] = [
  { ...POOL[0], id: "ev1" },
  { ...POOL[2], id: "ev2" },
  { ...POOL[4], id: "ev3" },
  { ...POOL[5], id: "ev4" },
];

function nextEvent(index: number): Event {
  const item = POOL[index % POOL.length];
  return { ...item, id: `ev-${Date.now()}-${index}` };
}

export default function LiveFeed() {
  const [items, setItems] = useState<Event[]>(INITIAL);
  const [time, setTime] = useState<string>("");
  const ref = useRef<HTMLDivElement>(null);
  const counter = useRef(INITIAL.length);

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
      setItems((prev) => {
        const next = nextEvent(counter.current++);
        return [next, ...prev].slice(0, 4);
      });
    }, 2800);

    return () => { mounted = false; clearInterval(interval); clearInterval(tick); obs.disconnect(); };
  }, []);

  return (
    <div
      ref={ref}
      className="relative mx-auto w-full max-w-sm rounded-[28px] border border-white/10 bg-brand-dark p-4 sm:p-5 shadow-[0_30px_80px_rgba(0,0,0,0.35)]"
    >
      {/* Status bar */}
      <div className="mb-3 flex items-center justify-between border-b border-white/[0.07] pb-3 text-[11px] font-bold text-white/70">
        <span className="inline-flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-green opacity-60" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-brand-green" />
          </span>
          LIVE — Buddy at home
        </span>
        <span suppressHydrationWarning className="font-mono text-white/45">{time || "—"}</span>
      </div>

      {/* Fixed-height feed area to prevent layout shift */}
      <div className="relative h-[372px] overflow-hidden">
        <AnimatePresence initial={false}>
          {items.map((it) => (
            <motion.div
              key={it.id}
              layout
              initial={{ opacity: 0, y: -32, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.25 } }}
              transition={{ type: "spring", damping: 24, stiffness: 240 }}
              className={`mb-2.5 flex items-start gap-3 rounded-2xl p-3 sm:p-3.5 ring-1 ${TONE_BG[it.tone]} backdrop-blur-sm`}
            >
              <span className="grid h-9 w-9 flex-shrink-0 place-items-center rounded-xl bg-white/[0.08]">
                {it.icon}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-wider">
                  <span className="text-white/60">{it.tag}</span>
                  <span className="h-1 w-1 rounded-full bg-white/25" />
                  <span className="text-white/40">just now</span>
                </div>
                <div className="mt-0.5 truncate text-[13.5px] font-bold text-white">{it.title}</div>
                <div className="mt-0.5 truncate text-[11.5px] text-white/55">{it.body}</div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Soft fade at bottom edge so the cycling card animates out cleanly */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-brand-dark to-transparent" />
      </div>

      <div className="mt-3 flex items-center justify-between border-t border-white/[0.07] pt-3 text-[11px]">
        <span className="text-white/40">PawMe iOS · v1.0</span>
        <span className="font-bold text-brand-green">All systems calm</span>
      </div>
    </div>
  );
}
