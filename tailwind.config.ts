import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ziva: {
          crimson: "#991B1B",
          amber: "#D97706",
          charcoal: "#1C1917",
          emerald: "#065F46",
          cream: "#FFFBEB",
          gold: "#F59E0B",
          terracotta: "#C2410C",
        },
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      animation: {
        "steam-rise": "steam 4s ease-in-out infinite",
        "pulse-glow": "pulseGlow 3s ease-in-out infinite",
        "float-slow": "float 6s ease-in-out infinite",
      },
      keyframes: {
        steam: {
          "0%": { transform: "translateY(0) scaleX(1)", opacity: "0.2" },
          "50%": { transform: "translateY(-25px) scaleX(1.2)", opacity: "0.6" },
          "100%": { transform: "translateY(-50px) scaleX(1.4)", opacity: "0" },
        },
        pulseGlow: {
          "0%, 100%": { opacity: "0.4" },
          "50%": { opacity: "0.8" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px) rotate(0deg)" },
          "50%": { transform: "translateY(-12px) rotate(2deg)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;