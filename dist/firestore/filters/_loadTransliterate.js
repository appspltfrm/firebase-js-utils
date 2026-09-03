/**
 * Lazily loads the optional `transliteration` dependency for the async overloads of the text search helpers.
 * Callers that already have a `transliterate` function should pass it explicitly and use the sync overloads.
 */
export function loadTransliterate() {
    return import("transliteration").then(module => module.transliterate);
}
//# sourceMappingURL=_loadTransliterate.js.map