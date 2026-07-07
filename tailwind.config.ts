import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        sirius: {
          // Fonds sombres (bleu marine — charte PDF)
          bg: "#0B1B2E",
          surface: "#12283F",
          surface2: "#0E2337",
          // Accent cyan (token "gold" conservé pour compat — valeur = cyan charte)
          gold: "#17A2DC",
          "gold-soft": "#5CC5EE",
          // Texte sur fond sombre
          text: "#EAF1F8",
          "text-dim": "rgba(234,241,248,0.66)",
          "text-mute": "rgba(234,241,248,0.45)",
          border: "rgba(255,255,255,0.10)",
          "border-teal": "rgba(23,162,220,0.28)",
          // Sections claires (charte PDF)
          light: "#EEF3F8",
          "light-2": "#F6F9FC",
          card: "#FFFFFF",
          ink: "#0B1B2E",
          "ink-dim": "#5A6B7B",
          "ink-mute": "#8A98A6",
          "light-border": "#DDE6EF",
        },
      },
      fontFamily: {
        sans: ["var(--font-jakarta)", "system-ui", "sans-serif"],
        serif: ["var(--font-lora)", "Georgia", "Cambria", "serif"],
      },
      maxWidth: {
        container: "1280px",
      },
    },
  },
  plugins: [],
};

export default config;
