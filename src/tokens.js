// Design tokens from the Figma file "Map Cam", frame 237:10391.
// tailwind.config.js reads this file. The map code reads it too.
export const colors = {
  sand: "#F1EADD", // map land and section background
  water: { DEFAULT: "#3F6B7B", pin: "#5E97A3", line: "#9DB3B6" },
  ink: { DEFAULT: "#262626", muted: "#8C8C8C", soft: "#353535" },
  link: "#3084B7",
  line: "#E7E7E7",
  menu: { DEFAULT: "#ECECEC", text: "#222222" }, // language dropdown
};

export const fonts = {
  sans: ['"Avenir Next"', "Avenir", '"Nunito Sans"', "system-ui", "sans-serif"],
  // The design uses Apple Garamond Light Italic, which is not a web font.
  // Cormorant Garamond is the nearest free match, and it has Kazakh and Russian letters.
  serif: ['"Cormorant Garamond"', "Garamond", "Georgia", "serif"],
  // Kazakh needs letters (ә, ғ, қ, ң, ө, ұ, ү, һ, і) that Avenir Next lacks.
  sansKk: ['"Nunito Sans"', "system-ui", "sans-serif"],
  // The design uses Season Serif Bold (a paid font). Libre Caslon Text Bold is the nearest free match.
  logo: ['"Libre Caslon Text"', "Georgia", "serif"],
};
