import { DocumentData } from "./DocumentData.js";
import { Query, QueryAdmin, QueryClient } from "./Query.js";
import { QueryDocumentSnapshot, QueryDocumentSnapshotAdmin, QueryDocumentSnapshotClient } from "./QueryDocumentSnapshot.js";
export declare function getChunkedSnapshotsFromCache<T = DocumentData>(query: QueryClient<T>, chunkSize: number): AsyncGenerator<QueryDocumentSnapshotClient<T>[]>;
export declare function getChunkedSnapshotsFromCache<T = DocumentData>(query: QueryAdmin<T>, chunkSize: number): AsyncGenerator<QueryDocumentSnapshotAdmin<T>[]>;
export declare function getChunkedSnapshotsFromCache<T = DocumentData>(query: Query<T>, chunkSize: number): AsyncGenerator<QueryDocumentSnapshot<T>[]>;
