import React from "react";

type IconProps = { size?: number; color?: string; className?: string };

export const PawIcon = ({ size = 24, color = "#04DA8D" }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <ellipse cx="7" cy="5" rx="2" ry="2.5" fill={color} />
    <ellipse cx="17" cy="5" rx="2" ry="2.5" fill={color} />
    <ellipse cx="4.5" cy="9" rx="1.8" ry="2.2" fill={color} />
    <ellipse cx="19.5" cy="9" rx="1.8" ry="2.2" fill={color} />
    <path d="M12 18C12 18 7 14.5 7 11.5C7 10 8.5 9 10 9.5C11 10 11.5 10.5 12 11.5C12.5 10.5 13 10 14 9.5C15.5 9 17 10 17 11.5C17 14.5 12 18 12 18Z" fill={color} />
  </svg>
);

export const HeartIcon = ({ size = 24, color = "#FF6B6B" }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" fill={color} />
  </svg>
);

export const ShieldIcon = ({ size = 24, color = "#04DA8D" }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M12 2L3 7v5c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-9-5z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M9 12l2 2 4-4" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const CameraIcon = ({ size = 24, color = "#0085FF" }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <rect x="1" y="5" width="15" height="14" rx="2" stroke={color} strokeWidth="2" />
    <path d="M23 7l-7 5 7 5V7z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const BellIcon = ({ size = 24, color = "#FF9F43" }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M18 8A6 6 0 106 8c0 7-3 9-3 9h18s-3-2-3-9zM13.73 21a2 2 0 01-3.46 0" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const ClockIcon = ({ size = 24, color = "#8E54E9" }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2" />
    <path d="M12 6v6l4 2" stroke={color} strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export const CheckIcon = ({ size = 24, color = "#04DA8D" }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M20 6L9 17l-5-5" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const XIcon = ({ size = 24, color = "#FF6B6B" }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M18 6L6 18M6 6l12 12" stroke={color} strokeWidth="3" strokeLinecap="round" />
  </svg>
);

export const SparkleIcon = ({ size = 24, color = "#0085FF" }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M12 2l2.4 7.2L22 12l-7.6 2.8L12 22l-2.4-7.2L2 12l7.6-2.8L12 2z" fill={color} />
  </svg>
);

export const ChartIcon = ({ size = 24, color = "#04DA8D" }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M3 3v18h18" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <path d="M7 14l4-4 4 4 5-5" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const BrainIcon = ({ size = 24, color = "#8E54E9" }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M9.5 2A4.5 4.5 0 005 6.5v.5a3.5 3.5 0 00-2 6.36V14a4 4 0 004 4h.5a3.5 3.5 0 003.5 3.5V2.5A4.5 4.5 0 009.5 2zM14.5 2A4.5 4.5 0 0119 6.5v.5a3.5 3.5 0 012 6.36V14a4 4 0 01-4 4h-.5a3.5 3.5 0 01-3.5 3.5V2.5A4.5 4.5 0 0114.5 2z" stroke={color} strokeWidth="1.6" strokeLinejoin="round" />
  </svg>
);
