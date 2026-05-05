import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";
import Tracking from "@/components/Tracking";

const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-nunito",
  weight: ["400", "600", "700", "800", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "PawMe — The AI Pet Camera That Follows Your Pet Room to Room",
  description:
    "PawMe is the world's first AI pet companion that follows your pet room to room, detects anxiety, and gives you peace of mind. Reserve VIP for $1.",
  icons: { icon: `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/favicon.png` },
  openGraph: {
    title: "PawMe — The AI Pet Camera That Follows Your Pet Room to Room",
    description:
      "847+ pet parents already joined the waitlist. Lock in 50% off ($199 vs $399 retail) for just $1.",
    url: "https://pawmebot.com",
    siteName: "PawMe",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={nunito.variable}>
      <body className="font-body antialiased">
        {children}
        <Tracking />
      </body>
    </html>
  );
}
