import {buildQuery} from "./buildQuery.js";
import {DocumentData} from "./DocumentData.js";
import {DocumentSnapshot} from "./DocumentSnapshot.js";
import {getSnapshotsFromServer} from "./getSnapshotsFromServer.js";
import {Query, QueryAdmin, QueryClient} from "./Query.js";
import {RestQuery} from "./RestQuery";

export function getChunkedDataFromServer<T = DocumentData>(query: QueryClient<T>, chunkSize: number): AsyncGenerator<T[]>;

export function getChunkedDataFromServer<T = DocumentData>(query: QueryAdmin<T>, chunkSize: number): AsyncGenerator<T[]>;

export function getChunkedDataFromServer<T = DocumentData>(query: RestQuery<T>, chunkSize: number): AsyncGenerator<T[]>;

export function getChunkedDataFromServer<T = DocumentData>(query: Query<T> | RestQuery<T>, chunkSize: number): AsyncGenerator<T[]>;

export async function* getChunkedDataFromServer<T = DocumentData>(query: Query<T> | RestQuery<T>, chunkSize: number): AsyncGenerator<T[], void, undefined> {
    let done = false;

    if (query instanceof RestQuery) {
        let offset = 0;
        while (!done) {
            const batch = (await new RestQuery(query).apply(["limit", chunkSize], ["offset", offset]).run()).map(d => d.data);
            if (batch.length === 0) {
                done = true;
                break;
            }
            yield batch;
            offset += batch.length;
            if (batch.length < chunkSize) {
                done = true;
            }
        }

    } else {
        let lastDocument: DocumentSnapshot | undefined;

        while (!done) {
            const batch = await getSnapshotsFromServer(buildQuery(query, ["limit", chunkSize], (lastDocument ? ["startAfter", lastDocument] : undefined)));
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
}
