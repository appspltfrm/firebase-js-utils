export interface FilterFieldSpec<T = any> {
    name: string;
    queryName?: string | ((args: {operator: FilterOperator}) => string);
    dataName?: string | ((args: {operator: FilterOperator}) => string);
    dataValue?: (data: T) => any;
    filterValue?: (args: {operator: FilterOperator, value: any | undefined}) => any;
    label: string;
    description?: string;
    hint?: string;
    type: FilterFieldType;
    operators: FilterOperator[];
    operatorLabel?: (operator: FilterOperator) => string;
}


export enum FilterOperator {
    textTrigram = 1,
    textWord = 2,
    hasAll = 3,
    hasAnyOf = 4,
    emptyArray = 5,
    equals = 6
}

export namespace FilterOperator {
    export const noValueOperators = [FilterOperator.emptyArray];
}

export enum FilterFieldType {
    text = 1,
    textArray = 2
}

export namespace FilterFieldType {
    export const operators = {
        [FilterFieldType.text]: [FilterOperator.textTrigram, FilterOperator.textWord, FilterOperator.equals],
        [FilterFieldType.textArray]: [FilterOperator.hasAnyOf, FilterOperator.hasAll, FilterOperator.emptyArray]
    } as const;
}

export interface Filter {
    field: FilterFieldSpec;
    operator: FilterOperator;
    value?: string | string[];
}

export namespace Filter {

    export type Serialized = [fieldName: string, operator: FilterOperator, value?: string | string[]];

    export function serialize(filters: Filter[] | undefined) {
        if (!filters) {
            return;
        }

        const serialized: Serialized[] = [];
        for (const filter of filters) {
            const s = [filter.field.name, filter.operator] as Serialized;
            if (filter.value !== undefined) {
                s.push(filter.value);
            }
            serialized.push(s);
        }
        return serialized;
    }

    export function unserialize(filters: Serialized[] | undefined, fields: FilterFieldSpec[]) {
        if (!filters) {
            return;
        }

        const unserialized: Filter[] = [];
        for (const filter of filters) {
            const field = fields.find(f => f.name === filter[0]);
            if (field) {
                unserialized.push({field, operator: filter[1], value: filter[2]})
            }
        }
        return unserialized;
    }
}