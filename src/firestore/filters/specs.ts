import {DocumentData} from "../DocumentData.js";
import {Pipeline} from "../Pipeline.js";
import {Query} from "../Query.js";
import {RestQuery} from "../rest.js";

export interface FilterFieldSpec<T extends DocumentData = any> {
  name: string;
  queryName?: string | ((args: {operator: FilterOperator}) => string);
  dataName?: string | ((args: {operator: FilterOperator}) => string);
  dataValue?: (args: {data: T}) => any;
  filterValue?: (args: {operator: FilterOperator, value: any | undefined}) => any;
  label?: string;
  description?: string;
  hint?: string;
  type: FilterFieldType;
  operators: FilterOperator[];
  operatorLabel?: (args: {operator: FilterOperator}) => string;
  /**
   * Resolves the filter value against another collection first: records of `query` matching the filter on
   * `dataField` are fetched and their `resultField` values (arrays are flattened) are used as an `in` filter.
   *
   * `dataField` and `whereField` may depend on the operator, for a collection that keeps both the raw value
   * and its search index — exact matching goes to one field, partial-text matching to the other.
   */
  join?: {
    query: Query<T> | RestQuery<T> | Pipeline,
    dataField: FilterFieldName,
    whereField?: FilterFieldName,
    resultField: string,
    type: "in"
  };
}

export type FilterFieldName = string | ((args: {operator: FilterOperator}) => string);

export namespace FilterFieldSpec {

  export function resolveFieldName(name: FilterFieldName, operator: FilterOperator): string;

  export function resolveFieldName(name: FilterFieldName | undefined, operator: FilterOperator): string | undefined;

  export function resolveFieldName(name: FilterFieldName | undefined, operator: FilterOperator) {
    return typeof name === "function" ? name({operator}) : name;
  }
}

export enum FilterOperator {
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

export namespace FilterOperator {
  export const noValueOperators = [FilterOperator.emptyArray];
}

export enum FilterFieldType {
  text = 1,
  textArray = 2,
  number = 3
}

export namespace FilterFieldType {
  export const operators = {
    [FilterFieldType.text]: [FilterOperator.includeChars, FilterOperator.includeWord, FilterOperator.equals],
    [FilterFieldType.textArray]: [FilterOperator.hasAnyOf, FilterOperator.hasAll, FilterOperator.emptyArray],
    [FilterFieldType.number]: [FilterOperator.equals, FilterOperator.greater, FilterOperator.greaterOrEqual, FilterOperator.less, FilterOperator.lessOrEqual]
  } as const;
}

export interface Filter {
  field: string;
  spec?: FilterFieldSpec;
  operator: FilterOperator;
  value?: string | string[];
}

export namespace Filter {

  export type SpecRequired = Filter & {spec: FilterFieldSpec};
  export type Serialized = [fieldName: string, operator: FilterOperator, value?: string | string[]];

  export function serialize(filters: Filter[] | undefined) {
    if (!filters) {
      return;
    }

    const serialized: Serialized[] = [];
    for (const filter of filters) {
      const s = [filter.field, filter.operator] as Serialized;
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

    const unserialized: Filter.SpecRequired[] = [];
    for (const filter of filters) {
      const spec = fields.find(f => f.name === filter[0]);
      if (spec) {
        unserialized.push({field: spec.name, spec, operator: filter[1], value: filter[2]});
      }
    }
    return unserialized.length ? unserialized : undefined;
  }
}
