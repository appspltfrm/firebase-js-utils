import {
    getDoc,
    getDocFromCache,
    getDocFromServer
} from "firebase/firestore";
import {DocumentData} from "./DocumentData";
import {DocumentReference, DocumentReferenceAdmin, DocumentReferenceClient} from "./DocumentReference";
import {DocumentSnapshot, DocumentSnapshotAdmin, DocumentSnapshotClient} from "./DocumentSnapshot";

export async function getDocSnapshot<T = DocumentData>(doc: DocumentReferenceClient<T>): Promise<DocumentSnapshotClient<T>>;

export async function getDocSnapshot<T = DocumentData>(doc: DocumentReferenceAdmin<T>): Promise<DocumentSnapshotAdmin<T>>;

export async function getDocSnapshot<T = DocumentData>(doc: DocumentReference<T>): Promise<DocumentSnapshot<T>>  {

    if (DocumentReference.isClient(doc)) {
        return await getDoc(doc);
    } else {
        return await doc.get();
    }

}

export async function getDocSnapshotFromCache<T = DocumentData>(doc: DocumentReferenceClient<T>): Promise<DocumentSnapshotClient<T>>;

export async function getDocSnapshotFromCache<T = DocumentData>(doc: DocumentReferenceAdmin<T>): Promise<DocumentSnapshotAdmin<T>>;

export async function getDocSnapshotFromCache<T = DocumentData>(doc: DocumentReference<T>): Promise<DocumentSnapshot<T>> {

    if (DocumentReference.isClient(doc)) {
        return await getDocFromCache(doc);
    } else {
        return await doc.get();
    }
}

export async function getDocSnapshotFromServer<T = DocumentData>(doc: DocumentReferenceClient<T>): Promise<DocumentSnapshotClient<T>>;

export async function getDocSnapshotFromServer<T = DocumentData>(doc: DocumentReferenceAdmin<T>): Promise<DocumentSnapshotAdmin<T>>;

export async function getDocSnapshotFromServer<T = DocumentData>(doc: DocumentReference<T>): Promise<DocumentSnapshot<T>> {

    if (DocumentReference.isClient(doc)) {
        return await getDocFromServer(doc);
    } else {
        return await doc.get();
    }
}
