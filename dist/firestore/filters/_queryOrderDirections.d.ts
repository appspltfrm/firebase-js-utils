import { Query } from "../Query.js";
import { RestQuery } from "../rest.js";
import type { CursorDirection } from "./_compareCursorValues.js";
/**
 * Best-effort read of the `orderBy` directions of a query, positional like a `startAfter` cursor. The REST
 * query exposes them; the client and admin SDKs only hold them in private fields, so those reads are
 * guarded and fall back to "no information" (an empty array — every position is then ascending).
 * Callers that know their sort should pass it explicitly instead of relying on this.
 */
export declare function queryOrderDirections(query: Query | RestQuery): CursorDirection[];
