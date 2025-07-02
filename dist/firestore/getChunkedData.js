import { buildQuery } from "./buildQuery.js";
import { getSnapshots } from "./getSnapshots.js";
export async function* getChunkedData(query, chunkSize) {
    let done = false;
    let lastDocument;
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
//# sourceMappingURL=getChunkedData.js.map