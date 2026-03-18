import type {firestore as admin} from "firebase-admin";
import {doc, DocumentReference as $DocumentReferenceClient} from "firebase/firestore";
import {DocumentData} from "./DocumentData.js";
import {Firestore, FirestoreAdmin, FirestoreClient} from "./Firestore.js";

export type DocumentReferenceClient<T extends DocumentData = any> = $DocumentReferenceClient<T>;
export type DocumentReferenceAdmin<T extends DocumentData = any> = admin.DocumentReference<T>;

/**
 * Polimorficzna referencja do dokumentu Firestore.
 */
export type DocumentReference<T extends DocumentData = any> = DocumentReferenceAdmin<T> | DocumentReferenceClient<T>;

export namespace DocumentReference {

  /**
     * Sprawdza, czy obiekt jest instancją referencji do dokumentu (klienta lub admina).
     */
  export function isInstance<T extends DocumentData = any>(obj: any): obj is DocumentReference<T> {
    return obj instanceof $DocumentReferenceClient || (Firestore.adminInitialized() && obj instanceof Firestore.admin().DocumentReference);
  }

  /**
     * Sprawdza, czy referencja pochodzi z Web SDK.
     */
  export function isClient<T extends DocumentData = any>(ref: DocumentReference<T>): ref is DocumentReferenceClient<T> {
    return Firestore.isClient(ref.firestore);
  }

  /**
     * Sprawdza, czy referencja pochodzi z Admin SDK.
     */
  export function isAdmin<T extends DocumentData = any>(ref: DocumentReference<T>): ref is DocumentReferenceAdmin<T> {
    return !isClient(ref);
  }
}

/**
 * Tworzy uniwersalną referencję do dokumentu Firestore na podstawie instancji Firestore i ścieżki.
 */
export function documentReference<T extends DocumentData = any>(firestore: FirestoreClient, path: string): DocumentReferenceClient<T>;

export function documentReference<T extends DocumentData = any>(firestore: FirestoreAdmin, path: string): DocumentReferenceAdmin<T>;

export function documentReference<T extends DocumentData = any>(firestore: Firestore, path: string): DocumentReference<T>;

export function documentReference<T extends DocumentData = any>(firestore: Firestore, path: string): DocumentReference<T> {

  if (Firestore.isClient(firestore)) {
    return doc(firestore, path) as DocumentReferenceClient<T>;
  } else {
    return firestore.doc(path) as DocumentReferenceAdmin<T>;
  }

}
