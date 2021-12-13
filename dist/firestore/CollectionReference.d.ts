import type { firestore as admin } from "firebase-admin";
import type * as client from "firebase/firestore";
import { DocumentData } from "./DocumentData";
export declare type CollectionReferenceClient<T = DocumentData> = client.CollectionReference<T>;
export declare type CollectionReferenceAdmin<T = DocumentData> = admin.CollectionReference<T>;
export declare type CollectionReference<T = DocumentData> = CollectionReferenceAdmin<T> | CollectionReferenceClient<T>;
export declare namespace CollectionReference {
    function isClient<T>(ref: CollectionReference<T>): ref is CollectionReferenceClient<T>;
    function isAdmin<T>(ref: CollectionReference<T>): ref is CollectionReferenceAdmin<T>;
}
