import {Observable} from "rxjs";
import {DocumentData} from "../DocumentData.js";
import {Query, QueryAdmin, QueryClient} from "../Query.js";
import {
    QueryDocumentSnapshot,
    QueryDocumentSnapshotAdmin,
    QueryDocumentSnapshotClient
} from "../QueryDocumentSnapshot.js";
import {SnapshotListenOptions} from "../SnapshotListenOptions.js";
import {snapshotsObservable} from "./snapshotsObservable";

type Options =  Omit<SnapshotListenOptions, "skipCache" | "includeMetadataChanges">;

export function serverSnapshotsObservable<T = DocumentData>(query: QueryClient<T>, options?: Options): Observable<QueryDocumentSnapshotClient<T>[]>;

export function serverSnapshotsObservable<T = DocumentData>(query: QueryAdmin<T>): Observable<QueryDocumentSnapshotAdmin<T>[]>;

export function serverSnapshotsObservable<T = DocumentData>(query: Query<T>, options?: Options): Observable<QueryDocumentSnapshot<T>[]>;

export function serverSnapshotsObservable<T = DocumentData>(query: Query<T>, options?: Options): Observable<QueryDocumentSnapshot<T>[]> {
    return snapshotsObservable(query, Object.assign({skipCache: true}, options));
}
