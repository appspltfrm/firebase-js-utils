import {buildQuery} from "./buildQuery.js";
import {collectionReference} from "./CollectionReference.js";
import {DocumentData} from "./DocumentData.js";
import {Firestore, FirestoreAdmin, FirestoreClient} from "./Firestore.js";
import {Query, QueryAdmin, QueryClient} from "./Query.js";
import {QueryConstraint} from "./QueryConstraint.js";

/**
 * Builds a Firestore query from a Firestore instance and a collection name, optionally applying
 * query constraints. Universal across Web and Admin SDK — a context-free composition of
 * {@link collectionReference} and {@link buildQuery}.
 */
export function collectionQuery<T extends DocumentData = any>(firestore: FirestoreClient, collectionName: string, ...queryConstraints: Array<QueryConstraint | undefined | false>): QueryClient<T>;

export function collectionQuery<T extends DocumentData = any>(firestore: FirestoreAdmin, collectionName: string, ...queryConstraints: Array<QueryConstraint | undefined | false>): QueryAdmin<T>;

export function collectionQuery<T extends DocumentData = any>(firestore: Firestore, collectionName: string, ...queryConstraints: Array<QueryConstraint | undefined | false>): Query<T>;

export function collectionQuery<T extends DocumentData = any>(firestore: Firestore, collectionName: string, ...queryConstraints: Array<QueryConstraint | undefined | false>): Query<T> {
  return buildQuery(collectionReference<T>(firestore, collectionName), ...queryConstraints);
}
