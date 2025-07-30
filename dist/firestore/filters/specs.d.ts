export interface FilterFieldSpec<T = any> {
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
    label: string;
    description?: string;
    hint?: string;
    type: FilterFieldType;
    operators: FilterOperator[];
    operatorLabel?: (args: {
        operator: FilterOperator;
    }) => string;
}
export declare enum FilterOperator {
    includeChars = 1,
    includeWord = 2,
    hasAll = 3,
    hasAnyOf = 4,
    emptyArray = 5,
    equals = 6
}
export declare namespace FilterOperator {
    const noValueOperators: FilterOperator[];
}
export declare enum FilterFieldType {
    text = 1,
    textArray = 2
}
export declare namespace FilterFieldType {
    const operators: {
        readonly 1: readonly [FilterOperator.includeChars, FilterOperator.includeWord, FilterOperator.equals];
        readonly 2: readonly [FilterOperator.hasAnyOf, FilterOperator.hasAll, FilterOperator.emptyArray];
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
    function serialize(filters: Filter[] | undefined): Serialized[];
    function unserialize(filters: Serialized[] | undefined, fields: FilterFieldSpec[]): SpecRequired[];
}
