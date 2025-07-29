type Transliterate = (input: string) => string;

export function splitTextSearchWords(input: string, transliterate: Transliterate): string[];

export function splitTextSearchWords(input: string): Promise<string[]>;

export function splitTextSearchWords(input: string, transliterate?: Transliterate): Promise<string[]> | string[] {
    if (transliterate) {
        return split(input, transliterate);
    } else {
        return new Promise(async (resolve, reject) => {
            try {
                const {transliterate} = await import("transliteration");
                resolve(split(input, transliterate));
            } catch (e) {
                reject(e);
            }
        })
    }
}

function split(input: string, transliterate: Transliterate) {
    return (transliterate(input).toLowerCase().match(/(\S*[A-Za-z0-9]\S*){2,}/g) ?? [])
        .map(word => [word, ...(word.match(/\w{2,}/g) ?? [])]).flat().sort().filter((v, i, a) => a.indexOf(v) === i)
}