import { DocumentData } from "./DocumentData.js";
import { Query, QueryAdmin, QueryClient } from "./Query.js";
import { QueryConstraint } from "./QueryConstraint.js";
export declare function buildQuery<T = DocumentData>(query: QueryClient<T>, ...queryConstraints: Array<QueryConstraint | undefined | false>): QueryClient<T>;
export declare function buildQuery<T = DocumentData>(query: QueryAdmin<T>, ...queryConstraints: Array<QueryConstraint | undefined | false>): QueryAdmin<T>;
export declare function buildQuery<T = DocumentData>(query: Query<T>, ...queryConstraints: Array<QueryConstraint | undefined | false>): Query<T>;
