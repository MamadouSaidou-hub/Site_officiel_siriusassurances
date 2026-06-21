import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        sirius: {
          bg: "#0F131F",
          surface: "#161A26",
          surface2: "#0D2F3B",
          gold: "#EAC14B",
          "gold-soft": "#D9CC7D",
          text: "#DCE2F2",
          "text-dim": "rgba(220,226,242,0.62)",
          "text-mute": "rgba(220,226,242,0.45)",
          border: "rgba(255,255,255,0.10)",
          "border-teal": "rgba(45,212,191,0.22)",
        },
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', "system-ui", "sans-serif"],
      },
      maxWidth: {
        container: "1280px",
      },
    },
  },
  plugins: [],
};

export default config;
