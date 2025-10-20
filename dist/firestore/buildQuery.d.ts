import { DocumentData } from "./DocumentData.js";
import { Query, QueryAdmin, QueryClient } from "./Query.js";
import { QueryConstraint, RestQueryConstraint } from "./QueryConstraint.js";
import { RestQuery } from "./RestQuery";
export declare function buildQuery<T = DocumentData>(query: QueryClient<T>, ...queryConstraints: Array<QueryConstraint | undefined | false>): QueryClient<T>;
export declare function buildQuery<T = DocumentData>(query: QueryAdmin<T>, ...queryConstraints: Array<QueryConstraint | undefined | false>): QueryAdmin<T>;
export declare function buildQuery<T = DocumentData>(query: Query<T>, ...queryConstraints: Array<QueryConstraint | undefined | false>): Query<T>;
export declare function buildQuery<T = DocumentData>(query: RestQuery<T>, ...queryConstraints: Array<RestQueryConstraint | undefined | false>): RestQuery<T>;
