import { getSnapshot } from "./getSnapshot.js";
export async function getSnapshots(query) {
    return (await getSnapshot(query)).docs;
}
//# sourceMappingURL=getSnapshots.js.map