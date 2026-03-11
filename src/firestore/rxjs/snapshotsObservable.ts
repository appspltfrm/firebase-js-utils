import {map, Observable} from "rxjs";
import {DocumentData} from "../DocumentData.js";
import {Query, QueryAdmin, QueryClient} from "../Query.js";
import {QueryDocumentSnapshot, QueryDocumentSnapshotAdmin, QueryDocumentSnapshotClient} from "../QueryDocumentSnapshot.js";
import {SnapshotListenOptions} from "../SnapshotListenOptions.js";
import {snapshotObservable} from "./snapshotObservable.js";

export function snapshotsObservable<T extends DocumentData = any>(query: QueryClient<T>, options?: SnapshotListenOptions): Observable<QueryDocumentSnapshotClient<T>[]>;

export function snapshotsObservable<T extends DocumentData = any>(query: QueryAdmin<T>): Observable<QueryDocumentSnapshotAdmin<T>[]>;

export function snapshotsObservable<T extends DocumentData = any>(query: Query<T>, options?: SnapshotListenOptions): Observable<QueryDocumentSnapshot<T>[]>;

export function snapshotsObservable<T extends DocumentData = any>(query: Query<T>, options?: SnapshotListenOptions): Observable<QueryDocumentSnapshot<T>[]> {
    return snapshotObservable(query, options)
        .pipe(map(snapshot => snapshot.docs));
}
