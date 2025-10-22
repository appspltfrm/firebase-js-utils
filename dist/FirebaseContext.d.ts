import { AuthUser } from "./client-auth/AuthUser.js";
import { CollectionReference, CollectionReferenceAdmin, CollectionReferenceClient } from "./firestore/CollectionReference.js";
import { DocumentData } from "./firestore/DocumentData.js";
import { DocumentReference, DocumentReferenceAdmin, DocumentReferenceClient } from "./firestore/DocumentReference.js";
import { Firestore, FirestoreAdmin, FirestoreClient } from "./firestore/Firestore.js";
import { Query, QueryAdmin, QueryClient } from "./firestore/Query.js";
import { QueryConstraint, RestQueryConstraint } from "./firestore/QueryConstraint.js";
import { RestQuery } from "./firestore/RestQuery.js";
export declare abstract class UniversalFirebaseContext {
    abstract get firestore(): Firestore;
    abstract firestoreQuery<T = DocumentData>(path: string, ...queryConstraints: Array<QueryConstraint | undefined | false>): Query<T>;
    abstract firestoreQuery<T = DocumentData>(collection: CollectionReference<T>, ...queryConstraints: Array<QueryConstraint | undefined | false>): Query<T>;
    abstract firestoreCollection<T = DocumentData>(path: string): CollectionReference<T>;
    abstract firestoreDocument<T = DocumentData>(path: string): DocumentReference<T>;
    functionUrl?(name: string): string;
    abstract get projectId(): string;
}
export declare abstract class FirebaseContextClient extends UniversalFirebaseContext {
    abstract get firestore(): FirestoreClient;
    abstract get authUser(): AuthUser;
    abstract functionUrl(name: string): string;
    firestoreRestQuery<T = DocumentData>(path: string, ...queryConstraints: Array<RestQueryConstraint | undefined | false>): RestQuery<T>;
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
