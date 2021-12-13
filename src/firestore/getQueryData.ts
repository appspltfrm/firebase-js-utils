import type {SnapshotOptions} from "firebase/firestore"
import {getDocs, getDocsFromCache, getDocsFromServer} from "firebase/firestore";
import {DocumentData} from "./DocumentData";
import {Query, QueryAdmin, QueryClient} from "./Query";

export async function getQueryData<T = DocumentData>(query: QueryClient<T>, options?: SnapshotOptions): Promise<T[]>;

export async function getQueryData<T = DocumentData>(query: QueryAdmin<T>, options?: SnapshotOptions): Promise<T[]>;

export async function getQueryData<T = DocumentData>(query: Query<T>, options?: SnapshotOptions): Promise<T[]>  {

    if (Query.isClient(query)) {
        return (await getDocs(query)).docs.map(snapshot => snapshot.data(options));
    } else {
        return (await query.get()).docs.map(snapshot => snapshot.data());
    }

}

export async function getQueryDataFromCache<T = DocumentData>(query: QueryClient<T>, options?: SnapshotOptions): Promise<T[]>;

export async function getQueryDataFromCache<T = DocumentData>(query: QueryAdmin<T>, options?: SnapshotOptions): Promise<T[]>;

export async function getQueryDataFromCache<T = DocumentData>(query: Query<T>, options?: SnapshotOptions): Promise<T[]> {

    if (Query.isClient(query)) {
        return (await getDocsFromCache(query)).docs.map(snapshot => snapshot.data(options));
    } else {
        return (await query.get()).docs.map(snapshot => snapshot.data());
    }
}

export async function getQueryDataFromServer<T = DocumentData>(query: QueryClient<T>, options?: SnapshotOptions): Promise<T[]>;

export async function getQueryDataFromServer<T = DocumentData>(query: QueryAdmin<T>, options?: SnapshotOptions): Promise<T[]>;

export async function getQueryDataFromServer<T = DocumentData>(query: Query<T>, options?: SnapshotOptions): Promise<T[]> {

    if (Query.isClient(query)) {
        return (await getDocsFromServer(query)).docs.map(snapshot => snapshot.data(options));
    } else {
        return (await query.get()).docs.map(snapshot => snapshot.data());
    }
}
