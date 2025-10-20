import { buildQuery } from "./buildQuery.js";
import { getSnapshotsFromServer } from "./getSnapshotsFromServer.js";
import { RestQuery } from "./RestQuery";
export async function* getChunkedDataFromServer(query, chunkSize) {
    let done = false;
    if (query instanceof RestQuery) {
        let offset = 0;
        while (!done) {
            const batch = (await new RestQuery(query).apply(["limit", chunkSize], ["offset", offset]).run()).docs.map(d => d.data);
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
    }
    else {
        let lastDocument;
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
//# sourceMappingURL=getChunkedDataFromServer.js.map