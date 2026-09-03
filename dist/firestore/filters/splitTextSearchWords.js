import { loadTransliterate } from "./_loadTransliterate.js";
/** Alphanumeric runs of at least two characters inside a token, e.g. "kowalski-nowak" -> "kowalski", "nowak". */
const SUB_WORD = /[a-z0-9]{2,}/g;
/**
 * Splits text into whitespace-delimited tokens after transliteration (diacritics removed) and lowercasing.
 * A token is kept only when it carries at least two alphanumeric characters (`a-z0-9`), so single letters and
 * pure punctuation are dropped. Tokens keep their inner punctuation ("kowalski-nowak", "ul.", "a.b") — trigrams
 * built from them cover substrings that span separators.
 *
 * Result is deduplicated and sorted. Tokenization is a plain whitespace split with a character counter (no
 * backtracking regex), so it stays linear on long inputs such as data-sheet cells.
 */
export function splitTextSearchTokens(input, transliterate) {
    return [...collectTokens(input, transliterate)].sort();
}
export function splitTextSearchWords(input, transliterate) {
    if (transliterate) {
        return split(input, transliterate);
    }
    return loadTransliterate().then(fn => split(input, fn));
}
function split(input, transliterate) {
    const words = collectTokens(input, transliterate);
    for (const token of [...words]) {
        for (const subWord of token.match(SUB_WORD) ?? []) {
            words.add(subWord);
        }
    }
    return [...words].sort();
}
function collectTokens(input, transliterate) {
    const tokens = new Set();
    for (const token of transliterate(input).toLowerCase().split(/\s+/)) {
        if (hasTwoAlphanumerics(token)) {
            tokens.add(token);
        }
    }
    return tokens;
}
function hasTwoAlphanumerics(token) {
    let count = 0;
    for (let i = 0; i < token.length; i++) {
        const code = token.charCodeAt(i);
        const isDigit = code >= 48 && code <= 57;
        const isLower = code >= 97 && code <= 122;
        if ((isDigit || isLower) && ++count === 2) {
            return true;
        }
    }
    return false;
}
//# sourceMappingURL=splitTextSearchWords.js.map