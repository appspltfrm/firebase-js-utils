import { DocumentData } from "../DocumentData.js";
import { Pipeline } from "../Pipeline.js";
import { Transliterate } from "./_buildPipelineWhere.js";
import { PipelineExpr } from "./_pipelineExpr.js";
import { Filter } from "./specs.js";
/**
 * Sort applied by the pipeline path. Named after the pipeline `sort` stage (the classic query builder uses
 * `orderBy`). Required for a deterministic order when paginating with `queryOffset`.
 */
export type PipelineQuerySort = Array<[field: string, direction?: "asc" | "desc"]>;
type Args<T extends DocumentData = any> = {
    pipeline: Pipeline;
    filters: Filter.SpecRequired[];
    querySort?: PipelineQuerySort;
    limit: number;
    queryOffset?: number;
    /** Pre-resolved join `resultField` values per filter `spec.name`, used on the client path (no native joins). */
    joinValues?: Map<string, any[]>;
    /** Removes diacritics so text queries match the transliterated `*Searchable` fields. */
    transliterate: Transliterate;
};
/**
 * Single-shot pipeline filtering: all filters are pushed into one server-side `where` stage and the pipeline
 * is executed exactly once — no per-filter count probing and no in-memory post-filtering.
 *
 * The provided `pipeline` is expected to already be scoped to its collection (plus any fixed/scope conditions).
 * This function appends the dynamic filter conditions, sort, offset pagination and limit.
 *
 * Pagination uses the native `offset` stage (the Pipeline API has no value cursor), so `queryOffset` is a row
 * count to skip — it requires `querySort` for a deterministic order.
 */
export declare function getFilteredDataFromPipeline<T extends DocumentData = any>({ pipeline, filters, querySort, limit, queryOffset, joinValues, transliterate }: Args<T>): Promise<{
    next: boolean;
    records: T[];
}>;
/**
 * Client join: the join query was already run "alongside" (`fetchJoin`) and produced a set of `resultField`
 * values; constrain the main field with an `in`, chunked + OR-combined exactly like the standard path.
 */
export declare function buildClientJoinCondition(filter: Filter.SpecRequired, values: any[], expr: PipelineExpr): any | undefined;
/**
 * Admin join: native correlated-existence subquery. For each outer row, count join docs that match the user's
 * filter on `dataField` AND whose `resultField` equals the outer `mainField`; keep rows where that count > 0.
 * Returns the `define` binding to add to the main pipeline plus the `where` condition.
 */
export declare function buildAdminJoinCondition(filter: Filter.SpecRequired, expr: PipelineExpr, transliterate: Transliterate): {
    define: any;
    condition: any;
};
export {};
