import {map, Observable} from "rxjs";
import {DocumentData} from "../DocumentData.js";
import {DocumentReference, DocumentReferenceAdmin, DocumentReferenceClient} from "../DocumentReference.js";
import {Query, QueryAdmin, QueryClient} from "../Query.js";
import {SnapshotListenOptions} from "../SnapshotListenOptions.js";
import {SnapshotOptions} from "../SnapshotOptions.js";
import {snapshotObservable} from "./snapshotObservable.js";

type Options = SnapshotOptions & SnapshotListenOptions

export function dataObservable<T = DocumentData>(query: QueryClient<T>, options?: Options): Observable<T[]>;

export function dataObservable<T = DocumentData>(query: QueryAdmin<T>): Observable<T[]>;

export function dataObservable<T = DocumentData>(query: Query<T>, options?: Options): Observable<T[]>;

export function dataObservable<T = DocumentData>(doc: DocumentReferenceClient<T>, options?: Options): Observable<T>;

export function dataObservable<T = DocumentData>(doc: DocumentReferenceAdmin<T>): Observable<T>;

export function dataObservable<T = DocumentData>(doc: DocumentReference<T>, options?: Options): Observable<T>;

export function dataObservable<T = DocumentData>(docOrQuery: DocumentReference<T> | Query<T>, options?: Options): Observable<T | T[]> {

    if (Query.isInstance(docOrQuery)) {
        return snapshotObservable(docOrQuery, options)
            .pipe(map(snapshot => snapshot.docs.map(d => d.data(SnapshotOptions.extract(options)))));

    } else if (DocumentReference.isInstance(docOrQuery)) {
        return snapshotObservable(docOrQuery, options)
            .pipe(map(snapshot => snapshot.data()));

    } else {
        throw new Error("Invalid DocumentReference or Query object");
    }
}
