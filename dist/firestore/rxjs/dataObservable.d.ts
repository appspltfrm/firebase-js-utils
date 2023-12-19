import { Observable } from "rxjs";
import { DocumentData } from "../DocumentData";
import { DocumentReference, DocumentReferenceAdmin, DocumentReferenceClient } from "../DocumentReference";
import { Query, QueryAdmin, QueryClient } from "../Query";
import { SnapshotListenOptions } from "../SnapshotListenOptions";
import { SnapshotOptions } from "../SnapshotOptions";
declare type Options = SnapshotOptions & SnapshotListenOptions & {
    skipCache?: boolean;
};
export declare function dataObservable<T = DocumentData>(query: QueryClient<T>, options?: Options): Observable<T[]>;
export declare function dataObservable<T = DocumentData>(query: QueryAdmin<T>): Observable<T[]>;
export declare function dataObservable<T = DocumentData>(query: Query<T>, options?: Options): Observable<T[]>;
export declare function dataObservable<T = DocumentData>(doc: DocumentReferenceClient<T>, options?: Options): Observable<T>;
export declare function dataObservable<T = DocumentData>(doc: DocumentReferenceAdmin<T>): Observable<T>;
export declare function dataObservable<T = DocumentData>(doc: DocumentReference<T>, options?: Options): Observable<T>;
export {};
