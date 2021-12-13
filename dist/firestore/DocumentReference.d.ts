import type { firestore as admin } from "firebase-admin";
import type * as client from "firebase/firestore";
import { DocumentData } from "./DocumentData";
export declare type DocumentReferenceClient<T = DocumentData> = client.DocumentReference<T>;
export declare type DocumentReferenceAdmin<T = DocumentData> = admin.DocumentReference<T>;
export declare type DocumentReference<T = DocumentData> = DocumentReferenceAdmin<T> | DocumentReferenceClient<T>;
export declare namespace DocumentReference {
    function isClient<T>(ref: DocumentReference<T>): ref is DocumentReferenceClient<T>;
    function isAdmin<T>(ref: DocumentReference<T>): ref is DocumentReferenceAdmin<T>;
}
