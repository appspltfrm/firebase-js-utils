import type {SnapshotOptions} from "firebase/firestore"
import {getDoc, getDocFromCache, getDocFromServer} from "firebase/firestore";
import {DocumentData, DocumentReference} from "./types";

export async function getDocData<T = DocumentData>(doc: DocumentReference<T>, options?: SnapshotOptions): Promise<T> {

    if (DocumentReference.isClient(doc)) {
        return (await getDoc(doc)).data(options);
    } else {
        return (await doc.get()).data();
    }

}

export async function getDocDataFromCache<T = DocumentData>(doc: DocumentReference<T>, options?: SnapshotOptions): Promise<T> {

    if (DocumentReference.isClient(doc)) {
        return (await getDocFromCache(doc)).data(options);
    } else {
        return (await doc.get()).data();
    }
}

export async function getDocDataFromServer<T = DocumentData>(doc: DocumentReference<T>, options?: SnapshotOptions): Promise<T> {

    if (DocumentReference.isClient(doc)) {
        return (await getDocFromServer(doc)).data(options);
    } else {
        return (await doc.get()).data();
    }
}
