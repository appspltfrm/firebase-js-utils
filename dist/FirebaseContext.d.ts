import { AuthUser } from "./client-auth";
import { CollectionReference, CollectionReferenceAdmin, CollectionReferenceClient, DocumentData, DocumentReference, DocumentReferenceAdmin, DocumentReferenceClient, Firestore, FirestoreAdmin, FirestoreClient, Query, QueryAdmin, QueryClient, QueryConstraint } from "./firestore";
declare abstract class UniversalFirebaseContext {
    abstract get firestore(): Firestore;
    abstract firestoreQuery<T = DocumentData>(path: string, ...queryConstraints: Array<QueryConstraint | undefined | false>): Query<T>;
    abstract firestoreQuery<T = DocumentData>(collection: CollectionReference<T>, ...queryConstraints: Array<QueryConstraint | undefined | false>): Query<T>;
    abstract firestoreCollection<T = DocumentData>(path: string): CollectionReference<T>;
    abstract firestoreDocument<T = DocumentData>(path: string): DocumentReference<T>;
    functionUrl?(name: string): string;
    readonly projectId: string;
}
export declare abstract class FirebaseContextClient extends UniversalFirebaseContext {
    abstract get firestore(): FirestoreClient;
    abstract get authUser(): AuthUser;
    abstract functionUrl(name: string): string;
    firestoreQuery<T = DocumentData>(path: string, ...queryConstraints: Array<QueryConstraint | undefined | false>): QueryClient<T>;
    firestoreQuery<T = DocumentData>(collection: CollectionReferenceClient<T>, ...queryConstraints: Array<QueryConstraint | undefined | false>): QueryClient<T>;
    firestoreCollection<T = DocumentData>(path: string): CollectionReferenceClient<T>;
    firestoreDocument<T = DocumentData>(path: string): DocumentReferenceClient<T>;
}
export declare abstract class FirebaseContextAdmin extends UniversalFirebaseContext {
    abstract get firestore(): FirestoreAdmin;
    firestoreQuery<T = DocumentData>(path: string, ...queryConstraints: QueryConstraint[]): QueryAdmin<T>;
    firestoreQuery<T = DocumentData>(collection: CollectionReferenceAdmin<T>, ...queryConstraints: QueryConstraint[]): QueryAdmin<T>;
    firestoreCollection<T = DocumentData>(path: string): CollectionReferenceAdmin<T>;
    firestoreDocument<T = DocumentData>(path: string): DocumentReferenceAdmin<T>;
}
export type FirebaseContext = FirebaseContextClient | FirebaseContextAdmin;
export {};
