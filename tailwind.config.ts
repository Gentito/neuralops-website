import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: "#04050A",
        navy: "#070B1A",
        signal: {
          DEFAULT: "#58C4FF",
          soft: "#8FD6FF",
          deep: "#1E6FB8"
        }
      },
      fontFamily: {
        display: ["var(--font-space)", "ui-sans-serif", "system-ui"]
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(88, 196, 255, 0.25), 0 8px 30px rgba(88, 196, 255, 0.15)",
        "glow-lg":
          "0 0 0 1px rgba(88, 196, 255, 0.28), 0 18px 60px -12px rgba(88, 196, 255, 0.45)",
        panel: "0 30px 80px -40px rgba(0, 0, 0, 0.9)"
      },
      backgroundImage: {
        "radial-glow":
          "radial-gradient(1200px circle at var(--x, 50%) var(--y, 30%), rgba(88, 196, 255, 0.18), transparent 55%)",
        "grid-fade":
          "linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)"
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" }
        },
        shimmer: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" }
        },
        "pulse-slow": {
          "0%, 100%": { opacity: "0.6" },
          "50%": { opacity: "1" }
        }
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        shimmer: "shimmer 2.4s ease-in-out infinite",
        "pulse-slow": "pulse-slow 4s ease-in-out infinite"
      }
    }
  },
  plugins: []
} satisfies Config;
