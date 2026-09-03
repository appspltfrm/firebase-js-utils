import {loadTransliterate, Transliterate} from "./_loadTransliterate.js";
import {splitTextSearchTokens, splitTextSearchWords} from "./splitTextSearchWords.js";

type Mode = "index" | "query";

const TRIGRAM = 3;

/**
 * Trigrams for Firestore text search on the `*Searchable` array fields.
 *
 * - `index` mode (document write): every sliding 3-character window of every token from
 *   {@link splitTextSearchTokens}. Sub-words are substrings of their token, so their windows are already covered
 *   and are not generated again.
 * - `query` mode (filter build): the minimal cover of each word from {@link splitTextSearchWords} — chunks at
 *   offsets 0, 3, 6, … plus the trailing window when the length is not a multiple of 3. Words of 3 characters or
 *   fewer are emitted as-is (they match a stored word, not a trigram). Every emitted value is guaranteed to be in
 *   the `index` set of any text that contains the query, so the values can be combined with `array-contains` /
 *   `arrayContainsAll`. Fewer values means fewer count probes on the classic query path.
 *
 * Result is deduplicated and sorted. The async overload lazily loads the optional `transliteration` package.
 */
export function generateTextSearchTrigrams(input: string, mode: Mode, transliterate: Transliterate): string[];

export function generateTextSearchTrigrams(input: string, mode: Mode): Promise<string[]>;

export function generateTextSearchTrigrams(input: string, mode: Mode, transliterate?: Transliterate): string[] | Promise<string[]> {
  if (transliterate) {
    return generate(input, transliterate, mode);
  }
  return loadTransliterate().then(fn => generate(input, fn, mode));
}

function generate(input: string, transliterate: Transliterate, mode: Mode): string[] {

  const result = new Set<string>();

  if (mode === "index") {
    for (const token of splitTextSearchTokens(input, transliterate)) {
      addIndexTrigrams(token, result);
    }
  } else {
    for (const word of splitTextSearchWords(input, transliterate)) {
      addQueryTrigrams(word, result);
    }
  }

  return [...result].sort();
}

function addIndexTrigrams(token: string, result: Set<string>) {
  for (let i = 0; i + TRIGRAM <= token.length; i++) {
    result.add(token.slice(i, i + TRIGRAM));
  }
}

function addQueryTrigrams(word: string, result: Set<string>) {

  const length = word.length;

  if (length <= TRIGRAM) {
    result.add(word);
    return;
  }

  let i = 0;
  for (; i + TRIGRAM <= length; i += TRIGRAM) {
    result.add(word.slice(i, i + TRIGRAM));
  }

  if (i < length) {
    result.add(word.slice(-TRIGRAM));
  }
}
