type Transliterate = (input: string) => string;
type Mode = "index" | "query";
export declare function generateTextSearchTrigrams(input: string, mode: Mode, transliterate: Transliterate): string[];
export declare function generateTextSearchTrigrams(input: string, mode: Mode): Promise<string[]>;
export {};
