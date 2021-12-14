import { Observable } from "rxjs";
import { DocumentData } from "../DocumentData";
import { DocumentReference, DocumentReferenceAdmin, DocumentReferenceClient } from "../DocumentReference";
import { DocumentSnapshot, DocumentSnapshotAdmin, DocumentSnapshotClient } from "../DocumentSnapshot";
import { SnapshotListenOptions } from "firebase/firestore";
import { Query, QueryAdmin, QueryClient } from "../Query";
import { QuerySnapshot, QuerySnapshotAdmin, QuerySnapshotClient } from "../QuerySnapshot";
export declare function snapshotObservable<T = DocumentData>(query: QueryClient<T>, options?: SnapshotListenOptions): Observable<QuerySnapshotClient<T>>;
export declare function snapshotObservable<T = DocumentData>(query: QueryAdmin<T>): Observable<QuerySnapshotAdmin<T>>;
export declare function snapshotObservable<T = DocumentData>(query: Query<T>, options?: SnapshotListenOptions): Observable<QuerySnapshot<T>>;
export declare function snapshotObservable<T = DocumentData>(doc: DocumentReferenceClient<T>, options?: SnapshotListenOptions): Observable<DocumentSnapshotClient<T>>;
export declare function snapshotObservable<T = DocumentData>(doc: DocumentReferenceAdmin<T>): Observable<DocumentSnapshotAdmin<T>>;
export declare function snapshotObservable<T = DocumentData>(doc: DocumentReference<T>, options?: SnapshotListenOptions): Observable<DocumentSnapshot<T>>;
