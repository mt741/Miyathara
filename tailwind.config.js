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
      backgroundImage: {
        hero: "url('/hero.jpg')",
      },
    },
  },
  plugins: [],
};
