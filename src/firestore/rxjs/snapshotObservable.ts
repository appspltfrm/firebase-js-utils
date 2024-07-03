import firebase from "firebase/compat";
import {Observable, Subscriber} from "rxjs";
import {DocumentData} from "../DocumentData";
import {DocumentReference, DocumentReferenceAdmin, DocumentReferenceClient} from "../DocumentReference";
import {DocumentSnapshot, DocumentSnapshotAdmin, DocumentSnapshotClient} from "../DocumentSnapshot";
import {onSnapshot, SnapshotListenOptions as FirestoreSnapshotListenOptions} from "firebase/firestore";
import {Query, QueryAdmin, QueryClient} from "../Query";
import {QuerySnapshot, QuerySnapshotAdmin, QuerySnapshotClient} from "../QuerySnapshot";
import {SnapshotListenOptions} from "../SnapshotListenOptions";

export function snapshotObservable<T = DocumentData>(query: QueryClient<T>, options?: SnapshotListenOptions): Observable<QuerySnapshotClient<T>>;

export function snapshotObservable<T = DocumentData>(query: QueryAdmin<T>): Observable<QuerySnapshotAdmin<T>>;

export function snapshotObservable<T = DocumentData>(query: Query<T>, options?: SnapshotListenOptions): Observable<QuerySnapshot<T>>;

export function snapshotObservable<T = DocumentData>(doc: DocumentReferenceClient<T>, options?: SnapshotListenOptions): Observable<DocumentSnapshotClient<T>>;

export function snapshotObservable<T = DocumentData>(doc: DocumentReferenceAdmin<T>): Observable<DocumentSnapshotAdmin<T>>;

export function snapshotObservable<T = DocumentData>(doc: DocumentReference<T>, options?: SnapshotListenOptions): Observable<DocumentSnapshot<T>>;

export function snapshotObservable<T = DocumentData>(docOrQuery: DocumentReference<T> | Query<T>, options?: SnapshotListenOptions): Observable<DocumentSnapshot<T> | QuerySnapshot<T>> {

    if (!(Query.isInstance(docOrQuery) || DocumentReference.isInstance(docOrQuery))) {
        throw new Error("Invalid DocumentReference or Query object");
    }

    return new Observable(subscriber => {

        let hasValue = false;

        const handleNext = (snapshot: any) => {
            hasValue = true;
            subscriber.next(snapshot);
        }

        const handleError = (error: any) => {
            if (options?.skipErrors !== false && hasValue) {
                console.warn(error);
            } else {
                subscriber.error(error);
            }
        }

        if (Query.isInstance(docOrQuery)) {
            if (Query.isClient(docOrQuery)) {
                const unsubscribe = onSnapshot(docOrQuery, extractSnapshotListen(options), handleNext, handleError)
                return () => unsubscribe();
            } else {
                const unsubscribe = docOrQuery.onSnapshot(handleNext, handleError);
                return () => unsubscribe();
            }

        } else if (DocumentReference.isInstance(docOrQuery)) {
            if (DocumentReference.isClient(docOrQuery)) {
                const unsubscribe = onSnapshot(docOrQuery, extractSnapshotListen(options), handleNext, handleError);
                return () => unsubscribe();
            } else if (DocumentReference.isAdmin(docOrQuery)) {
                const unsubscribe = docOrQuery.onSnapshot(handleNext, handleError);
                return () => unsubscribe();
            }

        }
    });

}

function extractSnapshotListen(options: Partial<SnapshotListenOptions>): FirestoreSnapshotListenOptions {

    if (!options) {
        return {};
    }

    return Object.assign({}, "includeMetadataChanges" in options ? {"includeMetadataChanges": options.includeMetadataChanges} : undefined);
}
