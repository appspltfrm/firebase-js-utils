import { getSnapshotFromServer } from "./getSnapshotFromServer";
export async function getSnapshotsFromServer(query) {
    return (await getSnapshotFromServer(query)).docs;
}
//# sourceMappingURL=getSnapshotsFromServer.js.map