import type { firestore as admin } from "firebase-admin";
import { DocumentReference as $DocumentReferenceClient } from "firebase/firestore";
import { DocumentData } from "./DocumentData";
import { Firestore, FirestoreAdmin, FirestoreClient } from "./Firestore";
export type DocumentReferenceClient<T = DocumentData> = $DocumentReferenceClient<T>;
export type DocumentReferenceAdmin<T = DocumentData> = admin.DocumentReference<T>;
export type DocumentReference<T = DocumentData> = DocumentReferenceAdmin<T> | DocumentReferenceClient<T>;
export declare namespace DocumentReference {
    function isInstance<T>(obj: any): obj is DocumentReference<T>;
    function isClient<T>(ref: DocumentReference<T>): ref is DocumentReferenceClient<T>;
    function isAdmin<T>(ref: DocumentReference<T>): ref is DocumentReferenceAdmin<T>;
}
export declare function documentReference<T = DocumentData>(firestore: FirestoreClient, path: string): DocumentReferenceClient<T>;
export declare function documentReference<T = DocumentData>(firestore: FirestoreAdmin, path: string): DocumentReferenceAdmin<T>;
export declare function documentReference<T = DocumentData>(firestore: Firestore, path: string): DocumentReference<T>;
