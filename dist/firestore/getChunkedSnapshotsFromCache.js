import { buildQuery } from "./buildQuery.js";
import { getSnapshotsFromCache } from "./getSnapshotsFromCache.js";
export async function* getChunkedSnapshotsFromCache(query, chunkSize) {
    let done = false;
    let lastDocument;
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
//# sourceMappingURL=getChunkedSnapshotsFromCache.js.map