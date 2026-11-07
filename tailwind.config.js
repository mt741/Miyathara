/** Design tokens taken from the Figma file "Map Cam", frame 237:10391. */
import { colors, fonts } from "./src/tokens.js";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors,
      fontFamily: fonts,
      fontSize: {
        // 105px at 1440px wide, line height 113px, as in the design.
        hero: ["clamp(2.6rem, 7.3vw, 6.5625rem)", { lineHeight: "1.076" }],
      },
      borderRadius: { card: "15px", panel: "36px" },
      boxShadow: {
        card: "0 10px 100px rgba(0,0,0,0.3)",
        panel: "-12px 0 40px rgba(60,45,20,0.18)",
      },
      keyframes: {
        "sheet-in": { from: { transform: "translateY(100%)" }, to: { transform: "none" } },
        "fade-in": { from: { opacity: "0" }, to: { opacity: "1" } },
        "pop-in": { from: { opacity: "0", transform: "translateY(-6px) scale(0.98)" }, to: { opacity: "1", transform: "none" } },
      },
      animation: {
        "sheet-in": "sheet-in 0.32s cubic-bezier(0.32, 0.72, 0, 1)",
        "fade-in": "fade-in 0.2s ease-out",
        "pop-in": "pop-in 0.16s ease-out",
      },
      backgroundImage: {
        hero: "url('/hero.jpg')",
      },
    },
  },
  plugins: [],
};
