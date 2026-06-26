import { FirebaseApp } from "firebase/app";
import { Auth } from "firebase/auth";
import { AuthUser } from "./client-auth/AuthUser.js";
import { CollectionReference, CollectionReferenceAdmin, CollectionReferenceClient } from "./firestore/CollectionReference.js";
import { DocumentData } from "./firestore/DocumentData.js";
import { DocumentReference, DocumentReferenceAdmin, DocumentReferenceClient } from "./firestore/DocumentReference.js";
import { Firestore, FirestoreAdmin, FirestoreClient } from "./firestore/Firestore.js";
import { Pipeline, PipelineAdmin, PipelineClient } from "./firestore/Pipeline.js";
import { Query, QueryAdmin, QueryClient } from "./firestore/Query.js";
import { QueryConstraint, RestQueryConstraint } from "./firestore/QueryConstraint.js";
import { RestQuery } from "./firestore/rest.js";
/**
 * Abstrakcyjna klasa bazowa dla kontekstu Firebase, ujednolicająca dostęp do Firestore w różnych środowiskach.
 * Pozwala na pisanie kodu uniwersalnego, który może działać zarówno po stronie klienta (Web SDK), jak i serwera (Admin SDK).
 *
 * @category Context
 */
export declare abstract class UniversalFirebaseContext {
    /**
       * Zwraca domyślną instancję Firestore (klienta lub admina).
       */
    abstract firestore(databaseId?: string): Firestore;
    isFirestoreEmulator(): boolean;
    abstract firestoreQuery<T extends DocumentData = any>(path: string, ...queryConstraints: Array<QueryConstraint | undefined | false>): Query<T>;
    abstract firestoreQuery<T extends DocumentData = any>(collection: CollectionReference<T>, ...queryConstraints: Array<QueryConstraint | undefined | false>): Query<T>;
    /**
       * Zwraca referencję do kolekcji o podanej ścieżce.
       */
    abstract firestoreCollection<T extends DocumentData = any>(path: string): CollectionReference<T>;
    /**
       * Zwraca referencję do dokumentu o podanej ścieżce.
       */
    abstract firestoreDocument<T extends DocumentData = any>(path: string): DocumentReference<T>;
    abstract firestorePipeline(collectionOrQuery: string | CollectionReference | Query): Pipeline;
    /**
       * (Opcjonalnie) Zwraca URL do funkcji Cloud Function o podanej nazwie.
       */
    functionUrl?(name: string): string;
    /**
       * ID projektu Firebase.
       */
    abstract get projectId(): string;
}
/**
 * Implementacja kontekstu Firebase przeznaczona dla środowiska klienta (Web SDK).
 *
 * @category Context
 */
export declare abstract class FirebaseContextClient extends UniversalFirebaseContext {
    abstract get firebase(): FirebaseApp;
    abstract firestore(databaseId?: string): FirestoreClient;
    abstract get auth(): Auth;
    /**
       * Zwraca aktualnie zalogowanego użytkownika (tylko klient).
       */
    abstract get authUser(): AuthUser;
    /**
       * Wymagana implementacja generowania URL dla Cloud Functions na kliencie.
       */
    abstract functionUrl(name: string): string;
    functionCall<ResponseData = unknown, RequestData = unknown>(name: string, data?: RequestData): Promise<ResponseData>;
    /**
       * Specyficzne dla klienta zapytanie REST (np. dla optymalizacji lub omijania ograniczeń SDK).
       */
    firestoreRestQuery<T extends DocumentData = any>(path: string, ...queryConstraints: Array<RestQueryConstraint | undefined | false>): RestQuery<T>;
    firestoreQuery<T extends DocumentData = any>(path: string, ...queryConstraints: Array<QueryConstraint | undefined | false>): QueryClient<T>;
    firestoreQuery<T extends DocumentData = any>(collection: CollectionReferenceClient<T>, ...queryConstraints: Array<QueryConstraint | undefined | false>): QueryClient<T>;
    firestoreCollection<T extends DocumentData = any>(path: string): CollectionReferenceClient<T>;
    firestoreDocument<T extends DocumentData = any>(path: string): DocumentReferenceClient<T>;
    firestorePipeline(collectionOrQuery: string | CollectionReferenceClient | QueryClient): PipelineClient;
}
/**
 * Implementacja kontekstu Firebase przeznaczona dla środowiska serwera (Admin SDK).
 *
 * @category Context
 */
export declare abstract class FirebaseContextAdmin extends UniversalFirebaseContext {
    abstract firestore(databaseId?: string): FirestoreAdmin;
    firestoreQuery<T extends DocumentData = any>(path: string, ...queryConstraints: Array<QueryConstraint | undefined | false>): QueryAdmin<T>;
    firestoreQuery<T extends DocumentData = any>(collection: CollectionReferenceAdmin<T>, ...queryConstraints: Array<QueryConstraint | undefined | false>): QueryAdmin<T>;
    firestoreCollection<T extends DocumentData = any>(path: string): CollectionReferenceAdmin<T>;
    firestoreDocument<T extends DocumentData = any>(path: string): DocumentReferenceAdmin<T>;
    firestorePipeline(collectionOrQuery: string | CollectionReferenceAdmin | QueryAdmin): PipelineAdmin;
}
export type FirebaseContext = FirebaseContextClient | FirebaseContextAdmin;
