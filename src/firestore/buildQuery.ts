import {query as queryClient, QueryConstraint as QueryConstraintClient} from "@firebase/firestore";
import {endAt, endBefore, limit, limitToLast, orderBy, startAfter, startAt, where} from "firebase/firestore";
import {DocumentData} from "./DocumentData";
import {Query, QueryAdmin, QueryClient} from "./Query";
import {QueryConstraint, QueryConstraintType} from "./QueryConstraint";

export function buildQuery<T = DocumentData>(query: QueryClient<T>, ...queryConstraints: QueryConstraint[]): QueryClient<T>;

export function buildQuery<T = DocumentData>(query: QueryAdmin<T>, ...queryConstraints: QueryConstraint[]): QueryAdmin<T>;

export function buildQuery<T = DocumentData>(query: Query<T>, ...queryConstraints: QueryConstraint[]): Query<T>;

export function buildQuery<T = DocumentData>(query: Query<T>, ...queryConstraints: QueryConstraint[]): Query<T> {
    if (Query.isClient(query)) {

        if (queryConstraints) {

            const constraints: QueryConstraintClient[] = [];
            for (const constraint of queryConstraints.filter(c => !!c)) {
                const type = constraint[0] as QueryConstraintType;
                const args = constraint.slice(1);
                if (type === "where") {
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
                }
            }

            return queryClient(query, ...constraints);
        }

        return query;

    } else {

        if (queryConstraints) {
            let niu = query as QueryAdmin<T>;
            for (const constraint of queryConstraints.filter(c => !!c)) {
                const type = constraint[0] as QueryConstraintType;
                const args = constraint.slice(1);
                if (type === "where") {
                    niu = niu.where.call(niu, ...args);
                } else if (type === "limit") {
                    niu.limit.call(niu, ...args);
                } else if (type === "endBefore") {
                    niu.endBefore.call(niu, ...args);
                } else if (type === "limitToLast") {
                    niu.limitToLast.call(niu, ...args);
                } else if (type === "orderBy") {
                    niu.orderBy.call(niu, ...args);
                } else if (type === "startAfter") {
                    niu.startAfter.call(niu, ...args);
                } else if (type === "startAt") {
                    niu.startAt.call(niu, ...args);
                } else if (type === "endAt") {
                    niu.endAt.call(niu, ...args);
                }
            }

            return niu;
        }

        return query;
    }
}
