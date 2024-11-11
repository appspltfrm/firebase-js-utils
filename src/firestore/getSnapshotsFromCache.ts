import {DocumentData} from "./DocumentData.js";
import {getSnapshotFromCache} from "./getSnapshotFromCache.js";
import {Query, QueryAdmin, QueryClient} from "./Query.js";
import {QueryDocumentSnapshot, QueryDocumentSnapshotAdmin, QueryDocumentSnapshotClient} from "./QueryDocumentSnapshot.js";

export async function getSnapshotsFromCache<T = DocumentData>(query: QueryClient<T>): Promise<QueryDocumentSnapshotClient<T>[]>;

export async function getSnapshotsFromCache<T = DocumentData>(query: QueryAdmin<T>): Promise<QueryDocumentSnapshotAdmin<T>[]>;

export async function getSnapshotsFromCache<T = DocumentData>(query: Query<T>): Promise<QueryDocumentSnapshot<T>[]>;

export async function getSnapshotsFromCache<T = DocumentData>(query: Query<T>): Promise<QueryDocumentSnapshot<T>[]> {
    return (await getSnapshotFromCache(query)).docs;
}
