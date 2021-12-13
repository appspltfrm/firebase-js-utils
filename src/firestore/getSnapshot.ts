import {getDoc, getDocs} from "firebase/firestore";
import {DocumentData} from "./DocumentData";
import {DocumentReference, DocumentReferenceAdmin, DocumentReferenceClient} from "./DocumentReference";
import {DocumentSnapshot, DocumentSnapshotAdmin, DocumentSnapshotClient} from "./DocumentSnapshot";
import {Query, QueryAdmin, QueryClient} from "./Query";
import {QuerySnapshot, QuerySnapshotAdmin, QuerySnapshotClient} from "./QuerySnapshot";

export async function getSnapshot<T = DocumentData>(query: QueryClient<T>): Promise<QuerySnapshotClient<T>>;

export async function getSnapshot<T = DocumentData>(query: QueryAdmin<T>): Promise<QuerySnapshotAdmin<T>>;

export async function getSnapshot<T = DocumentData>(query: Query<T>): Promise<QuerySnapshot<T>>;

export async function getSnapshot<T = DocumentData>(doc: DocumentReferenceClient<T>): Promise<DocumentSnapshotClient<T>>;

export async function getSnapshot<T = DocumentData>(doc: DocumentReferenceAdmin<T>): Promise<DocumentSnapshotAdmin<T>>;

export async function getSnapshot<T = DocumentData>(doc: DocumentReference<T>): Promise<DocumentSnapshot<T>>;

export async function getSnapshot<T = DocumentData>(docOrQuery: DocumentReference<T> | Query<T>): Promise<DocumentSnapshot<T> | QuerySnapshot<T>>  {

    if (Query.isInstance(docOrQuery)) {
        if (Query.isClient(docOrQuery)) {
            return await getDocs(docOrQuery);
        } else {
            return await docOrQuery.get();
        }

    } else if (DocumentReference.isInstance(docOrQuery)) {
        if (DocumentReference.isClient(docOrQuery)) {
            return await getDoc(docOrQuery);
        } else {
            return await docOrQuery.get();
        }

    } else {
        throw new Error("Invalid DocumentReference or Query object");
    }
}
