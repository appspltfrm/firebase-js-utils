import {query as queryClient, QueryConstraint as QueryConstraintClient} from "@firebase/firestore";
import {endAt, endBefore, limit, limitToLast, orderBy, startAfter, startAt, where, or, and} from "firebase/firestore";
import {DocumentData} from "./DocumentData.js";
import {Firestore} from "./Firestore.js";
import {Query, QueryAdmin, QueryClient} from "./Query.js";
import {
    QueryConstraint,
    QueryConstraintType,
    QueryConstraintWhere, QueryConstraintAndOr, RestQueryConstraint
} from "./QueryConstraint.js";
import {RestQuery} from "./RestQuery";

export function buildQuery<T = DocumentData>(query: QueryClient<T>, ...queryConstraints: Array<QueryConstraint | undefined | false>): QueryClient<T>;

export function buildQuery<T = DocumentData>(query: QueryAdmin<T>, ...queryConstraints: Array<QueryConstraint | undefined | false>): QueryAdmin<T>;

export function buildQuery<T = DocumentData>(query: Query<T>, ...queryConstraints: Array<QueryConstraint | undefined | false>): Query<T>;

export function buildQuery<T = DocumentData>(query: RestQuery<T>, ...queryConstraints: Array<RestQueryConstraint | undefined | false>): RestQuery<T>;

export function buildQuery<T = DocumentData>(query: Query<T> | RestQuery<T>, ...queryConstraints: Array<QueryConstraint | RestQueryConstraint | undefined | false>): Query<T> | RestQuery<T>;

export function buildQuery<T = DocumentData>(query: Query<T> | RestQuery<T>, ...queryConstraints: Array<QueryConstraint | RestQueryConstraint | undefined | false>): Query<T> | RestQuery<T> {

    if (query instanceof RestQuery) {
        return new RestQuery(query).apply(...queryConstraints as RestQueryConstraint[]);

    } else if (Query.isClient(query)) {

        if (queryConstraints) {

            const buildOrAnd = (...whereConstraints: Array<QueryConstraintWhere | QueryConstraintAndOr>) => {
                const constraints = [];
                for (const constraint of whereConstraints.filter(c => !!c)) {
                    const type = constraint[0] as "where" | "and" | "or";
                    const args = constraint.slice(1);
                    if (type === "where") {
                        constraints.push(where.call(where, ...args));
                    } else if (type === "and") {
                        constraints.push(and.call(and, ...buildOrAnd(...args as any)));
                    } else if (type === "or") {
                        constraints.push(or.call(or, ...buildOrAnd(...args as any)));
                    }
                }
                return constraints;
            }

            const constraints: QueryConstraintClient[] = [];
            for (const constraint of queryConstraints.filter(c => !!c) as QueryConstraint[]) {
                const type = constraint[0] as QueryConstraintType | "and" | "or";
                const args = constraint.slice(1);

                if (type === "or") {
                    constraints.push(or.call(or, ...buildOrAnd(...args as any)));
                } else if (type === "and") {
                    constraints.push(and.call(and, ...buildOrAnd(...args as any)));
                } else if (type === "where") {
                    constraints.push(where.call(where, ...args));
                } else if (type === "limit") {
                    constraints.push(limit.call(limit, ...args));
                } else if (type === "endBefore") {
                    constraints.push(endBefore.call(endBefore, ...args));
                } else if (type === "limitToLast") {
                    constraints.push(limitToLast.call(limitToLast, ...args));
                } else if (type === "orderBy") {
                    constraints.push(orderBy.call(orderBy, ...args));
                } else if (type === "startAfter") {
                    constraints.push(startAfter.call(startAfter, ...args));
                } else if (type === "startAt") {
                    constraints.push(startAt.call(startAt, ...args));
                } else if (type === "endAt") {
                    constraints.push(endAt.call(endAt, ...args));
                } else if (type === "select") {
                    throw new Error("Select query constraint is not supported");
                }
            }

            return queryClient(query, ...constraints);
        }

        return query;

    } else {

        if (queryConstraints) {
            let niu = query as QueryAdmin<T>;
            const Filter = (Firestore.adminInitialized() && Firestore.admin().Filter);

            const buildFilterWhere = (...whereConstraints: Array<QueryConstraintWhere | QueryConstraintAndOr>) => {
                const where = [];
                for (const constraint of whereConstraints.filter(c => !!c)) {
                    const type = constraint[0] as "where" | "and" | "or";
                    const args = constraint.slice(1);
                    if (type === "where") {
                        where.push(Filter.where.call(Filter.where, ...args));
                    } else if (type === "and") {
                        where.push(Filter.and.call(Filter.and, ...buildFilterWhere(...args as any)));
                    } else if (type === "or") {
                        where.push(Filter.or.call(Filter.or, ...buildFilterWhere(...args as any)));
                    }
                }
                return where;
            }

            for (const constraint of queryConstraints.filter(c => !!c) as QueryConstraint[]) {
                const type = constraint[0] as QueryConstraintType | "and" | "or" | "select";
                const args = constraint.slice(1);
                if (type === "or") {
                    niu = niu.where.call(niu, Filter.or(...buildFilterWhere(...args as any)));
                } else if (type === "and") {
                    niu = niu.where.call(niu, Filter.and(...buildFilterWhere(...args as any)));
                } else if (type === "where") {
                    niu = niu.where.call(niu, ...args);
                } else if (type === "limit") {
                    niu = niu.limit.call(niu, ...args);
                } else if (type === "endBefore") {
                    niu = niu.endBefore.call(niu, ...args);
                } else if (type === "limitToLast") {
                    niu = niu.limitToLast.call(niu, ...args);
                } else if (type === "orderBy") {
                    niu = niu.orderBy.call(niu, ...args);
                } else if (type === "startAfter") {
                    niu = niu.startAfter.call(niu, ...args);
                } else if (type === "startAt") {
                    niu = niu.startAt.call(niu, ...args);
                } else if (type === "endAt") {
                    niu = niu.endAt.call(niu, ...args);
                } else if (type === "select") {
                    niu = niu.select.call(niu, ...args);
                }
            }

            return niu;
        }

        return query;
    }
}
