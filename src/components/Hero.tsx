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
          <em key={i} className="font-serif text-[1.0476em] font-light">
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
      // Desktop: the design fills the width with the photo and stretches it to 126% of the
      // height, cropped at the bottom. Phones: the same height and crop, without the stretch.
      className="relative flex h-full flex-col overflow-hidden bg-[#8a8f8f] bg-hero bg-[length:auto_126.13%] bg-[position:62%_0] md:bg-[length:100%_126.13%] md:bg-top"
    >
      <div aria-hidden className="absolute inset-0 bg-black/30" />
      <Navbar />
      <div className="relative z-10 flex flex-1 flex-col items-center justify-start px-4 pt-[26vh] text-center text-white md:pt-[min(299px,33.2vh)]">
        <h1 className="max-w-[18ch] text-hero font-normal sm:max-w-[1217px]">
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
          className="mt-6 md:mt-[30px]"
          onClick={onGoToMap}
        >
          {t.hero.cta}
        </Button>
      </div>
    </section>
  );
}
