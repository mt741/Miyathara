import wave from "../assets/logo-wave.svg";
import { useI18n } from "../i18n";

export function Logo() {
  const { t } = useI18n();
  return (
    <a
      href="./"
      onClick={(e) => e.preventDefault()}
      className="flex shrink-0 flex-col items-center gap-[3px] text-white md:w-[214px]"
      aria-label="Miyathara"
    >
      <img src={wave} width={36.5} height={7} alt="" className="block" />
      <span className="font-logo text-xl font-bold uppercase leading-none md:text-[25px]">Miyathara</span>
      <span className="hidden text-[11px] leading-tight sm:block md:text-[13px]">{t.tagline}</span>
    </a>
  );
}
