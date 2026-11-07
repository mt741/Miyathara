import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { LOCALES, useI18n, type Locale } from "../i18n";
import { Button } from "./Button";
import { Card } from "./Card";
import { Logo } from "./Logo";
import chevron from "../assets/chevron.svg";

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
            className="-m-2 p-2 sm:hidden"
            aria-label={t.nav.menu}
            aria-expanded={open === "menu"}
            onClick={() => toggle("menu")}
          >
            <svg width="22" height="14" viewBox="0 0 22 14" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden>
              <path d="M1 1h20M1 7h20M1 13h20" />
            </svg>
          </Button>
        </div>
      </nav>

      {open === "menu" && (
        <div className="absolute left-4 right-4 top-[5rem] sm:hidden">
          <Card caretRight={11} className="!p-2">
            {(["about", "how"] as const).map((p) => (
              <button key={p} onClick={() => setOpen(p)} className="block w-full rounded-lg px-3 py-3 text-left text-base text-ink-soft hover:bg-sand">
                {t.nav[p]}
              </button>
            ))}
          </Card>
        </div>
      )}

      {(open === "about" || open === "how") && (
        <div
          className="absolute left-4 right-4 top-[5rem] max-h-[calc(100svh-6rem)] overflow-y-auto rounded-card sm:left-auto sm:max-h-none sm:w-[444px] sm:overflow-visible"
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
      )}
    </header>
  );
}
