import {getDoc, getDocs} from "firebase/firestore";
import {DocumentData} from "./DocumentData.js";
import {DocumentReference} from "./DocumentReference.js";
import {executePipeline} from "./executePipeline.js";
import {Pipeline} from "./Pipeline.js";
import {Query} from "./Query.js";

/**
 * Uniwersalna funkcja do pobierania danych z Firestore.
 * Automatycznie obsługuje różnice między Web SDK a Admin SDK.
 *
 * @param docOrQuery Referencja do dokumentu, zapytanie (Query) albo pipeline.
 * @param options Opcjonalne parametry (np. SnapshotOptions dla klienta).
 * @returns Dane dokumentu (T) lub tablica dokumentów (T[]).
 */
export async function getData<T extends DocumentData = any>(docOrQuery: DocumentReference<T>): Promise<T>;

export async function getData<T extends DocumentData = any>(docOrQuery: Query<T>): Promise<T[]>;

export async function getData<T extends DocumentData = any>(pipeline: Pipeline): Promise<T[]>;

export async function getData<T extends DocumentData = any>(input: DocumentReference<T> | Query<T> | Pipeline, options?: any): Promise<T | T[]> {

  if (Query.isInstance(input)) {
    if (Query.isClient(input)) {
      return (await getDocs(input)).docs.map(snapshot => snapshot.data(options));
    } else {
      return (await input.get()).docs.map(snapshot => snapshot.data());
    }

  } else if (DocumentReference.isInstance(input)) {

    if (DocumentReference.isClient(input)) {
      return (await getDoc(input)).data(options)!;
    } else {
      return (await input.get()).data()!;
    }

  } else if (Pipeline.isInstance(input)) {
    return (await executePipeline(input)).results.map(r => r.data() as T);

  } else {
    throw new Error("Invalid DocumentReference or Query object");
  }
}
