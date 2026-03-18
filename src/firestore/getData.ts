import {getDoc, getDocs} from "firebase/firestore";
import {DocumentData} from "./DocumentData.js";
import {DocumentReference} from "./DocumentReference.js";
import {Query} from "./Query.js";

/**
 * Uniwersalna funkcja do pobierania danych z Firestore.
 * Automatycznie obsługuje różnice między Web SDK a Admin SDK.
 *
 * @param docOrQuery Referencja do dokumentu lub zapytanie (Query).
 * @param options Opcjonalne parametry (np. SnapshotOptions dla klienta).
 * @returns Dane dokumentu (T) lub tablica dokumentów (T[]).
 */
export async function getData<T extends DocumentData = any>(docOrQuery: DocumentReference<T>): Promise<T>;

export async function getData<T extends DocumentData = any>(docOrQuery: Query<T>): Promise<T[]>;

export async function getData<T extends DocumentData = any>(docOrQuery: DocumentReference<T> | Query<T>, options?: any): Promise<T | T[]> {

  if (Query.isInstance(docOrQuery)) {
    if (Query.isClient(docOrQuery)) {
      return (await getDocs(docOrQuery)).docs.map(snapshot => snapshot.data(options));
    } else {
      return (await docOrQuery.get()).docs.map(snapshot => snapshot.data());
    }

  } else if (DocumentReference.isInstance(docOrQuery)) {

    if (DocumentReference.isClient(docOrQuery)) {
      return (await getDoc(docOrQuery)).data(options)!;
    } else {
      return (await docOrQuery.get()).data()!;
    }

  } else {
    throw new Error("Invalid DocumentReference or Query object");
  }
}
