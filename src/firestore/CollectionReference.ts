import type {firestore as admin} from "firebase-admin";
import type * as client from "firebase/firestore";
import {DocumentData} from "./DocumentData";
import {Firestore} from "./Firestore";

export type CollectionReferenceClient<T = DocumentData> = client.CollectionReference<T>;
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
