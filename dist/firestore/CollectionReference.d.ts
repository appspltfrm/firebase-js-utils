import type { firestore as admin } from "firebase-admin";
import { CollectionReference as $CollectionReferenceClient } from "firebase/firestore";
import { DocumentData } from "./DocumentData.js";
import { Firestore, FirestoreAdmin, FirestoreClient } from "./Firestore.js";
export type CollectionReferenceClient<T extends DocumentData = any> = $CollectionReferenceClient<T>;
export type CollectionReferenceAdmin<T extends DocumentData = any> = admin.CollectionReference<T>;
/**
 * Polimorficzna referencja do kolekcji Firestore.
 */
export type CollectionReference<T extends DocumentData = any> = CollectionReferenceAdmin<T> | CollectionReferenceClient<T>;
export declare namespace CollectionReference {
    /**
     * Sprawdza, czy referencja pochodzi z Web SDK.
     */
    function isClient<T extends DocumentData = any>(ref: CollectionReference<T>): ref is CollectionReferenceClient<T>;
    /**
     * Sprawdza, czy referencja pochodzi z Admin SDK.
     */
    function isAdmin<T extends DocumentData = any>(ref: CollectionReference<T>): ref is CollectionReferenceAdmin<T>;
}
/**
 * Tworzy uniwersalną referencję do kolekcji Firestore na podstawie instancji Firestore i ścieżki.
 */
export declare function collectionReference<T extends DocumentData = any>(firestore: FirestoreClient, path: string): CollectionReferenceClient<T>;
export declare function collectionReference<T extends DocumentData = any>(firestore: FirestoreAdmin, path: string): CollectionReferenceAdmin<T>;
export declare function collectionReference<T extends DocumentData = any>(firestore: Firestore, path: string): CollectionReference<T>;
