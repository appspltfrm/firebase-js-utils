import { Observable } from "rxjs";
import { DocumentData } from "../DocumentData.js";
import { Query, QueryAdmin, QueryClient } from "../Query.js";
import { QueryDocumentSnapshot, QueryDocumentSnapshotAdmin, QueryDocumentSnapshotClient } from "../QueryDocumentSnapshot.js";
import { SnapshotListenOptions } from "../SnapshotListenOptions.js";
export declare function snapshotsObservable<T = DocumentData>(query: QueryClient<T>, options?: SnapshotListenOptions): Observable<QueryDocumentSnapshotClient<T>[]>;
export declare function snapshotsObservable<T = DocumentData>(query: QueryAdmin<T>): Observable<QueryDocumentSnapshotAdmin<T>[]>;
export declare function snapshotsObservable<T = DocumentData>(query: Query<T>, options?: SnapshotListenOptions): Observable<QueryDocumentSnapshot<T>[]>;
