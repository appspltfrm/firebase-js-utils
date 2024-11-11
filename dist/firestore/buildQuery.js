import { query as queryClient } from "@firebase/firestore";
import { endAt, endBefore, limit, limitToLast, orderBy, startAfter, startAt, where, or, and } from "firebase/firestore";
import { Firestore } from "./Firestore.js";
import { Query } from "./Query.js";
export function buildQuery(query, ...queryConstraints) {
    if (Query.isClient(query)) {
        if (queryConstraints) {
            const buildOrAnd = (...whereConstraints) => {
                const constraints = [];
                for (const constraint of whereConstraints.filter(c => !!c)) {
                    const type = constraint[0];
                    const args = constraint.slice(1);
                    if (type === "where") {
                        constraints.push(where.call(where, ...args));
                    }
                    else if (type === "and") {
                        constraints.push(and.call(and, ...buildOrAnd(...args)));
                    }
                    else if (type === "or") {
                        constraints.push(or.call(or, ...buildOrAnd(...args)));
                    }
                }
                return constraints;
            };
            const constraints = [];
            for (const constraint of queryConstraints.filter(c => !!c)) {
                const type = constraint[0];
                const args = constraint.slice(1);
                if (type === "or") {
                    constraints.push(or.call(or, ...buildOrAnd(...args)));
                }
                else if (type === "and") {
                    constraints.push(and.call(and, ...buildOrAnd(...args)));
                }
                else if (type === "where") {
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
            let niu = query;
            const Filter = (Firestore.adminInitialized() && Firestore.admin().Filter);
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