import { getSnapshotFromServer } from "./getSnapshotFromServer.js";
export async function getSnapshotsFromServer(query) {
    return (await getSnapshotFromServer(query)).docs;
}
//# sourceMappingURL=getSnapshotsFromServer.js.map