import {AuthUser} from "./client-auth";
import {
    CollectionReference, CollectionReferenceAdmin, CollectionReferenceClient,
    DocumentData, DocumentReference, DocumentReferenceAdmin, DocumentReferenceClient,
    Firestore,
    FirestoreAdmin,
    FirestoreClient,
    getCollectionRef, getDocRef, getQuery, Query, QueryAdmin, QueryClient, QueryConstraint
} from "./firestore";

abstract class UniversalFirebaseContext {

    readonly firestore?: Firestore;

    abstract firestoreQuery<T = DocumentData>(path: string, ...queryConstraints: QueryConstraint[]): Query<T>;

    abstract firestoreQuery<T = DocumentData>(collection: CollectionReference<T>, ...queryConstraints: QueryConstraint[]): Query<T>;

    abstract firestoreCollection<T = DocumentData>(path: string): CollectionReference<T>;

    abstract firestoreDoc<T = DocumentData>(path: string): DocumentReference<T>;

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
        return getQuery(collection, ...queryConstraints);
    }

    firestoreCollection<T = DocumentData>(path: string): CollectionReferenceClient<T> {
        return getCollectionRef(this.firestore, path);
    }

    firestoreDoc<T = DocumentData>(path: string): DocumentReferenceClient<T> {
        return getDocRef(this.firestore, path);
    }
}

export abstract class FirebaseContextAdmin extends UniversalFirebaseContext {
    readonly firestore?: FirestoreAdmin;

    firestoreQuery<T = DocumentData>(path: string, ...queryConstraints: QueryConstraint[]): QueryAdmin<T>;

    firestoreQuery<T = DocumentData>(collection: CollectionReferenceAdmin<T>, ...queryConstraints: QueryConstraint[]): QueryAdmin<T>;

    firestoreQuery<T = DocumentData>(pathOrCollection: string | CollectionReferenceAdmin<T>, ...queryConstraints: QueryConstraint[]): QueryAdmin<T> {
        const collection: CollectionReference<T> = typeof pathOrCollection === "string" ? this.firestoreCollection(pathOrCollection) : pathOrCollection;
        return getQuery(collection, ...queryConstraints);
    }

    firestoreCollection<T = DocumentData>(path: string): CollectionReferenceAdmin<T> {
        return getCollectionRef(this.firestore, path);
    }

    firestoreDoc<T = DocumentData>(path: string): DocumentReferenceAdmin<T> {
        return getDocRef(this.firestore, path);
    }
}

export type FirebaseContext = FirebaseContextClient | FirebaseContextAdmin;
