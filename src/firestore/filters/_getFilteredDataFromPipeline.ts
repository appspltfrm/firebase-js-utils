import {DocumentData} from "../DocumentData.js";
import {executePipeline} from "../executePipeline.js";
import {Firestore} from "../Firestore.js";
import {Pipeline} from "../Pipeline.js";
import {buildFieldCondition, buildPipelineWhere, resolveFieldName, resolveValue, Transliterate} from "./_buildPipelineWhere.js";
import {combineAnd, combineOr, getPipelineExpr, PipelineExpr} from "./_pipelineExpr.js";
import {Filter} from "./specs.js";

/**
 * Sort applied by the pipeline path. Named after the pipeline `sort` stage (the classic query builder uses
 * `orderBy`). Required for a deterministic order when paginating with `queryOffset`.
 */
export type PipelineQuerySort = Array<[field: string, direction?: "asc" | "desc"]>;

type Args<T extends DocumentData = any> = {
  pipeline: Pipeline,
  filters: Filter.SpecRequired[],
  querySort?: PipelineQuerySort,
  limit: number,
  queryOffset?: number,
  /** Pre-resolved join `resultField` values per filter `spec.name`, used on the client path (no native joins). */
  joinValues?: Map<string, any[]>,
  /** Removes diacritics so text queries match the transliterated `*Searchable` fields. */
  transliterate: Transliterate
};

/** Max values per `in`/`equalAny` clause, mirroring the standard query path's chunking. */
const IN_CHUNK_SIZE = 30;

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
export async function getFilteredDataFromPipeline<T extends DocumentData = any>({pipeline, filters, querySort, limit, queryOffset, joinValues, transliterate}: Args<T>): Promise<{next: boolean, records: T[]}> {

  if (queryOffset && queryOffset > 0 && !querySort?.length) {
    throw new Error("Pipeline pagination with queryOffset requires querySort");
  }

  const hasLimit = limit > 0;
  const expr = getPipelineExpr(pipeline);
  const isClient = Pipeline.isClient(pipeline);

  let pipe: any = pipeline;

  //#region Where (filters + joins)

  const conditions: any[] = [];

  const nonJoinWhere = buildPipelineWhere(filters.filter(f => !f.spec.join), expr, transliterate);
  if (nonJoinWhere !== undefined) {
    conditions.push(nonJoinWhere);
  }

  for (const filter of filters.filter(f => f.spec.join)) {
    if (isClient) {
      const condition = buildClientJoinCondition(filter, joinValues?.get(filter.spec.name) ?? [], expr);
      if (condition !== undefined) {
        conditions.push(condition);
      }
    } else {
      const {define, condition} = buildAdminJoinCondition(filter, expr, transliterate);
      pipe = pipe.define(define);
      conditions.push(condition);
    }
  }

  const where = combineAnd(conditions, expr);
  if (where !== undefined) {
    pipe = pipe.where(where);
  }

  //#endregion

  if (querySort?.length) {
    pipe = pipe.sort(...querySort.map(([field, direction]) => {
      const orderingField = expr.field(field);
      return direction === "desc" ? expr.descending(orderingField) : expr.ascending(orderingField);
    }));
  }

  if (queryOffset && queryOffset > 0) {
    pipe = pipe.offset(queryOffset);
  }

  if (hasLimit) {
    pipe = pipe.limit(limit + 1);
  }

  const records = (await executePipeline(pipe)).results.map(result => result.data() as T);

  const next = hasLimit && records.length > limit;
  return {next, records: next ? records.slice(0, limit) : records};
}

//#region Joins

/**
 * Client join: the join query was already run "alongside" (`fetchJoin`) and produced a set of `resultField`
 * values; constrain the main field with an `in`, chunked + OR-combined exactly like the standard path.
 */
export function buildClientJoinCondition(filter: Filter.SpecRequired, values: any[], expr: PipelineExpr): any | undefined {

  const mainField = expr.field(resolveFieldName(filter));
  // Empty result means "match nothing"; an empty `equalAny([])` already does that.
  if (values.length === 0) {
    return mainField.equalAny([]);
  }

  const chunks = chunk(values, IN_CHUNK_SIZE);
  return combineOr(chunks.map(c => mainField.equalAny(c)), expr);
}

/**
 * Admin join: native correlated-existence subquery. For each outer row, count join docs that match the user's
 * filter on `dataField` AND whose `resultField` equals the outer `mainField`; keep rows where that count > 0.
 * Returns the `define` binding to add to the main pipeline plus the `where` condition.
 */
export function buildAdminJoinCondition(filter: Filter.SpecRequired, expr: PipelineExpr, transliterate: Transliterate): {define: any, condition: any} {

  const P = Firestore.admin().Pipelines as any;
  const join = filter.spec.join!;

  const mainField = resolveFieldName(filter);
  const varName = `__join_${filter.spec.name}`.replace(/[^A-Za-z0-9_]/g, "_");

  // The join source may already be a pipeline; otherwise build one from the (admin) query.
  let subPipe = Pipeline.isInstance(join.query) ? (join.query as any) : (join.query as any).firestore.pipeline().createFrom(join.query);

  const subFilter = buildFieldCondition(filter.operator, filter.spec.type, P.field(join.whereField || join.dataField), resolveValue(filter), expr, transliterate);
  if (subFilter !== undefined) {
    subPipe = subPipe.where(subFilter);
  }

  subPipe = subPipe
    .where(P.field(join.resultField).equal(P.variable(varName)))
    .aggregate(P.countAll().as("c"));

  return {
    define: expr.field(mainField).as(varName),
    condition: subPipe.toScalarExpression().greaterThan(0)
  };
}

function chunk<V>(arr: V[], size: number): V[][] {
  const chunks: V[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
}

//#endregion
