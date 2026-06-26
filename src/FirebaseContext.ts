import {FirebaseApp} from "firebase/app";
import {Auth} from "firebase/auth";
import {getFunctions, httpsCallableFromURL} from "firebase/functions";
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
import {Pipeline, PipelineAdmin, PipelineClient} from "./firestore/Pipeline.js";
import {Query, QueryAdmin, QueryClient} from "./firestore/Query.js";
import {QueryConstraint, RestQueryConstraint} from "./firestore/QueryConstraint.js";
import {restCollectionQuery, RestQuery} from "./firestore/rest.js";
import {serialize} from "./functions/serialize.js";
import {unserialize} from "./functions/unserialize.js";

/**
 * Abstrakcyjna klasa bazowa dla kontekstu Firebase, ujednolicająca dostęp do Firestore w różnych środowiskach.
 * Pozwala na pisanie kodu uniwersalnego, który może działać zarówno po stronie klienta (Web SDK), jak i serwera (Admin SDK).
 *
 * @category Context
 */
export abstract class UniversalFirebaseContext {

  /**
     * Zwraca domyślną instancję Firestore (klienta lub admina).
     */
  abstract firestore(databaseId?: string): Firestore;

  isFirestoreEmulator() {
    return false;
  }

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
export abstract class FirebaseContextClient extends UniversalFirebaseContext {

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

  async functionCall<ResponseData = unknown, RequestData = unknown>(name: string, data?: RequestData): Promise<ResponseData> {
    const func = httpsCallableFromURL<RequestData, ResponseData>(getFunctions(this.firebase), this.functionUrl(name));
    if (typeof data === "object") {
      data = serialize(data);
    }
    const resp = await func(data);
    if (typeof resp.data === "object") {
      return unserialize(resp.data);
    }
    return resp.data;
  }

  /**
     * Specyficzne dla klienta zapytanie REST (np. dla optymalizacji lub omijania ograniczeń SDK).
     */
  firestoreRestQuery<T extends DocumentData = any>(path: string, ...queryConstraints: Array<RestQueryConstraint | undefined | false>): RestQuery<T> {
    return restCollectionQuery<T>(this.firestore(), path).apply(...queryConstraints);
  }

  firestoreQuery<T extends DocumentData = any>(path: string, ...queryConstraints: Array<QueryConstraint | undefined | false>): QueryClient<T>;

  firestoreQuery<T extends DocumentData = any>(collection: CollectionReferenceClient<T>, ...queryConstraints: Array<QueryConstraint | undefined | false>): QueryClient<T>;

  firestoreQuery<T extends DocumentData = any>(pathOrCollection: string | CollectionReferenceClient<T>, ...queryConstraints: Array<QueryConstraint | undefined | false>): QueryClient<T> {
    const collection: CollectionReference<T> = typeof pathOrCollection === "string" ? this.firestoreCollection(pathOrCollection) : pathOrCollection;
    return buildQuery(collection, ...queryConstraints);
  }

  firestoreCollection<T extends DocumentData = any>(path: string): CollectionReferenceClient<T> {
    return collectionReference(this.firestore(), path);
  }

  firestoreDocument<T extends DocumentData = any>(path: string): DocumentReferenceClient<T> {
    return documentReference(this.firestore(), path);
  }

  firestorePipeline(collectionOrQuery: string | CollectionReferenceClient | QueryClient): PipelineClient {
    return this.firestore().pipeline().collection(typeof collectionOrQuery === "string" ? collectionReference(this.firestore(), collectionOrQuery) : collectionOrQuery);
  }
}

/**
 * Implementacja kontekstu Firebase przeznaczona dla środowiska serwera (Admin SDK).
 *
 * @category Context
 */
export abstract class FirebaseContextAdmin extends UniversalFirebaseContext {
  abstract firestore(databaseId?: string): FirestoreAdmin;

  firestoreQuery<T extends DocumentData = any>(path: string, ...queryConstraints: Array<QueryConstraint | undefined | false>): QueryAdmin<T>;

  firestoreQuery<T extends DocumentData = any>(collection: CollectionReferenceAdmin<T>, ...queryConstraints: Array<QueryConstraint | undefined | false>): QueryAdmin<T>;

  firestoreQuery<T extends DocumentData = any>(pathOrCollection: string | CollectionReferenceAdmin<T>, ...queryConstraints: Array<QueryConstraint | undefined | false>): QueryAdmin<T> {
    const collection: CollectionReference<T> = typeof pathOrCollection === "string" ? this.firestoreCollection(pathOrCollection) : pathOrCollection;
    return buildQuery(collection, ...queryConstraints);
  }

  firestoreCollection<T extends DocumentData = any>(path: string): CollectionReferenceAdmin<T> {
    return collectionReference(this.firestore(), path);
  }

  firestoreDocument<T extends DocumentData = any>(path: string): DocumentReferenceAdmin<T> {
    return documentReference(this.firestore(), path);
  }

  firestorePipeline(collectionOrQuery: string | CollectionReferenceAdmin | QueryAdmin): PipelineAdmin {

    const pipeline = this.firestore("enterprise").pipeline();

    if (typeof collectionOrQuery === "string") {
      return pipeline.collection(this.firestoreCollection(collectionOrQuery));
    } else if ((collectionOrQuery as CollectionReferenceAdmin).path) {
      return pipeline.collection(collectionOrQuery as CollectionReferenceAdmin);
    } else {
      return pipeline.createFrom(collectionOrQuery);
    }
  }
}

export type FirebaseContext = FirebaseContextClient | FirebaseContextAdmin;
