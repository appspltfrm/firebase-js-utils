import { getSnapshot } from "./getSnapshot";
export async function getSnapshots(query) {
    return (await getSnapshot(query)).docs;
}
//# sourceMappingURL=getSnapshots.js.map