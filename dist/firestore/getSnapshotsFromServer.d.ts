import { DocumentData } from "./DocumentData.js";
import { Query, QueryAdmin, QueryClient } from "./Query.js";
import { QueryDocumentSnapshot, QueryDocumentSnapshotAdmin, QueryDocumentSnapshotClient } from "./QueryDocumentSnapshot.js";
export declare function getSnapshotsFromServer<T = DocumentData>(query: QueryClient<T>): Promise<QueryDocumentSnapshotClient<T>[]>;
export declare function getSnapshotsFromServer<T = DocumentData>(query: QueryAdmin<T>): Promise<QueryDocumentSnapshotAdmin<T>[]>;
export declare function getSnapshotsFromServer<T = DocumentData>(query: Query<T>): Promise<QueryDocumentSnapshot<T>[]>;
