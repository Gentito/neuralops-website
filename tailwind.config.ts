import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: "#05060A",
        navy: "#070B1A"
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(88, 196, 255, 0.25), 0 8px 30px rgba(88, 196, 255, 0.15)"
      },
      backgroundImage: {
        "radial-glow":
          "radial-gradient(1200px circle at var(--x, 50%) var(--y, 30%), rgba(88, 196, 255, 0.20), transparent 55%)"
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" }
        }
      },
      animation: {
        float: "float 6s ease-in-out infinite"
      }
    }
  },
  plugins: []
} satisfies Config;
