import type { firestore as admin } from "firebase-admin";
import { CollectionReference as $CollectionReferenceClient } from "firebase/firestore";
import { DocumentData } from "./DocumentData";
import { Firestore, FirestoreAdmin, FirestoreClient } from "./Firestore";
export declare type CollectionReferenceClient<T = DocumentData> = $CollectionReferenceClient<T>;
export declare type CollectionReferenceAdmin<T = DocumentData> = admin.CollectionReference<T>;
export declare type CollectionReference<T = DocumentData> = CollectionReferenceAdmin<T> | CollectionReferenceClient<T>;
export declare namespace CollectionReference {
    function isClient<T>(ref: CollectionReference<T>): ref is CollectionReferenceClient<T>;
    function isAdmin<T>(ref: CollectionReference<T>): ref is CollectionReferenceAdmin<T>;
}
export declare function collectionReference<T = DocumentData>(firestore: FirestoreClient, path: string): CollectionReferenceClient<T>;
export declare function collectionReference<T = DocumentData>(firestore: FirestoreAdmin, path: string): CollectionReferenceAdmin<T>;
export declare function collectionReference<T = DocumentData>(firestore: Firestore, path: string): CollectionReference<T>;
