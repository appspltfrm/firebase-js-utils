import { DocumentData } from "./DocumentData.js";
import { Query, QueryAdmin, QueryClient } from "./Query.js";
import { QueryConstraint, RestQueryConstraint } from "./QueryConstraint.js";
import { RestQuery } from "./rest.js";
export declare function buildQuery<T extends DocumentData = any>(query: QueryClient<T>, ...queryConstraints: Array<QueryConstraint | undefined | false>): QueryClient<T>;
export declare function buildQuery<T extends DocumentData = any>(query: QueryAdmin<T>, ...queryConstraints: Array<QueryConstraint | undefined | false>): QueryAdmin<T>;
export declare function buildQuery<T extends DocumentData = any>(query: Query<T>, ...queryConstraints: Array<QueryConstraint | undefined | false>): Query<T>;
export declare function buildQuery<T extends DocumentData = any>(query: RestQuery<T>, ...queryConstraints: Array<RestQueryConstraint | undefined | false>): RestQuery<T>;
export declare function buildQuery<T extends DocumentData = any>(query: Query<T> | RestQuery<T>, ...queryConstraints: Array<QueryConstraint | RestQueryConstraint | undefined | false>): Query<T> | RestQuery<T>;
