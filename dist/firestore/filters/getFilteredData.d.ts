import { Query } from "../Query.js";
import { Filter } from "./specs.js";
type Args<T> = {
    query: Query<T>;
    startAfter?: any[];
    getStartAfter: (data: T) => any[];
    allData?: T[];
    limit: number;
    filters: Filter[];
    transliterate?: (input: string) => string;
};
export declare function getFilteredData<T>({ filters, query: baseQuery, transliterate, limit, startAfter, getStartAfter, allData }: Args<T>): Promise<{
    next: boolean;
    records: T[];
}>;
export {};
