/** A hero line: plain text, with *asterisks* around words set in the italic serif. */
export const en = {
  langName: "ENG",
  meta: { title: "Miyathara — Stories of Water" },
  tagline: "Stories of Water: Worlds to Discover",
  nav: { language: "Language", about: "About", how: "How it works", menu: "Menu", close: "Close" },
  hero: { lines: ["*Explore* the Kazakhstan’s", "Water *Bodies*"], cta: "Go to map" },
  about: {
    title: "About Miyathara",
    lead: "Water has more stories than we see on a map.",
    body: [
      "Miyathara is an interactive space for exploring the stories of water. Beginning with Kazakhstan, it brings together the history of water bodies, the changes affecting them, and the efforts shaping their future.",
      "By looking beyond the surface, we hope to turn curiosity into understanding — and understanding into a deeper sense of care for the water and the world around us.",
    ],
  },
  how: {
    title: "How it works",
    lead: "Explore water bodies through an interactive map. Each place opens a window into its story — from its significance and different changes to ongoing efforts and what may come next.",
    steps: [
      ["Discover", "Choose a water body and learn why it matters."],
      ["Explore", "Follow its history and discover how it has changed."],
      ["Understand", "Learn about the responses, research, and efforts connected to it."],
      ["Look ahead", "Explore what remains unresolved and find meaningful ways to learn more or take action."],
    ] as [string, string][],
  },
  map: {
    backToTop: "Back to top",
    zoomIn: "Zoom in",
    zoomOut: "Zoom out",
  },
  search: {
    label: "Search water bodies",
    placeholder: "Type...",
    empty: "No water bodies found.",
    showList: "Show list",
    hideList: "Hide list",
  },
  places: {
    alakol: ["Alakol", "Jetisu Region, Kazakhstan"],
    aral: ["Aral Sea", "Kyzylorda Region, Kazakhstan"],
    balkhash: ["Balkhash", "Balkhash, Kazakhstan"],
    burabay: ["Burabay", "Akmola Region, Kazakhstan"],
    caspian: ["Caspian Sea", "Mangystau Region, Kazakhstan"],
    "maly-taldykol": ["Maly Taldykol", "Astana, Kazakhstan"],
    tengiz: ["Tengiz", "Akmola Region, Kazakhstan"],
  } as Record<string, [string, string]>,
};

export type Messages = typeof en;
