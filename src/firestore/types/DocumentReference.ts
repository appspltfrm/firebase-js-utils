import {firestore as admin} from "firebase-admin";
import * as client from "firebase/firestore";
import {DocumentData} from "./DocumentData";
import {Firestore} from "./Firestore";

export type DocumentReferenceClient<T = DocumentData> = client.DocumentReference<T>;
export type DocumentReferenceAdmin<T = DocumentData> = admin.DocumentReference<T>;
export type DocumentReference<T = DocumentData> = DocumentReferenceAdmin<T> | DocumentReferenceClient<T>;

export namespace DocumentReference {

    export function isClient<T>(ref: DocumentReference<T>): ref is DocumentReferenceClient<T> {
        return Firestore.isClient(ref.firestore);
    }

    export function isAdmin<T>(ref: DocumentReference<T>): ref is DocumentReferenceAdmin<T> {
        return !isClient(ref);
    }
}
