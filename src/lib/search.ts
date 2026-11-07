/**
 * Search that works in any language and any script.
 *
 * Every name is reduced to a "search key": lowercase Latin letters with the spelling
 * differences between Kazakh Cyrillic, Russian Cyrillic, Kazakh Latin and English removed.
 * So "Балқаш", "Балхаш", "Balqash", "Balkhash" and "balhash" all give the key "balhas".
 */

// Cyrillic (Kazakh and Russian) to Latin. Kazakh letters map to their nearest Russian sound.
const CYRILLIC: Record<string, string> = {
  а: "a", ә: "a", б: "b", в: "v", г: "g", ғ: "g", д: "d", е: "e", ё: "e", ж: "j", з: "z",
  и: "i", й: "i", і: "i", к: "k", қ: "k", л: "l", м: "m", н: "n", ң: "n", о: "o", ө: "o",
  п: "p", р: "r", с: "s", т: "t", у: "u", ұ: "u", ү: "u", ф: "f", х: "h", һ: "h", ц: "ts",
  ч: "ch", ш: "sh", щ: "sh", ъ: "", ы: "i", ь: "", э: "e", ю: "iu", я: "ia",
};

// Latin letters with marks that need more than "remove the mark" (Kazakh Latin, Turkish-style).
const LATIN: Record<string, string> = { ş: "sh", ç: "ch", ı: "i", ğ: "g", ñ: "n", "ʼ": "", "'": "", "’": "" };

/** Reduce text to a search key. Spaces and punctuation are removed. */
export function searchKey(text: string): string {
  let s = text.toLowerCase();
  s = s.replace(/[Ѐ-ӿ]/g, (c) => CYRILLIC[c] ?? c);
  s = s.replace(/[şçığñʼ'’]/g, (c) => LATIN[c]);
  s = s.normalize("NFD").replace(/\p{M}/gu, ""); // á → a, ú → u, ó → o
  s = s
    .replace(/kh/g, "h") // Balkhash → Balhash
    .replace(/q/g, "k") // Balqash → Balkash
    .replace(/zh|dzh|dj/g, "j") // Zhetysu / Jetisu
    .replace(/sh/g, "s") // Balkash / Balkas
    .replace(/ch/g, "c")
    .replace(/[yw]/g, (c) => (c === "y" ? "i" : "v")) // Burabay / Burabai
    .replace(/[^a-z0-9]/g, "")
    .replace(/(.)\1+/g, "$1"); // Taldykkol → Taldykol
  return s;
}

// Text typed with the wrong keyboard layout: English QWERTY <-> Russian ЙЦУКЕН.
const EN = "`qwertyuiop[]asdfghjkl;'zxcvbnm,.";
const RU = "ёйцукенгшщзхъфывапролджэячсмитьбю";

/** The same keys pressed on the other layout: "fhfk" → "арал", "ифдлрфыр" → "balkhash". */
export function switchLayout(text: string): string {
  return [...text.toLowerCase()]
    .map((c) => {
      const en = EN.indexOf(c);
      if (en >= 0) return RU[en];
      const ru = RU.indexOf(c);
      return ru >= 0 ? EN[ru] : c;
    })
    .join("");
}

/** Edit distance, limited: stops early and returns max + 1 when the distance is above max. */
function distance(a: string, b: string, max: number): number {
  if (Math.abs(a.length - b.length) > max) return max + 1;
  let prev = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    const cur = [i];
    let rowMin = i;
    for (let j = 1; j <= b.length; j++) {
      cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
      rowMin = Math.min(rowMin, cur[j]);
    }
    if (rowMin > max) return max + 1;
    prev = cur;
  }
  return prev[b.length];
}

export type SearchEntry = {
  id: string;
  /** Names of the place in every language, plus other spellings. */
  names: string[];
  /** Regions in every language. */
  regions: string[];
};

type Indexed = { id: string; names: string[]; regions: string[] };

export function buildIndex(entries: SearchEntry[]): Indexed[] {
  return entries.map((e) => ({
    id: e.id,
    names: [...new Set(e.names.map(searchKey))],
    regions: [...new Set(e.regions.map(searchKey))],
  }));
}

/** Score one query key against one place. Lower is better. Infinity means no match. */
function score(q: string, place: Indexed): number {
  let best = Infinity;
  for (const n of place.names) {
    if (n.startsWith(q)) best = Math.min(best, 0);
    else if (n.includes(q)) best = Math.min(best, 1);
  }
  if (best < Infinity) return best;
  if (place.regions.some((r) => r.includes(q))) return 2;
  // Typos: compare with the start of each name. Allow 1 error from 4 letters, 2 from 7.
  const max = q.length >= 7 ? 2 : q.length >= 4 ? 1 : 0;
  if (max === 0) return Infinity;
  for (const n of place.names) {
    const d = distance(q, n.slice(0, q.length), max);
    if (d <= max) best = Math.min(best, 3 + d);
  }
  return best;
}

/** The ids of matching places, best match first. Ties keep the original order. */
export function search(index: Indexed[], query: string): string[] {
  const run = (text: string) => {
    const q = searchKey(text);
    if (!q) return index.map((p) => p.id);
    return index
      .map((p, i) => ({ id: p.id, s: score(q, p), i }))
      .filter((r) => r.s < Infinity)
      .sort((a, b) => a.s - b.s || a.i - b.i)
      .map((r) => r.id);
  };
  const direct = run(query);
  // Nothing found: the user may have typed on the wrong keyboard layout.
  return direct.length > 0 ? direct : run(switchLayout(query));
}
