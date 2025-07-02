import {buildQuery} from "./buildQuery.js";
import {DocumentData} from "./DocumentData.js";
import {DocumentSnapshot} from "./DocumentSnapshot.js";
import {getSnapshotsFromServer} from "./getSnapshotsFromServer.js";
import {Query, QueryAdmin, QueryClient} from "./Query.js";
import {QueryDocumentSnapshot, QueryDocumentSnapshotAdmin, QueryDocumentSnapshotClient} from "./QueryDocumentSnapshot.js";

export function getChunkedSnapshotsFromServer<T = DocumentData>(query: QueryClient<T>, chunkSize: number): AsyncGenerator<QueryDocumentSnapshotClient<T>[]>;

export function getChunkedSnapshotsFromServer<T = DocumentData>(query: QueryAdmin<T>, chunkSize: number): AsyncGenerator<QueryDocumentSnapshotAdmin<T>[]>;

export function getChunkedSnapshotsFromServer<T = DocumentData>(query: Query<T>, chunkSize: number): AsyncGenerator<QueryDocumentSnapshot<T>[]>;

export async function* getChunkedSnapshotsFromServer<T = DocumentData>(query: Query<T>, chunkSize: number): AsyncGenerator<QueryDocumentSnapshot<T>[], void, undefined> {
    let done = false;
    let lastDocument: DocumentSnapshot | undefined;

    while (!done) {
        const batch = await getSnapshotsFromServer(buildQuery(query, ["limit", chunkSize], (lastDocument ? ["startAfter", lastDocument] : undefined)));
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
