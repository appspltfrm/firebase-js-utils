import { PipelineExpr } from "./_pipelineExpr.js";
import { Filter, FilterFieldType, FilterOperator } from "./specs.js";
/** Removes diacritics so a query without Polish characters matches the transliterated `*Searchable` fields. */
export type Transliterate = (input: string) => string;
/**
 * Translates a set of filters into a single pipeline `where` condition (a `BooleanExpression`), pushing all
 * filtering server-side. Returns `undefined` when no filter produces a condition (e.g. all values empty).
 *
 * Pure and synchronous so it can be unit-tested against a fake expression builder. `join` filters are not
 * handled here — the orchestrator resolves/rejects them before calling this.
 */
export declare function buildPipelineWhere(filters: Filter.SpecRequired[], expr: PipelineExpr, transliterate: Transliterate): any | undefined;
export declare function resolveFieldName(filter: Filter.SpecRequired): string;
export declare function resolveValue(filter: Filter.SpecRequired): any;
/**
 * Builds a single `BooleanExpression` for a given operator/type against an already-resolved field expression.
 * Shared by the top-level filter mapping and by the admin native-join sub-filter (on the join collection's
 * `dataField`).
 */
export declare function buildFieldCondition(operator: FilterOperator, type: FilterFieldType, field: any, value: any, expr: PipelineExpr, transliterate: Transliterate): any | undefined;
