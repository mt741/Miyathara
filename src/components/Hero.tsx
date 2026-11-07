import { Fragment, useRef } from "react";
import { useI18n } from "../i18n";
import { Button } from "./Button";
import { Navbar } from "./Navbar";

/** Renders "*word*" as the italic serif accent used in the design. */
function Accented({ text }: { text: string }) {
  return (
    <>
      {text.split(/(\*[^*]+\*)/).map((part, i) =>
        part.startsWith("*") ? (
          <em key={i} className="font-serif font-normal">
            {part.slice(1, -1)}
          </em>
        ) : (
          <Fragment key={i}>{part}</Fragment>
        ),
      )}
    </>
  );
}

/** Wheel or swipe inside these elements belongs to them, not to the page. */
const OWN_SCROLL = "[role=dialog], [role=menu]";

export function Hero({ onGoToMap }: { onGoToMap: () => void }) {
  const { t } = useI18n();
  const touchY = useRef<number | null>(null);

  // The page does not scroll. A scroll down or a swipe up on the hero opens the map instead.
  const onWheel = (e: React.WheelEvent) => {
    if (e.deltaY > 20 && !(e.target as Element).closest(OWN_SCROLL)) onGoToMap();
  };
  const onTouchStart = (e: React.TouchEvent) => {
    touchY.current = (e.target as Element).closest(OWN_SCROLL) ? null : e.touches[0].clientY;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchY.current !== null && touchY.current - e.changedTouches[0].clientY > 60) onGoToMap();
    touchY.current = null;
  };

  return (
    <section
      id="top"
      onWheel={onWheel}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      className="relative flex h-full flex-col overflow-hidden bg-hero bg-cover bg-center"
    >
      <div aria-hidden className="absolute inset-0 bg-gradient-to-b from-black/25 via-black/5 to-black/10" />
      <Navbar />
      <div className="relative z-10 flex flex-1 flex-col items-center justify-start px-4 pt-[24vh] text-center text-white md:pt-[14.5rem]">
        <h1 className="max-w-[18ch] text-hero font-light sm:max-w-none">
          {t.hero.lines.map((line, i) => (
            <Fragment key={i}>
              {i > 0 && <br className="hidden sm:inline" />}
              {i > 0 && " "}
              <Accented text={line} />
            </Fragment>
          ))}
        </h1>
        <Button
          variant="glass"
          className="mt-6 md:mt-8"
          onClick={onGoToMap}
        >
          {t.hero.cta}
        </Button>
      </div>
    </section>
  );
}
