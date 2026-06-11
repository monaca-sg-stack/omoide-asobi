import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        paper: "#F5F0E8",
        wood: "#C4A882",
        sunset: "#E8A87C",
        ink: "#3D3630",
        sage: "#8B9E8B",
        mist: "#E8E4DC",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "sans-serif"],
        rounded: ["var(--font-rounded)", "sans-serif"],
      },
      maxWidth: {
        app: "480px",
      },
      animation: {
        "box-open": "boxOpen 0.6s ease-out forwards",
        "bookmark-stamp": "bookmarkStamp 0.5s ease-out forwards",
      },
      keyframes: {
        boxOpen: {
          "0%": { transform: "scale(1) rotate(0deg)" },
          "50%": { transform: "scale(1.05) rotate(-2deg)" },
          "100%": { transform: "scale(1) rotate(0deg)" },
        },
        bookmarkStamp: {
          "0%": { transform: "scale(1.4) rotate(-8deg)", opacity: "0" },
          "100%": { transform: "scale(1) rotate(0deg)", opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
