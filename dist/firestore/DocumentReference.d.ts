import type { firestore as admin } from "firebase-admin";
import { DocumentReference as $DocumentReferenceClient } from "firebase/firestore";
import { DocumentData } from "./DocumentData.js";
import { Firestore, FirestoreAdmin, FirestoreClient } from "./Firestore.js";
export type DocumentReferenceClient<T extends DocumentData = any> = $DocumentReferenceClient<T>;
export type DocumentReferenceAdmin<T extends DocumentData = any> = admin.DocumentReference<T>;
/**
 * Polimorficzna referencja do dokumentu Firestore.
 */
export type DocumentReference<T extends DocumentData = any> = DocumentReferenceAdmin<T> | DocumentReferenceClient<T>;
export declare namespace DocumentReference {
    /**
     * Sprawdza, czy obiekt jest instancją referencji do dokumentu (klienta lub admina).
     */
    function isInstance<T extends DocumentData = any>(obj: any): obj is DocumentReference<T>;
    /**
     * Sprawdza, czy referencja pochodzi z Web SDK.
     */
    function isClient<T extends DocumentData = any>(ref: DocumentReference<T>): ref is DocumentReferenceClient<T>;
    /**
     * Sprawdza, czy referencja pochodzi z Admin SDK.
     */
    function isAdmin<T extends DocumentData = any>(ref: DocumentReference<T>): ref is DocumentReferenceAdmin<T>;
}
/**
 * Tworzy uniwersalną referencję do dokumentu Firestore na podstawie instancji Firestore i ścieżki.
 */
export declare function documentReference<T extends DocumentData = any>(firestore: FirestoreClient, path: string): DocumentReferenceClient<T>;
export declare function documentReference<T extends DocumentData = any>(firestore: FirestoreAdmin, path: string): DocumentReferenceAdmin<T>;
export declare function documentReference<T extends DocumentData = any>(firestore: Firestore, path: string): DocumentReference<T>;
