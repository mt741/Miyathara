import { useI18n } from "../i18n";

export function Logo() {
  const { t } = useI18n();
  return (
    <a href="./" onClick={(e) => e.preventDefault()} className="flex shrink-0 flex-col items-center text-white" aria-label="Miyathara">
      <svg width="34" height="6" viewBox="0 0 34 6" fill="none" stroke="currentColor" strokeWidth="1" aria-hidden>
        <path d="M1 5c4-5 8-5 12-1s8 4 12-1 6-2 8 0" />
      </svg>
      <span className="-mt-0.5 font-logo text-xl tracking-[0.04em] md:text-2xl">MIYATHARA</span>
      <span className="hidden text-[10px] leading-tight text-white/85 sm:block md:text-xs">{t.tagline}</span>
    </a>
  );
}
