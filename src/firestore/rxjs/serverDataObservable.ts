import {Observable} from "rxjs";
import {DocumentData} from "../DocumentData";
import {DocumentReference, DocumentReferenceAdmin, DocumentReferenceClient} from "../DocumentReference";
import {Query, QueryAdmin, QueryClient} from "../Query";
import {SnapshotListenOptions} from "../SnapshotListenOptions";
import {SnapshotOptions} from "../SnapshotOptions";
import {dataObservable} from "./dataObservable";

type Options = SnapshotOptions & SnapshotListenOptions;

export function serverDataObservable<T = DocumentData>(query: QueryClient<T>, options?: Options): Observable<T[]>;

export function serverDataObservable<T = DocumentData>(query: QueryAdmin<T>): Observable<T[]>;

export function serverDataObservable<T = DocumentData>(query: Query<T>, options?: Options): Observable<T[]>;

export function serverDataObservable<T = DocumentData>(doc: DocumentReferenceClient<T>, options?: Options): Observable<T>;

export function serverDataObservable<T = DocumentData>(doc: DocumentReferenceAdmin<T>): Observable<T>;

export function serverDataObservable<T = DocumentData>(doc: DocumentReference<T>, options?: Options): Observable<T>;

export function serverDataObservable<T = DocumentData>(docOrQuery: DocumentReference<T> | Query<T>, options?: Options): Observable<T | T[]> {
    return dataObservable(docOrQuery as any, Object.assign({skipCache: true}, options));
}
