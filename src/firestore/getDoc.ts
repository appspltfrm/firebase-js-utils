import {
    getDoc as $getDoc,
    getDocFromCache as $getDocFromCache,
    getDocFromServer as $getDocFromServer
} from "firebase/firestore";
import {
    DocumentData,
    DocumentReference,
    DocumentReferenceAdmin,
    DocumentReferenceClient,
    DocumentSnapshot,
    DocumentSnapshotAdmin,
    DocumentSnapshotClient
} from "./types";

export async function getDoc<T = DocumentData>(doc: DocumentReferenceClient<T>): Promise<DocumentSnapshotClient<T>>;

export async function getDoc<T = DocumentData>(doc: DocumentReferenceAdmin<T>): Promise<DocumentSnapshotAdmin<T>>;

export async function getDoc<T = DocumentData>(doc: DocumentReference<T>): Promise<DocumentSnapshot<T>>  {

    if (DocumentReference.isClient(doc)) {
        return await $getDoc(doc);
    } else {
        return await doc.get();
    }

}

export async function getDocFromCache<T = DocumentData>(doc: DocumentReferenceClient<T>): Promise<DocumentSnapshotClient<T>>;

export async function getDocFromCache<T = DocumentData>(doc: DocumentReferenceAdmin<T>): Promise<DocumentSnapshotAdmin<T>>;

export async function getDocFromCache<T = DocumentData>(doc: DocumentReference<T>): Promise<DocumentSnapshot<T>> {

    if (DocumentReference.isClient(doc)) {
        return await $getDocFromCache(doc);
    } else {
        return await doc.get();
    }
}

export async function getDocFromServer<T = DocumentData>(doc: DocumentReferenceClient<T>): Promise<DocumentSnapshotClient<T>>;

export async function getDocFromServer<T = DocumentData>(doc: DocumentReferenceAdmin<T>): Promise<DocumentSnapshotAdmin<T>>;

export async function getDocFromServer<T = DocumentData>(doc: DocumentReference<T>): Promise<DocumentSnapshot<T>> {

    if (DocumentReference.isClient(doc)) {
        return await $getDocFromServer(doc);
    } else {
        return await doc.get();
    }
}
