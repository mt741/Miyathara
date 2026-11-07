import { useEffect, useRef, useState } from "react";
import { waterBodies } from "../data/waterBodies";
import { useI18n } from "../i18n";
import { Button } from "./Button";
import { KazakhstanMap, type MapHandle } from "./KazakhstanMap";
import { SearchPanel } from "./SearchPanel";

// The side panel needs room. Below 1024px (phones, tablets in portrait) the list is a bottom sheet.
const DESKTOP = "(min-width: 1024px)";

export function MapSection({ onBack }: { onBack: () => void }) {
  const { t } = useI18n();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [open, setOpen] = useState(true);
  const [desktop, setDesktop] = useState(() => window.matchMedia(DESKTOP).matches);
  const [sheetHeight, setSheetHeight] = useState(0);
  const [viewportHeight, setViewportHeight] = useState(() => window.innerHeight);
  const mapRef = useRef<MapHandle>(null);
  const sheetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mq = window.matchMedia(DESKTOP);
    const onChange = () => setDesktop(mq.matches);
    const onResize = () => setViewportHeight(window.innerHeight);
    mq.addEventListener("change", onChange);
    window.addEventListener("resize", onResize);
    return () => {
      mq.removeEventListener("change", onChange);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  useEffect(() => {
    const el = sheetRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setSheetHeight(el.offsetHeight));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // The part of the map that the list covers.
  const cover = desktop ? { right: open ? 380 : 0, bottom: 0 } : { right: 0, bottom: open ? sheetHeight : 68 };
  // Fit to the sheet's largest height (max-h-[44svh] in SearchPanel), not its current height.
  // Otherwise a short result list would make the map jump and zoom out.
  const fitCover = desktop ? { right: 380, bottom: 0 } : { right: 0, bottom: Math.round(viewportHeight * 0.44) };

  const select = (id: string) => {
    setSelectedId(id);
    // On phones, lower the sheet so the selected place is visible.
    if (!desktop) setOpen(false);
  };

  return (
    <section id="map" className="relative h-full overflow-hidden bg-sand">
      <KazakhstanMap ref={mapRef} items={waterBodies} selectedId={selectedId} onSelect={select} cover={cover} fitCover={fitCover} />

      <Button
        variant="icon"
        aria-label={t.map.backToTop}
        className="absolute left-4 top-5 z-[550] border border-ink bg-sand/80 lg:left-[70px] lg:top-[70px]"
        onClick={onBack}
      >
        <svg width="14" height="12" viewBox="0 0 14 12" fill="none" stroke="currentColor" strokeWidth="1.3" aria-hidden>
          <path d="M6 1L1 6l5 5M1 6h12" />
        </svg>
      </Button>

      <div className="absolute right-3 top-14 z-[550] flex flex-col rounded-full bg-sand/80 text-ink-soft lg:left-4 lg:right-auto lg:top-[160px]">
        <Button aria-label={t.map.zoomIn} className="h-9 w-9 text-xl leading-none hover:text-ink lg:h-7 lg:w-7" onClick={() => mapRef.current?.zoomIn()}>
          +
        </Button>
        <Button aria-label={t.map.zoomOut} className="h-9 w-9 text-xl leading-none hover:text-ink lg:h-7 lg:w-7" onClick={() => mapRef.current?.zoomOut()}>
          −
        </Button>
      </div>

      <SearchPanel
        ref={sheetRef}
        items={waterBodies}
        selectedId={selectedId}
        onSelect={select}
        open={open}
        onOpenChange={setOpen}
      />
    </section>
  );
}
