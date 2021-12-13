import {doc} from "firebase/firestore";
import {DocumentData} from "./DocumentData";
import {DocumentReference, DocumentReferenceAdmin, DocumentReferenceClient} from "./DocumentReference";
import {Firestore, FirestoreAdmin, FirestoreClient} from "./Firestore";

export function getDocRef<T = DocumentData>(firestore: FirestoreClient, path: string): DocumentReferenceClient<T>;

export function getDocRef<T = DocumentData>(firestore: FirestoreAdmin, path: string): DocumentReferenceAdmin<T>;

export function getDocRef<T = DocumentData>(firestore: Firestore, path: string): DocumentReference<T> {

    if (Firestore.isClient(firestore)) {
        return doc(firestore, path) as DocumentReferenceClient<T>;
    } else {
        return firestore.doc(path) as DocumentReferenceAdmin<T>;
    }

}
