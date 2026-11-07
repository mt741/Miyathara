import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { LOCALES, useI18n, type Locale } from "../i18n";
import { Button } from "./Button";
import { Card } from "./Card";
import { Logo } from "./Logo";

type Panel = "about" | "how" | "lang" | "menu" | null;

function AboutContent() {
  const { t } = useI18n();
  return (
    <div className="space-y-4 text-[15px] leading-snug text-ink-soft md:text-base">
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
    <div className="space-y-4 text-[15px] leading-snug text-ink-soft md:text-base">
      <p className="font-semibold text-ink">{t.how.lead}</p>
      {t.how.steps.map(([term, text]) => (
        <p key={term}>
          <span className="font-semibold text-link">{term}</span> – {text}
        </p>
      ))}
    </div>
  );
}

const Chevron = () => (
  <svg width="8" height="5" viewBox="0 0 8 5" fill="none" stroke="currentColor" aria-hidden>
    <path d="M1 1l3 3 3-3" />
  </svg>
);

export function Navbar() {
  const { t, locale, setLocale } = useI18n();
  const [open, setOpen] = useState<Panel>(null);
  const ref = useRef<HTMLElement>(null);
  const aboutRef = useRef<HTMLButtonElement>(null);
  const howRef = useRef<HTMLButtonElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const [caret, setCaret] = useState<number | undefined>();

  // Point the card caret at the link that opened it. Label widths change with the language.
  useLayoutEffect(() => {
    const btn = open === "about" ? aboutRef.current : open === "how" ? howRef.current : null;
    const card = cardRef.current;
    if (!btn || !card || btn.offsetParent === null) return setCaret(undefined);
    const b = btn.getBoundingClientRect();
    setCaret(card.getBoundingClientRect().right - (b.left + b.width / 2) - 8);
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
  const active = (p: Panel) => (open === p ? "underline underline-offset-4" : "");
  const pick = (l: Locale) => {
    setLocale(l);
    setOpen(null);
  };

  return (
    <header ref={ref} className="absolute inset-x-0 top-0 z-30 px-4 pt-5 md:px-10 md:pt-7">
      <nav className="flex items-start justify-between gap-4">
        <Logo />
        <div className="flex items-center gap-4 pt-2 md:gap-7">
          <div className="relative">
            <Button
              variant="nav"
              className="flex items-center gap-1 font-semibold"
              aria-label={t.nav.language}
              aria-haspopup="menu"
              aria-expanded={open === "lang"}
              onClick={() => toggle("lang")}
            >
              {t.langName}
              <Chevron />
            </Button>
            {open === "lang" && (
              <ul role="menu" className="absolute right-0 top-full mt-3 min-w-[9rem] overflow-hidden rounded-card bg-white py-1 shadow-card md:left-1/2 md:right-auto md:-translate-x-1/2">
                {(Object.keys(LOCALES) as Locale[]).map((l) => (
                  <li key={l} role="none">
                    <button
                      role="menuitemradio"
                      aria-checked={l === locale}
                      lang={l}
                      onClick={() => pick(l)}
                      className={`flex w-full items-center justify-between gap-3 px-4 py-2.5 text-left text-sm hover:bg-sand ${
                        l === locale ? "font-semibold text-water" : "text-ink"
                      }`}
                    >
                      {{ kk: "Қазақша", ru: "Русский", en: "English" }[l]}
                      <span className="text-xs text-ink-muted">{LOCALES[l].langName}</span>
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
        <div className="absolute left-4 right-4 top-[4.25rem] sm:hidden">
          <Card caretRight={14} className="!p-2">
            {(["about", "how"] as const).map((p) => (
              <button key={p} onClick={() => setOpen(p)} className="block w-full rounded-lg px-3 py-3 text-left text-base hover:bg-sand">
                {t.nav[p]}
              </button>
            ))}
          </Card>
        </div>
      )}

      {(open === "about" || open === "how") && (
        <div
          ref={cardRef}
          className="absolute left-4 right-4 top-[4.25rem] max-h-[calc(100svh-5.5rem)] overflow-y-auto rounded-card sm:left-auto sm:max-h-none sm:overflow-visible sm:w-[440px] md:right-8 md:top-[5.5rem]">
          <Card
            title={open === "about" ? t.about.title : t.how.title}
            onClose={() => setOpen(null)}
            closeLabel={t.nav.close}
            caretRight={caret}
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
