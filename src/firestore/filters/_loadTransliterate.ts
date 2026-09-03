export type Transliterate = (input: string) => string;

/**
 * Lazily loads the optional `transliteration` dependency for the async overloads of the text search helpers.
 * Callers that already have a `transliterate` function should pass it explicitly and use the sync overloads.
 */
export function loadTransliterate(): Promise<Transliterate> {
  return import("transliteration").then(module => module.transliterate);
}
