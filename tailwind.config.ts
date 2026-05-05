import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          green: "#04DA8D",
          neon: "#00FF94",
          blue: "#0085FF",
          dark: "#0E1E2E",
          darkAlt: "#1A2F44",
          cream: "#FFF8F0",
          offWhite: "#F8FAFC",
          red: "#FF6B6B",
          orange: "#FF9F43",
          purple: "#8E54E9",
        },
      },
      fontFamily: {
        heading: ["var(--font-nunito)", "SF Pro Rounded", "system-ui", "sans-serif"],
        body: ["var(--font-nunito)", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "primary-gradient": "linear-gradient(90deg, #04DA8D 0%, #0085FF 100%)",
        "mid-cta-gradient": "linear-gradient(135deg, #4F46E5 0%, #06B6D4 100%)",
        "dark-gradient": "linear-gradient(135deg, #0E1E2E 0%, #1A2F44 100%)",
      },
      boxShadow: {
        card: "0 4px 24px rgba(0,0,0,0.06)",
        cardHover: "0 12px 40px rgba(0,0,0,0.12)",
        button: "0 10px 40px rgba(4,218,141,0.35)",
      },
    },
  },
  plugins: [],
};
export default config;
