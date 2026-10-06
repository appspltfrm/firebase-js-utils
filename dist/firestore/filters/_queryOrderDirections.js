import { RestQuery } from "../rest.js";
/**
 * Best-effort read of the `orderBy` directions of a query, positional like a `startAfter` cursor. The REST
 * query exposes them; the client and admin SDKs only hold them in private fields, so those reads are
 * guarded and fall back to "no information" (an empty array — every position is then ascending).
 * Callers that know their sort should pass it explicitly instead of relying on this.
 */
export function queryOrderDirections(query) {
    if (query instanceof RestQuery) {
        return query.orderBy.map(order => order.direction === "DESCENDING" ? "desc" : "asc");
    }
    const internal = query;
    // firebase/firestore: Query._query.explicitOrderBy[] = {field, dir: "asc" | "desc"}
    const clientOrders = internal?._query?.explicitOrderBy;
    if (Array.isArray(clientOrders)) {
        return clientOrders.map(order => order?.dir === "desc" ? "desc" : "asc");
    }
    // firebase-admin/firestore: Query._queryOptions.fieldOrders[] = {field, direction: "ASCENDING" | "DESCENDING"}
    const adminOrders = internal?._queryOptions?.fieldOrders;
    if (Array.isArray(adminOrders)) {
        return adminOrders.map(order => order?.direction === "DESCENDING" ? "desc" : "asc");
    }
    return [];
}
//# sourceMappingURL=_queryOrderDirections.js.map