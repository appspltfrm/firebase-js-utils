import {DocumentData} from "./DocumentData";
import {getSnapshotFromServer} from "./getSnapshotFromServer";
import {Query, QueryAdmin, QueryClient} from "./Query";
import {QueryDocumentSnapshot, QueryDocumentSnapshotAdmin, QueryDocumentSnapshotClient} from "./QueryDocumentSnapshot";

export async function getSnapshotsFromServer<T = DocumentData>(query: QueryClient<T>): Promise<QueryDocumentSnapshotClient<T>[]>;

export async function getSnapshotsFromServer<T = DocumentData>(query: QueryAdmin<T>): Promise<QueryDocumentSnapshotAdmin<T>[]>;

export async function getSnapshotsFromServer<T = DocumentData>(query: Query<T>): Promise<QueryDocumentSnapshot<T>[]>;

export async function getSnapshotsFromServer<T = DocumentData>(query: Query<T>): Promise<QueryDocumentSnapshot<T>[]> {
    return (await getSnapshotFromServer(query)).docs;
}
