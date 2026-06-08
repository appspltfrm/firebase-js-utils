import { BigNumber } from "bignumber.js";
import { combineAnd } from "./_pipelineExpr.js";
import { generateTextSearchTrigrams } from "./generateTextSearchTrigrams.js";
import { FilterFieldType, FilterOperator } from "./specs.js";
import { splitTextSearchWords } from "./splitTextSearchWords.js";
/**
 * Translates a set of filters into a single pipeline `where` condition (a `BooleanExpression`), pushing all
 * filtering server-side. Returns `undefined` when no filter produces a condition (e.g. all values empty).
 *
 * Pure and synchronous so it can be unit-tested against a fake expression builder. `join` filters are not
 * handled here — the orchestrator resolves/rejects them before calling this.
 */
export function buildPipelineWhere(filters, expr, transliterate) {
    const conditions = [];
    for (const filter of filters) {
        // Join filters are handled by the orchestrator (client `in` / admin native subquery), not here.
        if (filter.spec.join) {
            continue;
        }
        const condition = buildCondition(filter, expr, transliterate);
        if (condition !== undefined) {
            conditions.push(condition);
        }
    }
    return combineAnd(conditions, expr);
}
//#region Field / value resolution
export function resolveFieldName(filter) {
    const queryName = typeof filter.spec.queryName === "function"
        ? filter.spec.queryName({ operator: filter.operator })
        : filter.spec.queryName;
    return queryName || filter.spec.name;
}
export function resolveValue(filter) {
    return filter.spec.filterValue
        ? filter.spec.filterValue({ operator: filter.operator, value: filter.value })
        : filter.value;
}
//#endregion
//#region Per-filter condition
function buildCondition(filter, expr, transliterate) {
    return buildFieldCondition(filter.operator, filter.spec.type, expr.field(resolveFieldName(filter)), resolveValue(filter), expr, transliterate);
}
/**
 * Builds a single `BooleanExpression` for a given operator/type against an already-resolved field expression.
 * Shared by the top-level filter mapping and by the admin native-join sub-filter (on the join collection's
 * `dataField`).
 */
export function buildFieldCondition(operator, type, field, value, expr, transliterate) {
    switch (type) {
        case FilterFieldType.text:
            return buildTextCondition(operator, field, value, transliterate);
        case FilterFieldType.textArray:
            return buildTextArrayCondition(operator, field, value);
        case FilterFieldType.number:
            return buildNumberCondition(operator, field, value);
        default:
            return undefined;
    }
}
/**
 * Text matching against the transliterated `*Searchable` array field (words + trigrams). The query is
 * transliterated + lowercased the same way the stored values are, so a query without Polish characters matches
 * data that has them. `equals` is the exception: it compares the raw field exactly.
 */
function buildTextCondition(operator, field, value, transliterate) {
    if (value === undefined || value === null || value === "") {
        return undefined;
    }
    const text = String(value);
    if (operator === FilterOperator.equals) {
        return field.equal(text);
    }
    if (operator === FilterOperator.includeWord) {
        const words = splitTextSearchWords(text, transliterate);
        return words.length ? field.arrayContainsAll(words) : undefined;
    }
    if (operator === FilterOperator.includeChars) {
        const trigrams = generateTextSearchTrigrams(text, "query", transliterate);
        return trigrams.length ? field.arrayContainsAll(trigrams) : undefined;
    }
    return undefined;
}
function buildTextArrayCondition(operator, field, value) {
    if (operator === FilterOperator.emptyArray) {
        return field.arrayLength().equal(0);
    }
    if (!Array.isArray(value) || value.length === 0) {
        return undefined;
    }
    if (operator === FilterOperator.hasAll) {
        return field.arrayContainsAll(value);
    }
    // hasAnyOf
    return field.arrayContainsAny(value);
}
function buildNumberCondition(operator, field, value) {
    const num = value instanceof BigNumber ? value.toNumber() : value;
    if (typeof num !== "number" || Number.isNaN(num)) {
        return undefined;
    }
    switch (operator) {
        case FilterOperator.equals:
            return field.equal(num);
        case FilterOperator.greater:
            return field.greaterThan(num);
        case FilterOperator.greaterOrEqual:
            return field.greaterThanOrEqual(num);
        case FilterOperator.less:
            return field.lessThan(num);
        case FilterOperator.lessOrEqual:
            return field.lessThanOrEqual(num);
        default:
            return undefined;
    }
}
//#endregion
//# sourceMappingURL=_buildPipelineWhere.js.map