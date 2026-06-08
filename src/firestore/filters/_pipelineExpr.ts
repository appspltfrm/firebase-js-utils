import {and as andClient, ascending as ascendingClient, constant as constantClient, descending as descendingClient, field as fieldClient, not as notClient, or as orClient} from "firebase/firestore/pipelines";
import {Firestore} from "../Firestore.js";
import {Pipeline} from "../Pipeline.js";

/**
 * Minimal set of standalone pipeline expression builders the filter translation needs.
 *
 * The comparison/array/string operators (`equal`, `greaterThan`, `arrayContainsAny`, `stringContains`,
 * `toLower`, `arrayLength`, ...) are identically named *methods* on the `Expression` returned by `field()`
 * in both the client (`firebase/firestore/pipelines`) and the admin (`@google-cloud/firestore` `Pipelines`)
 * SDKs, so they don't need to go through this seam. Only these top-level functions differ by import source.
 *
 * Values are intentionally typed as `any`: both SDKs expose their pipeline API with `any` externally, and a
 * single object can never satisfy both SDKs' nominal `Expression` types at once.
 */
export interface PipelineExpr {
  field(name: string): any;
  constant(value: any): any;
  and(first: any, second: any, ...more: any[]): any;
  or(first: any, second: any, ...more: any[]): any;
  not(condition: any): any;
  ascending(expr: any): any;
  descending(expr: any): any;
}

/**
 * Returns the expression builders bound to the SDK the given pipeline belongs to.
 *
 * Client builders are statically imported (same pattern as {@link Pipeline}/`executePipeline`). Admin builders
 * are read lazily from the initialized admin module reference so this file stays importable in the browser.
 */
export function getPipelineExpr(pipeline: Pipeline): PipelineExpr {

  if (Pipeline.isClient(pipeline)) {
    return {
      field: fieldClient,
      constant: constantClient,
      and: andClient as any,
      or: orClient as any,
      not: notClient,
      ascending: ascendingClient as any,
      descending: descendingClient as any
    };
  }

  const {field, constant, and, or, not, ascending, descending} = Firestore.admin().Pipelines;
  return {field, constant, and: and as any, or: or as any, not, ascending: ascending as any, descending: descending as any};
}

/**
 * Combines conditions with a logical AND, handling the SDK requirement of at least two operands.
 * Returns `undefined` for an empty list and the single condition unchanged for a list of one.
 */
export function combineAnd(conditions: any[], expr: PipelineExpr): any | undefined {
  if (conditions.length === 0) {
    return undefined;
  }
  if (conditions.length === 1) {
    return conditions[0];
  }
  return expr.and(conditions[0], conditions[1], ...conditions.slice(2));
}

/**
 * Combines conditions with a logical OR, with the same arity handling as {@link combineAnd}.
 */
export function combineOr(conditions: any[], expr: PipelineExpr): any | undefined {
  if (conditions.length === 0) {
    return undefined;
  }
  if (conditions.length === 1) {
    return conditions[0];
  }
  return expr.or(conditions[0], conditions[1], ...conditions.slice(2));
}
