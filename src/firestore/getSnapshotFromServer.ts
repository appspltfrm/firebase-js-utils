import {getDocFromServer, getDocsFromServer} from "firebase/firestore";
import {DocumentData} from "./DocumentData.js";
import {DocumentReference, DocumentReferenceAdmin, DocumentReferenceClient} from "./DocumentReference.js";
import {DocumentSnapshot, DocumentSnapshotAdmin, DocumentSnapshotClient} from "./DocumentSnapshot.js";
import {Query, QueryAdmin, QueryClient} from "./Query.js";
import {QuerySnapshot, QuerySnapshotAdmin, QuerySnapshotClient} from "./QuerySnapshot.js";

export async function getSnapshotFromServer<T extends DocumentData = any>(query: QueryClient<T>): Promise<QuerySnapshotClient<T>>;

export async function getSnapshotFromServer<T extends DocumentData = any>(query: QueryAdmin<T>): Promise<QuerySnapshotAdmin<T>>;

export async function getSnapshotFromServer<T extends DocumentData = any>(query: Query<T>): Promise<QuerySnapshot<T>>;

export async function getSnapshotFromServer<T extends DocumentData = any>(doc: DocumentReferenceClient<T>): Promise<DocumentSnapshotClient<T>>;

export async function getSnapshotFromServer<T extends DocumentData = any>(doc: DocumentReferenceAdmin<T>): Promise<DocumentSnapshotAdmin<T>>;

export async function getSnapshotFromServer<T extends DocumentData = any>(doc: DocumentReference<T>): Promise<DocumentSnapshot<T>>;

export async function getSnapshotFromServer<T extends DocumentData = any>(docOrQuery: DocumentReference<T> | Query<T>): Promise<DocumentSnapshot<T> | QuerySnapshot<T>> {

  if (Query.isInstance(docOrQuery)) {
    if (Query.isClient(docOrQuery)) {
      return await getDocsFromServer(docOrQuery);
    } else {
      return await docOrQuery.get();
    }

  } else if (DocumentReference.isInstance(docOrQuery)) {

    if (DocumentReference.isClient(docOrQuery)) {
      return await getDocFromServer(docOrQuery);
    } else {
      return await docOrQuery.get();
    }

  } else {
    throw new Error("Invalid DocumentReference or Query object");
  }
}
