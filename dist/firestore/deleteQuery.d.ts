import { Query, QueryAdmin, QueryClient } from "./Query.js";
export interface DeleteOptions {
    readLimit?: number;
    batch?: boolean;
    batchRetryCount?: number;
    batchRetryDelay?: number;
}
/**
 * Options in admin mode.
 */
export interface DeleteOptionsAdmin extends DeleteOptions {
    subcollections?: boolean;
}
export declare function deleteQuery(query: QueryAdmin<any>, options?: DeleteOptionsAdmin): any;
export declare function deleteQuery(query: QueryClient<any>, options?: DeleteOptions): any;
export declare function deleteQuery(query: Query<any>, options?: DeleteOptions): any;
