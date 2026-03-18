import {DocumentData} from "./DocumentData.js";
import {getSnapshot} from "./getSnapshot.js";
import {Query, QueryAdmin, QueryClient} from "./Query.js";
import {QueryDocumentSnapshot, QueryDocumentSnapshotAdmin, QueryDocumentSnapshotClient} from "./QueryDocumentSnapshot.js";

export async function getSnapshots<T extends DocumentData = any>(query: QueryClient<T>): Promise<QueryDocumentSnapshotClient<T>[]>;

export async function getSnapshots<T extends DocumentData = any>(query: QueryAdmin<T>): Promise<QueryDocumentSnapshotAdmin<T>[]>;

export async function getSnapshots<T extends DocumentData = any>(query: Query<T>): Promise<QueryDocumentSnapshot<T>[]>;

export async function getSnapshots<T extends DocumentData = any>(query: Query<T>): Promise<QueryDocumentSnapshot<T>[]> {
  return (await getSnapshot(query)).docs;
}
