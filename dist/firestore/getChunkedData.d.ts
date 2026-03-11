import { DocumentData } from "./DocumentData.js";
import { Query, QueryAdmin, QueryClient } from "./Query.js";
export declare function getChunkedData<T extends DocumentData = any>(query: QueryClient<T>, chunkSize: number): AsyncGenerator<T[]>;
export declare function getChunkedData<T extends DocumentData = any>(query: QueryAdmin<T>, chunkSize: number): AsyncGenerator<T[]>;
export declare function getChunkedData<T extends DocumentData = any>(query: Query<T>, chunkSize: number): AsyncGenerator<T[]>;
