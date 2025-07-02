import {buildQuery} from "./buildQuery.js";
import {DocumentData} from "./DocumentData.js";
import {DocumentSnapshot} from "./DocumentSnapshot.js";
import {getSnapshotsFromCache} from "./getSnapshotsFromCache.js";
import {Query, QueryAdmin, QueryClient} from "./Query.js";
import {QueryDocumentSnapshot, QueryDocumentSnapshotAdmin, QueryDocumentSnapshotClient} from "./QueryDocumentSnapshot.js";

export function getChunkedSnapshotsFromCache<T = DocumentData>(query: QueryClient<T>, chunkSize: number): AsyncGenerator<QueryDocumentSnapshotClient<T>[]>;

export function getChunkedSnapshotsFromCache<T = DocumentData>(query: QueryAdmin<T>, chunkSize: number): AsyncGenerator<QueryDocumentSnapshotAdmin<T>[]>;

export function getChunkedSnapshotsFromCache<T = DocumentData>(query: Query<T>, chunkSize: number): AsyncGenerator<QueryDocumentSnapshot<T>[]>;

export async function* getChunkedSnapshotsFromCache<T = DocumentData>(query: Query<T>, chunkSize: number): AsyncGenerator<QueryDocumentSnapshot<T>[], void, undefined> {
    let done = false;
    let lastDocument: DocumentSnapshot | undefined;

    while (!done) {
        const batch = await getSnapshotsFromCache(buildQuery(query, ["limit", chunkSize], (lastDocument ? ["startAfter", lastDocument] : undefined)));
        if (batch.length === 0) {
            done = true;
            break;
        }
        yield batch;
        lastDocument = batch[batch.length - 1];
        if (batch.length < chunkSize) {
            done = true;
        }
    }
}
