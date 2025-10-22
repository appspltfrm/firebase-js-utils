import { Query } from "../Query.js";
import { RestQuery } from "../RestQuery.js";
import { Filter } from "./specs.js";
type Args<T> = {
    query: Query<T> | RestQuery<T>;
    startAfter?: any[];
    getStartAfter: (data: T) => any[];
    allData?: T[];
    limit: number;
    filters: Filter.SpecRequired[];
    transliterate?: (input: string) => string;
};
export declare function getFilteredData<T>({ filters, query: baseQuery, transliterate, limit, startAfter, getStartAfter, allData }: Args<T>): Promise<{
    next: boolean;
    records: T[];
}>;
export {};
