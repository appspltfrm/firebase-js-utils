import {AuthUser} from "./client-auth/AuthUser.js";
import {buildQuery} from "./firestore/buildQuery.js";
import {
  collectionReference,
  CollectionReference,
  CollectionReferenceAdmin,
  CollectionReferenceClient
} from "./firestore/CollectionReference.js";
import {DocumentData} from "./firestore/DocumentData.js";
import {
  documentReference,
  DocumentReference,
  DocumentReferenceAdmin,
  DocumentReferenceClient
} from "./firestore/DocumentReference.js";
import {Firestore, FirestoreAdmin, FirestoreClient} from "./firestore/Firestore.js";
import {Query, QueryAdmin, QueryClient} from "./firestore/Query.js";
import {QueryConstraint, RestQueryConstraint} from "./firestore/QueryConstraint.js";
import {RestQuery} from "./firestore/RestQuery.js";

/**
 * Abstrakcyjna klasa bazowa dla kontekstu Firebase, ujednolicająca dostęp do Firestore w różnych środowiskach.
 * Pozwala na pisanie kodu uniwersalnego, który może działać zarówno po stronie klienta (Web SDK), jak i serwera (Admin SDK).
 *
 * @category Context
 */
export abstract class UniversalFirebaseContext {

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
export abstract class FirebaseContextClient extends UniversalFirebaseContext {

  abstract get firestore(): FirestoreClient;

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
  firestoreRestQuery<T extends DocumentData = any>(path: string, ...queryConstraints: Array<RestQueryConstraint | undefined | false>): RestQuery<T> {
    return new RestQuery(this, path).apply(...queryConstraints);
  }

  firestoreQuery<T extends DocumentData = any>(path: string, ...queryConstraints: Array<QueryConstraint | undefined | false>): QueryClient<T>;

  firestoreQuery<T extends DocumentData = any>(collection: CollectionReferenceClient<T>, ...queryConstraints: Array<QueryConstraint | undefined | false>): QueryClient<T>;

  firestoreQuery<T extends DocumentData = any>(pathOrCollection: string | CollectionReferenceClient<T>, ...queryConstraints: Array<QueryConstraint | undefined | false>): QueryClient<T> {
    const collection: CollectionReference<T> = typeof pathOrCollection === "string" ? this.firestoreCollection(pathOrCollection) : pathOrCollection;
    return buildQuery(collection, ...queryConstraints);
  }

  firestoreCollection<T extends DocumentData = any>(path: string): CollectionReferenceClient<T> {
    return collectionReference(this.firestore, path);
  }

  firestoreDocument<T extends DocumentData = any>(path: string): DocumentReferenceClient<T> {
    return documentReference(this.firestore, path);
  }
}

/**
 * Implementacja kontekstu Firebase przeznaczona dla środowiska serwera (Admin SDK).
 *
 * @category Context
 */
export abstract class FirebaseContextAdmin extends UniversalFirebaseContext {
  abstract get firestore(): FirestoreAdmin;

  firestoreQuery<T extends DocumentData = any>(path: string, ...queryConstraints: Array<QueryConstraint | undefined | false>): QueryAdmin<T>;

  firestoreQuery<T extends DocumentData = any>(collection: CollectionReferenceAdmin<T>, ...queryConstraints: Array<QueryConstraint | undefined | false>): QueryAdmin<T>;

  firestoreQuery<T extends DocumentData = any>(pathOrCollection: string | CollectionReferenceAdmin<T>, ...queryConstraints: Array<QueryConstraint | undefined | false>): QueryAdmin<T> {
    const collection: CollectionReference<T> = typeof pathOrCollection === "string" ? this.firestoreCollection(pathOrCollection) : pathOrCollection;
    return buildQuery(collection, ...queryConstraints);
  }

  firestoreCollection<T extends DocumentData = any>(path: string): CollectionReferenceAdmin<T> {
    return collectionReference(this.firestore, path);
  }

  firestoreDocument<T extends DocumentData = any>(path: string): DocumentReferenceAdmin<T> {
    return documentReference(this.firestore, path);
  }
}

export type FirebaseContext = FirebaseContextClient | FirebaseContextAdmin;
