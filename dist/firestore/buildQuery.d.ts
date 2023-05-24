import { DocumentData } from "./DocumentData";
import { Query, QueryAdmin, QueryClient } from "./Query";
import { QueryConstraint } from "./QueryConstraint";
export declare function buildQuery<T = DocumentData>(query: QueryClient<T>, ...queryConstraints: Array<QueryConstraint | undefined | false>): QueryClient<T>;
export declare function buildQuery<T = DocumentData>(query: QueryAdmin<T>, ...queryConstraints: Array<QueryConstraint | undefined | false>): QueryAdmin<T>;
export declare function buildQuery<T = DocumentData>(query: Query<T>, ...queryConstraints: Array<QueryConstraint | undefined | false>): Query<T>;
