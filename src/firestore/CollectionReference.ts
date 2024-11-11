import type {firestore as admin} from "firebase-admin";
import {collection, CollectionReference as $CollectionReferenceClient} from "firebase/firestore";
import {DocumentData} from "./DocumentData.js";
import {Firestore, FirestoreAdmin, FirestoreClient} from "./Firestore.js";

export type CollectionReferenceClient<T = DocumentData> = $CollectionReferenceClient<T>;
export type CollectionReferenceAdmin<T = DocumentData> = admin.CollectionReference<T>;
export type CollectionReference<T = DocumentData> = CollectionReferenceAdmin<T> | CollectionReferenceClient<T>;

export namespace CollectionReference {

    export function isClient<T>(ref: CollectionReference<T>): ref is CollectionReferenceClient<T> {
        return Firestore.isClient(ref.firestore);
    }

    export function isAdmin<T>(ref: CollectionReference<T>): ref is CollectionReferenceAdmin<T> {
        return !isClient(ref);
    }
}

export function collectionReference<T = DocumentData>(firestore: FirestoreClient, path: string): CollectionReferenceClient<T>;

export function collectionReference<T = DocumentData>(firestore: FirestoreAdmin, path: string): CollectionReferenceAdmin<T>;

export function collectionReference<T = DocumentData>(firestore: Firestore, path: string): CollectionReference<T>;

export function collectionReference<T = DocumentData>(firestore: Firestore, path: string): CollectionReference<T> {

    if (Firestore.isClient(firestore)) {
        return collection(firestore, path) as CollectionReferenceClient<T>;
    } else {
        return firestore.collection(path) as CollectionReferenceAdmin<T>;
    }

}
