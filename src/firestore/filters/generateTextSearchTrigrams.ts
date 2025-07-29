import {splitTextSearchWords} from "./splitTextSearchWords.js";

type Transliterate = (input: string) => string;
type Mode = "index" | "query";

export function generateTextSearchTrigrams(input: string, mode: Mode, transliterate: Transliterate): string[];

export function generateTextSearchTrigrams(input: string, mode: Mode): Promise<string[]>;

export function generateTextSearchTrigrams(input: string, mode: Mode, transliterate?: Transliterate): string[] | Promise<string[]> {    

    if (transliterate) {
        return generate(input, transliterate, mode);
    } else {
        return new Promise(async (resolve, reject) => {
            try {
                const {transliterate} = await import("transliteration");
                resolve(generate(input, transliterate, mode));
            } catch (e) {
                reject(e);
            }
        })
    }
}

function generate(input: string, transliterate: Transliterate, mode: Mode) {

    const three = 3;
    const words = splitTextSearchWords(input, transliterate);
    
    const result: string[] = [];

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

        } else {
            for (let i = 0; i <= word.length - three; i++) {
                result.push(word.slice(i, i + three));
            }
        }
    }

    return result.filter((v, i, a) => a.indexOf(v) === i).sort();
}
