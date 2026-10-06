import assert from "node:assert/strict";
import { transliterate } from "transliteration";
import { generateTextSearchTrigrams } from "./generateTextSearchTrigrams.js";
import { splitTextSearchTokens, splitTextSearchWords } from "./splitTextSearchWords.js";
function legacySplit(input, transliterate) {
    return (transliterate(input).toLowerCase().match(/(\S*[A-Za-z0-9]\S*){2,}/g) ?? [])
        .map(word => [word, ...(word.match(/\w{2,}/g) ?? [])]).flat().sort().filter((v, i, a) => a.indexOf(v) === i);
}
function legacyGenerate(input, transliterate, mode) {
    const three = 3;
    const words = legacySplit(input, transliterate);
    const result = [];
    for (const word of words) {
        if (mode === "query") {
            const length = word.length;
            if (length <= three) {
                result.push(word);
            }
            let i = 0;
            while (i + three <= word.length) {
                result.push(word.substr(i, three));
                i += three;
            }
            if (i < word.length) {
                result.push(word.substr(-three, three));
            }
        }
        else {
            for (let i = 0; i <= word.length - three; i++) {
                result.push(word.slice(i, i + three));
            }
        }
    }
    return result.filter((v, i, a) => a.indexOf(v) === i).sort();
}
//#endregion
//#region Corpus
const corpus = [
    "",
    "   ",
    "a",
    "a b c",
    "ab",
    "12",
    "Jan Kowalski",
    "Kowalski-Nowak Anna",
    "Łódź",
    "Gdańsk Zażółć gęślą jaźń",
    "ToRoN",
    "a.b c.d e-f",
    "jan.kowalski@example.com",
    "  leading and trailing  ",
    "tab\tseparated\nlines",
    "ąę ĄĘ ćń",
    "Müller Straße",
    "Ελληνικά Кириллица 日本語",
    "😀 emoji 🚀 test",
    "x".repeat(50),
    "-".repeat(300) + "a",
    "a" + "-".repeat(300),
    Array.from({ length: 200 }, (_, i) => `w${i.toString(36)}`).join(" "),
    "O'Brien d'Artagnan",
    "abc-defg hij"
];
/** Inputs where the documented `_` difference applies (underscore is now a separator like `-`). */
const underscoreCorpus = [
    "ab_cd",
    "jan_kowalski",
    "x_ab",
    "value_1"
];
/** Inputs with punctuation at token edges: tokens are trimmed, so the output differs from legacy by design. */
const edgePunctuationCorpus = [
    "ul. Świętokrzyska 12/4, 00-001 Warszawa",
    "+48 601 234 567",
    "KBS \"KAPITAŁ-BEZPIECZEŃSTWO-SERWIS\" SPÓŁKA Z O.O. - BIURO GDAŃSK",
    "„Kapitał” “x” (a) [b] Kowalski, ul. +48 #tag @handle",
    "Sp. z o.o.",
    "a.b.c.",
    "((12)) ..ab.. -cd-",
    "__init__"
];
/** Queries a user may type or paste for the texts above, with and without the punctuation. */
const edgePunctuationNeedles = [
    "\"KAPITAŁ\"",
    "„Kapitał”",
    "KAPITAŁ",
    "Kowalski,",
    "Kowalski",
    "o.o.",
    "o.o",
    "kapital-bezpieczenstwo-serwis",
    "\"KAPITAŁ-BEZPIECZEŃSTWO-SERWIS\"",
    "12/4,",
    "+48",
    "a.b.c",
    "(12)"
];
//#endregion
//#region Helpers
const tests = [];
function test(name, fn) {
    tests.push([name, fn]);
}
function isSubset(subset, superset) {
    const set = new Set(superset);
    return subset.every(v => set.has(v));
}
/** What a document written with the given implementation stores in its `*Searchable` array. */
function indexOf(haystack, impl) {
    return impl === "legacy"
        ? new Set([...legacySplit(haystack, transliterate), ...legacyGenerate(haystack, transliterate, "index")])
        : new Set([...splitTextSearchWords(haystack, transliterate), ...generateTextSearchTrigrams(haystack, "index", transliterate)]);
}
/** Whether `needle` occurs in `haystack` after normalization, ignoring punctuation at the needle's edges. */
function contains(haystack, needle) {
    const normalizedNeedle = transliterate(needle).toLowerCase().replace(/^[^a-z0-9]+|[^a-z0-9]+$/g, "");
    return normalizedNeedle.length > 0 && transliterate(haystack).toLowerCase().includes(normalizedNeedle);
}
function measure(fn, runs) {
    const start = process.hrtime.bigint();
    for (let i = 0; i < runs; i++) {
        fn();
    }
    return Number(process.hrtime.bigint() - start) / 1e6 / runs;
}
//#endregion
//#region Equivalence
test("words: identical to legacy on the corpus", () => {
    for (const input of corpus) {
        assert.deepEqual(splitTextSearchWords(input, transliterate), legacySplit(input, transliterate), JSON.stringify(input));
    }
});
test("index trigrams: identical to legacy on the corpus", () => {
    for (const input of corpus) {
        assert.deepEqual(generateTextSearchTrigrams(input, "index", transliterate), legacyGenerate(input, transliterate, "index"), JSON.stringify(input));
    }
});
test("query trigrams: identical to legacy on the corpus", () => {
    for (const input of corpus) {
        assert.deepEqual(generateTextSearchTrigrams(input, "query", transliterate), legacyGenerate(input, transliterate, "query"), JSON.stringify(input));
    }
});
test("tokens: whitespace-delimited with >= 2 alphanumerics, inner punctuation kept, edges trimmed", () => {
    assert.deepEqual(splitTextSearchTokens("Kowalski-Nowak a ul. 12 -", transliterate), ["12", "kowalski-nowak", "ul"]);
    assert.deepEqual(splitTextSearchTokens("", transliterate), []);
});
test("index trigrams from tokens only equal trigrams from all words (sub-words are substrings)", () => {
    for (const input of [...corpus, ...underscoreCorpus, ...edgePunctuationCorpus]) {
        const fromTokens = generateTextSearchTrigrams(input, "index", transliterate);
        const fromWords = new Set();
        for (const word of splitTextSearchWords(input, transliterate)) {
            for (let i = 0; i + 3 <= word.length; i++) {
                fromWords.add(word.slice(i, i + 3));
            }
        }
        assert.deepEqual(fromTokens, [...fromWords].sort(), JSON.stringify(input));
    }
});
test("underscore: index output identical, words/query output a superset of legacy", () => {
    for (const input of underscoreCorpus) {
        assert.deepEqual(generateTextSearchTrigrams(input, "index", transliterate), legacyGenerate(input, transliterate, "index"), JSON.stringify(input));
        assert.ok(isSubset(legacySplit(input, transliterate), splitTextSearchWords(input, transliterate)), `words ${JSON.stringify(input)}`);
        assert.ok(isSubset(legacyGenerate(input, transliterate, "query"), generateTextSearchTrigrams(input, "query", transliterate)), `query ${JSON.stringify(input)}`);
    }
    assert.deepEqual(splitTextSearchWords("jan_kowalski", transliterate), ["jan", "jan_kowalski", "kowalski"]);
});
test("query cover: every query trigram of a needle is in the index set of any text containing it", () => {
    const haystacks = ["Jan Kowalski-Nowak", "ul. Świętokrzyska 12/4", "jan.kowalski@example.com"];
    const needles = ["kowal", "ski-now", "12/4", "example.com", "swieto", "Kowalski-Nowak"];
    for (const haystack of haystacks) {
        const index = new Set([...splitTextSearchWords(haystack, transliterate), ...generateTextSearchTrigrams(haystack, "index", transliterate)]);
        for (const needle of needles) {
            if (!transliterate(haystack).toLowerCase().includes(transliterate(needle).toLowerCase())) {
                continue;
            }
            for (const value of generateTextSearchTrigrams(needle, "query", transliterate)) {
                assert.ok(index.has(value), `${JSON.stringify(needle)} in ${JSON.stringify(haystack)}: missing ${value}`);
            }
        }
    }
});
test("edge punctuation: tokens are trimmed, no stored value starts or ends on punctuation", () => {
    const kbs = edgePunctuationCorpus[2];
    assert.deepEqual(splitTextSearchTokens(kbs, transliterate), ["biuro", "gdansk", "kapital-bezpieczenstwo-serwis", "kbs", "o.o", "spolka"]);
    assert.deepEqual(splitTextSearchTokens("„Kapitał” “x” (a) [b] Kowalski, ul. +48 #tag @handle", transliterate), ["48", "handle", "kapital", "kowalski", "tag", "ul"]);
    assert.deepEqual(splitTextSearchTokens("((12)) ..ab.. -cd-", transliterate), ["12", "ab", "cd"]);
    assert.deepEqual(splitTextSearchTokens("__init__", transliterate), ["init"]);
    // Inner punctuation still produces trigrams such as "-00" or "o.o"; only characters that appear at token edges
    // in this corpus must never reach the index.
    for (const input of edgePunctuationCorpus) {
        for (const value of indexOf(input, "current")) {
            assert.doesNotMatch(value, /["(),[\]+#@]/, `${JSON.stringify(input)}: ${JSON.stringify(value)}`);
        }
    }
});
test("edge punctuation: punctuated queries match the current index", () => {
    for (const haystack of edgePunctuationCorpus) {
        const index = indexOf(haystack, "current");
        for (const needle of edgePunctuationNeedles) {
            if (!contains(haystack, needle)) {
                continue;
            }
            for (const value of generateTextSearchTrigrams(needle, "query", transliterate)) {
                assert.ok(index.has(value), `${JSON.stringify(needle)} in ${JSON.stringify(haystack)}: missing ${value}`);
            }
        }
    }
});
test("edge punctuation: query values are covered by the legacy index (no reindex needed)", () => {
    // Trimming only removes token edges, so every query chunk is a substring of the legacy token and therefore
    // one of its legacy trigrams; 2-char query words are alphanumeric and therefore legacy sub-words.
    for (const haystack of edgePunctuationCorpus) {
        const index = indexOf(haystack, "legacy");
        for (const needle of edgePunctuationNeedles) {
            if (!contains(haystack, needle)) {
                continue;
            }
            for (const value of generateTextSearchTrigrams(needle, "query", transliterate)) {
                assert.ok(index.has(value), `${JSON.stringify(needle)} in ${JSON.stringify(haystack)}: legacy index misses ${value}`);
            }
        }
    }
});
test("edge punctuation: known limit — an includeWord query for a punctuated token needs a rewritten document", () => {
    // Legacy documents store `"kapital-bezpieczenstwo-serwis"` (with quotes); the trimmed word is neither a stored
    // word nor a trigram there. It never matched without the quotes either, so this is not a regression.
    const legacy = indexOf(edgePunctuationCorpus[2], "legacy");
    const current = indexOf(edgePunctuationCorpus[2], "current");
    const words = splitTextSearchWords("\"KAPITAŁ-BEZPIECZEŃSTWO-SERWIS\"", transliterate);
    assert.deepEqual(words, ["bezpieczenstwo", "kapital", "kapital-bezpieczenstwo-serwis", "serwis"]);
    assert.ok(!legacy.has("kapital-bezpieczenstwo-serwis"));
    assert.ok(isSubset(words, [...current]));
});
test("known limit (unchanged): a query sub-word of <= 2 chars is emitted whole and needs a stored word to match", () => {
    // "ski-no" -> words "ski-no", "ski", "no"; "no" is not a trigram, so `arrayContainsAll` requires the word "no"
    // even though "Kowalski-Nowak" contains the characters. Same as legacy; the classic path treats it as non-fatal.
    const query = generateTextSearchTrigrams("ski-no", "query", transliterate);
    assert.ok(query.includes("no"));
    assert.deepEqual(query, legacyGenerate("ski-no", transliterate, "query"));
});
test("async overloads resolve with the same output", async () => {
    assert.deepEqual(await splitTextSearchWords("Łódź Kowalski"), splitTextSearchWords("Łódź Kowalski", transliterate));
    assert.deepEqual(await generateTextSearchTrigrams("Łódź Kowalski", "index"), generateTextSearchTrigrams("Łódź Kowalski", "index", transliterate));
});
//#endregion
//#region Performance
test("index mode on a long cell is at least 10x faster than legacy", () => {
    const cell = Array.from({ length: 3000 }, (_, i) => `slowo${(i * 7919).toString(36)}`).join(" ");
    const legacyMs = measure(() => legacyGenerate(cell, transliterate, "index"), 3);
    const currentMs = measure(() => generateTextSearchTrigrams(cell, "index", transliterate), 3);
    console.log(`    3000-word cell: legacy ${legacyMs.toFixed(1)} ms, current ${currentMs.toFixed(1)} ms`);
    assert.ok(currentMs * 10 < legacyMs, `expected >= 10x speedup, got ${(legacyMs / currentMs).toFixed(1)}x`);
});
//#endregion
//#region Runner
(async () => {
    let failed = 0;
    for (const [name, fn] of tests) {
        try {
            await fn();
            console.log(`  ✓ ${name}`);
        }
        catch (error) {
            failed++;
            console.error(`  ✗ ${name}\n    ${error.message}`);
        }
    }
    console.log(`\n${tests.length - failed}/${tests.length} passed`);
    if (failed > 0) {
        process.exit(1);
    }
})();
//#endregion
//# sourceMappingURL=textSearch.test.js.map