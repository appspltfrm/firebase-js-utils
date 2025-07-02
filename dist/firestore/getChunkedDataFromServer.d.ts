import { DocumentData } from "./DocumentData.js";
import { Query, QueryAdmin, QueryClient } from "./Query.js";
export declare function getChunkedDataFromServer<T = DocumentData>(query: QueryClient<T>, chunkSize: number): AsyncGenerator<T[]>;
export declare function getChunkedDataFromServer<T = DocumentData>(query: QueryAdmin<T>, chunkSize: number): AsyncGenerator<T[]>;
export declare function getChunkedDataFromServer<T = DocumentData>(query: Query<T>, chunkSize: number): AsyncGenerator<T[]>;
