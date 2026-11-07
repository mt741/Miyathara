import { forwardRef, useMemo, useState } from "react";
import type { WaterBody } from "../data/waterBodies";
import { LOCALES, useI18n } from "../i18n";
import { buildIndex, search } from "../lib/search";
import { Button } from "./Button";

type Props = {
  items: WaterBody[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

function PinIcon({ className = "" }: { className?: string }) {
  return (
    <svg width="12" height="16" viewBox="0 0 12 16" className={className} aria-hidden>
      <path fill="currentColor" d="M6 0a6 6 0 0 0-6 6c0 4.2 6 10 6 10s6-5.8 6-10a6 6 0 0 0-6-6zm0 8.2A2.2 2.2 0 1 1 6 3.8a2.2 2.2 0 0 1 0 4.4z" />
    </svg>
  );
}

/** The list of water bodies: a side panel on desktop, a bottom sheet on phones. */
export const SearchPanel = forwardRef<HTMLDivElement, Props>(function SearchPanel(
  { items, selectedId, onSelect, open, onOpenChange },
  sheetRef,
) {
  const { t } = useI18n();
  const [query, setQuery] = useState("");

  // Every place is searchable by its names and regions in all three languages, plus other
  // spellings. So the search works in any language, whatever language the page shows.
  const index = useMemo(
    () =>
      buildIndex(
        items.map((w) => ({
          id: w.id,
          names: Object.values(LOCALES).map((l) => l.places[w.id][0]).concat(w.aliases),
          regions: Object.values(LOCALES).map((l) => l.places[w.id][1]).concat(w.regionAliases),
        })),
      ),
    [items],
  );

  const filtered = useMemo(() => {
    const byId = new Map(items.map((w) => [w.id, w]));
    return search(index, query).map((id) => byId.get(id)!);
  }, [index, items, query]);

  return (
    <aside
      className={`absolute inset-x-0 bottom-0 z-[600] transition-transform duration-300 lg:inset-x-auto lg:right-0 lg:top-[150px] lg:w-[380px] ${
        open ? "translate-y-0 lg:translate-x-0" : "translate-y-[calc(100%-4.25rem)] lg:translate-x-full lg:translate-y-0"
      }`}
    >
      {/* Collapse handle */}
      <Button
        aria-label={open ? t.search.hideList : t.search.showList}
        aria-expanded={open}
        onClick={() => onOpenChange(!open)}
        className="absolute left-1/2 top-0 flex h-7 w-14 -translate-x-1/2 -translate-y-full items-center justify-center rounded-t-xl bg-white lg:left-0 lg:top-1/2 lg:h-12 lg:w-6 lg:-translate-x-full lg:-translate-y-1/2 lg:rounded-l-lg lg:rounded-tr-none"
      >
        <svg
          width="7"
          height="12"
          viewBox="0 0 7 12"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.4"
          aria-hidden
          className={`transition-transform ${open ? "rotate-90 lg:rotate-0" : "-rotate-90 lg:rotate-180"}`}
        >
          <path d="M1 1l5 5-5 5" />
        </svg>
      </Button>

      <div
        ref={sheetRef}
        className={`flex max-h-[44svh] flex-col rounded-t-[28px] bg-white px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-4 shadow-panel sm:px-5 lg:h-full lg:max-h-none lg:rounded-l-panel lg:rounded-tr-none lg:px-6 lg:pb-6 lg:pt-5${open ? "" : " lg:shadow-none"}`}
      >
        <label className="relative block lg:mr-8">
          <span className="sr-only">{t.search.label}</span>
          <input
            type="search"
            autoComplete="off"
            spellCheck={false}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => onOpenChange(true)}
            placeholder={t.search.placeholder}
            className="w-full rounded-full border border-water bg-white py-2.5 pl-4 pr-10 text-base text-water placeholder:text-water/70 focus:outline-none focus:ring-2 focus:ring-water/30 [&::-webkit-search-cancel-button]:hidden"
          />
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.4" className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-water" aria-hidden>
            <circle cx="7.5" cy="7.5" r="6" />
            <path d="M12 12l5 5" />
          </svg>
        </label>

        <ul className="mt-2 overflow-y-auto overscroll-contain lg:mr-8 lg:mt-3">
          {filtered.map((w) => {
            const [name, region] = t.places[w.id];
            const active = selectedId === w.id;
            return (
              <li key={w.id} className="border-b border-line">
                <button
                  type="button"
                  aria-pressed={active}
                  onClick={() => onSelect(w.id)}
                  className={`flex w-full items-start gap-3 py-3 text-left transition-colors hover:text-water lg:py-2.5 ${
                    active ? "text-water" : "text-ink"
                  }`}
                >
                  <PinIcon className="mt-1 shrink-0" />
                  <span>
                    <span className="block text-lg font-semibold leading-tight">{name}</span>
                    <span className="block text-xs text-ink-muted">{region}</span>
                  </span>
                </button>
              </li>
            );
          })}
          {filtered.length === 0 && <li className="py-4 text-sm text-ink-muted">{t.search.empty}</li>}
        </ul>
      </div>
    </aside>
  );
});
