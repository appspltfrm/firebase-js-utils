import { DocumentData } from "./DocumentData.js";
import { DocumentReference } from "./DocumentReference.js";
import { Query } from "./Query.js";
/**
 * Uniwersalna funkcja do pobierania danych z Firestore.
 * Automatycznie obsługuje różnice między Web SDK a Admin SDK.
 *
 * @param docOrQuery Referencja do dokumentu lub zapytanie (Query).
 * @param options Opcjonalne parametry (np. SnapshotOptions dla klienta).
 * @returns Dane dokumentu (T) lub tablica dokumentów (T[]).
 */
export declare function getData<T extends DocumentData = any>(docOrQuery: DocumentReference<T>): Promise<T>;
export declare function getData<T extends DocumentData = any>(docOrQuery: Query<T>): Promise<T[]>;
