import { splitTextSearchWords } from "./splitTextSearchWords.js";
export function generateTextSearchTrigrams(input, mode, transliterate) {
    if (transliterate) {
        return generate(input, transliterate, mode);
    }
    else {
        return new Promise(async (resolve, reject) => {
            try {
                const { transliterate } = await import("transliteration");
                resolve(generate(input, transliterate, mode));
            }
            catch (e) {
                reject(e);
            }
        });
    }
}
function generate(input, transliterate, mode) {
    const three = 3;
    const words = splitTextSearchWords(input, transliterate);
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
//# sourceMappingURL=generateTextSearchTrigrams.js.map