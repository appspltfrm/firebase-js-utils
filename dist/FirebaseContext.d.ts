import { FirebaseApp } from "firebase/app";
import { Auth } from "firebase/auth";
import { AuthUser } from "./client-auth/AuthUser.js";
import { CollectionReference, CollectionReferenceAdmin, CollectionReferenceClient } from "./firestore/CollectionReference.js";
import { DocumentData } from "./firestore/DocumentData.js";
import { DocumentReference, DocumentReferenceAdmin, DocumentReferenceClient } from "./firestore/DocumentReference.js";
import { Firestore, FirestoreAdmin, FirestoreClient } from "./firestore/Firestore.js";
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
       * Zwraca instancję Firestore (klienta lub admina).
       */
    abstract get firestore(): Firestore;
    /**
       * Tworzy zapytanie Firestore na podstawie ścieżki lub istniejącej kolekcji oraz zestawu ograniczeń.
       * Automatycznie ujednolica składnię zapytań dla obu typów SDK.
       *
       * @param path Or collection reference.
       * @param queryConstraints Constraints to apply (where, orderBy, limit, etc.).
       */
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
    abstract get firestore(): FirestoreClient;
    abstract get auth(): Auth;
    /**
       * Zwraca aktualnie zalogowanego użytkownika (tylko klient).
       */
    abstract get authUser(): AuthUser;
    /**
       * Wymagana implementacja generowania URL dla Cloud Functions na kliencie.
       */
    abstract functionUrl(name: string): string;
    /**
       * Specyficzne dla klienta zapytanie REST (np. dla optymalizacji lub omijania ograniczeń SDK).
       */
    firestoreRestQuery<T extends DocumentData = any>(path: string, ...queryConstraints: Array<RestQueryConstraint | undefined | false>): RestQuery<T>;
    firestoreQuery<T extends DocumentData = any>(path: string, ...queryConstraints: Array<QueryConstraint | undefined | false>): QueryClient<T>;
    firestoreQuery<T extends DocumentData = any>(collection: CollectionReferenceClient<T>, ...queryConstraints: Array<QueryConstraint | undefined | false>): QueryClient<T>;
    firestoreCollection<T extends DocumentData = any>(path: string): CollectionReferenceClient<T>;
    firestoreDocument<T extends DocumentData = any>(path: string): DocumentReferenceClient<T>;
}
/**
 * Implementacja kontekstu Firebase przeznaczona dla środowiska serwera (Admin SDK).
 *
 * @category Context
 */
export declare abstract class FirebaseContextAdmin extends UniversalFirebaseContext {
    abstract get firestore(): FirestoreAdmin;
    firestoreQuery<T extends DocumentData = any>(path: string, ...queryConstraints: Array<QueryConstraint | undefined | false>): QueryAdmin<T>;
    firestoreQuery<T extends DocumentData = any>(collection: CollectionReferenceAdmin<T>, ...queryConstraints: Array<QueryConstraint | undefined | false>): QueryAdmin<T>;
    firestoreCollection<T extends DocumentData = any>(path: string): CollectionReferenceAdmin<T>;
    firestoreDocument<T extends DocumentData = any>(path: string): DocumentReferenceAdmin<T>;
}
export type FirebaseContext = FirebaseContextClient | FirebaseContextAdmin;
