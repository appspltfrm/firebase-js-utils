import {DocumentData} from "./DocumentData";
import {getSnapshot} from "./getSnapshot";
import {Query, QueryAdmin, QueryClient} from "./Query";
import {QueryDocumentSnapshot, QueryDocumentSnapshotAdmin, QueryDocumentSnapshotClient} from "./QueryDocumentSnapshot";

export async function getSnapshots<T = DocumentData>(query: QueryClient<T>): Promise<QueryDocumentSnapshotClient<T>[]>;

export async function getSnapshots<T = DocumentData>(query: QueryAdmin<T>): Promise<QueryDocumentSnapshotAdmin<T>[]>;

export async function getSnapshots<T = DocumentData>(query: Query<T>): Promise<QueryDocumentSnapshot<T>[]>;

export async function getSnapshots<T = DocumentData>(query: Query<T>): Promise<QueryDocumentSnapshot<T>[]>  {
    return (await getSnapshot(query)).docs;
}
