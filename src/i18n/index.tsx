import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { en, type Messages } from "./en";
import { kk } from "./kk";
import { ru } from "./ru";

export const LOCALES = { kk, ru, en } as const;
export type Locale = keyof typeof LOCALES;
const STORAGE_KEY = "miyathara.locale";

function initialLocale(): Locale {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && saved in LOCALES) return saved as Locale;
  } catch {
    /* storage can be blocked */
  }
  const nav = (navigator.language || "en").slice(0, 2);
  return nav in LOCALES ? (nav as Locale) : "en";
}

type Ctx = { locale: Locale; t: Messages; setLocale: (l: Locale) => void };
const I18nContext = createContext<Ctx | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>(initialLocale);

  useEffect(() => {
    document.documentElement.lang = locale;
    document.title = LOCALES[locale].meta.title;
    try {
      localStorage.setItem(STORAGE_KEY, locale);
    } catch {
      /* storage can be blocked */
    }
  }, [locale]);

  const value = useMemo(() => ({ locale, t: LOCALES[locale], setLocale }), [locale]);
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used inside I18nProvider");
  return ctx;
}
