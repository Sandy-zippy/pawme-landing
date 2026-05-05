"use client";

import Script from "next/script";
import { useEffect } from "react";
import { siteConfig } from "@/lib/siteConfig";

declare global {
  interface Window {
    clarity?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

/** Microsoft Clarity */
function Clarity() {
  const id = siteConfig.tracking.clarityProjectId;
  if (!id) return null;
  return (
    <Script id="ms-clarity" strategy="afterInteractive">
      {`(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,"clarity","script","${id}");`}
    </Script>
  );
}

/** Meta Pixel base */
function MetaPixel() {
  const id = siteConfig.tracking.metaPixelId;
  if (!id) return null;
  return (
    <>
      <Script id="meta-pixel" strategy="afterInteractive">
        {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${id}');fbq('track','PageView');`}
      </Script>
      <noscript>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img height="1" width="1" style={{ display: "none" }} alt="" src={`https://www.facebook.com/tr?id=${id}&ev=PageView&noscript=1`} />
      </noscript>
    </>
  );
}

/** GA4 (optional) */
function Ga4() {
  const id = siteConfig.tracking.gaMeasurementId;
  if (!id) return null;
  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${id}`} strategy="afterInteractive" />
      <Script id="ga4-init" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];function gtag(){dataLayer.push(arguments);}gtag('js', new Date());gtag('config','${id}');`}
      </Script>
    </>
  );
}

/** Public helpers callable from anywhere */
export function trackLead(payload: { email: string; firstName?: string }) {
  try { window.fbq?.("track", "Lead", { content_name: "PawMe VIP", value: 1, currency: "USD" }); } catch {}
  try { window.gtag?.("event", "generate_lead", { value: 1, currency: "USD", email: payload.email }); } catch {}
  try { window.clarity?.("set", "lead", "1"); } catch {}
}

export function trackPurchase(payload: { email?: string; sessionId?: string }) {
  try { window.fbq?.("track", "Purchase", { value: 1, currency: "USD" }); } catch {}
  try { window.gtag?.("event", "purchase", { transaction_id: payload.sessionId || "stripe_link", value: 1, currency: "USD" }); } catch {}
  try { window.clarity?.("set", "purchaser", "1"); } catch {}
}

export default function Tracking() {
  useEffect(() => {
    // First-touch UTM persistence so any later GHL event can be enriched
    try {
      const params = new URLSearchParams(window.location.search);
      const utm: Record<string, string> = {};
      ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "fbclid", "gclid"].forEach(k => {
        const v = params.get(k);
        if (v) utm[k] = v;
      });
      if (Object.keys(utm).length) {
        const existing = JSON.parse(localStorage.getItem("pawme_utm") || "{}");
        localStorage.setItem("pawme_utm", JSON.stringify({ ...utm, ...existing }));
      }
    } catch {}
  }, []);

  return (
    <>
      <Clarity />
      <MetaPixel />
      <Ga4 />
    </>
  );
}
