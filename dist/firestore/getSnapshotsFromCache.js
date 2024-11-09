import { getSnapshotFromCache } from "./getSnapshotFromCache";
export async function getSnapshotsFromCache(query) {
    return (await getSnapshotFromCache(query)).docs;
}
//# sourceMappingURL=getSnapshotsFromCache.js.map