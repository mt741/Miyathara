// Design tokens from the Figma file "Map Cam", frame 237:10391.
// tailwind.config.js reads this file. The map code reads it too.
export const colors = {
  sand: "#F1EADD", // map land and section background
  water: { DEFAULT: "#3F6B7B", pin: "#5E97A3", line: "#9DB3B6" },
  ink: { DEFAULT: "#262626", muted: "#8C8C8C", soft: "#4A4A4A" },
  link: "#2D7DB3",
  line: "#E7E7E7",
};

export const fonts = {
  sans: ['"Avenir Next"', "Avenir", '"Nunito Sans"', "system-ui", "sans-serif"],
  // Instrument Serif has no Cyrillic. Russian and Kazakh letters fall through to Cormorant.
  serif: ['"Instrument Serif"', "Cormorant", "Georgia", "serif"],
  // Kazakh needs letters (ә, ғ, қ, ң, ө, ұ, ү, һ, і) that Avenir Next lacks.
  sansKk: ['"Nunito Sans"', "system-ui", "sans-serif"],
  logo: ['"Instrument Serif"', "Georgia", "serif"],
};
