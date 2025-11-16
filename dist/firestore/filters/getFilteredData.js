import { BigNumber } from "bignumber.js";
import { deepEqual } from "fast-equals";
import { buildQuery } from "../buildQuery.js";
import { getCountFromServer } from "../getCountFromServer.js";
import { getDataFromServer } from "../getDataFromServer.js";
import { Query } from "../Query.js";
import { RestQuery } from "../RestQuery.js";
import { generateTextSearchTrigrams } from "./generateTextSearchTrigrams.js";
import { FilterFieldType, FilterOperator } from "./specs.js";
import { splitTextSearchWords } from "./splitTextSearchWords.js";
export async function getFilteredData({ filters, query: baseQuery, transliterate, limit, startAfter, getStartAfter, allData }) {
    const hasLimit = limit > 0;
    const result = { next: false, records: [] };
    if (!transliterate) {
        transliterate = (await import("transliteration")).transliterate;
    }
    const filtersNormalized = filters.map(filter => {
        let value = filter.spec.filterValue ? filter.spec.filterValue({ operator: filter.operator, value: filter.value }) : filter.value;
        if ([FilterOperator.includeChars, FilterOperator.includeWord].includes(filter.operator) && [FilterFieldType.text, FilterFieldType.textArray].includes(filter.spec.type)) {
            if (Array.isArray(value)) {
                value = value.map(v => transliterate(v).toLowerCase());
            }
            else {
                value = transliterate(value).toLowerCase();
            }
        }
        return { ...filter, value };
    });
    const textFilterWords = filtersNormalized.filter(f => f.spec.type === FilterFieldType.text)
        .map(filter => [filter, splitTextSearchWords(filter.value, transliterate)]);
    const joinResults = {};
    const fetchJoin = async (filter) => {
        if (!joinResults[filter.spec.name]) {
            const join = filter.spec.join;
            let query = join.query;
            if (query instanceof RestQuery || Query.isAdmin(query)) {
                query = buildQuery(query, ["select", join.dataField, join.resultField]);
            }
            joinResults[filter.spec.name] = (await getFilteredData({
                limit: -1,
                query,
                getStartAfter: (data) => data[join.whereField],
                transliterate,
                filters: [{
                        operator: filter.operator,
                        value: filter.value,
                        field: join.whereField || join.dataField,
                        spec: {
                            name: join.whereField || join.dataField,
                            dataName: join.dataField,
                            queryName: join.whereField,
                            type: filter.spec.type,
                            filterValue: filter.spec.filterValue,
                            operators: filter.spec.operators
                        }
                    }]
            })).records.map(r => r[join.resultField]);
        }
        return joinResults[filter.spec.name];
    };
    const testFilters = async (data) => {
        for (const filter of filtersNormalized) {
            const propName = typeof filter.spec.dataName === "string" ? filter.spec.dataName : filter.spec.dataName?.({ operator: filter.operator });
            let dataValue = filter.spec.dataValue ? filter.spec.dataValue({ data }) : data[propName || filter.spec.name];
            if (filter.spec.join) {
                return (await fetchJoin(filter)).includes(dataValue);
            }
            else {
                if ([FilterOperator.includeChars, FilterOperator.includeWord].includes(filter.operator) && [FilterFieldType.text, FilterFieldType.textArray].includes(filter.spec.type)) {
                    if (Array.isArray(dataValue)) {
                        dataValue = dataValue.map(v => transliterate(v).toLowerCase());
                    }
                    else {
                        dataValue = transliterate(dataValue).toLowerCase();
                    }
                }
                if (filter.spec.type === FilterFieldType.text) {
                    if (!filter.value) {
                        return false;
                    }
                    if (filter.operator === FilterOperator.equals && dataValue !== filter.value) {
                        return false;
                    }
                    if (filter.operator === FilterOperator.includeChars) {
                        if (typeof dataValue === "string") {
                            return dataValue.includes(filter.value);
                        }
                        else if (Array.isArray(dataValue)) {
                            return !!dataValue.find((v) => v.includes(filter.value));
                        }
                        return false;
                    }
                    if (filter.operator === FilterOperator.includeWord) {
                        for (const [, words] of textFilterWords.filter(([f]) => f === filter)) {
                            for (const word of words) {
                                if (typeof dataValue === "string") {
                                    return dataValue.includes(word);
                                }
                                else if (Array.isArray(dataValue)) {
                                    return dataValue.includes(word);
                                }
                            }
                        }
                        return false;
                    }
                }
                else if (filter.spec.type === FilterFieldType.textArray) {
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
                else if (filter.spec.type === FilterFieldType.number) {
                    if (typeof dataValue !== "number" && !(dataValue instanceof BigNumber)) {
                        return false;
                    }
                    if (typeof filter.value !== "number" && !(filter.value instanceof BigNumber)) {
                        return false;
                    }
                    const normalizedDataValue = dataValue instanceof BigNumber ? dataValue : new BigNumber(dataValue);
                    const normalizedFilterValue = filter.value instanceof BigNumber ? filter.value : new BigNumber(filter.value);
                    if (filter.operator === FilterOperator.equals) {
                        return normalizedDataValue.eq(normalizedFilterValue);
                    }
                    else if (filter.operator === FilterOperator.greater) {
                        return normalizedDataValue.gt(normalizedFilterValue);
                    }
                    else if (filter.operator === FilterOperator.greaterOrEqual) {
                        return normalizedDataValue.gte(normalizedFilterValue);
                    }
                    else if (filter.operator === FilterOperator.less) {
                        return normalizedDataValue.lt(normalizedFilterValue);
                    }
                    else if (filter.operator === FilterOperator.lessOrEqual) {
                        return normalizedDataValue.lte(normalizedFilterValue);
                    }
                    else {
                        return false;
                    }
                }
            }
        }
        return false;
    };
    if (allData) {
        const records = [];
        let startAfterFound = false;
        for (const data of allData) {
            if (await testFilters(data)) {
                if (startAfter && !startAfterFound) {
                    const d = getStartAfter(data);
                    if (deepEqual(startAfter, d)) {
                        startAfterFound = true;
                    }
                    continue;
                }
                records.push(data);
                if (hasLimit && records.length === limit + 1) {
                    break;
                }
            }
        }
        result.records = !hasLimit ? records : records.slice(0, limit);
        result.next = hasLimit && records.length > limit;
    }
    else {
        let bestQueryCount;
        let bestQuery;
        for (const filter of filtersNormalized) {
            const fieldName = (typeof filter.spec.queryName === "function" ? filter.spec.queryName({ operator: filter.operator }) : filter.spec.queryName) || filter.spec.name;
            if (filter.spec.join) {
                const allQueries = arrayChunk(await fetchJoin(filter), 30).map(chunk => buildQuery(baseQuery, ["where", fieldName, "in", chunk], (startAfter?.length && ["startAfter", ...startAfter])));
                const resultQueries = [];
                let count = 0;
                for (const query of allQueries) {
                    const c = await getCountFromServer(query);
                    count += c;
                    if (c > 0) {
                        resultQueries.push(query);
                    }
                }
                if (count === 0) {
                    return result;
                }
                if (count > 0 && (!bestQueryCount || bestQueryCount > count)) {
                    bestQueryCount = count;
                    bestQuery = resultQueries;
                }
                if (hasLimit && count > 0 && count < limit) {
                    break;
                }
            }
            else {
                if (filter.spec.type === FilterFieldType.text) {
                    if (!filter.value) {
                        return result;
                    }
                    const values = filter.operator === FilterOperator.equals ? [filter.value] : [
                        ...textFilterWords.filter(([f]) => f === filter).map(([, words]) => words).flat(),
                        ...((filter.operator === FilterOperator.includeChars && generateTextSearchTrigrams(filter.value, "query", transliterate)) || [])
                    ].filter((v, i, a) => a.indexOf(v) === i);
                    for (const value of values) {
                        const query = buildQuery(baseQuery, ([FilterOperator.includeChars, FilterOperator.includeWord].includes(filter.operator) && ["where", fieldName, "array-contains", value]) || undefined, (filter.operator === FilterOperator.equals && ["where", fieldName, "==", value]) || undefined, (startAfter?.length && ["startAfter", ...startAfter]) || undefined);
                        const count = await getCountFromServer(buildQuery(query, hasLimit && ["limit", (bestQueryCount > 0 ? bestQueryCount : limit) + 1]));
                        ZERO: if (count === 0) {
                            if (filter.operator === FilterOperator.includeChars && value.length !== 3) {
                                break ZERO;
                            }
                            return result;
                        }
                        if (count > 0 && (!bestQueryCount || bestQueryCount > count)) {
                            bestQueryCount = count;
                            bestQuery = query;
                        }
                        if (hasLimit && count > 0 && count < limit) {
                            break;
                        }
                    }
                }
                else if (filter.spec.type === FilterFieldType.textArray) {
                    if (filter.operator !== FilterOperator.emptyArray && (!filter.value || !Array.isArray(filter.value))) {
                        return result;
                    }
                    if (filter.operator === FilterOperator.hasAll) {
                        for (const value of filter.value) {
                            const query = buildQuery(baseQuery, ["where", fieldName, "array-contains", value], (startAfter?.length && ["startAfter", ...startAfter]) || undefined);
                            const count = await getCountFromServer(buildQuery(query, hasLimit && ["limit", (bestQueryCount > 0 ? bestQueryCount : limit) + 1]));
                            if (count === 0) {
                                return result;
                            }
                            if (count > 0 && (!bestQueryCount || bestQueryCount > count)) {
                                bestQueryCount = count;
                                bestQuery = query;
                            }
                            if (hasLimit && count > 0 && count < limit) {
                                break;
                            }
                        }
                    }
                    else {
                        const query = buildQuery(baseQuery, (filter.operator === FilterOperator.emptyArray && ["where", fieldName, "==", null]) || undefined, (filter.operator === FilterOperator.hasAnyOf && ["where", fieldName, "array-contains-any", filter.value]) || undefined, (startAfter?.length && ["startAfter", ...startAfter]) || undefined);
                        const count = await getCountFromServer(buildQuery(query, hasLimit && ["limit", (bestQueryCount > 0 ? bestQueryCount : limit) + 1]));
                        if (count === 0) {
                            return result;
                        }
                        if (count > 0 && (!bestQueryCount || bestQueryCount > count)) {
                            bestQueryCount = count;
                            bestQuery = query;
                        }
                        if (hasLimit && count > 0 && count < limit) {
                            break;
                        }
                    }
                }
                else if (filter.spec.type === FilterFieldType.number) {
                    const whereOperator = (filter.operator === FilterOperator.equals && "==") ||
                        (filter.operator === FilterOperator.greater && ">") ||
                        (filter.operator === FilterOperator.greaterOrEqual && ">=") ||
                        (filter.operator === FilterOperator.less && "<") ||
                        (filter.operator === FilterOperator.lessOrEqual && "<=") || undefined;
                    if (!whereOperator) {
                        return result;
                    }
                    const query = buildQuery(baseQuery, ["where", fieldName, whereOperator, filter.value instanceof BigNumber ? filter.value.toNumber() : filter.value]);
                    const count = await getCountFromServer(buildQuery(query, hasLimit && ["limit", (bestQueryCount && bestQueryCount > 0 ? bestQueryCount : limit) + 1]));
                    if (count === 0) {
                        return result;
                    }
                    if (count > 0 && (!bestQueryCount || bestQueryCount > count)) {
                        bestQueryCount = count;
                        bestQuery = query;
                    }
                    if (hasLimit && count > 0 && count < limit) {
                        break;
                    }
                }
            }
        }
        if (bestQuery) {
            RECORDS: while (!hasLimit || result.records.length < limit + 1) {
                let bestData;
                for (const query of Array.isArray(bestQuery) ? bestQuery : [bestQuery]) {
                    const queryData = await getDataFromServer(buildQuery(query, (startAfter?.length && ["startAfter", ...startAfter]) || undefined, hasLimit && ["limit", limit + 1]));
                    if (!bestData) {
                        bestData = queryData;
                    }
                    else {
                        bestData.push(...queryData);
                    }
                    for (const data of queryData) {
                        if (await testFilters(data)) {
                            result.records.push(data);
                            if (hasLimit && result.records.length > limit) {
                                break RECORDS;
                            }
                        }
                    }
                    if (hasLimit && queryData.length <= limit) {
                        break;
                    }
                }
                if (!hasLimit || bestData.length <= limit) {
                    break;
                }
                startAfter = getStartAfter(bestData[bestData.length - 1]);
            }
            if (hasLimit && result.records.length > limit) {
                result.next = true;
                result.records.splice(limit);
            }
        }
    }
    return result;
}
function arrayChunk(arr, chunkSize) {
    return arr.reduce((prevVal, currVal, currIndx, array) => !(currIndx % chunkSize) ? prevVal.concat([array.slice(currIndx, currIndx + chunkSize)]) : prevVal, []);
}
//# sourceMappingURL=getFilteredData.js.map