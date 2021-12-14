import { DocumentData } from "./DocumentData";
import { Query, QueryAdmin, QueryClient } from "./Query";
import { QueryConstraint } from "./QueryConstraint";
export declare function buildQuery<T = DocumentData>(query: QueryClient<T>, ...queryConstraints: QueryConstraint[]): QueryClient<T>;
export declare function buildQuery<T = DocumentData>(query: QueryAdmin<T>, ...queryConstraints: QueryConstraint[]): QueryAdmin<T>;
export declare function buildQuery<T = DocumentData>(query: Query<T>, ...queryConstraints: QueryConstraint[]): Query<T>;
