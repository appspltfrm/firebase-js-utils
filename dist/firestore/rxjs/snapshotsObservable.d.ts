import { Observable } from "rxjs";
import { DocumentData } from "../DocumentData";
import { Query, QueryAdmin, QueryClient } from "../Query";
import { QueryDocumentSnapshot, QueryDocumentSnapshotAdmin, QueryDocumentSnapshotClient } from "../QueryDocumentSnapshot";
import { SnapshotListenOptions } from "../SnapshotListenOptions";
export declare function snapshotsObservable<T = DocumentData>(query: QueryClient<T>, options?: SnapshotListenOptions): Observable<QueryDocumentSnapshotClient<T>[]>;
export declare function snapshotsObservable<T = DocumentData>(query: QueryAdmin<T>): Observable<QueryDocumentSnapshotAdmin<T>[]>;
export declare function snapshotsObservable<T = DocumentData>(query: Query<T>, options?: SnapshotListenOptions): Observable<QueryDocumentSnapshot<T>[]>;
