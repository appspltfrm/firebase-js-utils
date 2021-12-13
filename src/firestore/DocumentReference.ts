import type {firestore as admin} from "firebase-admin";
import {doc, DocumentReference as $DocumentReferenceClient} from "firebase/firestore";
import {DocumentData} from "./DocumentData";
import {Firestore, FirestoreAdmin, FirestoreClient} from "./Firestore";

export type DocumentReferenceClient<T = DocumentData> = $DocumentReferenceClient<T>;
export type DocumentReferenceAdmin<T = DocumentData> = admin.DocumentReference<T>;
export type DocumentReference<T = DocumentData> = DocumentReferenceAdmin<T> | DocumentReferenceClient<T>;

export namespace DocumentReference {

    export function isInstance<T>(obj: any): obj is DocumentReference<T> {
        return obj instanceof $DocumentReferenceClient || (Firestore.adminInitialized() && obj instanceof Firestore.admin().DocumentReference);
    }

    export function isClient<T>(ref: DocumentReference<T>): ref is DocumentReferenceClient<T> {
        return Firestore.isClient(ref.firestore);
    }

    export function isAdmin<T>(ref: DocumentReference<T>): ref is DocumentReferenceAdmin<T> {
        return !isClient(ref);
    }
}

export function documentReference<T = DocumentData>(firestore: FirestoreClient, path: string): DocumentReferenceClient<T>;

export function documentReference<T = DocumentData>(firestore: FirestoreAdmin, path: string): DocumentReferenceAdmin<T>;

export function documentReference<T = DocumentData>(firestore: Firestore, path: string): DocumentReference<T>;

export function documentReference<T = DocumentData>(firestore: Firestore, path: string): DocumentReference<T> {

    if (Firestore.isClient(firestore)) {
        return doc(firestore, path) as DocumentReferenceClient<T>;
    } else {
        return firestore.doc(path) as DocumentReferenceAdmin<T>;
    }

}
