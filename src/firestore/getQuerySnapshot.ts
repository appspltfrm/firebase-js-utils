import {getDocs, getDocsFromCache, getDocsFromServer} from "firebase/firestore";
import {DocumentData} from "./DocumentData";
import {Query, QueryAdmin, QueryClient} from "./Query";
import {QuerySnapshot, QuerySnapshotAdmin, QuerySnapshotClient} from "./QuerySnapshot";

export async function getQuerySnapshot<T = DocumentData>(query: QueryClient<T>): Promise<QuerySnapshotClient<T>>;

export async function getQuerySnapshot<T = DocumentData>(query: QueryAdmin<T>): Promise<QuerySnapshotAdmin<T>>;

export async function getQuerySnapshot<T = DocumentData>(query: Query<T>): Promise<QuerySnapshot<T>>;

export async function getQuerySnapshot<T = DocumentData>(query: Query<T>): Promise<QuerySnapshot<T>>  {

    if (Query.isClient(query)) {
        return await getDocs(query);
    } else {
        return await query.get();
    }

}

export async function getQuerySnapshotFromCache<T = DocumentData>(query: QueryClient<T>): Promise<QuerySnapshotClient<T>>;

export async function getQuerySnapshotFromCache<T = DocumentData>(query: QueryAdmin<T>): Promise<QuerySnapshotAdmin<T>>;

export async function getQuerySnapshotFromCache<T = DocumentData>(query: Query<T>): Promise<QuerySnapshot<T>>;

export async function getQuerySnapshotFromCache<T = DocumentData>(query: Query<T>): Promise<QuerySnapshot<T>> {

    if (Query.isClient(query)) {
        return await getDocsFromCache(query);
    } else {
        return await query.get();
    }
}

export async function getQuerySnapshotFromServer<T = DocumentData>(query: QueryClient<T>): Promise<QuerySnapshotClient<T>>;

export async function getQuerySnapshotFromServer<T = DocumentData>(query: QueryAdmin<T>): Promise<QuerySnapshotAdmin<T>>;

export async function getQuerySnapshotFromServer<T = DocumentData>(query: Query<T>): Promise<QuerySnapshot<T>>;

export async function getQuerySnapshotFromServer<T = DocumentData>(query: Query<T>): Promise<QuerySnapshot<T>> {

    if (Query.isClient(query)) {
        return await getDocsFromServer(query);
    } else {
        return await query.get();
    }
}
