import type {SnapshotOptions} from "firebase/firestore"
import {getDocFromCache, getDocsFromCache} from "firebase/firestore";
import {DocumentData} from "./DocumentData.js";
import {DocumentReference} from "./DocumentReference.js";
import {Query} from "./Query.js";

export async function getDataFromCache<T = DocumentData>(doc: DocumentReference<T>, options?: SnapshotOptions): Promise<T>;

export async function getDataFromCache<T = DocumentData>(query: Query<T>, options?: SnapshotOptions): Promise<T[]>;

export async function getDataFromCache<T = DocumentData>(docOrQuery: DocumentReference<T> | Query<T>, options?: any): Promise<T | T[]> {

    if (Query.isInstance(docOrQuery)) {
        if (Query.isClient(docOrQuery)) {
            return (await getDocsFromCache(docOrQuery)).docs.map(snapshot => snapshot.data(options));
        } else {
            return (await docOrQuery.get()).docs.map(snapshot => snapshot.data());
        }

    } else if (DocumentReference.isInstance(docOrQuery)) {
        if (DocumentReference.isClient(docOrQuery)) {
            return (await getDocFromCache(docOrQuery)).data(options);
        } else {
            return (await docOrQuery.get()).data();
        }

    } else {
        throw new Error("Invalid DocumentReference or Query object");
    }
}
