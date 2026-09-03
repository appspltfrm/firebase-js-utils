import { DocumentData } from "../DocumentData.js";
import { Pipeline } from "../Pipeline.js";
import { Query } from "../Query.js";
import { RestQuery } from "../rest.js";
export interface FilterFieldSpec<T extends DocumentData = any> {
    name: string;
    queryName?: string | ((args: {
        operator: FilterOperator;
    }) => string);
    dataName?: string | ((args: {
        operator: FilterOperator;
    }) => string);
    dataValue?: (args: {
        data: T;
    }) => any;
    filterValue?: (args: {
        operator: FilterOperator;
        value: any | undefined;
    }) => any;
    label?: string;
    description?: string;
    hint?: string;
    type: FilterFieldType;
    operators: FilterOperator[];
    operatorLabel?: (args: {
        operator: FilterOperator;
    }) => string;
    /**
     * Resolves the filter value against another collection first: records of `query` matching the filter on
     * `dataField` are fetched and their `resultField` values (arrays are flattened) are used as an `in` filter.
     *
     * `dataField` and `whereField` may depend on the operator, for a collection that keeps both the raw value
     * and its search index — exact matching goes to one field, partial-text matching to the other.
     */
    join?: {
        query: Query<T> | RestQuery<T> | Pipeline;
        dataField: FilterFieldName;
        whereField?: FilterFieldName;
        resultField: string;
        type: "in";
    };
}
export type FilterFieldName = string | ((args: {
    operator: FilterOperator;
}) => string);
export declare namespace FilterFieldSpec {
    function resolveFieldName(name: FilterFieldName, operator: FilterOperator): string;
    function resolveFieldName(name: FilterFieldName | undefined, operator: FilterOperator): string | undefined;
}
export declare enum FilterOperator {
    includeChars = 1,
    includeWord = 2,
    hasAll = 3,
    hasAnyOf = 4,
    emptyArray = 5,
    equals = 6,
    greater = 7,
    greaterOrEqual = 8,
    less = 9,
    lessOrEqual = 10
}
export declare namespace FilterOperator {
    const noValueOperators: FilterOperator[];
}
export declare enum FilterFieldType {
    text = 1,
    textArray = 2,
    number = 3
}
export declare namespace FilterFieldType {
    const operators: {
        readonly 1: readonly [FilterOperator.includeChars, FilterOperator.includeWord, FilterOperator.equals];
        readonly 2: readonly [FilterOperator.hasAnyOf, FilterOperator.hasAll, FilterOperator.emptyArray];
        readonly 3: readonly [FilterOperator.equals, FilterOperator.greater, FilterOperator.greaterOrEqual, FilterOperator.less, FilterOperator.lessOrEqual];
    };
}
export interface Filter {
    field: string;
    spec?: FilterFieldSpec;
    operator: FilterOperator;
    value?: string | string[];
}
export declare namespace Filter {
    type SpecRequired = Filter & {
        spec: FilterFieldSpec;
    };
    type Serialized = [fieldName: string, operator: FilterOperator, value?: string | string[]];
    function serialize(filters: Filter[] | undefined): Serialized[] | undefined;
    function unserialize(filters: Serialized[] | undefined, fields: FilterFieldSpec[]): SpecRequired[] | undefined;
}
