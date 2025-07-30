import {Query} from "../Query.js";
import {buildQuery} from "../buildQuery.js";
import {getCountFromServer} from "../getCountFromServer.js";
import {getDataFromServer} from "../getDataFromServer.js";
import {generateTextSearchTrigrams} from "./generateTextSearchTrigrams.js";
import {Filter, FilterFieldType, FilterOperator} from "./specs.js";
import {splitTextSearchWords} from "./splitTextSearchWords.js";
import {deepEqual} from "fast-equals";

type Args<T> = {
    query: Query<T>, 
    startAfter?: any[], 
    getStartAfter: (data: T) => any[],
    allData?: T[],
    limit: number, 
    filters: Filter[],
    transliterate?: (input: string) => string
}

export async function getFilteredData<T>({filters, query: baseQuery, transliterate, limit, startAfter, getStartAfter, allData}: Args<T>) {

    const result: {next: boolean, records: T[]} = {next: false, records: []};

    if (!transliterate) {
        transliterate = (await import("transliteration")).transliterate;
    }

    const filtersNormalized = filters.map(filter => ({
        ...filter, 
        value: filter.field.filterValue ? filter.field.filterValue({operator: filter.operator, value: filter.value}) : filter.value
    }));

    const textFilterWords: [filter: Filter, string[]][] = filtersNormalized.filter(f => f.field.type === FilterFieldType.text)
        .map(filter => [filter, splitTextSearchWords(filter.value as string, transliterate)]);

    const testFilters = (data: any) => {
        
        for (const filter of filtersNormalized) {
            const propName = typeof filter.field.dataName === "string" ? filter.field.dataName : filter.field.dataName?.({operator: filter.operator});
            let dataValue = filter.field.dataValue ? filter.field.dataValue({data}) : data[propName || filter.field.name];

            if ([FilterOperator.textTrigram, FilterOperator.textWord].includes(filter.operator) && [FilterFieldType.text, FilterFieldType.textArray].includes(filter.field.type)) {
                if (Array.isArray(dataValue)) {
                    dataValue = dataValue.map(v => transliterate(v));
                } else {
                    dataValue = transliterate(dataValue);
                }
            }
            
            if (filter.field.type === FilterFieldType.text) {

                if (!filter.value) {
                    return false;
                }

                if (filter.operator === FilterOperator.equals && dataValue !== filter.value) {
                    return false;
                }

                if (filter.operator === FilterOperator.textTrigram || filter.operator === FilterOperator.textWord) {
                    for (const [, words] of textFilterWords.filter(([f]) => f === filter)) {
                        for (const word of words) {
                            if (typeof dataValue === "string") {
                                return dataValue.includes(word);
                            } else if (!(Array.isArray(dataValue) && dataValue.find((v: string) => filter.operator === FilterOperator.textTrigram ? v.includes(word) : v === word))) {
                                return false;
                            }
                        }
                    }
                }

            } else if (filter.field.type === FilterFieldType.textArray) {

                if (filter.operator === FilterOperator.emptyArray) {
                    return !dataValue || (dataValue as string[]).length === 0;
                }

                if (!dataValue || !Array.isArray(dataValue)) {
                    return false;
                }

                if (filter.operator === FilterOperator.hasAll) {

                    for (const value of filter.value as string[]) {
                        if (!(dataValue as string[]).includes(value)) {
                            return false;
                        }
                    }

                    return true;

                } else {
                    return !!(dataValue as string[]).find(v => (filter.value as string[]).includes(v));
                }

            }
        }

        return true;
    }

    if (allData) {
        
        const records: T[] = [];
        let startAfterFound = false;

        for (const data of allData) {
            if (testFilters(data)) {
                
                if (startAfter && !startAfterFound) {
                    const d = getStartAfter(data);
                    if (deepEqual(startAfter, d)) {
                        startAfterFound = true;
                    }
                    continue;
                }

                records.push(data);

                if (records.length === limit + 1) {
                    break;
                }
            }
        }

        result.records = records.slice(0, limit);
        result.next = records.length > limit;

    } else {

        let bestQueryCount: number | undefined;
        let bestQuery: Query<T> | undefined;

        if (startAfter?.length) {
            baseQuery = buildQuery(baseQuery, ["startAfter", ...startAfter]);
        }

        for (const filter of filtersNormalized) {

            const fieldName = (typeof filter.field.queryName === "string" ? filter.field.queryName : filter.field.queryName({operator: filter.operator})) || filter.field.name;

            if (filter.field.type === FilterFieldType.text) {

                if (!filter.value) {
                    return result;
                }

                const values = filter.operator === FilterOperator.equals ? [filter.value] : [
                    ...textFilterWords.filter(([f]) => f === filter).map(([, words]) => words).flat(),
                    ...((filter.operator === FilterOperator.textTrigram && generateTextSearchTrigrams(filter.value as string, "query", transliterate)) || [])
                ].filter((v, i, a) => a.indexOf(v) === i);

                for (const value of values) {

                    const query = buildQuery(baseQuery, 
                        ([FilterOperator.textTrigram, FilterOperator.textWord].includes(filter.operator) && ["where", fieldName, "array-contains", value]) || undefined,
                        (filter.operator === FilterOperator.equals && ["where", fieldName, "==", value]) || undefined
                    )

                    const count = await getCountFromServer(query);

                    ZERO: if (count === 0) {
                        if (filter.operator === FilterOperator.textTrigram && value.length !== 3) {
                            break ZERO;
                        }

                        return result;
                    }

                    if (count > 0 && (!bestQueryCount || bestQueryCount > count)) {
                        bestQueryCount = count;
                        bestQuery = query;
                    }

                    if (count > 0 && count < limit) {
                        break;
                    }
                }

            } else if (filter.field.type === FilterFieldType.textArray) {

                if (filter.operator !== FilterOperator.emptyArray && (!filter.value || !Array.isArray(filter.value))) {
                    return result;
                }

                if (filter.operator === FilterOperator.hasAll) {
                    for (const value of filter.value as string[]) {

                        const query = buildQuery(baseQuery, ["where", fieldName, "array-contains", value])

                        const count = await getCountFromServer(query);
                        if (count === 0) {
                            return result;
                        }

                        if (count > 0 && (!bestQueryCount || bestQueryCount > count)) {
                            bestQueryCount = count;
                            bestQuery = query;
                        }
                    }

                } else {

                    const query = buildQuery(baseQuery, 
                        (filter.operator === FilterOperator.emptyArray && ["where", fieldName, "==", null]) || undefined,
                        (filter.operator === FilterOperator.hasAnyOf && ["where", fieldName, "array-contains-any", filter.value]) || undefined,
                    )

                    const count = await getCountFromServer(query);
                    if (count === 0) {
                        return result;
                    }

                    if (count > 0 && (!bestQueryCount || bestQueryCount > count)) {
                        bestQueryCount = count;
                        bestQuery = query;
                    }
                }
            }
        }

        if (bestQuery) {

            while (result.records.length < limit + 1) {

                const bestData = await getDataFromServer<any>(buildQuery(bestQuery, 
                    ["limit", limit + 1]
                ))

                for (const data of bestData) {
                    if (testFilters(data)) {
                        result.records.push(data);
                    }
                }

                if (bestData.length <= limit) {
                    break;
                }

                startAfter = getStartAfter(bestData[bestData.length - 1]);
            }
            if (result.records.length > limit) {
                result.next = true;
                result.records.splice(limit, 1);
            }
        }
    }

    return result;
}