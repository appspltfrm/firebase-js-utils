"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildQuery = buildQuery;
const firestore_1 = require("@firebase/firestore");
const firestore_2 = require("firebase/firestore");
const Firestore_1 = require("./Firestore");
const Query_1 = require("./Query");
function buildQuery(query, ...queryConstraints) {
    if (Query_1.Query.isClient(query)) {
        if (queryConstraints) {
            const buildOrAnd = (...whereConstraints) => {
                const constraints = [];
                for (const constraint of whereConstraints.filter(c => !!c)) {
                    const type = constraint[0];
                    const args = constraint.slice(1);
                    if (type === "where") {
                        constraints.push(firestore_2.where.call(firestore_2.where, ...args));
                    }
                    else if (type === "and") {
                        constraints.push(firestore_2.and.call(firestore_2.and, ...buildOrAnd(...args)));
                    }
                    else if (type === "or") {
                        constraints.push(firestore_2.or.call(firestore_2.or, ...buildOrAnd(...args)));
                    }
                }
                return constraints;
            };
            const constraints = [];
            for (const constraint of queryConstraints.filter(c => !!c)) {
                const type = constraint[0];
                const args = constraint.slice(1);
                if (type === "or") {
                    constraints.push(firestore_2.or.call(firestore_2.or, ...buildOrAnd(...args)));
                }
                else if (type === "and") {
                    constraints.push(firestore_2.and.call(firestore_2.and, ...buildOrAnd(...args)));
                }
                else if (type === "where") {
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
            let niu = query;
            const Filter = (Firestore_1.Firestore.adminInitialized() && Firestore_1.Firestore.admin().Filter);
            const buildFilterWhere = (...whereConstraints) => {
                const where = [];
                for (const constraint of whereConstraints.filter(c => !!c)) {
                    const type = constraint[0];
                    const args = constraint.slice(1);
                    if (type === "where") {
                        where.push(Filter.where.call(Filter.where, ...args));
                    }
                    else if (type === "and") {
                        where.push(Filter.and.call(Filter.and, ...buildFilterWhere(...args)));
                    }
                    else if (type === "or") {
                        where.push(Filter.or.call(Filter.or, ...buildFilterWhere(...args)));
                    }
                }
                return where;
            };
            for (const constraint of queryConstraints.filter(c => !!c)) {
                const type = constraint[0];
                const args = constraint.slice(1);
                if (type === "or") {
                    niu = niu.where.call(niu, Filter.or(...buildFilterWhere(...args)));
                }
                else if (type === "and") {
                    niu = niu.where.call(niu, Filter.and(...buildFilterWhere(...args)));
                }
                else if (type === "where") {
                    niu = niu.where.call(niu, ...args);
                }
                else if (type === "limit") {
                    niu = niu.limit.call(niu, ...args);
                }
                else if (type === "endBefore") {
                    niu = niu.endBefore.call(niu, ...args);
                }
                else if (type === "limitToLast") {
                    niu = niu.limitToLast.call(niu, ...args);
                }
                else if (type === "orderBy") {
                    niu = niu.orderBy.call(niu, ...args);
                }
                else if (type === "startAfter") {
                    niu = niu.startAfter.call(niu, ...args);
                }
                else if (type === "startAt") {
                    niu = niu.startAt.call(niu, ...args);
                }
                else if (type === "endAt") {
                    niu = niu.endAt.call(niu, ...args);
                }
            }
            return niu;
        }
        return query;
    }
}
//# sourceMappingURL=buildQuery.js.map