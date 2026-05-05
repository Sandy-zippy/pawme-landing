"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, useMotionValue, animate } from "framer-motion";

type Props = { value: number; suffix?: string; prefix?: string; durationMs?: number; className?: string };

export default function CountUp({ value, suffix = "", prefix = "", durationMs = 1400, className }: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, value, {
      duration: durationMs / 1000,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (latest) => setDisplay(latest),
    });
    return () => controls.stop();
  }, [inView, value, durationMs]);

  const formatted = Number.isInteger(value) ? Math.round(display).toLocaleString() : display.toFixed(1);
  return <span ref={ref} className={className}>{prefix}{formatted}{suffix}</span>;
}
