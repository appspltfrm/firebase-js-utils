import {collection} from "firebase/firestore";
import {CollectionReference, CollectionReferenceAdmin, CollectionReferenceClient} from "./CollectionReference";
import {DocumentData} from "./DocumentData";
import {Firestore, FirestoreAdmin, FirestoreClient} from "./Firestore";

export function getCollectionRef<T = DocumentData>(firestore: FirestoreClient, path: string): CollectionReferenceClient<T>;

export function getCollectionRef<T = DocumentData>(firestore: FirestoreAdmin, path: string): CollectionReferenceAdmin<T>;

export function getCollectionRef<T = DocumentData>(firestore: Firestore, path: string): CollectionReference<T> {

    if (Firestore.isClient(firestore)) {
        return collection(firestore, path) as CollectionReferenceClient<T>;
    } else {
        return firestore.collection(path) as CollectionReferenceAdmin<T>;
    }

}
