import { Transliterate } from "./_loadTransliterate.js";
type Mode = "index" | "query";
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
export declare function generateTextSearchTrigrams(input: string, mode: Mode, transliterate: Transliterate): string[];
export declare function generateTextSearchTrigrams(input: string, mode: Mode): Promise<string[]>;
export {};
