import { getSnapshotFromCache } from "./getSnapshotFromCache.js";
export async function getSnapshotsFromCache(query) {
    return (await getSnapshotFromCache(query)).docs;
}
//# sourceMappingURL=getSnapshotsFromCache.js.map