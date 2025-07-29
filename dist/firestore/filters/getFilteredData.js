import { buildQuery } from "../buildQuery.js";
import { getCountFromServer } from "../getCountFromServer.js";
import { getDataFromServer } from "../getDataFromServer.js";
import { generateTextSearchTrigrams } from "./generateTextSearchTrigrams.js";
import { FilterFieldType, FilterOperator } from "./specs.js";
import { splitTextSearchWords } from "./splitTextSearchWords.js";
export async function getFilteredData({ filters, query: baseQuery, transliterate, limit, startAfter, getStartAfter, allData }) {
    const result = { next: false, records: [] };
    let bestQueryCount;
    let bestQuery;
    if (!transliterate) {
        transliterate = (await import("transliteration")).transliterate;
    }
    if (startAfter?.length) {
        baseQuery = buildQuery(baseQuery, ["startAfter", ...startAfter]);
    }
    const filtersNormalized = filters.map(filter => ({
        ...filter,
        value: filter.field.filterValue ? filter.field.filterValue({ operator: filter.operator, value: filter.value }) : filter.value
    }));
    const textFilterWords = filters.filter(f => f.field.type === FilterFieldType.text)
        .map(filter => [filter, splitTextSearchWords(filter.value, transliterate)]);
    const testFilters = (data) => {
        for (const filter of filtersNormalized) {
            const propName = typeof filter.field.dataName === "string" ? filter.field.dataName : filter.field.dataName?.({ operator: filter.operator });
            const dataValue = filter.field.dataValue ? filter.field.dataValue({ data }) : data[propName || filter.field.name];
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
                            if (!(Array.isArray(dataValue) && dataValue.find((v) => filter.operator === FilterOperator.textTrigram ? v.includes(word) : v === word))) {
                                return false;
                            }
                        }
                    }
                }
            }
            else if (filter.field.type === FilterFieldType.textArray) {
                if (filter.operator === FilterOperator.emptyArray) {
                    return !dataValue || dataValue.length === 0;
                }
                if (!dataValue || !Array.isArray(dataValue)) {
                    return false;
                }
                if (filter.operator === FilterOperator.hasAll) {
                    for (const value of filter.value) {
                        if (!dataValue.includes(value)) {
                            return false;
                        }
                    }
                    return true;
                }
                else {
                    return !!dataValue.find(v => filter.value.includes(v));
                }
            }
        }
        return true;
    };
    if (allData) {
        result.next = false;
        for (const data of allData) {
            if (testFilters(data)) {
                result.records.push(data);
            }
        }
    }
    else {
        for (const filter of filtersNormalized) {
            const fieldName = (typeof filter.field.queryName === "string" ? filter.field.queryName : filter.field.queryName({ operator: filter.operator })) || filter.field.name;
            if (filter.field.type === FilterFieldType.text) {
                if (!filter.value) {
                    return result;
                }
                const values = filter.operator === FilterOperator.equals ? [filter.value] : [
                    ...textFilterWords.filter(([f]) => f === filter).map(([, words]) => words).flat(),
                    ...((filter.operator === FilterOperator.textTrigram && generateTextSearchTrigrams(filter.value, "query", transliterate)) || [])
                ].filter((v, i, a) => a.indexOf(v) === i);
                for (const value of values) {
                    const query = buildQuery(baseQuery, ([FilterOperator.textTrigram, FilterOperator.textWord].includes(filter.operator) && ["where", fieldName, "array-contains", value]) || undefined, (filter.operator === FilterOperator.equals && ["where", fieldName, "==", value]) || undefined);
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
            }
            else if (filter.field.type === FilterFieldType.textArray) {
                if (filter.operator !== FilterOperator.emptyArray && (!filter.value || !Array.isArray(filter.value))) {
                    return result;
                }
                if (filter.operator === FilterOperator.hasAll) {
                    for (const value of filter.value) {
                        const query = buildQuery(baseQuery, ["where", fieldName, "array-contains", value]);
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
                else {
                    const query = buildQuery(baseQuery, (filter.operator === FilterOperator.emptyArray && ["where", fieldName, "==", null]) || undefined, (filter.operator === FilterOperator.hasAnyOf && ["where", fieldName, "array-contains-any", filter.value]) || undefined);
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
                const bestData = await getDataFromServer(buildQuery(bestQuery, ["limit", limit + 1]));
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
//# sourceMappingURL=getFilteredData.js.map