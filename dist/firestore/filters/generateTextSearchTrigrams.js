import { loadTransliterate } from "./_loadTransliterate.js";
import { splitTextSearchTokens, splitTextSearchWords } from "./splitTextSearchWords.js";
const TRIGRAM = 3;
export function generateTextSearchTrigrams(input, mode, transliterate) {
    if (transliterate) {
        return generate(input, transliterate, mode);
    }
    return loadTransliterate().then(fn => generate(input, fn, mode));
}
function generate(input, transliterate, mode) {
    const result = new Set();
    if (mode === "index") {
        for (const token of splitTextSearchTokens(input, transliterate)) {
            addIndexTrigrams(token, result);
        }
    }
    else {
        for (const word of splitTextSearchWords(input, transliterate)) {
            addQueryTrigrams(word, result);
        }
    }
    return [...result].sort();
}
function addIndexTrigrams(token, result) {
    for (let i = 0; i + TRIGRAM <= token.length; i++) {
        result.add(token.slice(i, i + TRIGRAM));
    }
}
function addQueryTrigrams(word, result) {
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
//# sourceMappingURL=generateTextSearchTrigrams.js.map