import {map, Observable} from "rxjs";
import {DocumentData} from "../DocumentData";
import {DocumentReference, DocumentReferenceAdmin, DocumentReferenceClient} from "../DocumentReference";
import {Query, QueryAdmin, QueryClient} from "../Query";
import {SnapshotListenOptions} from "../SnapshotListenOptions";
import {SnapshotOptions} from "../SnapshotOptions";
import {snapshotObservable} from "./snapshotObservable";

type Options = SnapshotOptions & SnapshotListenOptions;

export function dataObservable<T = DocumentData>(query: QueryClient<T>, options?: Options): Observable<T[]>;

export function dataObservable<T = DocumentData>(query: QueryAdmin<T>): Observable<T[]>;

export function dataObservable<T = DocumentData>(query: Query<T>, options?: Options): Observable<T[]>;

export function dataObservable<T = DocumentData>(doc: DocumentReferenceClient<T>, options?: Options): Observable<T>;

export function dataObservable<T = DocumentData>(doc: DocumentReferenceAdmin<T>): Observable<T>;

export function dataObservable<T = DocumentData>(doc: DocumentReference<T>, options?: Options): Observable<T>;

export function dataObservable<T = DocumentData>(docOrQuery: DocumentReference<T> | Query<T>, options?: Options): Observable<T | T[]> {

    if (Query.isInstance(docOrQuery)) {

        return snapshotObservable(docOrQuery, SnapshotListenOptions.extract(options))
            .pipe(map(snapshot => snapshot.docs.map(d => d.data(SnapshotOptions.extract(options)))));

    } else if (DocumentReference.isInstance(docOrQuery)) {

        return snapshotObservable(docOrQuery, SnapshotListenOptions.extract(options))
            .pipe(map(snapshot => snapshot.data()));

    } else {
        throw new Error("Invalid DocumentReference or Query object");
    }
}
