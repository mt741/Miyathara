import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { LOCALES, useI18n, type Locale } from "../i18n";
import { Button } from "./Button";
import { Card } from "./Card";
import { Logo } from "./Logo";
import chevron from "../assets/chevron.svg";
import closeIcon from "../assets/close.svg";

type Panel = "about" | "how" | "lang" | "menu" | null;

/** Card body text: 18px, with one empty line between paragraphs, as in the design. */
const BODY = "space-y-[1.37em] text-base leading-normal text-ink-soft md:text-lg";

function AboutContent() {
  const { t } = useI18n();
  return (
    <div className={BODY}>
      <p className="font-semibold text-link">{t.about.lead}</p>
      {t.about.body.map((p) => (
        <p key={p}>{p}</p>
      ))}
    </div>
  );
}

function HowContent() {
  const { t } = useI18n();
  return (
    <div className={BODY}>
      <p className="font-semibold">{t.how.lead}</p>
      {t.how.steps.map(([term, text]) => (
        <p key={term}>
          <span className="font-semibold text-link">{term}</span> — {text}
        </p>
      ))}
    </div>
  );
}

/** The design's chevron icon points left. Turned -90° it points down. */
const Chevron = () => <img src={chevron} width={4.4} height={8} alt="" className="-rotate-90" />;

/** In the design, the caret center is 59px from the card's right edge. */
const CARET_FROM_RIGHT = 59;

export function Navbar() {
  const { t, locale, setLocale } = useI18n();
  const [open, setOpen] = useState<Panel>(null);
  const ref = useRef<HTMLElement>(null);
  const aboutRef = useRef<HTMLButtonElement>(null);
  const howRef = useRef<HTMLButtonElement>(null);
  const [place, setPlace] = useState<{ top: number; right: number; caret: number } | null>(null);

  // Place the card under the link that opened it, with the caret pointing at the link.
  // Label widths change with the language, so this is measured, not fixed.
  useLayoutEffect(() => {
    const btn = open === "about" ? aboutRef.current : open === "how" ? howRef.current : null;
    const header = ref.current;
    if (!btn || !header || btn.offsetParent === null) return setPlace(null);
    const b = btn.getBoundingClientRect();
    const h = header.getBoundingClientRect();
    const center = b.left + b.width / 2;
    const right = Math.max(16, h.right - center - CARET_FROM_RIGHT);
    setPlace({ top: b.bottom - h.top + 24, right, caret: h.right - right - center });
  }, [open, locale]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(null);
    const onClick = (e: MouseEvent) => ref.current && !ref.current.contains(e.target as Node) && setOpen(null);
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, [open]);

  const toggle = (p: Exclude<Panel, null>) => setOpen((cur) => (cur === p ? null : p));
  const active = (p: Panel) => (open === p ? "!text-white/70" : "");
  const pick = (l: Locale) => {
    setLocale(l);
    setOpen(null);
  };

  return (
    <header ref={ref} className="absolute inset-x-0 top-0 z-30 px-4 pt-4 md:px-[42px] md:pt-[35px]">
      <nav className="flex items-center justify-between gap-4 py-[10px]">
        <Logo />
        <div className="flex items-center gap-5 md:gap-[29px]">
          <div className="relative">
            <Button
              variant="nav"
              className="flex items-center gap-[5px] font-semibold uppercase"
              aria-label={t.nav.language}
              aria-haspopup="menu"
              aria-expanded={open === "lang"}
              onClick={() => toggle("lang")}
            >
              {t.langName}
              <Chevron />
            </Button>
            {open === "lang" && (
              <ul role="menu" className="absolute left-0 top-full mt-[7px] w-full min-w-[3.6rem]">
                {(["en", "ru", "kk"] as Locale[])
                  .filter((l) => l !== locale)
                  .map((l) => (
                    <li key={l} role="none">
                      <button
                        role="menuitem"
                        lang={l}
                        onClick={() => pick(l)}
                        className="block w-full bg-menu px-[3px] py-1 text-left text-base font-semibold uppercase text-menu-text hover:bg-white md:text-xl"
                      >
                        {LOCALES[l].langName}
                      </button>
                    </li>
                  ))}
              </ul>
            )}
          </div>

          {/* Wide screens: text links. Phones: one menu button, because the Kazakh and Russian labels are long. */}
          <div className="hidden items-center gap-4 sm:flex md:gap-7">
            <Button ref={aboutRef} variant="nav" className={active("about")} aria-expanded={open === "about"} onClick={() => toggle("about")}>
              {t.nav.about}
            </Button>
            <Button ref={howRef} variant="nav" className={active("how")} aria-expanded={open === "how"} onClick={() => toggle("how")}>
              {t.nav.how}
            </Button>
          </div>
          <Button
            variant="nav"
            className="-m-2 flex h-10 w-10 items-center justify-center sm:hidden"
            aria-label={open === "menu" ? t.nav.close : t.nav.menu}
            aria-expanded={open === "menu"}
            aria-haspopup="true"
            onClick={() => toggle("menu")}
          >
            <svg width="22" height="16" viewBox="0 0 22 16" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden>
              {open === "menu" ? <path d="M4 1l14 14M18 1L4 15" /> : <path d="M1 2h20M1 8h20M1 14h20" />}
            </svg>
          </Button>
        </div>
      </nav>

      {/* Phones: a small dropdown under the menu button. */}
      {open === "menu" && (
        <div role="menu" className="absolute right-4 top-[4.25rem] w-56 animate-pop-in sm:hidden">
          <div className="overflow-hidden rounded-card bg-white shadow-card">
            {(["about", "how"] as const).map((p, i) => (
              <button
                key={p}
                role="menuitem"
                onClick={() => setOpen(p)}
                className={`flex w-full items-center justify-between px-5 py-4 text-left text-base text-ink-soft active:bg-sand ${
                  i > 0 ? "border-t border-line" : ""
                }`}
              >
                {t.nav[p]}
                <img src={chevron} width={4.4} height={8} alt="" className="rotate-180 opacity-40 invert" />
              </button>
            ))}
          </div>
        </div>
      )}

      {(open === "about" || open === "how") && (
        <>
          {/* Wide screens: the card from the design, under the link, with the caret. */}
          <div
            className="absolute hidden w-[444px] sm:block"
            style={place ? { top: place.top, right: place.right } : undefined}
          >
            <Card
              title={open === "about" ? t.about.title : t.how.title}
              onClose={() => setOpen(null)}
              closeLabel={t.nav.close}
              caretRight={place?.caret}
              role="dialog"
              aria-label={open === "about" ? t.about.title : t.how.title}
            >
              {open === "about" ? <AboutContent /> : <HowContent />}
            </Card>
          </div>

          {/* Phones: a bottom sheet over a dimmed page, like the list sheet on the map. */}
          <div className="sm:hidden">
            <div aria-hidden data-overlay className="fixed inset-0 z-40 animate-fade-in bg-black/40" onClick={() => setOpen(null)} />
            <div
              role="dialog"
              aria-modal="true"
              aria-label={open === "about" ? t.about.title : t.how.title}
              className="fixed inset-x-0 bottom-0 z-50 flex max-h-[85svh] animate-sheet-in flex-col rounded-t-[28px] bg-white text-ink-soft shadow-panel"
            >
              <span aria-hidden className="mx-auto mt-2.5 h-1 w-10 shrink-0 rounded-full bg-black/15" />
              <div className="flex shrink-0 items-center justify-between gap-4 px-6 pb-3 pt-4">
                <h2 className="text-2xl font-bold leading-tight">{open === "about" ? t.about.title : t.how.title}</h2>
                <button
                  type="button"
                  aria-label={t.nav.close}
                  onClick={() => setOpen(null)}
                  className="-mr-2 shrink-0 rounded-full p-1.5 active:bg-black/5"
                >
                  <img src={closeIcon} width={25} height={25} alt="" />
                </button>
              </div>
              <div className="overflow-y-auto overscroll-contain px-6 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
                {open === "about" ? <AboutContent /> : <HowContent />}
              </div>
            </div>
          </div>
        </>
      )}
    </header>
  );
}
