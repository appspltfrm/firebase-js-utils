import {loadTransliterate, Transliterate} from "./_loadTransliterate.js";

/** Alphanumeric runs of at least two characters inside a token, e.g. "kowalski-nowak" -> "kowalski", "nowak". */
const SUB_WORD = /[a-z0-9]{2,}/g;

/**
 * Splits text into whitespace-delimited tokens after transliteration (diacritics removed) and lowercasing.
 * A token is kept only when it carries at least two alphanumeric characters (`a-z0-9`), so single letters and
 * pure punctuation are dropped. Leading and trailing non-alphanumerics are stripped (`"kapital-x"` ->
 * "kapital-x", "ul." -> "ul", "+48" -> "48", "kowalski," -> "kowalski"), so a query typed or pasted with quotes
 * or a trailing comma still matches. Inner punctuation is kept ("kowalski-nowak", "o.o", "12/4") — trigrams
 * built from it cover substrings that span separators.
 *
 * Result is deduplicated and sorted. Tokenization is a plain whitespace split with a single character scan (no
 * backtracking regex), so it stays linear on long inputs such as data-sheet cells.
 */
export function splitTextSearchTokens(input: string, transliterate: Transliterate): string[] {
  return [...collectTokens(input, transliterate)].sort();
}

/**
 * Words used by the `*Searchable` fields and by `includeWord` queries: every token from
 * {@link splitTextSearchTokens} plus its alphanumeric sub-words (`[a-z0-9]{2,}`), so "kowalski-nowak" yields
 * "kowalski-nowak", "kowalski" and "nowak". `_` counts as a separator like `-` or `.`.
 *
 * Result is deduplicated and sorted. The async overload lazily loads the optional `transliteration` package.
 */
export function splitTextSearchWords(input: string, transliterate: Transliterate): string[];

export function splitTextSearchWords(input: string): Promise<string[]>;

export function splitTextSearchWords(input: string, transliterate?: Transliterate): Promise<string[]> | string[] {
  if (transliterate) {
    return split(input, transliterate);
  }
  return loadTransliterate().then(fn => split(input, fn));
}

function split(input: string, transliterate: Transliterate): string[] {

  const words = collectTokens(input, transliterate);

  for (const token of [...words]) {
    for (const subWord of token.match(SUB_WORD) ?? []) {
      words.add(subWord);
    }
  }

  return [...words].sort();
}

function collectTokens(input: string, transliterate: Transliterate): Set<string> {

  const tokens = new Set<string>();

  for (const token of transliterate(input).toLowerCase().split(/\s+/)) {
    const trimmed = trimToken(token);
    if (trimmed !== undefined) {
      tokens.add(trimmed);
    }
  }

  return tokens;
}

/**
 * Strips leading and trailing non-alphanumerics; returns `undefined` when the token carries fewer than two
 * alphanumeric characters (`a-z0-9`).
 */
function trimToken(token: string): string | undefined {

  let count = 0;
  let first = -1;
  let last = -1;

  for (let i = 0; i < token.length; i++) {
    const code = token.charCodeAt(i);
    const isDigit = code >= 48 && code <= 57;
    const isLower = code >= 97 && code <= 122;

    if (isDigit || isLower) {
      count++;
      if (first < 0) {
        first = i;
      }
      last = i;
    }
  }

  if (count < 2) {
    return undefined;
  }

  return first === 0 && last === token.length - 1 ? token : token.slice(first, last + 1);
}
