"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildQuery = void 0;
const firestore_1 = require("@firebase/firestore");
const firestore_2 = require("firebase/firestore");
const Query_1 = require("./Query");
function buildQuery(query, ...queryConstraints) {
    if (Query_1.Query.isClient(query)) {
        if (queryConstraints) {
            const constraints = [];
            for (const constraint of queryConstraints) {
                const type = constraint[0];
                const args = constraint.slice(1);
                if (type === "where") {
                    constraints.push(firestore_2.where.call(firestore_2.where, ...args));
                }
                else if (type === "limit") {
                    constraints.push(firestore_2.limit.call(firestore_2.limit, ...args));
                }
                else if (type === "endBefore") {
                    constraints.push(firestore_2.endBefore.call(firestore_2.endBefore, ...args));
                }
                else if (type === "limitToLast") {
                    constraints.push(firestore_2.limitToLast.call(firestore_2.limitToLast, ...args));
                }
                else if (type === "orderBy") {
                    constraints.push(firestore_2.orderBy.call(firestore_2.orderBy, ...args));
                }
                else if (type === "startAfter") {
                    constraints.push(firestore_2.startAfter.call(firestore_2.startAfter, ...args));
                }
                else if (type === "startAt") {
                    constraints.push(firestore_2.startAt.call(firestore_2.startAt, ...args));
                }
                else if (type === "endAt") {
                    constraints.push(firestore_2.endAt.call(firestore_2.endAt, ...args));
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
exports.buildQuery = buildQuery;
//# sourceMappingURL=buildQuery.js.map