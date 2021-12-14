import {DocumentData} from "./DocumentData";
import {getSnapshotFromCache} from "./getSnapshotFromCache";
import {Query, QueryAdmin, QueryClient} from "./Query";
import {QueryDocumentSnapshot, QueryDocumentSnapshotAdmin, QueryDocumentSnapshotClient} from "./QueryDocumentSnapshot";

export async function getSnapshotsFromCache<T = DocumentData>(query: QueryClient<T>): Promise<QueryDocumentSnapshotClient<T>[]>;

export async function getSnapshotsFromCache<T = DocumentData>(query: QueryAdmin<T>): Promise<QueryDocumentSnapshotAdmin<T>[]>;

export async function getSnapshotsFromCache<T = DocumentData>(query: Query<T>): Promise<QueryDocumentSnapshot<T>[]>;

export async function getSnapshotsFromCache<T = DocumentData>(query: Query<T>): Promise<QueryDocumentSnapshot<T>[]> {
    return (await getSnapshotFromCache(query)).docs;
}
