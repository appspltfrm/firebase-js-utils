import { Transliterate } from "./_loadTransliterate.js";
/**
 * Splits text into whitespace-delimited tokens after transliteration (diacritics removed) and lowercasing.
 * A token is kept only when it carries at least two alphanumeric characters (`a-z0-9`), so single letters and
 * pure punctuation are dropped. Tokens keep their inner punctuation ("kowalski-nowak", "ul.", "a.b") — trigrams
 * built from them cover substrings that span separators.
 *
 * Result is deduplicated and sorted. Tokenization is a plain whitespace split with a character counter (no
 * backtracking regex), so it stays linear on long inputs such as data-sheet cells.
 */
export declare function splitTextSearchTokens(input: string, transliterate: Transliterate): string[];
/**
 * Words used by the `*Searchable` fields and by `includeWord` queries: every token from
 * {@link splitTextSearchTokens} plus its alphanumeric sub-words (`[a-z0-9]{2,}`), so "kowalski-nowak" yields
 * "kowalski-nowak", "kowalski" and "nowak". `_` counts as a separator like `-` or `.`.
 *
 * Result is deduplicated and sorted. The async overload lazily loads the optional `transliteration` package.
 */
export declare function splitTextSearchWords(input: string, transliterate: Transliterate): string[];
export declare function splitTextSearchWords(input: string): Promise<string[]>;
