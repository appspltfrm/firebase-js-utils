import {buildQuery} from "./buildQuery.js";
import {DocumentData} from "./DocumentData.js";
import {DocumentSnapshot} from "./DocumentSnapshot.js";
import {getSnapshots} from "./getSnapshots.js";
import {Query, QueryAdmin, QueryClient} from "./Query.js";

export function getChunkedData<T = DocumentData>(query: QueryClient<T>, chunkSize: number): AsyncGenerator<T[]>;

export function getChunkedData<T = DocumentData>(query: QueryAdmin<T>, chunkSize: number): AsyncGenerator<T[]>;

export function getChunkedData<T = DocumentData>(query: Query<T>, chunkSize: number): AsyncGenerator<T[]>;

export async function* getChunkedData<T = DocumentData>(query: Query<T>, chunkSize: number): AsyncGenerator<T[], void, undefined> {
    let done = false;
    let lastDocument: DocumentSnapshot | undefined;

    while (!done) {
        const batch = await getSnapshots(buildQuery(query, ["limit", chunkSize], (lastDocument ? ["startAfter", lastDocument] : undefined)));
        if (batch.length === 0) {
            done = true;
            break;
        }
        yield batch.map(d => d.data());
        lastDocument = batch[batch.length - 1];
        if (batch.length < chunkSize) {
            done = true;
        }
    }
}
