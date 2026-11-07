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
        hero: ["clamp(2.75rem, 7.2vw, 6.5rem)", { lineHeight: "1.06", letterSpacing: "-0.01em" }],
      },
      borderRadius: { card: "14px", panel: "36px" },
      boxShadow: {
        card: "0 12px 40px rgba(0,0,0,0.18)",
        panel: "-12px 0 40px rgba(60,45,20,0.18)",
      },
      backgroundImage: {
        hero: "url('/hero.jpg'), linear-gradient(180deg,#7f8f9c 0%,#b9a586 42%,#7c7a68 58%,#4b6370 72%,#2c4250 100%)",
      },
    },
  },
  plugins: [],
};
