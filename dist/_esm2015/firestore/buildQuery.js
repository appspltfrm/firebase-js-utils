import { query as queryClient } from "@firebase/firestore";
import { endAt, endBefore, limit, limitToLast, orderBy, startAfter, startAt, where } from "firebase/firestore";
import { Query } from "./Query";
export function buildQuery(query, ...queryConstraints) {
    if (Query.isClient(query)) {
        if (queryConstraints) {
            const constraints = [];
            for (const constraint of queryConstraints) {
                const type = constraint[0];
                const args = constraint.slice(1);
                if (type === "where") {
                    constraints.push(where.call(where, ...args));
                }
                else if (type === "limit") {
                    constraints.push(limit.call(limit, ...args));
                }
                else if (type === "endBefore") {
                    constraints.push(endBefore.call(endBefore, ...args));
                }
                else if (type === "limitToLast") {
                    constraints.push(limitToLast.call(limitToLast, ...args));
                }
                else if (type === "orderBy") {
                    constraints.push(orderBy.call(orderBy, ...args));
                }
                else if (type === "startAfter") {
                    constraints.push(startAfter.call(startAfter, ...args));
                }
                else if (type === "startAt") {
                    constraints.push(startAt.call(startAt, ...args));
                }
                else if (type === "endAt") {
                    constraints.push(endAt.call(endAt, ...args));
                }
            }
            return queryClient(query, ...constraints);
        }
        return query;
    }
    else {
        if (queryConstraints) {
            for (const constraint of queryConstraints) {
                const type = constraint[0];
                const args = constraint.slice(1);
                if (type === "where") {
                    query.where.call(query, ...args);
                }
                else if (type === "limit") {
                    query.limit.call(query, ...args);
                }
                else if (type === "endBefore") {
                    query.endBefore.call(query, ...args);
                }
                else if (type === "limitToLast") {
                    query.limitToLast.call(query, ...args);
                }
                else if (type === "orderBy") {
                    query.orderBy.call(query, ...args);
                }
                else if (type === "startAfter") {
                    query.startAfter.call(query, ...args);
                }
                else if (type === "startAt") {
                    query.startAt.call(query, ...args);
                }
                else if (type === "endAt") {
                    query.endAt.call(query, ...args);
                }
            }
        }
        return query;
    }
}
//# sourceMappingURL=buildQuery.js.map