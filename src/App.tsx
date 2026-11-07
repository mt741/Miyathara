import { useCallback, useEffect, useRef, useState } from "react";
import { Hero } from "./components/Hero";
import { MapSection } from "./components/MapSection";

type View = "hero" | "map";
const viewFromUrl = (): View => (location.hash === "#map" ? "map" : "hero");

/**
 * The page has two full-screen views and never scrolls. "Go to map" slides the map in,
 * and the back arrow or the browser Back button slides the hero back.
 */
export default function App() {
  const [view, setView] = useState<View>(viewFromUrl);
  const heroRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onPop = () => setView(viewFromUrl());
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  // The hidden view must not take keyboard focus or be read by screen readers.
  useEffect(() => {
    heroRef.current?.toggleAttribute("inert", view !== "hero");
    mapRef.current?.toggleAttribute("inert", view !== "map");
  }, [view]);

  const goToMap = useCallback(() => {
    if (viewFromUrl() === "map") return;
    history.pushState({ fromHero: true }, "", "#map");
    setView("map");
  }, []);

  const goToHero = useCallback(() => {
    // If the map was opened from the hero, go back in history, so Back and Forward stay in order.
    if ((history.state as { fromHero?: boolean } | null)?.fromHero) return history.back();
    history.replaceState(null, "", location.pathname + location.search);
    setView("hero");
  }, []);

  return (
    <main className="fixed inset-0 overflow-hidden">
      <div
        className="h-full transition-transform duration-700 ease-[cubic-bezier(0.65,0,0.35,1)] motion-reduce:transition-none"
        style={{ transform: view === "map" ? "translateY(-100%)" : "none" }}
      >
        <div ref={heroRef} className="h-full">
          <Hero onGoToMap={goToMap} />
        </div>
        <div ref={mapRef} className="h-full">
          <MapSection onBack={goToHero} />
        </div>
      </div>
    </main>
  );
}
