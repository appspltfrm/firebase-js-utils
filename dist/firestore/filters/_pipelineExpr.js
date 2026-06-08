import { and as andClient, ascending as ascendingClient, constant as constantClient, descending as descendingClient, field as fieldClient, not as notClient, or as orClient } from "firebase/firestore/pipelines";
import { Firestore } from "../Firestore.js";
import { Pipeline } from "../Pipeline.js";
/**
 * Returns the expression builders bound to the SDK the given pipeline belongs to.
 *
 * Client builders are statically imported (same pattern as {@link Pipeline}/`executePipeline`). Admin builders
 * are read lazily from the initialized admin module reference so this file stays importable in the browser.
 */
export function getPipelineExpr(pipeline) {
    if (Pipeline.isClient(pipeline)) {
        return {
            field: fieldClient,
            constant: constantClient,
            and: andClient,
            or: orClient,
            not: notClient,
            ascending: ascendingClient,
            descending: descendingClient
        };
    }
    const { field, constant, and, or, not, ascending, descending } = Firestore.admin().Pipelines;
    return { field, constant, and: and, or: or, not, ascending: ascending, descending: descending };
}
/**
 * Combines conditions with a logical AND, handling the SDK requirement of at least two operands.
 * Returns `undefined` for an empty list and the single condition unchanged for a list of one.
 */
export function combineAnd(conditions, expr) {
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
export function combineOr(conditions, expr) {
    if (conditions.length === 0) {
        return undefined;
    }
    if (conditions.length === 1) {
        return conditions[0];
    }
    return expr.or(conditions[0], conditions[1], ...conditions.slice(2));
}
//# sourceMappingURL=_pipelineExpr.js.map