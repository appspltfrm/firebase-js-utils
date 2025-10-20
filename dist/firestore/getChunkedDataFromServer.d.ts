import { DocumentData } from "./DocumentData.js";
import { Query, QueryAdmin, QueryClient } from "./Query.js";
import { RestQuery } from "./RestQuery";
export declare function getChunkedDataFromServer<T = DocumentData>(query: QueryClient<T>, chunkSize: number): AsyncGenerator<T[]>;
export declare function getChunkedDataFromServer<T = DocumentData>(query: QueryAdmin<T>, chunkSize: number): AsyncGenerator<T[]>;
export declare function getChunkedDataFromServer<T = DocumentData>(query: RestQuery<T>, chunkSize: number): AsyncGenerator<T[]>;
export declare function getChunkedDataFromServer<T = DocumentData>(query: Query<T> | RestQuery<T>, chunkSize: number): AsyncGenerator<T[]>;
