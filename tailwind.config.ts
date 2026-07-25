import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        void: "#0B0B0C",
        slate: "#141416",
        paper: "#EDE9E2",
        ash: "#6E6C6A",
        ember: "#C9601A",
      },
      fontFamily: {
        mono: ["var(--font-mono)", "ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      letterSpacing: {
        brand: "0.34em",
        wide2: "0.18em",
      },
      maxWidth: {
        shell: "82rem",
      },
    },
  },
  plugins: [],
};

export default config;
