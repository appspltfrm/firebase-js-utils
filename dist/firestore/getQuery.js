"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getQuery = void 0;
const firestore_1 = require("firebase/firestore");
const Query_1 = require("./Query");
function getQuery(query, ...queryConstraints) {
    if (Query_1.Query.isClient(query)) {
        if (queryConstraints) {
            const constraints = [];
            for (const constraint of queryConstraints) {
                const type = constraint[0];
                const args = constraint.slice(1);
                if (type === "where") {
                    constraints.push(firestore_1.where.call(firestore_1.where, ...args));
                }
                else if (type === "limit") {
                    constraints.push(firestore_1.limit.call(firestore_1.limit, ...args));
                }
                else if (type === "endBefore") {
                    constraints.push(firestore_1.endBefore.call(firestore_1.endBefore, ...args));
                }
                else if (type === "limitToLast") {
                    constraints.push(firestore_1.limitToLast.call(firestore_1.limitToLast, ...args));
                }
                else if (type === "orderBy") {
                    constraints.push(firestore_1.orderBy.call(firestore_1.orderBy, ...args));
                }
                else if (type === "startAfter") {
                    constraints.push(firestore_1.startAfter.call(firestore_1.startAfter, ...args));
                }
                else if (type === "startAt") {
                    constraints.push(firestore_1.startAt.call(firestore_1.startAt, ...args));
                }
                else if (type === "endAt") {
                    constraints.push(firestore_1.endAt.call(firestore_1.endAt, ...args));
                }
            }
            return (0, firestore_1.query)(query, ...constraints);
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
exports.getQuery = getQuery;
//# sourceMappingURL=getQuery.js.map