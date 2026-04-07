import { DocumentData } from "./DocumentData.js";
import { Query, QueryAdmin, QueryClient } from "./Query.js";
import { RestQuery } from "./rest.js";
export declare function getChunkedDataFromServer<T extends DocumentData = any>(query: QueryClient<T>, chunkSize: number): AsyncGenerator<T[]>;
export declare function getChunkedDataFromServer<T extends DocumentData = any>(query: QueryAdmin<T>, chunkSize: number): AsyncGenerator<T[]>;
export declare function getChunkedDataFromServer<T extends DocumentData = any>(query: RestQuery<T>, chunkSize: number): AsyncGenerator<T[]>;
export declare function getChunkedDataFromServer<T extends DocumentData = any>(query: Query<T> | RestQuery<T>, chunkSize: number): AsyncGenerator<T[]>;
