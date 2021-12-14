import {AuthUser} from "./client-auth";
import {
    buildQuery,
    collectionReference,
    CollectionReference, CollectionReferenceAdmin, CollectionReferenceClient,
    DocumentData, documentReference, DocumentReference, DocumentReferenceAdmin, DocumentReferenceClient,
    Firestore,
    FirestoreAdmin,
    FirestoreClient,
    Query, QueryAdmin, QueryClient, QueryConstraint
} from "./firestore";

abstract class UniversalFirebaseContext {

    readonly firestore?: Firestore;

    abstract firestoreQuery<T = DocumentData>(path: string, ...queryConstraints: QueryConstraint[]): Query<T>;

    abstract firestoreQuery<T = DocumentData>(collection: CollectionReference<T>, ...queryConstraints: QueryConstraint[]): Query<T>;

    abstract firestoreCollection<T = DocumentData>(path: string): CollectionReference<T>;

    abstract firestoreDocument<T = DocumentData>(path: string): DocumentReference<T>;

    functionUrl?: (name: string) => string;

    readonly projectId: string;
}

export abstract class FirebaseContextClient extends UniversalFirebaseContext {

    readonly firestore?: FirestoreClient;
    readonly authUser?: AuthUser;

    firestoreQuery<T = DocumentData>(path: string, ...queryConstraints: QueryConstraint[]): QueryClient<T>;

    firestoreQuery<T = DocumentData>(collection: CollectionReferenceClient<T>, ...queryConstraints: QueryConstraint[]): QueryClient<T>;

    firestoreQuery<T = DocumentData>(pathOrCollection: string | CollectionReferenceClient<T>, ...queryConstraints: QueryConstraint[]): QueryClient<T> {
        const collection: CollectionReference<T> = typeof pathOrCollection === "string" ? this.firestoreCollection(pathOrCollection) : pathOrCollection;
        return buildQuery(collection, ...queryConstraints);
    }

    firestoreCollection<T = DocumentData>(path: string): CollectionReferenceClient<T> {
        return collectionReference(this.firestore, path);
    }

    firestoreDocument<T = DocumentData>(path: string): DocumentReferenceClient<T> {
        return documentReference(this.firestore, path);
    }
}

export abstract class FirebaseContextAdmin extends UniversalFirebaseContext {
    readonly firestore?: FirestoreAdmin;

    firestoreQuery<T = DocumentData>(path: string, ...queryConstraints: QueryConstraint[]): QueryAdmin<T>;

    firestoreQuery<T = DocumentData>(collection: CollectionReferenceAdmin<T>, ...queryConstraints: QueryConstraint[]): QueryAdmin<T>;

    firestoreQuery<T = DocumentData>(pathOrCollection: string | CollectionReferenceAdmin<T>, ...queryConstraints: QueryConstraint[]): QueryAdmin<T> {
        const collection: CollectionReference<T> = typeof pathOrCollection === "string" ? this.firestoreCollection(pathOrCollection) : pathOrCollection;
        return buildQuery(collection, ...queryConstraints);
    }

    firestoreCollection<T = DocumentData>(path: string): CollectionReferenceAdmin<T> {
        return collectionReference(this.firestore, path);
    }

    firestoreDocument<T = DocumentData>(path: string): DocumentReferenceAdmin<T> {
        return documentReference(this.firestore, path);
    }
}

export type FirebaseContext = FirebaseContextClient | FirebaseContextAdmin;
