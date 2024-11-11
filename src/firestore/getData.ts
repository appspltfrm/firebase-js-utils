import {getDoc, getDocs} from "firebase/firestore";
import {DocumentData} from "./DocumentData.js";
import {DocumentReference} from "./DocumentReference.js";
import {Query} from "./Query.js";

export async function getData<T = DocumentData>(docOrQuery: DocumentReference<T>): Promise<T>;

export async function getData<T = DocumentData>(docOrQuery: Query<T>): Promise<T[]>

export async function getData<T = DocumentData>(docOrQuery: DocumentReference<T> | Query<T>, options?: any): Promise<T | T[]> {

    if (Query.isInstance(docOrQuery)) {
        if (Query.isClient(docOrQuery)) {
            return (await getDocs(docOrQuery)).docs.map(snapshot => snapshot.data(options));
        } else {
            return (await docOrQuery.get()).docs.map(snapshot => snapshot.data());
        }

    } else if (DocumentReference.isInstance(docOrQuery)) {

        if (DocumentReference.isClient(docOrQuery)) {
            return (await getDoc(docOrQuery)).data(options);
        } else {
            return (await docOrQuery.get()).data();
        }

    } else {
        throw new Error("Invalid DocumentReference or Query object");
    }
}
