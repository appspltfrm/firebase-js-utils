import { DocumentData } from "./DocumentData";
import { Query, QueryAdmin, QueryClient } from "./Query";
import { QueryDocumentSnapshot, QueryDocumentSnapshotAdmin, QueryDocumentSnapshotClient } from "./QueryDocumentSnapshot";
export declare function getSnapshots<T = DocumentData>(query: QueryClient<T>): Promise<QueryDocumentSnapshotClient<T>[]>;
export declare function getSnapshots<T = DocumentData>(query: QueryAdmin<T>): Promise<QueryDocumentSnapshotAdmin<T>[]>;
export declare function getSnapshots<T = DocumentData>(query: Query<T>): Promise<QueryDocumentSnapshot<T>[]>;
