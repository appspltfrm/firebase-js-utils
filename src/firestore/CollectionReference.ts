import type {firestore as admin} from "firebase-admin";
import {collection, CollectionReference as $CollectionReferenceClient} from "firebase/firestore";
import {DocumentData} from "./DocumentData.js";
import {Firestore, FirestoreAdmin, FirestoreClient} from "./Firestore.js";

export type CollectionReferenceClient<T extends DocumentData = any> = $CollectionReferenceClient<T>;
export type CollectionReferenceAdmin<T extends DocumentData = any> = admin.CollectionReference<T>;

/**
 * Polimorficzna referencja do kolekcji Firestore.
 */
export type CollectionReference<T extends DocumentData = any> = CollectionReferenceAdmin<T> | CollectionReferenceClient<T>;

export namespace CollectionReference {

  /**
     * Sprawdza, czy referencja pochodzi z Web SDK.
     */
  export function isClient<T extends DocumentData = any>(ref: CollectionReference<T>): ref is CollectionReferenceClient<T> {
    return Firestore.isClient(ref.firestore);
  }

  /**
     * Sprawdza, czy referencja pochodzi z Admin SDK.
     */
  export function isAdmin<T extends DocumentData = any>(ref: CollectionReference<T>): ref is CollectionReferenceAdmin<T> {
    return !isClient(ref);
  }
}

/**
 * Tworzy uniwersalną referencję do kolekcji Firestore na podstawie instancji Firestore i ścieżki.
 */
export function collectionReference<T extends DocumentData = any>(firestore: FirestoreClient, path: string): CollectionReferenceClient<T>;

export function collectionReference<T extends DocumentData = any>(firestore: FirestoreAdmin, path: string): CollectionReferenceAdmin<T>;

export function collectionReference<T extends DocumentData = any>(firestore: Firestore, path: string): CollectionReference<T>;

export function collectionReference<T extends DocumentData = any>(firestore: Firestore, path: string): CollectionReference<T> {

  if (Firestore.isClient(firestore)) {
    return collection(firestore, path) as CollectionReferenceClient<T>;
  } else {
    return firestore.collection(path) as CollectionReferenceAdmin<T>;
  }

}
